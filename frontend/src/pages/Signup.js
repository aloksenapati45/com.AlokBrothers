import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './Signup.css';

const fields = [
  { name: 'firstName', label: 'First name', type: 'text', fullWidth: false },
  { name: 'lastName', label: 'Last name', type: 'text', fullWidth: false },
  { name: 'email', label: 'Email', type: 'email', fullWidth: true },
  { name: 'mobileNumber', label: 'Mobile number', type: 'tel', fullWidth: true },
  { name: 'username', label: 'Username', type: 'text', fullWidth: true },
  { name: 'password', label: 'Password', type: 'password', fullWidth: true },
];

export default function Signup() {
  const initialState = fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {});
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const onChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const validateForm = () => {
    const tempErrors = {};
    
    if (!form.firstName.trim()) {
      tempErrors.firstName = "First name is required";
    } else if (!/^[A-Za-z\s]+$/.test(form.firstName)) {
      tempErrors.firstName = "First name should only contain letters";
    } else if (form.firstName.length < 2) {
      tempErrors.firstName = "First name must be at least 2 characters";
    }

    if (!form.lastName.trim()) {
      tempErrors.lastName = "Last name is required";
    } else if (!/^[A-Za-z\s]+$/.test(form.lastName)) {
      tempErrors.lastName = "Last name should only contain letters";
    } else if (form.lastName.length < 2) {
      tempErrors.lastName = "Last name must be at least 2 characters";
    }

    if (!form.email) {
      tempErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      tempErrors.email = "Please enter a valid email address";
    }

    if (!form.mobileNumber) {
      tempErrors.mobileNumber = "Mobile number is required";
    } else if (!/^[0-9]{10,12}$/.test(form.mobileNumber)) {
      tempErrors.mobileNumber = "Mobile number must be 10 to 12 digits";
    }

    if (!form.username) {
      tempErrors.username = "Username is required";
    } else if (form.username.length < 4) {
      tempErrors.username = "Username must be at least 4 characters";
    } else if (!/^[a-zA-Z0-9_]+$/.test(form.username)) {
      tempErrors.username = "Username can only contain letters, numbers, and underscores";
    }

    if (!form.password) {
      tempErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters";
    } else if (!/(?=.*[0-9])(?=.*[a-zA-Z])/.test(form.password)) {
      tempErrors.password = "Password must contain at least one letter and one number";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const onSubmit = async e => {
    e.preventDefault();
    if (!validateForm()) return;
    setSubmitting(true);
    setMsg(null);
    try {
      const registeredUsername = form.username;
      await api.post('/auth/register', form);
      setMsg({ type: 'success', text: `Congratulations, ${registeredUsername}! Your account has been successfully created.` });
      setForm(initialState);
      setErrors({});
    } catch (err) {
      const text = err?.response?.data?.error || 'Registration failed';
      setMsg({ type: 'error', text });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="signup-page" style={{
      backgroundImage: "radial-gradient(circle at 50% 50%, rgba(10, 48, 110, 0.45) 0%, rgba(4, 21, 51, 0.92) 100%), url('/fishwallpaper.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      <div className="signup-card">
        <div className="signup-card__header">
          <div className="header-icon-container">
            <svg width="80" height="80" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="login-fish-icon">
              <defs>
                <linearGradient id="fishGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#0284c7" />
                </linearGradient>
                <linearGradient id="tailGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0284c7" />
                  <stop offset="100%" stopColor="#0369a1" />
                </linearGradient>
              </defs>
              <circle cx="60" cy="60" r="54" stroke="rgba(56, 189, 248, 0.25)" strokeWidth="2.5" strokeDasharray="5 5" />
              <circle cx="60" cy="60" r="46" fill="rgba(56, 189, 248, 0.06)" />
              <path d="M32 60C45 42 75 42 88 60C75 78 45 78 32 60Z" fill="url(#fishGrad)" />
              <path d="M86 60C92 50 98 44 102 42C100 52 100 68 102 78C98 76 92 70 86 60Z" fill="url(#tailGrad)" />
              <path d="M52 50C48 55 48 65 52 70" stroke="rgba(255, 255, 255, 0.35)" strokeWidth="2" strokeLinecap="round" />
              <circle cx="44" cy="56" r="3" fill="#ffffff" />
              <circle cx="44.5" cy="55.5" r="1.2" fill="#0f172a" />
              <path d="M60 47C62 38 72 38 74 46C68 46 62 47 60 47Z" fill="url(#fishGrad)" opacity="0.8" />
              <path d="M60 73C62 82 72 82 74 74C68 74 62 73 60 73Z" fill="url(#fishGrad)" opacity="0.8" />
            </svg>
          </div>
          <h2>Create your account</h2>
          <p>Join Alok & Brother's to manage inventory, orders, and clients from one dashboard.</p>
        </div>
        <div className="signup-card__body">
          {msg && <div className={`signup-message ${msg.type}`}>{msg.text}</div>}
          <form className="signup-form" onSubmit={onSubmit}>
            {fields.map(field => (
              <div key={field.name} className={`field-group ${field.fullWidth ? 'full-width' : 'half-width'} ${errors[field.name] ? 'has-error' : ''}`}>
                <input
                  className="field-input"
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  value={form[field.name]}
                  onChange={onChange}
                  placeholder=" "
                  required
                />
                <label className="field-label" htmlFor={field.name}>{field.label}</label>
                {errors[field.name] && <span className="field-error-text">{errors[field.name]}</span>}
              </div>
            ))}
            <div className="submit-row">
              <button className="submit-btn" type="submit" disabled={submitting}>
                {submitting ? 'Creating account...' : 'Create account'}
              </button>
            </div>
          </form>
          <div className="auth-footer">
            <span>Already have an account?</span>
            <Link to="/login" className="auth-link">Log in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
