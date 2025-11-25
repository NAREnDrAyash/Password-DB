from database_manager_sqlite import DatabaseManager
from crypto_utils import CryptoUtils


class VaultManager:
    def __init__(self, db_manager: DatabaseManager, crypto_utils: CryptoUtils):
        self.db_manager = db_manager
        self.crypto_utils = crypto_utils

    def add_entry(self, user_id: int, service_name: str, username: str, password: str, notes: str, master_key: bytes) -> bool:
        # Encrypt sensitive data
        encrypted_password = self.crypto_utils.encrypt_data(password, master_key)
        encrypted_notes = self.crypto_utils.encrypt_data(notes or "", master_key)

        return self.db_manager.execute_query(
            """INSERT INTO vault_entries (user_id, service_name, username, encrypted_password, encrypted_notes)
               VALUES (?, ?, ?, ?, ?)""",
            (user_id, service_name, username, encrypted_password, encrypted_notes)
        )

    def get_all_entries(self, user_id: int, master_key: bytes) -> list:
        entries_data = self.db_manager.fetch_all(
            """SELECT id, service_name, username, encrypted_password, encrypted_notes, created_at, updated_at
               FROM vault_entries WHERE user_id = ? ORDER BY service_name""",
            (user_id,)
        )

        decrypted_entries = []
        for entry in entries_data:
            entry_id, service_name, username, encrypted_password, encrypted_notes, created_at, updated_at = entry
            
            try:
                decrypted_password = self.crypto_utils.decrypt_data(encrypted_password, master_key)
                decrypted_notes = self.crypto_utils.decrypt_data(encrypted_notes, master_key) if encrypted_notes else ""
                
                decrypted_entries.append({
                    'id': entry_id,
                    'service_name': service_name,
                    'username': username,
                    'password': decrypted_password,
                    'notes': decrypted_notes,
                    'created_at': created_at,
                    'updated_at': updated_at
                })
            except Exception:
                continue

        return decrypted_entries

    def get_entry_by_service(self, user_id: int, service_name: str, master_key: bytes) -> dict:
        entry_data = self.db_manager.fetch_one(
            """SELECT id, service_name, username, encrypted_password, encrypted_notes, created_at, updated_at
               FROM vault_entries WHERE user_id = ? AND service_name LIKE ?""",
            (user_id, f"%{service_name}%")
        )

        if not entry_data:
            return None

        entry_id, service_name, username, encrypted_password, encrypted_notes, created_at, updated_at = entry_data

        try:
            decrypted_password = self.crypto_utils.decrypt_data(encrypted_password, master_key)
            decrypted_notes = self.crypto_utils.decrypt_data(encrypted_notes, master_key) if encrypted_notes else ""
            
            return {
                'id': entry_id,
                'service_name': service_name,
                'username': username,
                'password': decrypted_password,
                'notes': decrypted_notes,
                'created_at': created_at,
                'updated_at': updated_at
            }
        except Exception:
            return None

    def update_entry(self, user_id: int, entry_id: int, new_password: str, new_notes: str, master_key: bytes) -> bool:
        updates = []
        params = []

        if new_password is not None:
            encrypted_password = self.crypto_utils.encrypt_data(new_password, master_key)
            updates.append("encrypted_password = ?")
            params.append(encrypted_password)

        if new_notes is not None:
            encrypted_notes = self.crypto_utils.encrypt_data(new_notes, master_key)
            updates.append("encrypted_notes = ?")
            params.append(encrypted_notes)

        if not updates:
            return True

        updates.append("updated_at = CURRENT_TIMESTAMP")
        params.extend([user_id, entry_id])

        query = f"UPDATE vault_entries SET {', '.join(updates)} WHERE user_id = ? AND id = ?"
        
        return self.db_manager.execute_query(query, params)

    def delete_entry(self, user_id: int, entry_id: int) -> bool:
        return self.db_manager.execute_query(
            "DELETE FROM vault_entries WHERE user_id = ? AND id = ?",
            (user_id, entry_id)
        )
