import sqlite3
import os
from typing import Optional, List, Tuple, Any


class DatabaseManager:
    def __init__(self):
        self.connection = None
        self.db_path = os.path.join(os.path.dirname(__file__), '..', 'secure_vault.db')

    def connect(self):
        if self.connection:
            return True

        try:
            self.connection = sqlite3.connect(self.db_path, check_same_thread=False)
            self.connection.row_factory = sqlite3.Row  # Enable column access by name
            return True
        except sqlite3.Error as e:
            print(f"Database connection error: {e}")
            return False

    def disconnect(self):
        if self.connection:
            self.connection.close()
            self.connection = None

    def initialize_db(self):
        if not self.connect():
            return False

        try:
            cursor = self.connection.cursor()
            
            # Create users table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT NOT NULL UNIQUE,
                    password_hash BLOB NOT NULL,
                    salt BLOB NOT NULL,
                    master_key_salt BLOB NOT NULL,
                    encrypted_master_key BLOB NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)

            # Create vault_entries table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS vault_entries (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    service_name TEXT NOT NULL,
                    username TEXT NOT NULL,
                    encrypted_password BLOB NOT NULL,
                    encrypted_notes BLOB,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                )
            """)

            self.connection.commit()
            return True
        except sqlite3.Error as e:
            print(f"Database initialization error: {e}")
            return False

    def execute_query(self, query: str, params: Optional[Tuple] = None) -> bool:
        if not self.connect():
            return False

        try:
            cursor = self.connection.cursor()
            if params:
                cursor.execute(query, params)
            else:
                cursor.execute(query)
            self.connection.commit()
            return True
        except sqlite3.Error as e:
            print(f"Query execution error: {e}")
            return False

    def fetch_one(self, query: str, params: Optional[Tuple] = None) -> Optional[Tuple]:
        if not self.connect():
            return None

        try:
            cursor = self.connection.cursor()
            if params:
                cursor.execute(query, params)
            else:
                cursor.execute(query)
            result = cursor.fetchone()
            return tuple(result) if result else None
        except sqlite3.Error as e:
            print(f"Fetch one error: {e}")
            return None

    def fetch_all(self, query: str, params: Optional[Tuple] = None) -> List[Tuple]:
        if not self.connect():
            return []

        try:
            cursor = self.connection.cursor()
            if params:
                cursor.execute(query, params)
            else:
                cursor.execute(query)
            results = cursor.fetchall()
            return [tuple(row) for row in results]
        except sqlite3.Error as e:
            print(f"Fetch all error: {e}")
            return []
