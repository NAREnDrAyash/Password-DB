# Database Configuration Template

# PostgreSQL Setup Commands

## Create Database and User

```sql
-- Connect to PostgreSQL as superuser
CREATE DATABASE secure_vault;

-- Create dedicated user for the application
CREATE USER vault_user WITH PASSWORD 'your_secure_password_here';

-- Grant necessary privileges
GRANT ALL PRIVILEGES ON DATABASE secure_vault TO vault_user;

-- Connect to the secure_vault database
\c secure_vault

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO vault_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO vault_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO vault_user;
```

## Configuration Notes

1. Replace 'your_secure_password_here' with a strong password
2. Consider using a different database name for production
3. Ensure PostgreSQL is configured for secure connections
4. Backup the database regularly
5. Monitor database logs for security events

## Production Considerations

- Use SSL/TLS for database connections
- Implement connection pooling if needed
- Configure proper firewall rules
- Regular security updates for PostgreSQL
- Database user should have minimal required permissions
