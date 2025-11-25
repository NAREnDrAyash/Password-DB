from database_manager_sqlite import DatabaseManager
from crypto_utils import CryptoUtils


class AuthManager:
    def __init__(self, db_manager: DatabaseManager, crypto_utils: CryptoUtils):
        self.db_manager = db_manager
        self.crypto_utils = crypto_utils

    def register_user(self, username: str, password: str) -> bool:
        # Check if username already exists
        existing_user = self.db_manager.fetch_one(
            "SELECT id FROM users WHERE username = ?", (username,)
        )
        
        if existing_user:
            return False

        # Hash password
        password_hash, salt = self.crypto_utils.hash_password(password)
        
        # Generate master key and salt for key derivation
        master_key = self.crypto_utils.generate_key()
        master_key_salt = self.crypto_utils.generate_salt()
        
        # Derive key from password for encrypting master key
        password_derived_key = self.crypto_utils.derive_key_from_password(password, master_key_salt)
        
        # Encrypt master key with password-derived key
        encrypted_master_key = self.crypto_utils.encrypt_master_key(master_key, password_derived_key)

        # Store user in database
        return self.db_manager.execute_query(
            """INSERT INTO users (username, password_hash, salt, master_key_salt, encrypted_master_key)
               VALUES (?, ?, ?, ?, ?)""",
            (username, password_hash, salt, master_key_salt, encrypted_master_key)
        )

    def login_user(self, username: str, password: str) -> dict:
        # Fetch user from database
        user_data = self.db_manager.fetch_one(
            """SELECT id, username, password_hash, salt, master_key_salt, encrypted_master_key
               FROM users WHERE username = ?""",
            (username,)
        )

        if not user_data:
            return None

        user_id, stored_username, password_hash, salt, master_key_salt, encrypted_master_key = user_data

        # Verify password
        if not self.crypto_utils.verify_password(password, password_hash):
            return None

        # Derive key from password and decrypt master key
        password_derived_key = self.crypto_utils.derive_key_from_password(password, master_key_salt)
        
        try:
            master_key = self.crypto_utils.decrypt_master_key(encrypted_master_key, password_derived_key)
        except Exception:
            return None

        return {
            'user': {
                'id': user_id,
                'username': stored_username
            },
            'master_key': master_key
        }

    def logout_user(self):
        pass
