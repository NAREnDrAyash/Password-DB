import os
import bcrypt
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
import base64


class CryptoUtils:
    def __init__(self):
        self.iterations = 100000

    def hash_password(self, password: str) -> tuple:
        salt = bcrypt.gensalt()
        password_hash = bcrypt.hashpw(password.encode('utf-8'), salt)
        return password_hash, salt

    def verify_password(self, password: str, password_hash: bytes) -> bool:
        return bcrypt.checkpw(password.encode('utf-8'), password_hash)

    def generate_key(self) -> bytes:
        return Fernet.generate_key()

    def generate_salt(self) -> bytes:
        return os.urandom(32)

    def derive_key_from_password(self, password: str, salt: bytes) -> bytes:
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=salt,
            iterations=self.iterations,
        )
        key = base64.urlsafe_b64encode(kdf.derive(password.encode('utf-8')))
        return key

    def encrypt_data(self, data: str, key: bytes) -> bytes:
        if isinstance(data, str):
            data = data.encode('utf-8')
        
        fernet = Fernet(key)
        encrypted_data = fernet.encrypt(data)
        return encrypted_data

    def decrypt_data(self, encrypted_data: bytes, key: bytes) -> str:
        fernet = Fernet(key)
        decrypted_data = fernet.decrypt(encrypted_data)
        return decrypted_data.decode('utf-8')

    def encrypt_master_key(self, master_key: bytes, password_derived_key: bytes) -> bytes:
        fernet = Fernet(password_derived_key)
        encrypted_master_key = fernet.encrypt(master_key)
        return encrypted_master_key

    def decrypt_master_key(self, encrypted_master_key: bytes, password_derived_key: bytes) -> bytes:
        fernet = Fernet(password_derived_key)
        master_key = fernet.decrypt(encrypted_master_key)
        return master_key
