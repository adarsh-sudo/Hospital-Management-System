import Spinner from '../ui/Spinner';
import Button from '../ui/Button';
import { getToken } from '../../utils/auth';

async function downloadPrescription(id) {
  const res = await fetch(`/api/medical-records/${id}/prescription`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) return;
  const blob = await res.blob();
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `prescription-${id}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}

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

export default function MedicalRecordTable({ records, loading, error, enrichedAppointments = [], onEdit, onDelete, userRole }) {
  if (loading) return <Spinner size="lg" />;
  if (error)   return <p style={{ textAlign:'center', padding:'4rem', color:'#fb7185', fontSize:'0.875rem' }}>{error}</p>;
  if (!records.length) return <p style={{ textAlign:'center', padding:'4rem', color:'rgba(255,255,255,0.3)', fontSize:'0.875rem' }}>No medical records found.</p>;

  const apptMap = Object.fromEntries(enrichedAppointments.map(a => [a.id, a]));
  const canEdit = userRole !== 'clerk';

  return (
    <div style={glass}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {['ID', 'Appointment', 'Diagnosis', 'Notes', 'Prescription', 'Created At', ...(canEdit ? ['Actions'] : [])].map(h => (
              <th key={h} style={thStyle}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {records.map((r, i) => {
            const appt = apptMap[r.appointment_id];
            return (
              <tr key={r.id}
                style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(20,184,166,0.06)'}
                onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)'}
              >
                <td style={{ ...tdStyle, color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>#{r.id}</td>
                <td style={tdStyle}>
                  {appt ? (
                    <>
                      <div style={{ fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>{appt.patientName}</div>
                      <div style={{ fontSize: '0.75rem', color: '#2dd4bf', marginTop: '0.2rem' }}>{appt.doctorName}</div>
                    </>
                  ) : (
                    <span style={{ color: 'rgba(255,255,255,0.35)' }}>#{r.appointment_id}</span>
                  )}
                </td>
                <td style={{ ...tdStyle, color: 'rgba(255,255,255,0.7)', maxWidth: '14rem' }}>
                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.diagnosis || '—'}</div>
                </td>
                <td style={{ ...tdStyle, color: 'rgba(255,255,255,0.55)', maxWidth: '14rem' }}>
                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.notes || '—'}</div>
                </td>
                <td style={tdStyle}>
                  {r.prescription_path ? (
                    <button
                      onClick={() => downloadPrescription(r.id)}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: '#2dd4bf', fontSize: '0.8rem', fontWeight: 600,
                        textDecoration: 'underline', padding: 0,
                      }}
                    >
                      Download PDF
                    </button>
                  ) : (
                    <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.8rem' }}>No Prescription Uploaded</span>
                  )}
                </td>
                <td style={{ ...tdStyle, color: 'rgba(255,255,255,0.45)' }}>{new Date(r.created_at).toLocaleDateString()}</td>
                {canEdit && (
                  <td style={{ ...tdStyle, textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <Button size="sm" variant="secondary" onClick={() => onEdit(r)}>Edit</Button>
                      <Button size="sm" variant="danger"    onClick={() => onDelete(r.id)}>Delete</Button>
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
