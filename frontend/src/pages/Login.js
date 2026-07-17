import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import api, { setToken } from '../services/api';
import './Signup.css';

export default function Login(){
  const [form, setForm] = useState({username:'', password:''});
  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const onChange = e => {
    setForm({...form, [e.target.name]: e.target.value});
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const validateForm = () => {
    const tempErrors = {};
    if (!form.username.trim()) {
      tempErrors.username = "Username is required";
    }
    if (!form.password) {
      tempErrors.password = "Password is required";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const onSubmit = async e => {
    e.preventDefault();
    if (!validateForm()) return;
    setSubmitting(true);
    setMsg(null);
    try{
      const res = await api.post('/auth/login', form);
      setToken(res.data.token);
      localStorage.setItem('username', form.username);
      setMsg({type:'success', text:'Logged in successfully'});
      setTimeout(() => navigate('/dashboard'), 800);
    }catch(err){
      const text = err?.response?.data?.error || 'Login failed';
      setMsg({type:'error', text});
    }finally{
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
          <h2>Welcome back</h2>
          <p>Sign in to your account and continue managing your fish dealership.</p>
        </div>
        <div className="signup-card__body">
          {msg && <div className={`signup-message ${msg.type}`}>{msg.text}</div>}
          <form className="signup-form" onSubmit={onSubmit}>
            <div className={`field-group ${errors.username ? 'has-error' : ''}`}>
              <input
                className="field-input"
                id="username"
                name="username"
                type="text"
                value={form.username}
                onChange={onChange}
                placeholder=" "
                required
              />
              <label className="field-label" htmlFor="username">Username</label>
              {errors.username && <span className="field-error-text">{errors.username}</span>}
            </div>
            <div className={`field-group ${errors.password ? 'has-error' : ''}`}>
              <input
                className="field-input"
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={onChange}
                placeholder=" "
                required
              />
              <label className="field-label" htmlFor="password">Password</label>
              {errors.password && <span className="field-error-text">{errors.password}</span>}
            </div>
            <div className="submit-row">
              <button className="submit-btn" type="submit" disabled={submitting}>
                {submitting ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
          <div className="auth-footer">
            <span>New here?</span>
            <button className="auth-link" onClick={() => navigate('/signup')} type="button">Create account</button>
          </div>
        </div>
      </div>
    </div>
  );
}
