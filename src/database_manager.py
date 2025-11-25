import os
import psycopg2
from psycopg2 import sql
from dotenv import load_dotenv

load_dotenv()


class DatabaseManager:
    def __init__(self):
        self.connection = None
        self.host = os.getenv('DB_HOST', 'localhost')
        self.database = os.getenv('DB_NAME', 'secure_vault')
        self.user = os.getenv('DB_USER', 'postgres')
        self.password = os.getenv('DB_PASSWORD', 'password')
        self.port = os.getenv('DB_PORT', '5432')

    def connect(self):
        if self.connection and not self.connection.closed:
            return True

        try:
            self.connection = psycopg2.connect(
                host=self.host,
                database=self.database,
                user=self.user,
                password=self.password,
                port=self.port
            )
            self.connection.autocommit = True
            return True
        except psycopg2.Error as e:
            print(f"Database connection error: {e}")
            return False

    def disconnect(self):
        if self.connection and not self.connection.closed:
            self.connection.close()

    def initialize_db(self):
        if not self.connect():
            return False

        try:
            cursor = self.connection.cursor()
            
            # Create users table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS users (
                    id SERIAL PRIMARY KEY,
                    username VARCHAR(255) NOT NULL UNIQUE,
                    password_hash BYTEA NOT NULL,
                    salt BYTEA NOT NULL,
                    master_key_salt BYTEA NOT NULL,
                    encrypted_master_key BYTEA NOT NULL,
                    created_at TIMESTAMP DEFAULT NOW()
                )
            """)

            # Create vault_entries table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS vault_entries (
                    id SERIAL PRIMARY KEY,
                    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                    service_name VARCHAR(255) NOT NULL,
                    username VARCHAR(255) NOT NULL,
                    encrypted_password BYTEA NOT NULL,
                    encrypted_notes BYTEA,
                    created_at TIMESTAMP DEFAULT NOW(),
                    updated_at TIMESTAMP DEFAULT NOW()
                )
            """)

            cursor.close()
            return True
        except psycopg2.Error as e:
            print(f"Database initialization error: {e}")
            return False

    def execute_query(self, query, params=None):
        if not self.connect():
            return False

        try:
            cursor = self.connection.cursor()
            cursor.execute(query, params)
            cursor.close()
            return True
        except psycopg2.Error as e:
            print(f"Query execution error: {e}")
            return False

    def fetch_one(self, query, params=None):
        if not self.connect():
            return None

        try:
            cursor = self.connection.cursor()
            cursor.execute(query, params)
            result = cursor.fetchone()
            cursor.close()
            return result
        except psycopg2.Error as e:
            print(f"Fetch one error: {e}")
            return None

    def fetch_all(self, query, params=None):
        if not self.connect():
            return []

        try:
            cursor = self.connection.cursor()
            cursor.execute(query, params)
            results = cursor.fetchall()
            cursor.close()
            return results
        except psycopg2.Error as e:
            print(f"Fetch all error: {e}")
            return []
