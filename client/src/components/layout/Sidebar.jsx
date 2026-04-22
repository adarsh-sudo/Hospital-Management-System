import { NavLink } from 'react-router-dom';
import { getUserRole } from '../../utils/auth';

const patientLinks = [
  {
    to: '/patient/doctors', label: 'Browse Doctors',
    icon: <svg style={{ width: '1.15rem', height: '1.15rem', flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  },
  {
    to: '/patient/bookings', label: 'My Bookings',
    icon: <svg style={{ width: '1.15rem', height: '1.15rem', flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  },
];

const doctorLinks = [
  {
    to: '/doctor/dashboard', label: 'Appointments',
    icon: <svg style={{ width: '1.15rem', height: '1.15rem', flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>,
  },
  {
    to: '/doctor/availability', label: 'My Availability',
    icon: <svg style={{ width: '1.15rem', height: '1.15rem', flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  },
];

const ChevronLeft = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);
const ChevronRight = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

export default function Sidebar({ collapsed, onCollapse, mobileOpen, onClose, isMobile }) {
  const role  = getUserRole();
  const links = role === 'doctor' ? doctorLinks : patientLinks;
  const isExpanded = isMobile || !collapsed;

  return (
    <>
      {/* Mobile backdrop */}
      {isMobile && mobileOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0, zIndex: 29,
            background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(2px)',
          }}
        />
      )}

      <aside style={{
        position: 'fixed', top: '4rem', left: 0, zIndex: 30,
        height: 'calc(100vh - 4rem)',
        width: isMobile ? '15rem' : collapsed ? '3.5rem' : '14rem',
        background: 'rgba(6,13,31,0.97)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(255,255,255,0.07)',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
        transition: 'width 0.25s ease, transform 0.25s ease',
        transform: isMobile ? (mobileOpen ? 'translateX(0)' : 'translateX(-100%)') : 'translateX(0)',
      }}>

        {/* Header row */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: isExpanded ? 'space-between' : 'center',
          padding: isExpanded ? '0.85rem 0.85rem 0.85rem 1rem' : '0.85rem',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          minHeight: '3rem',
        }}>
          {isExpanded && (
            <p style={{
              fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.12em',
              color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase',
              whiteSpace: 'nowrap', overflow: 'hidden',
            }}>
              {role === 'doctor' ? 'Doctor Panel' : 'Patient Panel'}
            </p>
          )}

          {/* Desktop collapse toggle */}
          {!isMobile && (
            <button
              onClick={onCollapse}
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              style={{
                background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '6px', width: '24px', height: '24px', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: 'rgba(255,255,255,0.5)', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(20,184,166,0.2)'; e.currentTarget.style.color = '#14b8a6'; e.currentTarget.style.borderColor = 'rgba(20,184,166,0.3)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
            >
              {collapsed ? <ChevronRight /> : <ChevronLeft />}
            </button>
          )}

          {/* Mobile close button */}
          {isMobile && (
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '6px', width: '24px', height: '24px', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: 'rgba(255,255,255,0.5)',
              }}
            >
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Nav links */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px', padding: '0.5rem 0.4rem', flex: 1 }}>
          {links.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={isMobile ? onClose : undefined}
              title={collapsed && !isMobile ? label : undefined}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center',
                gap: isExpanded ? '0.65rem' : 0,
                justifyContent: isExpanded ? 'flex-start' : 'center',
                padding: isExpanded ? '0.65rem 0.75rem' : '0.65rem',
                borderRadius: '10px',
                fontSize: '0.875rem', fontWeight: 500,
                textDecoration: 'none', transition: 'all 0.2s',
                whiteSpace: 'nowrap', overflow: 'hidden',
                ...(isActive ? {
                  background: 'linear-gradient(90deg, rgba(20,184,166,0.2), rgba(20,184,166,0.06))',
                  color: '#14b8a6',
                  boxShadow: 'inset 0 0 20px rgba(20,184,166,0.05)',
                  border: '1px solid rgba(20,184,166,0.2)',
                } : {
                  color: 'rgba(255,255,255,0.5)',
                  border: '1px solid transparent',
                }),
              })}
              onMouseEnter={e => {
                if (!e.currentTarget.style.color.includes('20,184,166') && !e.currentTarget.classList.contains('active')) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.color = 'rgba(255,255,255,0.8)';
                }
              }}
              onMouseLeave={e => {
                if (!e.currentTarget.getAttribute('aria-current')) {
                  e.currentTarget.style.background = '';
                  e.currentTarget.style.color = '';
                }
              }}
            >
              {icon}
              {isExpanded && <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
