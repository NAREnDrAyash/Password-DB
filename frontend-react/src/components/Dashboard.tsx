import React, { useState, useEffect } from 'react';
import { User } from '../App';
import AddEntryForm from './AddEntryForm';
import VaultEntry from './VaultEntry';
import DeleteAccount from './DeleteAccount';

interface VaultEntryData {
  id: number;
  serviceName: string;
  username: string;
  password: string;
  notes?: string;
  createdAt: string;
}

interface DashboardProps {
  user: User;
  onAccountDeleted: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onAccountDeleted }) => {
  const [entries, setEntries] = useState<VaultEntryData[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      const mockEntries: VaultEntryData[] = [
        {
          id: 1,
          serviceName: 'Gmail',
          username: 'user@gmail.com',
          password: 'SecurePass123!',
          notes: 'Primary email account',
          createdAt: '2024-01-15'
        },
        {
          id: 2,
          serviceName: 'GitHub',
          username: 'developer',
          password: 'GitHubPass456@',
          notes: 'Development account',
          createdAt: '2024-01-10'
        },
        {
          id: 3,
          serviceName: 'AWS Console',
          username: 'admin@company.com',
          password: 'AWSSecure789#',
          notes: 'Production environment access',
          createdAt: '2024-01-05'
        }
      ];
      
      setEntries(mockEntries);
    } catch (error) {
      console.error('Failed to load entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEntry = (newEntry: Omit<VaultEntryData, 'id' | 'createdAt'>) => {
    const entry: VaultEntryData = {
      ...newEntry,
      id: Date.now(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    setEntries([entry, ...entries]);
    setShowAddForm(false);
  };

  const handleDeleteEntry = (id: number) => {
    setEntries(entries.filter(entry => entry.id !== id));
  };

  const handleUpdateEntry = (id: number, updatedEntry: Partial<VaultEntryData>) => {
    setEntries(entries.map(entry => 
      entry.id === id ? { ...entry, ...updatedEntry } : entry
    ));
  };

  const filteredEntries = entries.filter(entry =>
    entry.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-container fade-in">
      <div className="dashboard-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 className="dashboard-title">Your Secure Vault</h2>
            <p className="dashboard-subtitle">
              Manage your passwords and sensitive credentials securely
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setShowAddForm(true)}
              className="btn btn-primary"
            >
              Add New Entry
            </button>
            <button
              onClick={() => setShowDeleteAccount(true)}
              className="btn btn-secondary"
              style={{ 
                color: '#dc3545',
                borderColor: '#dc3545'
              }}
            >
              Delete Account
            </button>
          </div>
        </div>
        
        <div style={{ marginTop: '24px' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search entries by service name or username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ maxWidth: '400px' }}
          />
        </div>
      </div>

      {showAddForm && (
        <AddEntryForm
          onAdd={handleAddEntry}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {showDeleteAccount && (
        <DeleteAccount
          user={user}
          onAccountDeleted={onAccountDeleted}
          onCancel={() => setShowDeleteAccount(false)}
        />
      )}

      {loading ? (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '200px' 
        }}>
          <span className="loading-spinner" style={{ width: '40px', height: '40px' }}></span>
        </div>
      ) : (
        <div className="vault-grid">
          {filteredEntries.length === 0 ? (
            <div style={{
              gridColumn: '1 / -1',
              textAlign: 'center',
              padding: '40px',
              color: 'var(--accent-gray)'
            }}>
              {searchTerm ? 'No entries match your search.' : 'No entries yet. Add your first credential!'}
            </div>
          ) : (
            filteredEntries.map(entry => (
              <VaultEntry
                key={entry.id}
                entry={entry}
                onDelete={handleDeleteEntry}
                onUpdate={handleUpdateEntry}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
