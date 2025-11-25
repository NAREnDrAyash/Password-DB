import unittest
import sys
import os

# Add src directory to path for imports
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

from crypto_utils import CryptoUtils


class TestCryptoUtils(unittest.TestCase):
    def setUp(self):
        self.crypto = CryptoUtils()

    def test_password_hashing(self):
        password = "test_password_123"
        password_hash, salt = self.crypto.hash_password(password)
        
        self.assertIsInstance(password_hash, bytes)
        self.assertIsInstance(salt, bytes)
        self.assertTrue(self.crypto.verify_password(password, password_hash))
        self.assertFalse(self.crypto.verify_password("wrong_password", password_hash))

    def test_key_generation(self):
        key = self.crypto.generate_key()
        self.assertIsInstance(key, bytes)
        self.assertEqual(len(key), 44)  # Fernet key is 44 bytes base64 encoded

    def test_data_encryption_decryption(self):
        data = "sensitive_data_123"
        key = self.crypto.generate_key()
        
        encrypted_data = self.crypto.encrypt_data(data, key)
        decrypted_data = self.crypto.decrypt_data(encrypted_data, key)
        
        self.assertEqual(data, decrypted_data)
        self.assertNotEqual(data, encrypted_data)

    def test_key_derivation(self):
        password = "user_password"
        salt = self.crypto.generate_salt()
        
        key1 = self.crypto.derive_key_from_password(password, salt)
        key2 = self.crypto.derive_key_from_password(password, salt)
        
        self.assertEqual(key1, key2)
        self.assertIsInstance(key1, bytes)


if __name__ == '__main__':
    unittest.main()
