# Secure Vault Project

## Overview
This project is a secure vault application with a Python backend and a React frontend. It allows users to register, log in, and manage vault entries securely.

## Project Structure
- `api/` - Backend API entry point
- `src/` - Core backend modules (authentication, crypto, database, vault management)
- `frontend-react/` - React frontend application
- `config/` - Configuration and documentation
- `docs/` - Security documentation
- `tests/` - Python unit tests

## Prerequisites
- Python 3.x
- Node.js and npm

## Backend Setup
1. Navigate to the project root directory.
2. (Optional) Create and activate a Python virtual environment:
   ```powershell
   python -m venv venv; .\venv\Scripts\Activate.ps1
   ```
3. Install required Python packages (add a `requirements.txt` if needed):
   ```powershell
   pip install -r requirements.txt
   ```
4. Run the backend server:
   ```powershell
   python .\api\main.py
   ```

## Frontend Setup
1. Navigate to the frontend directory:
   ```powershell
   cd frontend-react
   ```
2. Install dependencies:
   ```powershell
   npm install
   ```
3. Start the React app:
   ```powershell
   npm start
   ```

## Running the Project
- Start the backend server first.
- Then start the frontend React app.
- Access the application via your browser at `http://localhost:3000` (default React port).

## Notes
- Update `requirements.txt` and environment files as needed.
- For database configuration, refer to `config/database.md`.
- For security details, see `docs/security.md`.

## License
Specify your license here.
