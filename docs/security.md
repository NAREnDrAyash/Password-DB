# Security Architecture Documentation

## Overview

The Secure Credential Vault implements a layered security architecture designed to protect sensitive user data through multiple security mechanisms.

## Security Layers

### 1. Authentication Layer
- **Password Hashing**: Uses bcrypt with salt for secure password storage
- **Session Management**: Temporary master key storage during user sessions
- **User Isolation**: Database-level user separation

### 2. Encryption Layer
- **Symmetric Encryption**: Fernet (AES 128 CBC + HMAC SHA256)
- **Key Derivation**: PBKDF2 with 100,000 iterations
- **Master Key Management**: Password-derived encryption keys

### 3. Database Layer
- **Prepared Statements**: SQL injection prevention
- **Data Separation**: User-specific data isolation
- **Referential Integrity**: Foreign key constraints

## Cryptographic Implementation

### Password Security
```
User Password → bcrypt(password, salt) → Stored Hash
User Password + Master Salt → PBKDF2(100k iterations) → Key Derivation Key
```

### Data Encryption Flow
```
Master Key → Fernet Encryption → Vault Data
Key Derivation Key → Fernet Encryption → Encrypted Master Key
```

### Key Management
- Master keys are never stored in plaintext
- Key derivation uses strong salts
- Keys are cleared from memory on logout

## Threat Model

### Protected Against
- Password attacks (rainbow tables, brute force)
- Data breaches (encrypted data at rest)
- SQL injection attacks
- Session hijacking
- Memory dumps (keys cleared on exit)

### Assumptions
- Secure execution environment
- PostgreSQL server security
- User follows security best practices
- No malware on execution system

## Best Practices Implemented

1. **Defense in Depth**: Multiple security layers
2. **Least Privilege**: Minimal database permissions
3. **Secure Defaults**: Strong cryptographic parameters
4. **Input Validation**: All user inputs sanitized
5. **Error Handling**: No sensitive information in error messages
