const sizes = { sm: '1rem', md: '1.5rem', lg: '2.5rem' };

export default function Spinner({ size = 'md', style: extraStyle = {} }) {
  const s = sizes[size];
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem', ...extraStyle }}>
      <div style={{
        width: s, height: s,
        border: '2px solid rgba(20,184,166,0.2)',
        borderTop: '2px solid #14b8a6',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
        boxShadow: '0 0 12px rgba(20,184,166,0.3)',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
