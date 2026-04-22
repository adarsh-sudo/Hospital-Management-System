import Spinner from '../ui/Spinner';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

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

export default function AppointmentTable({ appointments, loading, error, patients = [], doctors = [], departments = [], onEdit, onDelete, userRole }) {
  if (loading) return <Spinner size="lg" />;
  if (error)   return <p style={{ textAlign:'center', padding:'4rem', color:'#fb7185', fontSize:'0.875rem' }}>{error}</p>;
  if (!appointments.length) return <p style={{ textAlign:'center', padding:'4rem', color:'rgba(255,255,255,0.3)', fontSize:'0.875rem' }}>No appointments found.</p>;

  const patientMap  = Object.fromEntries(patients.map(p => [p.id, p.name]));
  const deptMap     = Object.fromEntries(departments.map(d => [d.id, d.name]));
  const doctorLabel = d => d.department_id ? `${d.name} — ${deptMap[d.department_id] || ''}` : d.name;
  const doctorMap   = Object.fromEntries(doctors.map(d => [d.id, doctorLabel(d)]));

  const isClerk  = userRole === 'clerk';
  const canDelete = !isClerk;

  return (
    <div style={glass}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {['Patient & Time', 'Doctor', 'Status', 'Actions'].map(h => (
              <th key={h} style={thStyle}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {appointments.map((a, i) => (
            <tr key={a.id}
              style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(20,184,166,0.06)'}
              onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)'}
            >
              <td style={tdStyle}>
                <div style={{ fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>{patientMap[a.patient_id] || `#${a.patient_id}`}</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.2rem' }}>
                  {new Date(a.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  {' · '}
                  {new Date(a.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                </div>
              </td>
              <td style={{ ...tdStyle, color: 'rgba(255,255,255,0.6)' }}>{doctorMap[a.doctor_id] || `#${a.doctor_id}`}</td>
              <td style={tdStyle}><Badge label={a.status} /></td>
              <td style={{ ...tdStyle, textAlign: 'right' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                  <Button size="sm" variant="secondary" onClick={() => onEdit(a)}>Edit</Button>
                  {canDelete && <Button size="sm" variant="danger" onClick={() => onDelete(a.id)}>Delete</Button>}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
