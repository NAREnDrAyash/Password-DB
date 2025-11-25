import React, { useState } from 'react';
import { User } from '../App';
import UserStorage from '../utils/UserStorage';

interface DeleteAccountProps {
  user: User;
  onAccountDeleted: () => void;
  onCancel: () => void;
}

const DeleteAccount: React.FC<DeleteAccountProps> = ({ user, onAccountDeleted, onCancel }) => {
  const [password, setPassword] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validation
      if (!password) {
        setError('Please enter your password');
        return;
      }

      if (confirmText !== 'DELETE') {
        setError('Please type "DELETE" to confirm');
        return;
      }

      // Simulate password verification (in real app, verify with backend)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, assume password is correct if it's not empty
      // In real app, you'd verify this against your backend
      
      // Remove user from storage
      const userStorage = UserStorage.getInstance();
      const deleted = userStorage.removeUser(user.username);
      
      if (deleted) {
        onAccountDeleted();
      } else {
        setError('Failed to delete account');
      }
      
    } catch (err) {
      setError('Failed to delete account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div className="glass-card" style={{
        width: '100%',
        maxWidth: '450px',
        padding: '32px',
        animation: 'slideUp 0.3s ease-out'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            background: '#dc3545',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            fontSize: '24px'
          }}>
            ⚠️
          </div>
          <h3 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#dc3545',
            marginBottom: '8px'
          }}>
            Delete Account
          </h3>
          <p style={{
            color: 'var(--accent-gray)',
            fontSize: '14px',
            lineHeight: '1.5'
          }}>
            This action cannot be undone. This will permanently delete your account and remove all your data.
          </p>
        </div>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <form onSubmit={handleDelete}>
          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Confirm your password
            </label>
            <input
              type="password"
              id="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="confirmText">
              Type "DELETE" to confirm
            </label>
            <input
              type="text"
              id="confirmText"
              className="form-input"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Type DELETE"
              required
            />
          </div>
          
          <div style={{
            background: '#fff3cd',
            border: '1px solid #ffeaa7',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '20px'
          }}>
            <p style={{
              fontSize: '13px',
              color: '#856404',
              margin: 0,
              lineHeight: '1.4'
            }}>
              <strong>Warning:</strong> Deleting your account will remove:
            </p>
            <ul style={{
              fontSize: '13px',
              color: '#856404',
              margin: '8px 0 0 16px',
              lineHeight: '1.4'
            }}>
              <li>All your saved passwords</li>
              <li>Account settings and preferences</li>
              <li>Access to this username in the future</li>
            </ul>
          </div>
          
          <div style={{ 
            display: 'flex', 
            gap: '12px',
            marginTop: '24px'
          }}>
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-secondary"
              style={{ flex: 1 }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || confirmText !== 'DELETE' || !password}
              style={{ 
                flex: 1,
                background: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 24px',
                fontWeight: '500',
                fontSize: '14px',
                cursor: loading || confirmText !== 'DELETE' || !password ? 'not-allowed' : 'pointer',
                opacity: loading || confirmText !== 'DELETE' || !password ? 0.6 : 1,
                transition: 'all 0.3s ease'
              }}
            >
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  Deleting...
                </>
              ) : (
                'Delete Account'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeleteAccount;
