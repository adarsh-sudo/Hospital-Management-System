import Spinner from '../ui/Spinner';
import Button from '../ui/Button';

const glass = {
  background: 'rgba(255,255,255,0.04)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '16px',
  overflow: 'hidden',
};

const thStyle = {
  padding: '0.75rem 1.25rem',
  fontSize: '0.7rem', fontWeight: 600,
  letterSpacing: '0.08em', textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.35)',
  borderBottom: '1px solid rgba(255,255,255,0.07)',
  textAlign: 'left',
  background: 'rgba(255,255,255,0.02)',
};

const tdStyle = {
  padding: '1rem 1.25rem',
  borderBottom: '1px solid rgba(255,255,255,0.05)',
  fontSize: '0.875rem',
};

export default function DoctorTable({ doctors, loading, error, onEdit, onDelete, userRole }) {
  if (loading) return <Spinner size="lg" />;
  if (error)   return <p style={{ textAlign:'center', padding:'4rem', color:'#fb7185', fontSize:'0.875rem' }}>{error}</p>;
  if (!doctors.length) return <p style={{ textAlign:'center', padding:'4rem', color:'rgba(255,255,255,0.3)', fontSize:'0.875rem' }}>No doctors found.</p>;

  const canEdit = userRole !== 'clerk';

  return (
    <div style={glass}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {['Name', 'Specialization', 'Phone', 'Email', ...(canEdit ? ['Actions'] : [])].map(h => (
              <th key={h} style={thStyle}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {doctors.map((d, i) => (
            <tr key={d.id}
              style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(20,184,166,0.06)'}
              onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)'}
            >
              <td style={{ ...tdStyle, fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>{d.name}</td>
              <td style={{ ...tdStyle, color: 'rgba(255,255,255,0.55)' }}>{d.specialization || '—'}</td>
              <td style={{ ...tdStyle, color: 'rgba(255,255,255,0.55)' }}>{d.phone || '—'}</td>
              <td style={{ ...tdStyle, color: 'rgba(255,255,255,0.55)' }}>{d.email || '—'}</td>
              {canEdit && (
                <td style={{ ...tdStyle, textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    <Button size="sm" variant="secondary" onClick={() => onEdit(d)}>Edit</Button>
                    <Button size="sm" variant="danger"    onClick={() => onDelete(d.id)}>Delete</Button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
