const fieldStyle = {
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '8px',
  padding: '0.55rem 0.875rem',
  fontSize: '0.875rem',
  color: 'rgba(255,255,255,0.9)',
  fontFamily: 'inherit',
  width: '100%',
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
};

const errorFieldStyle = {
  ...fieldStyle,
  border: '1px solid rgba(244,63,94,0.6)',
};

export default function Input({ label, error, style: extraStyle = {}, ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
      {label && (
        <label style={{ fontSize: '0.8rem', fontWeight: 500, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.02em' }}>{label}</label>
      )}
      <input
        style={{ ...(error ? errorFieldStyle : fieldStyle), ...extraStyle }}
        onFocus={e => { e.target.style.borderColor = '#14b8a6'; e.target.style.boxShadow = '0 0 0 3px rgba(20,184,166,0.15)'; }}
        onBlur={e => { e.target.style.borderColor = error ? 'rgba(244,63,94,0.6)' : 'rgba(255,255,255,0.12)'; e.target.style.boxShadow = 'none'; }}
        {...props}
      />
      {error && <p style={{ fontSize: '0.75rem', color: '#f43f5e' }}>{error}</p>}
    </div>
  );
}
