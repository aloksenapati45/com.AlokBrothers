import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './Profile.css';

export default function Profile() {
  const [profile, setProfile] = useState({
    username: '',
    fullName: '',
    email: '',
    mobileNumber: '',
    homeAddress: '',
    adhaarCard: '',
    panCard: '',
    roles: []
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [activeTab, setActiveTab] = useState('details'); // 'details' | 'password'
  const [profileErrors, setProfileErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [adhaarFocused, setAdhaarFocused] = useState(false);
  const [panFocused, setPanFocused] = useState(false);

  const getMaskedAdhaar = (val) => {
    if (!val) return '';
    const cleaned = val.replace(/\s+/g, '');
    if (cleaned.length <= 4) return cleaned;
    return '•••• •••• ' + cleaned.slice(-4);
  };

  const getMaskedPan = (val) => {
    if (!val) return '';
    const cleaned = val.toUpperCase().replace(/\s+/g, '');
    if (cleaned.length <= 4) return cleaned;
    return '••••••' + cleaned.slice(-4);
  };

  const initialUsername = localStorage.getItem('username') || 'admin';
  const defaultPhoto = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80";
  const [photo, setPhoto] = useState(localStorage.getItem(`profilePhoto_${initialUsername}`) || defaultPhoto);
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  const handleDeletePhoto = () => {
    const currentUsername = profile.username || localStorage.getItem('username') || 'admin';
    localStorage.removeItem(`profilePhoto_${currentUsername}`);
    setPhoto(defaultPhoto);
    window.dispatchEvent(new Event('storage'));
    setMsg({ type: 'success', text: 'Profile picture removed.' });
  };

  const handleAvatarChange = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setPhoto(base64String);
        const currentUsername = profile.username || localStorage.getItem('username') || 'admin';
        localStorage.setItem(`profilePhoto_${currentUsername}`, base64String);
        window.dispatchEvent(new Event('storage'));
        setMsg({ type: 'success', text: 'Profile picture updated successfully!' });
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await api.get('/users/me');
        setProfile(res.data);
        const currentUsername = res.data.username || 'admin';
        setPhoto(localStorage.getItem(`profilePhoto_${currentUsername}`) || defaultPhoto);
      } catch (err) {
        setMsg({ type: 'error', text: 'Failed to load profile details' });
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const onProfileChange = e => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
    if (profileErrors[e.target.name]) {
      setProfileErrors({ ...profileErrors, [e.target.name]: null });
    }
  };

  const onPasswordChange = e => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
    if (passwordErrors[e.target.name]) {
      setPasswordErrors({ ...passwordErrors, [e.target.name]: null });
    }
  };

  const validateProfile = () => {
    const errors = {};
    if (!profile.fullName || !profile.fullName.trim()) {
      errors.fullName = 'Full name is required';
    }
    if (!profile.email || !profile.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
      errors.email = 'Invalid email address';
    }
    if (profile.mobileNumber && !/^[0-9]{10,12}$/.test(profile.mobileNumber)) {
      errors.mobileNumber = 'Mobile number must be 10 to 12 digits';
    }
    if (profile.adhaarCard && !/^[0-9]{12}$/.test(profile.adhaarCard)) {
      errors.adhaarCard = 'Aadhaar number must be a valid 12-digit number';
    }
    if (profile.panCard && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i.test(profile.panCard)) {
      errors.panCard = 'PAN number must be a valid 10-character code (e.g. ABCDE1234F)';
    }
    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePassword = () => {
    const errors = {};
    if (!passwordForm.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    if (!passwordForm.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordForm.newPassword.length < 6) {
      errors.newPassword = 'Password must be at least 6 characters';
    } else if (!/(?=.*[0-9])(?=.*[a-zA-Z])/.test(passwordForm.newPassword)) {
      errors.newPassword = 'Must contain at least one letter and one number';
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUpdateProfile = async e => {
    e.preventDefault();
    if (!validateProfile()) return;
    setUpdating(true);
    setMsg(null);
    try {
      const res = await api.put('/users/me', {
        fullName: profile.fullName,
        email: profile.email,
        mobileNumber: profile.mobileNumber,
        homeAddress: profile.homeAddress,
        adhaarCard: profile.adhaarCard,
        panCard: profile.panCard ? profile.panCard.toUpperCase() : ''
      });
      setProfile(res.data);
      if (res.data.fullName) {
        localStorage.setItem('username', res.data.fullName);
      } else {
        localStorage.setItem('username', res.data.username);
      }
      window.dispatchEvent(new Event('storage'));
      setMsg({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setMsg({ type: 'error', text: err?.response?.data?.error || 'Failed to update profile' });
    } finally {
      setUpdating(false);
    }
  };

  const handleChangePassword = async e => {
    e.preventDefault();
    if (!validatePassword()) return;
    setUpdating(true);
    setMsg(null);
    try {
      await api.post('/users/me/password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setMsg({ type: 'success', text: 'Password updated successfully!' });
    } catch (err) {
      setMsg({ type: 'error', text: err?.response?.data?.error || 'Failed to change password' });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="spinner"></div>
        <p>Loading your profile details...</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-grid">
        {/* Left Column: Summary Card */}
        <div className="profile-summary-card">
          <div className="profile-banner-mesh"></div>
          <div className="profile-summary-header">
            <div className="profile-avatar-container">
              <div className="avatar-wrapper">
                <img 
                  src={photo} 
                  alt="Profile Avatar" 
                  className="profile-avatar-large"
                />
                <label htmlFor="avatar-upload" className="profile-avatar-hover">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                    <circle cx="12" cy="13" r="4"/>
                  </svg>
                  <span>Upload</span>
                </label>
                <input 
                  type="file" 
                  id="avatar-upload" 
                  accept="image/*" 
                  onChange={handleAvatarChange} 
                  style={{ display: 'none' }}
                />
              </div>
              <span className="profile-status-badge">Active</span>
            </div>

            {/* Modernized Photo Action Toolbar (placed directly under profile pic) */}
            <div className="modern-photo-toolbar">
              <button 
                type="button" 
                className="toolbar-btn view-btn"
                onClick={() => setShowPhotoModal(true)}
                title="View Photo"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <span>View</span>
              </button>
              
              <label htmlFor="avatar-upload" className="toolbar-btn upload-btn" title="Upload Photo">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <span>Upload</span>
              </label>

              {photo !== defaultPhoto && (
                <button 
                  type="button" 
                  className="toolbar-btn delete-btn"
                  onClick={handleDeletePhoto}
                  title="Remove Photo"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                  <span>Remove</span>
                </button>
              )}
            </div>

            <h3 style={{ marginTop: '16px' }}>{profile.fullName || profile.username}</h3>
            <p className="profile-summary-role">
              {profile.roles && profile.roles.map(r => r.replace('ROLE_', '')).join(', ') || 'USER'}
            </p>
          </div>
          
          <div className="profile-summary-stats">
            <div className="stat-item">
              <div className="stat-icon-wrapper">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
              </div>
              <span className="stat-value">12</span>
              <span className="stat-label">Orders</span>
            </div>
            <div className="stat-item">
              <div className="stat-icon-wrapper">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <span className="stat-value">Active</span>
              <span className="stat-label">Status</span>
            </div>
            <div className="stat-item">
              <div className="stat-icon-wrapper">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <span className="stat-value">Admin</span>
              <span className="stat-label">Role</span>
            </div>
          </div>

          <div className="profile-summary-nav">
            <button 
              className={`summary-nav-btn ${activeTab === 'details' ? 'active' : ''}`}
              onClick={() => { setActiveTab('details'); setMsg(null); }}
            >
              Account Information
            </button>
            <button 
              className={`summary-nav-btn ${activeTab === 'password' ? 'active' : ''}`}
              onClick={() => { setActiveTab('password'); setMsg(null); }}
            >
              Security Settings
            </button>
          </div>
        </div>

        {/* Right Column: Settings Card */}
        <div className="profile-settings-card">
          {msg && (
            <div className={`profile-banner-message ${msg.type}`}>
              {msg.text}
            </div>
          )}

          {activeTab === 'details' ? (
            <div className="tab-pane">
              <h2>Account Settings</h2>
              <p className="tab-subtitle">Update your personal details and account information.</p>
              
              <form onSubmit={handleUpdateProfile} className="profile-form">
                <div className="profile-form-grid">
                  <div className="profile-form-group">
                    <label htmlFor="username">Username</label>
                    <div className="profile-input-wrapper">
                      <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                      <input 
                        type="text" 
                        id="username" 
                        name="username" 
                        value={profile.username} 
                        disabled 
                        className="profile-input disabled"
                      />
                    </div>
                    <small>Username cannot be changed</small>
                  </div>

                  <div className={`profile-form-group ${profileErrors.fullName ? 'has-error' : ''}`}>
                    <label htmlFor="fullName">Full Name</label>
                    <div className="profile-input-wrapper">
                      <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      <input 
                        type="text" 
                        id="fullName" 
                        name="fullName" 
                        value={profile.fullName || ''} 
                        onChange={onProfileChange} 
                        className="profile-input"
                      />
                    </div>
                    {profileErrors.fullName && <span className="error-text">{profileErrors.fullName}</span>}
                  </div>

                  <div className={`profile-form-group ${profileErrors.email ? 'has-error' : ''}`}>
                    <label htmlFor="email">Email Address</label>
                    <div className="profile-input-wrapper">
                      <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22,6 12,13 2,6"/>
                      </svg>
                      <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        value={profile.email || ''} 
                        onChange={onProfileChange} 
                        className="profile-input"
                      />
                    </div>
                    {profileErrors.email && <span className="error-text">{profileErrors.email}</span>}
                  </div>

                  <div className={`profile-form-group ${profileErrors.mobileNumber ? 'has-error' : ''}`}>
                    <label htmlFor="mobileNumber">Mobile Number</label>
                    <div className="profile-input-wrapper">
                      <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                        <line x1="12" y1="18" x2="12.01" y2="18"/>
                      </svg>
                      <input 
                        type="text" 
                        id="mobileNumber" 
                        name="mobileNumber" 
                        value={profile.mobileNumber || ''} 
                        onChange={onProfileChange} 
                        className="profile-input"
                      />
                    </div>
                    {profileErrors.mobileNumber && <span className="error-text">{profileErrors.mobileNumber}</span>}
                  </div>

                  <div className={`profile-form-group full-width ${profileErrors.homeAddress ? 'has-error' : ''}`}>
                    <label htmlFor="homeAddress">Home Address</label>
                    <div className="profile-input-wrapper">
                      <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                        <polyline points="9 22 9 12 15 12 15 22"/>
                      </svg>
                      <input 
                        type="text" 
                        id="homeAddress" 
                        name="homeAddress" 
                        value={profile.homeAddress || ''} 
                        onChange={onProfileChange} 
                        className="profile-input"
                        placeholder="Enter your home address"
                      />
                    </div>
                    {profileErrors.homeAddress && <span className="error-text">{profileErrors.homeAddress}</span>}
                  </div>

                  <div className={`profile-form-group ${profileErrors.adhaarCard ? 'has-error' : ''}`}>
                    <label htmlFor="adhaarCard">Aadhaar Card Number</label>
                    <div className="profile-input-wrapper">
                      <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <rect x="3" y="4" width="18" height="16" rx="2"/>
                        <circle cx="9" cy="10" r="2"/>
                        <path d="M15 8h2M15 12h2M15 16h2M5 16h8"/>
                      </svg>
                      <input 
                        type="text" 
                        id="adhaarCard" 
                        name="adhaarCard" 
                        value={adhaarFocused ? (profile.adhaarCard || '') : getMaskedAdhaar(profile.adhaarCard)} 
                        onChange={onProfileChange} 
                        onFocus={() => setAdhaarFocused(true)}
                        onBlur={() => setAdhaarFocused(false)}
                        className="profile-input"
                        placeholder="12-digit Aadhaar number"
                        maxLength="12"
                      />
                    </div>
                    {profileErrors.adhaarCard && <span className="error-text">{profileErrors.adhaarCard}</span>}
                  </div>

                  <div className={`profile-form-group ${profileErrors.panCard ? 'has-error' : ''}`}>
                    <label htmlFor="panCard">PAN Card Number</label>
                    <div className="profile-input-wrapper">
                      <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <rect x="3" y="4" width="18" height="16" rx="2"/>
                        <line x1="7" y1="8" x2="7.01" y2="8"/>
                        <line x1="7" y1="12" x2="7.01" y2="12"/>
                        <line x1="7" y1="16" x2="7.01" y2="16"/>
                      </svg>
                      <input 
                        type="text" 
                        id="panCard" 
                        name="panCard" 
                        value={panFocused ? (profile.panCard || '') : getMaskedPan(profile.panCard)} 
                        onChange={onProfileChange} 
                        onFocus={() => setPanFocused(true)}
                        onBlur={() => setPanFocused(false)}
                        className="profile-input"
                        placeholder="10-character PAN number"
                        maxLength="10"
                        style={{ textTransform: 'uppercase' }}
                      />
                    </div>
                    {profileErrors.panCard && <span className="error-text">{profileErrors.panCard}</span>}
                  </div>
                </div>

                <div className="profile-submit-row">
                  <button type="submit" disabled={updating} className="profile-action-btn">
                    {updating ? 'Saving Changes...' : 'Save Details'}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="tab-pane">
              <h2>Change Password</h2>
              <p className="tab-subtitle">Update your password to keep your account secure.</p>
              
              <form onSubmit={handleChangePassword} className="profile-form">
                <div className="profile-form-grid-single">
                  <div className={`profile-form-group ${passwordErrors.currentPassword ? 'has-error' : ''}`}>
                    <label htmlFor="currentPassword">Current Password</label>
                    <div className="profile-input-wrapper">
                      <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                      <input 
                        type="password" 
                        id="currentPassword" 
                        name="currentPassword" 
                        value={passwordForm.currentPassword} 
                        onChange={onPasswordChange} 
                        className="profile-input"
                      />
                    </div>
                    {passwordErrors.currentPassword && <span className="error-text">{passwordErrors.currentPassword}</span>}
                  </div>

                  <div className={`profile-form-group ${passwordErrors.newPassword ? 'has-error' : ''}`}>
                    <label htmlFor="newPassword">New Password</label>
                    <div className="profile-input-wrapper">
                      <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M21 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      <input 
                        type="password" 
                        id="newPassword" 
                        name="newPassword" 
                        value={passwordForm.newPassword} 
                        onChange={onPasswordChange} 
                        className="profile-input"
                      />
                    </div>
                    {passwordErrors.newPassword && <span className="error-text">{passwordErrors.newPassword}</span>}
                  </div>

                  <div className={`profile-form-group ${passwordErrors.confirmPassword ? 'has-error' : ''}`}>
                    <label htmlFor="confirmPassword">Confirm New Password</label>
                    <div className="profile-input-wrapper">
                      <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M21 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      <input 
                        type="password" 
                        id="confirmPassword" 
                        name="confirmPassword" 
                        value={passwordForm.confirmPassword} 
                        onChange={onPasswordChange} 
                        className="profile-input"
                      />
                    </div>
                    {passwordErrors.confirmPassword && <span className="error-text">{passwordErrors.confirmPassword}</span>}
                  </div>
                </div>

                <div className="profile-submit-row">
                  <button type="submit" disabled={updating} className="profile-action-btn">
                    {updating ? 'Updating Password...' : 'Update Password'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
      {showPhotoModal && (
        <div className="photo-modal-overlay" onClick={() => setShowPhotoModal(false)}>
          <div className="photo-modal-content" onClick={e => e.stopPropagation()}>
            <button className="photo-modal-close" onClick={() => setShowPhotoModal(false)}>&times;</button>
            <img src={photo} alt="Full Size Profile Avatar" className="photo-modal-image" />
          </div>
        </div>
      )}
    </div>
  );
}
