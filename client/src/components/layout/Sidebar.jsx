import { NavLink } from 'react-router-dom';

const links = [
  {
    to: '/patients', label: 'Patients',
    icon: <svg style={{width:'1.1rem',height:'1.1rem'}} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  },
  {
    to: '/doctors', label: 'Doctors',
    icon: <svg style={{width:'1.1rem',height:'1.1rem'}} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  },
  {
    to: '/appointments', label: 'Appointments',
    icon: <svg style={{width:'1.1rem',height:'1.1rem'}} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  },
  {
    to: '/medical-records', label: 'Medical Records',
    icon: <svg style={{width:'1.1rem',height:'1.1rem'}} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  },
];

const activeStyle = {
  background: 'linear-gradient(90deg, rgba(20,184,166,0.2), rgba(20,184,166,0.05))',
  color: '#14b8a6',
  borderLeft: '2px solid #14b8a6',
  boxShadow: 'inset 0 0 20px rgba(20,184,166,0.05)',
};

const inactiveStyle = {
  color: 'rgba(255,255,255,0.5)',
  borderLeft: '2px solid transparent',
};

export default function Sidebar() {
  return (
    <aside style={{
      position: 'fixed', top: '4rem', left: 0, zIndex: 30,
      height: 'calc(100vh - 4rem)', width: '14rem',
      background: 'rgba(6,13,31,0.6)',
      backdropFilter: 'blur(20px)',
      borderRight: '1px solid rgba(255,255,255,0.07)',
      display: 'flex', flexDirection: 'column', paddingTop: '1rem',
    }}>
      <div style={{ padding: '0 0.5rem 0.75rem', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: '0.5rem' }}>
        <p style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.25)', padding: '0 0.75rem', textTransform: 'uppercase' }}>Navigation</p>
      </div>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px', padding: '0 0.5rem' }}>
        {links.map(({ to, label, icon }) => (
          <NavLink key={to} to={to} style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: '0.65rem',
            padding: '0.6rem 0.75rem', borderRadius: '0 8px 8px 0',
            fontSize: '0.875rem', fontWeight: 500,
            textDecoration: 'none', transition: 'all 0.2s',
            ...(isActive ? activeStyle : inactiveStyle),
          })}>
            {icon}
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
