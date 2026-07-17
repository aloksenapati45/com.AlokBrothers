import React, {useState, useRef, useEffect} from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { setToken } from '../services/api';
import './NavBar.css';

const navigation = [
  { name: 'Dashboard', to: '/dashboard', current: true },
  { name: 'Inventory', to: '/inventory', current: false },
  { name: 'Orders', to: '/orders', current: false },
  { name: 'Customers', to: '/customers', current: false },
  { name: 'Suppliers', to: '/suppliers', current: false },
  { name: 'Reports', to: '/reports', current: false },
];

function IconMenu(){
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconClose(){
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}



export default function NavBar(){
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef();
  const location = useLocation();
  const navigate = useNavigate();

  const token = localStorage.getItem('authToken');
  const isLoggedIn = !!token;
  const [username, setUsername] = useState(isLoggedIn ? (localStorage.getItem('username') || 'admin') : '');
  const defaultPhoto = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80";
  const [photo, setPhoto] = useState(isLoggedIn ? (localStorage.getItem(`profilePhoto_${localStorage.getItem('username') || 'admin'}`) || defaultPhoto) : "/avatar.png");

  useEffect(()=>{
    function onDoc(e){
      if(profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    }
    const onStorage = () => {
      const currentUsername = localStorage.getItem('username') || 'admin';
      setUsername(currentUsername);
      if (localStorage.getItem('authToken')) {
        setPhoto(localStorage.getItem(`profilePhoto_${currentUsername}`) || defaultPhoto);
      } else {
        setPhoto("/avatar.png");
      }
    };
    document.addEventListener('click', onDoc);
    window.addEventListener('storage', onStorage);
    return ()=>{
      document.removeEventListener('click', onDoc);
      window.removeEventListener('storage', onStorage);
    };
  },[isLoggedIn]);

  const handleLogout = (e) => {
    e.preventDefault();
    setToken(null);
    localStorage.removeItem('username');
    setUsername('');
    setPhoto("/avatar.png");
    setProfileOpen(false);
    navigate('/login');
  };

  const profilePhoto = isLoggedIn ? photo : "/avatar.png";

  return (
    <nav className="ab-nav">
      <div className="ab-container">
        <div className="ab-left">
          <button className="ab-mobile-btn" onClick={()=>setMobileOpen(!mobileOpen)} aria-label="toggle menu">
            <span className="ab-sr">Toggle menu</span>
            {mobileOpen ? <IconClose/> : <IconMenu/>}
          </button>
          <div className="ab-brand" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
            <img src="/logo.png" alt="Alok & Brother" onError={(e)=>e.target.style.display='none'} />
          </div>
        </div>

        <div className="ab-center">
          <div className={`ab-links ${mobileOpen? 'open': ''}`}>
            {navigation.map(item => {
              const isCurrent = location.pathname === item.to;
              return (
                <Link key={item.name} to={item.to} className={`ab-link ${isCurrent? 'current':''}`} onClick={()=>setMobileOpen(false)}>
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="ab-right">
          {isLoggedIn ? (
            <div className="ab-profile" ref={profileRef} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <button className="ab-profile-btn" onClick={()=>setProfileOpen(!profileOpen)}>
                <img src={photo} alt="Profile" style={{ objectFit: 'cover' }} />
              </button>
              <span className="profile-username" style={{ fontSize: '11px', marginTop: '2px', opacity: 0.85, fontWeight: 600, color: 'var(--color-structural)' }}>{username}</span>
              {profileOpen && (
                <div className="ab-profile-menu" style={{ top: '52px' }}>
                  <Link to="/profile" className="ab-profile-item" onClick={()=>setProfileOpen(false)}>Your profile</Link>
                  <a href="#" className="ab-profile-item" onClick={handleLogout}>Sign out</a>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="ab-link login">Login</Link>
              <Link to="/signup" className="ab-link signup">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
