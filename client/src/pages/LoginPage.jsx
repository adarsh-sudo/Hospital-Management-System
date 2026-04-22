import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { setToken } from '../utils/auth';

const bgStyle = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#060d1f',
  backgroundImage: `
    radial-gradient(ellipse 100% 80% at 50% 0%, rgba(20,184,166,0.18) 0%, transparent 60%),
    radial-gradient(ellipse 70% 60% at 10% 100%, rgba(99,102,241,0.15) 0%, transparent 55%),
    radial-gradient(ellipse 60% 50% at 90% 80%, rgba(14,165,233,0.12) 0%, transparent 50%)
  `,
  padding: '1.5rem',
};

const cardStyle = {
  width: '100%',
  maxWidth: '22rem',
  background: 'rgba(255,255,255,0.07)',
  backdropFilter: 'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '20px',
  padding: '2.5rem 2rem',
  boxShadow: '0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(20,184,166,0.08)',
};

const inputWrapStyle = {
  position: 'relative',
  marginBottom: '1rem',
};

const inputStyle = {
  width: '100%',
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '10px',
  padding: '0.75rem 2.75rem 0.75rem 1rem',
  fontSize: '0.9rem',
  color: 'rgba(255,255,255,0.9)',
  fontFamily: 'DM Sans, sans-serif',
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
  boxSizing: 'border-box',
};

const iconStyle = {
  position: 'absolute',
  right: '0.875rem',
  top: '50%',
  transform: 'translateY(-50%)',
  color: 'rgba(255,255,255,0.3)',
  pointerEvents: 'none',
};

const btnStyle = {
  width: '100%',
  padding: '0.8rem',
  background: 'linear-gradient(135deg, #14b8a6, #0ea5e9)',
  border: 'none',
  borderRadius: '10px',
  color: '#fff',
  fontSize: '0.95rem',
  fontWeight: 600,
  fontFamily: 'DM Sans, sans-serif',
  cursor: 'pointer',
  marginTop: '0.5rem',
  boxShadow: '0 0 24px rgba(20,184,166,0.4)',
  transition: 'opacity 0.2s, transform 0.15s',
};

export default function LoginPage() {
  const [form, setForm]       = useState({ email: '', password: '' });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const set = field => e => setForm(f => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.email.trim())    e.email    = 'Email is required';
    if (!form.password.trim()) e.password = 'Password is required';
    return e;
  };

  const [submitErr, setSubmitErr] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setSubmitErr('');
    try {
      const res  = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) { setSubmitErr(data.error || 'Login failed'); return; }
      setToken(data.token);
      navigate('/patients');
    } catch {
      setSubmitErr('Network error — is the server running?');
    } finally {
      setLoading(false);
    }
  };

  const focusStyle  = e => { e.target.style.borderColor = '#14b8a6'; e.target.style.boxShadow = '0 0 0 3px rgba(20,184,166,0.15)'; };
  const blurStyle   = (e, hasErr) => { e.target.style.borderColor = hasErr ? 'rgba(244,63,94,0.6)' : 'rgba(255,255,255,0.12)'; e.target.style.boxShadow = 'none'; };

  return (
    <div style={bgStyle}>
      <div style={cardStyle}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '3rem', height: '3rem', borderRadius: '12px',
            background: 'linear-gradient(135deg, #14b8a6, #0ea5e9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 0.875rem',
            boxShadow: '0 0 24px rgba(20,184,166,0.5)',
          }}>
            <svg style={{ width: '1.4rem', height: '1.4rem', color: '#fff' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 style={{
            fontSize: '1.6rem', fontWeight: 700, letterSpacing: '-0.03em',
            background: 'linear-gradient(90deg, #fff 0%, rgba(20,184,166,0.9) 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            marginBottom: '0.25rem',
          }}>Login</h1>
          <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)' }}>Sign in to MediCore</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div style={inputWrapStyle}>
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={set('email')}
              onFocus={focusStyle}
              onBlur={e => blurStyle(e, errors.email)}
              style={{ ...inputStyle, borderColor: errors.email ? 'rgba(244,63,94,0.6)' : 'rgba(255,255,255,0.12)' }}
            />
            <span style={iconStyle}>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>
            </span>
            {errors.email && <p style={{ fontSize: '0.72rem', color: '#f43f5e', marginTop: '0.3rem' }}>{errors.email}</p>}
          </div>

          {/* Password */}
          <div style={inputWrapStyle}>
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={set('password')}
              onFocus={focusStyle}
              onBlur={e => blurStyle(e, errors.password)}
              style={{ ...inputStyle, borderColor: errors.password ? 'rgba(244,63,94,0.6)' : 'rgba(255,255,255,0.12)' }}
            />
            <span style={iconStyle}>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </span>
            {errors.password && <p style={{ fontSize: '0.72rem', color: '#f43f5e', marginTop: '0.3rem' }}>{errors.password}</p>}
          </div>

          {submitErr && <p style={{ fontSize: '0.78rem', color: '#f43f5e', marginBottom: '0.75rem', textAlign: 'center' }}>{submitErr}</p>}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{ ...btnStyle, opacity: loading ? 0.7 : 1 }}
            onMouseEnter={e => { if (!loading) { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(-1px)'; }}}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'none'; }}
          >
            {loading ? 'Signing in…' : 'Login'}
          </button>
        </form>

        {/* Register link */}
        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.82rem', color: 'rgba(255,255,255,0.35)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#14b8a6', fontWeight: 600, textDecoration: 'none' }}
            onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
            onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
          >Register</Link>
        </p>
      </div>
    </div>
  );
}
