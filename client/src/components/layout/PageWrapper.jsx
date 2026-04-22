export default function PageWrapper({ title, action, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{
            fontSize: '1.6rem', fontWeight: 700, letterSpacing: '-0.03em',
            background: 'linear-gradient(90deg, #ffffff 0%, rgba(20,184,166,0.85) 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>{title}</h1>
          <div style={{ height: '2px', width: '2rem', background: 'linear-gradient(90deg,#14b8a6,transparent)', marginTop: '4px', borderRadius: '1px' }} />
        </div>
        {action && <div>{action}</div>}
      </div>
      {children}
    </div>
  );
}
