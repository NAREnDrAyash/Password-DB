import React, { useState, useEffect } from 'react';
import apiService from '../services/apiService';

interface RegisterFormProps {
  onRegister: () => void;
  onSwitchToLogin: () => void;
}

interface PasswordStrength {
  score: number;
  message: string;
  color: string;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegister, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [usernameStatus, setUsernameStatus] = useState<{
    checking: boolean;
    available: boolean | null;
    message: string;
  }>({
    checking: false,
    available: null,
    message: ''
  });
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    message: '',
    color: '#e9ecef'
  });

  // Check username availability with debounce
  useEffect(() => {
    // Clear any existing username-related errors when user types
    if (error === 'Username is already taken' || error === 'Username is not available' || error.includes('Username')) {
      setError('');
    }

    if (formData.username.length < 3) {
      setUsernameStatus({
        checking: false,
        available: null,
        message: formData.username.length > 0 ? 'Username must be at least 3 characters' : ''
      });
      return;
    }

    // Reset status to checking immediately
    setUsernameStatus({
      checking: true,
      available: null,
      message: 'Checking availability...'
    });

    const timeoutId = setTimeout(async () => {
      try {
        const result = await apiService.checkUsername(formData.username);
        setUsernameStatus({
          checking: false,
          available: result.available,
          message: result.available ? `✓ Username "${formData.username}" is available!` : `✗ Username "${formData.username}" is already taken`
        });
      } catch (error) {
        console.error('Username check error:', error);
        setUsernameStatus({
          checking: false,
          available: null,
          message: 'Error checking username availability'
        });
      }
    }, 800); // Increased debounce time to 800ms

    return () => clearTimeout(timeoutId);
  }, [formData.username, error]);

  // Check password strength
  useEffect(() => {
    const checkPasswordStrength = (password: string): PasswordStrength => {
      if (password.length === 0) {
        return { score: 0, message: '', color: '#e9ecef' };
      }

      let score = 0;
      let message = '';
      let color = '#dc3545';

      // Length check
      if (password.length >= 8) score += 1;
      
      // Uppercase check
      if (/[A-Z]/.test(password)) score += 1;
      
      // Lowercase check
      if (/[a-z]/.test(password)) score += 1;
      
      // Number check
      if (/\d/.test(password)) score += 1;
      
      // Special character check
      if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;

      switch (score) {
        case 0:
        case 1:
          message = 'Very weak password';
          color = '#dc3545';
          break;
        case 2:
          message = 'Weak password';
          color = '#fd7e14';
          break;
        case 3:
          message = 'Fair password';
          color = '#ffc107';
          break;
        case 4:
          message = 'Good password';
          color = '#20c997';
          break;
        case 5:
          message = 'Strong password';
          color = '#198754';
          break;
      }

      return { score, message, color };
    };

    setPasswordStrength(checkPasswordStrength(formData.password));
  }, [formData.password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validation
      if (!formData.username || !formData.password || !formData.confirmPassword) {
        setError('Please fill in all fields');
        return;
      }

      if (formData.username.length < 3) {
        setError('Username must be at least 3 characters');
        return;
      }

      if (usernameStatus.available === false) {
        setError('Username is already taken');
        return;
      }

      if (usernameStatus.available === null || usernameStatus.checking) {
        setError('Please wait for username validation to complete');
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      if (passwordStrength.score < 3) {
        setError('Password is too weak. Please use a stronger password');
        return;
      }

      // Register user via API
      await apiService.register({
        username: formData.username,
        password: formData.password
      });
      
      setSuccess('Account created successfully! Please sign in.');
      setTimeout(() => {
        onRegister();
      }, 1500);
      
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Registration failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Clear errors when user starts typing
    if (error) {
      setError('');
    }
    
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const getPasswordRequirements = () => {
    const requirements = [
      { test: formData.password.length >= 8, text: 'At least 8 characters' },
      { test: /[A-Z]/.test(formData.password), text: 'One uppercase letter' },
      { test: /[a-z]/.test(formData.password), text: 'One lowercase letter' },
      { test: /\d/.test(formData.password), text: 'One number' },
      { test: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password), text: 'One special character' }
    ];

    return requirements;
  };

  return (
    <div className="auth-container fade-in">
      <div className="auth-card">
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Join Secure Vault to protect your credentials</p>
        
        {error && !(error.includes('Username') && usernameStatus.available !== null) && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        {success && (
          <div className="success-message">
            {success}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="form-input"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a username (min 3 characters)"
              required
            />
            {formData.username.length > 0 && !error && (
              <div className="username-status">
                {usernameStatus.checking ? (
                  <span className="checking">
                    <span className="loading-dots"></span>
                    {usernameStatus.message}
                  </span>
                ) : usernameStatus.available === true ? (
                  <span className="available">
                    {usernameStatus.message}
                  </span>
                ) : usernameStatus.available === false ? (
                  <span className="unavailable">
                    {usernameStatus.message}
                  </span>
                ) : usernameStatus.message ? (
                  <span className="neutral">
                    {usernameStatus.message}
                  </span>
                ) : null}
              </div>
            )}
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a strong password"
              required
            />
            {formData.password && (
              <div className="password-strength">
                <div className="strength-bar">
                  <div 
                    className="strength-fill" 
                    style={{ 
                      width: `${(passwordStrength.score / 5) * 100}%`,
                      backgroundColor: passwordStrength.color
                    }}
                  ></div>
                </div>
                <span className="strength-text" style={{ color: passwordStrength.color }}>
                  {passwordStrength.message}
                </span>
                <div className="password-requirements">
                  {getPasswordRequirements().map((req, index) => (
                    <div key={index} className={`requirement ${req.test ? 'met' : 'unmet'}`}>
                      <span className="requirement-icon">{req.test ? '✓' : '○'}</span>
                      {req.text}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="form-input"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
            />
            {formData.confirmPassword && (
              <div className="password-match">
                {formData.password === formData.confirmPassword ? (
                  <span className="match">Passwords match</span>
                ) : (
                  <span className="no-match">Passwords do not match</span>
                )}
              </div>
            )}
          </div>
          
          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading || !usernameStatus.available || passwordStrength.score < 3}
            >
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </div>
        </form>
        
        <div className="form-footer">
          <p>Already have an account?</p>
          <button
            type="button"
            className="link-button"
            onClick={onSwitchToLogin}
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
