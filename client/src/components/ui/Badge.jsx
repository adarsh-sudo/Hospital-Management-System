const variants = {
  scheduled: { background: 'rgba(14,165,233,0.15)', color: '#38bdf8', border: '1px solid rgba(14,165,233,0.3)' },
  completed: { background: 'rgba(20,184,166,0.15)', color: '#2dd4bf', border: '1px solid rgba(20,184,166,0.3)' },
  cancelled: { background: 'rgba(244,63,94,0.15)',  color: '#fb7185', border: '1px solid rgba(244,63,94,0.3)' },
  default:   { background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.12)' },
};

export default function Badge({ label }) {
  const style = variants[label?.toLowerCase()] || variants.default;
  return (
    <span style={{
      ...style,
      display: 'inline-flex', alignItems: 'center',
      borderRadius: '20px', padding: '0.2rem 0.65rem',
      fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.05em',
      textTransform: 'capitalize',
    }}>
      {label}
    </span>
  );
}
