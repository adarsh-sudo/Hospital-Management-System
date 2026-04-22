const base = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  gap: '0.5rem', borderRadius: '8px', fontWeight: 500, fontFamily: 'inherit',
  cursor: 'pointer', border: 'none', transition: 'all 0.2s', outline: 'none',
};

const variants = {
  primary: {
    background: 'linear-gradient(135deg, #14b8a6, #0ea5e9)',
    color: '#fff',
    boxShadow: '0 0 16px rgba(20,184,166,0.35)',
  },
  secondary: {
    background: 'rgba(255,255,255,0.08)',
    color: 'rgba(255,255,255,0.75)',
    border: '1px solid rgba(255,255,255,0.12)',
  },
  danger: {
    background: 'linear-gradient(135deg, #f43f5e, #e11d48)',
    color: '#fff',
    boxShadow: '0 0 12px rgba(244,63,94,0.3)',
  },
};

const sizes = {
  sm: { padding: '0.35rem 0.75rem', fontSize: '0.8rem' },
  md: { padding: '0.5rem 1rem',     fontSize: '0.875rem' },
  lg: { padding: '0.65rem 1.25rem', fontSize: '1rem' },
};

export default function Button({ children, variant = 'primary', size = 'md', loading = false, style: extraStyle = {}, ...props }) {
  return (
    <button
      style={{ ...base, ...variants[variant], ...sizes[size], opacity: (loading || props.disabled) ? 0.5 : 1, cursor: (loading || props.disabled) ? 'not-allowed' : 'pointer', ...extraStyle }}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && (
        <svg style={{ width: '1rem', height: '1rem', animation: 'spin 1s linear infinite' }} viewBox="0 0 24 24" fill="none">
          <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      )}
      {children}
    </button>
  );
}
