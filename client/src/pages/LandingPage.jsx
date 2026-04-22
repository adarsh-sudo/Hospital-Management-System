import { useNavigate, Navigate } from 'react-router-dom';
import { isAuthenticated, getUserRole } from '../utils/auth';

const bg = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#060d1f',
  backgroundImage: `
    radial-gradient(ellipse 100% 80% at 50% 0%, rgba(20,184,166,0.18) 0%, transparent 60%),
    radial-gradient(ellipse 70% 60% at 10% 100%, rgba(99,102,241,0.15) 0%, transparent 55%),
    radial-gradient(ellipse 60% 50% at 90% 80%, rgba(14,165,233,0.12) 0%, transparent 50%)
  `,
  padding: '2rem',
  paddingTop: 0,
};

function RoleCard({ role, title, description, icon, onClick }) {
  const isDoctor = role === 'doctor';
  const accent   = isDoctor ? '#818cf8' : '#14b8a6';
  const glow     = isDoctor ? 'rgba(99,102,241,0.35)' : 'rgba(20,184,166,0.35)';
  const grad     = isDoctor
    ? 'linear-gradient(135deg, #6366f1, #818cf8)'
    : 'linear-gradient(135deg, #14b8a6, #0ea5e9)';

  return (
    <div
      onClick={onClick}
      style={{
        width: '100%', maxWidth: '22rem', cursor: 'pointer',
        background: 'rgba(255,255,255,0.06)',
        backdropFilter: 'blur(24px)',
        border: `1px solid rgba(255,255,255,0.1)`,
        borderRadius: '20px', padding: '2.5rem 2rem',
        boxShadow: '0 24px 60px rgba(0,0,0,0.4)',
        transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = `0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px ${accent}33`;
        e.currentTarget.style.borderColor = `${accent}55`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = '0 24px 60px rgba(0,0,0,0.4)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
      }}
    >
      <div style={{
        width: '4rem', height: '4rem', borderRadius: '16px',
        background: grad, display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: `0 0 32px ${glow}`,
      }}>
        {icon}
      </div>
      <div style={{ textAlign: 'center' }}>
        <h2 style={{
          fontSize: '1.3rem', fontWeight: 700, letterSpacing: '-0.02em',
          color: '#fff', marginBottom: '0.4rem',
        }}>{title}</h2>
        <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>{description}</p>
      </div>
      <div style={{
        marginTop: '0.5rem', padding: '0.6rem 1.5rem',
        background: grad, borderRadius: '10px',
        color: '#fff', fontSize: '0.875rem', fontWeight: 600,
        boxShadow: `0 0 20px ${glow}`,
      }}>
        Continue as {title}
      </div>
    </div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();

  if (isAuthenticated()) {
    const role = getUserRole();
    return <Navigate to={role === 'doctor' ? '/doctor/dashboard' : '/patient/doctors'} replace />;
  }

  return (
    <div style={bg}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <div style={{
          width: '3.5rem', height: '3.5rem', borderRadius: '14px',
          background: 'linear-gradient(135deg, #14b8a6, #0ea5e9)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1rem',
          boxShadow: '0 0 32px rgba(20,184,166,0.5)',
        }}>
          <svg style={{ width: '1.75rem', height: '1.75rem', color: '#fff' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h1 style={{
          fontSize: '2.5rem', fontWeight: 700, letterSpacing: '-0.04em',
          background: 'linear-gradient(90deg, #fff 0%, rgba(20,184,166,0.9) 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          marginBottom: '0.5rem',
        }}>MediCore</h1>
        <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.4)' }}>
          Book appointments. Manage availability. Stay connected.
        </p>
      </div>

      {/* Role cards */}
      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <RoleCard
          role="patient"
          title="Patient"
          description="Browse doctors, check availability, and book appointments instantly."
          onClick={() => navigate('/patient/register')}
          icon={
            <svg style={{ width: '2rem', height: '2rem', color: '#fff' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          }
        />
        <RoleCard
          role="doctor"
          title="Doctor"
          description="Set your availability, manage time slots, and handle appointment requests."
          onClick={() => navigate('/doctor/register')}
          icon={
            <svg style={{ width: '2rem', height: '2rem', color: '#fff' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
        />
      </div>
    </div>
  );
}
