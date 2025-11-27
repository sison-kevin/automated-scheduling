import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { post } from '../api';

export default function SettingsPage() {
  const { user, checkAuth } = useAuth();
  const [profileData, setProfileData] = useState({
    name: '',
    email: ''
  });
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || ''
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      const response = await post('api/settings/update_profile', profileData);
      if (response.success) {
        setSuccess('Profile updated successfully!');
        checkAuth(); // Refresh user data
      } else {
        setError(response.message || 'Failed to update profile');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Error updating profile');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (passwordData.new_password !== passwordData.confirm_password) {
      setError('New passwords do not match');
      return;
    }
    
    try {
      const response = await post('api/settings/change_password', {
        current_password: passwordData.current_password,
        new_password: passwordData.new_password
      });
      if (response.success) {
        setSuccess('Password changed successfully!');
        setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
      } else {
        setError(response.message || 'Failed to change password');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Error changing password');
    }
  };

  return (
    <>
      <style>{`

        .back-link {
          display: inline-block;
          margin-bottom: 25px;
          color: var(--primary);
          font-weight: 500;
          text-decoration: none;
          transition: 0.2s;
        }
        .back-link:hover {
          text-decoration: underline;
        }

        .card {
          background: var(--card);
          border-radius: 14px;
          padding: 40px 35px;
          margin-bottom: 30px;
          box-shadow: 0 6px 24px rgba(0,0,0,0.06);
          transition: 0.3s;
        }
        .card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 30px rgba(0,0,0,0.08);
        }
        .card h3, .card h2 {
          color: var(--primary);
          margin-bottom: 18px;
          font-size: 1.35rem;
          font-weight: 700;
        }
        .card p {
          color: #555;
          font-size: 0.96rem;
          margin-bottom: 25px;
        }

        .alert {
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
          border: 1px solid;
        }
        .alert-success { background: #d4edda; color: #155724; border-color: #c3e6cb; }
        .alert-error { background: #f8d7da; color: #721c24; border-color: #f5c6cb; }

        form label {
          display: block;
          font-weight: 600;
          margin-top: 15px;
          color: #333;
        }
        form input {
          width: 100%;
          padding: 10px 12px;
          margin-top: 6px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 0.95rem;
          transition: border-color 0.2s;
        }
        form input:focus {
          border-color: var(--primary);
          outline: none;
          box-shadow: 0 0 0 3px rgba(255,145,77,0.15);
        }
        form button {
          margin-top: 20px;
          background: var(--primary);
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: 0.3s;
        }
        form button:hover {
          background: var(--light-orange);
          transform: translateY(-2px);
        }
      `}</style>

      <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
      {success && <div className="alert alert-success">✓ {success}</div>}
      {error && <div className="alert alert-error">✗ {error}</div>}

      <div className="card">
        <h2>Account Settings</h2>
        <p>Update your personal details and contact information below.</p>

        <form onSubmit={handleProfileSubmit}>
          <label htmlFor="name">Full Name</label>
          <input 
            type="text" 
            id="name"
            name="name" 
            value={profileData.name} 
            onChange={handleProfileChange} 
            required 
          />
          
          <label htmlFor="email">Email Address</label>
          <input 
            type="email" 
            id="email"
            name="email" 
            value={profileData.email} 
            onChange={handleProfileChange} 
            required 
          />
          
          <button type="submit">Save Changes</button>
            </form>
          </div>

      <div className="card">
        <h2>Change Password</h2>
        <p>Secure your account by changing your password regularly.</p>
        
        <form onSubmit={handlePasswordSubmit}>
          <label htmlFor="current_password">Current Password</label>
          <input 
            type="password" 
            id="current_password"
            name="current_password" 
            value={passwordData.current_password} 
            onChange={handlePasswordChange} 
            required 
          />
          
          <label htmlFor="new_password">New Password</label>
          <input 
            type="password" 
            id="new_password"
            name="new_password" 
            value={passwordData.new_password} 
            onChange={handlePasswordChange} 
            required 
            minLength="6"
          />
          
          <label htmlFor="confirm_password">Confirm New Password</label>
          <input 
            type="password" 
            id="confirm_password"
            name="confirm_password" 
            value={passwordData.confirm_password} 
            onChange={handlePasswordChange} 
            required 
            minLength="6"
          />
          
          <button type="submit">Update Password</button>
        </form>
      </div>
    </>
  );
}
