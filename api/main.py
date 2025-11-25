from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import sys
import os

# Add src directory to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'src'))

from database_manager_sqlite import DatabaseManager
from auth_manager import AuthManager
from vault_manager import VaultManager
from crypto_utils import CryptoUtils

app = FastAPI(title="Secure Vault API", version="1.0.0")
security = HTTPBearer()

# CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize managers
db_manager = DatabaseManager()
crypto_utils = CryptoUtils()
auth_manager = AuthManager(db_manager, crypto_utils)
vault_manager = VaultManager(db_manager, crypto_utils)

# Pydantic models
class UserCreate(BaseModel):
    username: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class VaultEntryCreate(BaseModel):
    service_name: str
    username: str
    password: str
    notes: Optional[str] = ""

class VaultEntryUpdate(BaseModel):
    password: Optional[str] = None
    notes: Optional[str] = None

class UserResponse(BaseModel):
    id: int
    username: str

class VaultEntryResponse(BaseModel):
    id: int
    service_name: str
    username: str
    password: str
    notes: str
    created_at: str
    updated_at: str

# Session storage (in production, use Redis or proper session management)
active_sessions = {}

@app.on_event("startup")
async def startup_event():
    try:
        print("Initializing database...")
        if not db_manager.initialize_db():
            print("Failed to initialize database")
            raise Exception("Failed to initialize database")
        print("Database initialized successfully")
    except Exception as e:
        print(f"Startup error: {e}")
        raise

@app.get("/")
async def root():
    return {"message": "Secure Vault API is running"}

@app.post("/api/register", response_model=dict)
async def register(user: UserCreate):
    if len(user.username) < 3:
        raise HTTPException(status_code=400, detail="Username must be at least 3 characters")
    
    if len(user.password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters")
    
    success = auth_manager.register_user(user.username, user.password)
    if not success:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    return {"message": "User registered successfully"}

@app.post("/api/login", response_model=dict)
async def login(user: UserLogin):
    result = auth_manager.login_user(user.username, user.password)
    if not result:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Create session token (simple implementation)
    session_token = f"session_{result['user']['id']}_{hash(user.username + user.password)}"
    active_sessions[session_token] = {
        'user': result['user'],
        'master_key': result['master_key']
    }
    
    return {
        "message": "Login successful",
        "token": session_token,
        "user": result['user']
    }

@app.get("/api/check-username/{username}")
async def check_username(username: str):
    existing_user = db_manager.fetch_one(
        "SELECT id FROM users WHERE username = ?", (username,)
    )
    return {"available": existing_user is None}

@app.post("/api/vault/entries", response_model=dict)
async def create_vault_entry(entry: VaultEntryCreate, credentials: HTTPAuthorizationCredentials = Depends(security)):
    session = active_sessions.get(credentials.credentials)
    if not session:
        raise HTTPException(status_code=401, detail="Invalid session")
    
    success = vault_manager.add_entry(
        session['user']['id'],
        entry.service_name,
        entry.username,
        entry.password,
        entry.notes,
        session['master_key']
    )
    
    if not success:
        raise HTTPException(status_code=500, detail="Failed to create entry")
    
    return {"message": "Entry created successfully"}

@app.get("/api/vault/entries", response_model=List[VaultEntryResponse])
async def get_vault_entries(credentials: HTTPAuthorizationCredentials = Depends(security)):
    session = active_sessions.get(credentials.credentials)
    if not session:
        raise HTTPException(status_code=401, detail="Invalid session")
    
    entries = vault_manager.get_all_entries(session['user']['id'], session['master_key'])
    return [
        VaultEntryResponse(
            id=entry['id'],
            service_name=entry['service_name'],
            username=entry['username'],
            password=entry['password'],
            notes=entry['notes'],
            created_at=str(entry['created_at']),
            updated_at=str(entry['updated_at'])
        )
        for entry in entries
    ]

@app.get("/api/vault/entries/{service_name}")
async def get_vault_entry_by_service(service_name: str, credentials: HTTPAuthorizationCredentials = Depends(security)):
    session = active_sessions.get(credentials.credentials)
    if not session:
        raise HTTPException(status_code=401, detail="Invalid session")
    
    entry = vault_manager.get_entry_by_service(session['user']['id'], service_name, session['master_key'])
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    
    return VaultEntryResponse(
        id=entry['id'],
        service_name=entry['service_name'],
        username=entry['username'],
        password=entry['password'],
        notes=entry['notes'],
        created_at=str(entry['created_at']),
        updated_at=str(entry['updated_at'])
    )

@app.put("/api/vault/entries/{entry_id}")
async def update_vault_entry(entry_id: int, entry: VaultEntryUpdate, credentials: HTTPAuthorizationCredentials = Depends(security)):
    session = active_sessions.get(credentials.credentials)
    if not session:
        raise HTTPException(status_code=401, detail="Invalid session")
    
    success = vault_manager.update_entry(
        session['user']['id'],
        entry_id,
        entry.password,
        entry.notes,
        session['master_key']
    )
    
    if not success:
        raise HTTPException(status_code=500, detail="Failed to update entry")
    
    return {"message": "Entry updated successfully"}

@app.delete("/api/vault/entries/{entry_id}")
async def delete_vault_entry(entry_id: int, credentials: HTTPAuthorizationCredentials = Depends(security)):
    session = active_sessions.get(credentials.credentials)
    if not session:
        raise HTTPException(status_code=401, detail="Invalid session")
    
    success = vault_manager.delete_entry(session['user']['id'], entry_id)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to delete entry")
    
    return {"message": "Entry deleted successfully"}

@app.delete("/api/user/delete")
async def delete_user_account(user: UserLogin, credentials: HTTPAuthorizationCredentials = Depends(security)):
    session = active_sessions.get(credentials.credentials)
    if not session:
        raise HTTPException(status_code=401, detail="Invalid session")
    
    # Verify password
    auth_result = auth_manager.login_user(user.username, user.password)
    if not auth_result or auth_result['user']['id'] != session['user']['id']:
        raise HTTPException(status_code=401, detail="Invalid password")
    
    # Delete all vault entries first
    db_manager.execute_query("DELETE FROM vault_entries WHERE user_id = ?", (session['user']['id'],))
    
    # Delete user account
    success = db_manager.execute_query("DELETE FROM users WHERE id = ?", (session['user']['id'],))
    if not success:
        raise HTTPException(status_code=500, detail="Failed to delete account")
    
    # Remove session
    del active_sessions[credentials.credentials]
    
    return {"message": "Account deleted successfully"}

@app.post("/api/logout")
async def logout(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if credentials.credentials in active_sessions:
        del active_sessions[credentials.credentials]
    return {"message": "Logged out successfully"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8080)
