import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { setToken } from '../utils/auth';

const bg = {
  minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
  background: '#060d1f',
  backgroundImage: `
    radial-gradient(ellipse 100% 80% at 50% 0%, rgba(20,184,166,0.18) 0%, transparent 60%),
    radial-gradient(ellipse 70% 60% at 10% 100%, rgba(99,102,241,0.15) 0%, transparent 55%),
    radial-gradient(ellipse 60% 50% at 90% 80%, rgba(14,165,233,0.12) 0%, transparent 50%)
  `,
  padding: '1.5rem', paddingTop: 0,
};

const card = {
  width: '100%', maxWidth: '22rem',
  background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(24px)',
  border: '1px solid rgba(255,255,255,0.12)', borderRadius: '20px',
  padding: '2.5rem 2rem',
  boxShadow: '0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(20,184,166,0.08)',
};

const inputStyle = {
  width: '100%', background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px',
  padding: '0.75rem 1rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.9)',
  fontFamily: 'DM Sans, sans-serif', outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s', boxSizing: 'border-box',
};

const btnStyle = {
  width: '100%', padding: '0.8rem',
  background: 'linear-gradient(135deg, #14b8a6, #0ea5e9)',
  border: 'none', borderRadius: '10px', color: '#fff',
  fontSize: '0.95rem', fontWeight: 600, fontFamily: 'DM Sans, sans-serif',
  cursor: 'pointer', marginTop: '0.5rem',
  boxShadow: '0 0 24px rgba(20,184,166,0.4)', transition: 'opacity 0.2s, transform 0.15s',
};

export default function RegisterPage() {
  const { role } = useParams();
  const navigate  = useNavigate();
  const isDoctor  = role === 'doctor';

  const [form, setForm]         = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors]     = useState({});
  const [submitErr, setSubmitErr] = useState('');
  const [loading, setLoading]   = useState(false);

  const set = f => e => setForm(prev => ({ ...prev, [f]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = {};
    if (!form.name.trim())                    errs.name     = 'Name is required';
    if (!form.email.trim())                   errs.email    = 'Email is required';
    if (!form.password)                       errs.password = 'Password is required';
    if (!form.confirm)                        errs.confirm  = 'Please confirm your password';
    else if (form.confirm !== form.password)  errs.confirm  = 'Passwords do not match';
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setSubmitErr('');
    try {
      const res  = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password, role }),
      });
      const data = await res.json();
      if (!res.ok) { setSubmitErr(data.error || 'Registration failed'); return; }
      setToken(data.token);
      navigate(role === 'doctor' ? '/doctor/dashboard' : '/patient/doctors');
    } catch {
      setSubmitErr('Network error — is the server running?');
    } finally {
      setLoading(false);
    }
  };

  const focus = e => { e.target.style.borderColor = '#14b8a6'; e.target.style.boxShadow = '0 0 0 3px rgba(20,184,166,0.15)'; };
  const blur  = (e, err) => { e.target.style.borderColor = err ? 'rgba(244,63,94,0.6)' : 'rgba(255,255,255,0.12)'; e.target.style.boxShadow = 'none'; };

  const field = (key, placeholder, type = 'text') => (
    <div style={{ marginBottom: '1rem' }}>
      <input
        type={type} placeholder={placeholder} value={form[key]} onChange={set(key)}
        onFocus={focus} onBlur={e => blur(e, errors[key])}
        style={{ ...inputStyle, borderColor: errors[key] ? 'rgba(244,63,94,0.6)' : 'rgba(255,255,255,0.12)' }}
      />
      {errors[key] && <p style={{ fontSize: '0.72rem', color: '#f43f5e', marginTop: '0.3rem' }}>{errors[key]}</p>}
    </div>
  );

  return (
    <div style={bg}>
      <div style={card}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            width: '3rem', height: '3rem', borderRadius: '12px',
            background: isDoctor ? 'linear-gradient(135deg, #6366f1, #818cf8)' : 'linear-gradient(135deg, #14b8a6, #0ea5e9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 0.875rem',
            boxShadow: isDoctor ? '0 0 24px rgba(99,102,241,0.5)' : '0 0 24px rgba(20,184,166,0.5)',
          }}>
            <svg style={{ width: '1.4rem', height: '1.4rem', color: '#fff' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 style={{
            fontSize: '1.6rem', fontWeight: 700, letterSpacing: '-0.03em',
            background: 'linear-gradient(90deg, #fff 0%, rgba(20,184,166,0.9) 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.25rem',
          }}>{isDoctor ? 'Doctor Register' : 'Patient Register'}</h1>
          <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)' }}>Create your MediCore account</p>
        </div>

        <form onSubmit={handleSubmit}>
          {field('name',     'Full Name')}
          {field('email',    'Email',           'email')}
          {field('password', 'Password',        'password')}
          {field('confirm',  'Confirm Password', 'password')}

          {submitErr && <p style={{ fontSize: '0.78rem', color: '#f43f5e', marginBottom: '0.75rem', textAlign: 'center' }}>{submitErr}</p>}

          <button type="submit" disabled={loading} style={{ ...btnStyle, opacity: loading ? 0.7 : 1 }}
            onMouseEnter={e => { if (!loading) { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(-1px)'; }}}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'none'; }}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.82rem', color: 'rgba(255,255,255,0.35)' }}>
          Already have an account?{' '}
          <Link to={`/${role}/login`} style={{ color: '#14b8a6', fontWeight: 600, textDecoration: 'none' }}>Login</Link>
        </p>
        <p style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '0.82rem', color: 'rgba(255,255,255,0.35)' }}>
          <Link to="/" style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>← Back to home</Link>
        </p>
      </div>
    </div>
  );
}
