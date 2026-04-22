import { useNavigate } from 'react-router-dom';
import { removeToken, getUser } from '../../utils/auth';

export default function Navbar({ onMenuClick, isMobile }) {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    removeToken();
    navigate('/');
  };

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 40, height: '4rem',
      background: 'rgba(6,13,31,0.7)', backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 1rem',
      boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Hamburger — mobile only */}
        {isMobile && (
          <button onClick={onMenuClick} style={{
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px', padding: '0.4rem', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.7)',
          }}>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            width: '2rem', height: '2rem', borderRadius: '8px',
            background: 'linear-gradient(135deg, #14b8a6, #0ea5e9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 16px rgba(20,184,166,0.5)', flexShrink: 0,
          }}>
            <svg style={{ width: '1.1rem', height: '1.1rem', color: '#fff' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <span style={{
            fontSize: '1.1rem', fontWeight: 600, letterSpacing: '-0.02em',
            background: 'linear-gradient(90deg, #fff 0%, rgba(20,184,166,0.9) 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>MediCore</span>
        </div>
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        {user && !isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)' }}>{user.name}</span>
            <span style={{
              fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase',
              padding: '0.2rem 0.55rem', borderRadius: '20px',
              background: user.role === 'doctor' ? 'rgba(99,102,241,0.2)' : 'rgba(20,184,166,0.15)',
              color: user.role === 'doctor' ? '#a5b4fc' : '#2dd4bf',
              border: user.role === 'doctor' ? '1px solid rgba(99,102,241,0.3)' : '1px solid rgba(20,184,166,0.3)',
            }}>{user.role}</span>
          </div>
        )}
        <button
          onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px', padding: '0.4rem 0.75rem',
            color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', fontWeight: 500,
            fontFamily: 'DM Sans, sans-serif', cursor: 'pointer', transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(244,63,94,0.15)'; e.currentTarget.style.color = '#f43f5e'; e.currentTarget.style.borderColor = 'rgba(244,63,94,0.3)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
        >
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {!isMobile && 'Logout'}
        </button>
      </div>
    </header>
  );
}
