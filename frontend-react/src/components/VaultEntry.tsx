import React, { useState } from 'react';

interface VaultEntryData {
  id: number;
  serviceName: string;
  username: string;
  password: string;
  notes?: string;
  createdAt: string;
}

interface VaultEntryProps {
  entry: VaultEntryData;
  onDelete: (id: number) => void;
  onUpdate: (id: number, updatedEntry: Partial<VaultEntryData>) => void;
}

const VaultEntry: React.FC<VaultEntryProps> = ({ entry, onDelete, onUpdate }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    serviceName: entry.serviceName,
    username: entry.username,
    password: entry.password,
    notes: entry.notes || ''
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onUpdate(entry.id, editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      serviceName: entry.serviceName,
      username: entry.username,
      password: entry.password,
      notes: entry.notes || ''
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete the entry for ${entry.serviceName}?`)) {
      onDelete(entry.id);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      // You could add a toast notification here
      console.log(`${type} copied to clipboard`);
    });
  };

  const maskPassword = (password: string) => {
    return '•'.repeat(password.length);
  };

  if (isEditing) {
    return (
      <div className="vault-card">
        <div style={{ marginBottom: '16px' }}>
          <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
            Edit Entry
          </h4>
          
          <div className="form-group" style={{ marginBottom: '12px' }}>
            <label className="form-label" style={{ fontSize: '12px' }}>Service Name</label>
            <input
              type="text"
              className="form-input"
              value={editData.serviceName}
              onChange={(e) => setEditData({ ...editData, serviceName: e.target.value })}
              style={{ padding: '8px 12px', fontSize: '14px' }}
            />
          </div>
          
          <div className="form-group" style={{ marginBottom: '12px' }}>
            <label className="form-label" style={{ fontSize: '12px' }}>Username</label>
            <input
              type="text"
              className="form-input"
              value={editData.username}
              onChange={(e) => setEditData({ ...editData, username: e.target.value })}
              style={{ padding: '8px 12px', fontSize: '14px' }}
            />
          </div>
          
          <div className="form-group" style={{ marginBottom: '12px' }}>
            <label className="form-label" style={{ fontSize: '12px' }}>Password</label>
            <input
              type="text"
              className="form-input"
              value={editData.password}
              onChange={(e) => setEditData({ ...editData, password: e.target.value })}
              style={{ padding: '8px 12px', fontSize: '14px' }}
            />
          </div>
          
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="form-label" style={{ fontSize: '12px' }}>Notes</label>
            <textarea
              className="form-input"
              value={editData.notes}
              onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
              rows={2}
              style={{ padding: '8px 12px', fontSize: '14px', resize: 'vertical' }}
            />
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={handleSave} className="btn btn-primary btn-small" style={{ flex: 1 }}>
            Save
          </button>
          <button onClick={handleCancel} className="btn btn-secondary btn-small" style={{ flex: 1 }}>
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="vault-card">
      <div className="vault-card-header">
        <div>
          <h4 className="vault-card-title">{entry.serviceName}</h4>
          <p className="vault-card-username">{entry.username}</p>
        </div>
      </div>
      
      <div style={{ marginBottom: '16px' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          marginBottom: '8px'
        }}>
          <span style={{ 
            fontFamily: 'monospace',
            fontSize: '14px',
            flex: 1,
            color: showPassword ? 'var(--secondary-black)' : 'var(--accent-gray)'
          }}>
            {showPassword ? entry.password : maskPassword(entry.password)}
          </span>
          <button
            onClick={() => setShowPassword(!showPassword)}
            className="btn btn-secondary btn-small"
            style={{ 
              padding: '4px 8px',
              fontSize: '12px',
              minWidth: 'auto'
            }}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        
        {entry.notes && (
          <p style={{ 
            fontSize: '13px', 
            color: 'var(--accent-gray)',
            backgroundColor: 'var(--tertiary-white)',
            padding: '8px',
            borderRadius: '6px',
            margin: '8px 0'
          }}>
            {entry.notes}
          </p>
        )}
        
        <p style={{ 
          fontSize: '12px', 
          color: 'var(--accent-gray)',
          marginTop: '8px'
        }}>
          Created: {new Date(entry.createdAt).toLocaleDateString()}
        </p>
      </div>
      
      <div className="vault-card-actions">
        <button
          onClick={() => copyToClipboard(entry.username, 'Username')}
          className="btn btn-secondary btn-small"
        >
          Copy User
        </button>
        <button
          onClick={() => copyToClipboard(entry.password, 'Password')}
          className="btn btn-secondary btn-small"
        >
          Copy Pass
        </button>
        <button
          onClick={handleEdit}
          className="btn btn-secondary btn-small"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="btn btn-secondary btn-small"
          style={{ 
            color: '#dc3545',
            borderColor: '#dc3545'
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default VaultEntry;
