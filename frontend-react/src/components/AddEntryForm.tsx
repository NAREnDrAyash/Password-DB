import React, { useState } from 'react';

interface VaultEntryData {
  id: number;
  serviceName: string;
  username: string;
  password: string;
  notes?: string;
  createdAt: string;
}

interface AddEntryFormProps {
  onAdd: (entry: Omit<VaultEntryData, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

const AddEntryForm: React.FC<AddEntryFormProps> = ({ onAdd, onCancel }) => {
  const [formData, setFormData] = useState({
    serviceName: '',
    username: '',
    password: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!formData.serviceName || !formData.username || !formData.password) {
        setError('Please fill in all required fields');
        return;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      onAdd({
        serviceName: formData.serviceName,
        username: formData.username,
        password: formData.password,
        notes: formData.notes
      });
      
    } catch (err) {
      setError('Failed to add entry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 16; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, password });
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div className="glass-card" style={{
        width: '100%',
        maxWidth: '500px',
        padding: '32px',
        animation: 'slideUp 0.3s ease-out'
      }}>
        <h3 style={{
          fontSize: '20px',
          fontWeight: '600',
          color: 'var(--primary-black)',
          marginBottom: '24px'
        }}>
          Add New Entry
        </h3>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="serviceName">
              Service Name *
            </label>
            <input
              type="text"
              id="serviceName"
              name="serviceName"
              className="form-input"
              value={formData.serviceName}
              onChange={handleChange}
              placeholder="e.g., Gmail, GitHub, AWS"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="username">
              Username *
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="form-input"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username or email"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password *
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                id="password"
                name="password"
                className="form-input"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter or generate password"
                required
                style={{ flex: 1 }}
              />
              <button
                type="button"
                onClick={generatePassword}
                className="btn btn-secondary"
                style={{ whiteSpace: 'nowrap' }}
              >
                Generate
              </button>
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="notes">
              Notes (Optional)
            </label>
            <textarea
              id="notes"
              name="notes"
              className="form-input"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Additional notes..."
              rows={3}
              style={{ resize: 'vertical', minHeight: '80px' }}
            />
          </div>
          
          <div className="form-actions" style={{ 
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
              className="btn btn-primary"
              disabled={loading}
              style={{ flex: 1 }}
            >
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  Adding...
                </>
              ) : (
                'Add Entry'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEntryForm;
