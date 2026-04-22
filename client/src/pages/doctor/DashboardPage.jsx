import { useState, useEffect } from 'react';
import { getAppointmentRequests, updateAppointmentStatus } from '../../services/appointment.service';
import Badge from '../../components/ui/Badge';
import PageWrapper from '../../components/layout/PageWrapper';

const FILTERS = ['all', 'pending', 'approved', 'rejected'];

function RequestCard({ appt, onAction }) {
  const [loading, setLoading] = useState('');
  const date    = new Date(appt.slot_time);
  const dateStr = date.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
  const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const act = async (status) => {
    setLoading(status);
    try {
      await updateAppointmentStatus(appt.id, status);
      onAction();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading('');
    }
  };

  return (
    <div style={{
      background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '14px', padding: '1.25rem',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
      flexWrap: 'wrap',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff' }}>{appt.patient_name}</span>
          <Badge label={appt.status} />
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {dateStr}
          </span>
          <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {timeStr}
          </span>
        </div>
        <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.25)' }}>{appt.slot_label}</span>
      </div>

      {appt.status === 'pending' && (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => act('approved')}
            disabled={!!loading}
            style={{
              padding: '0.45rem 1rem', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer',
              background: 'rgba(20,184,166,0.15)', border: '1px solid rgba(20,184,166,0.3)',
              color: '#2dd4bf', fontSize: '0.8rem', fontWeight: 600, fontFamily: 'inherit',
              opacity: loading === 'approved' ? 0.6 : 1, transition: 'all 0.15s',
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.background = 'rgba(20,184,166,0.25)'; }}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(20,184,166,0.15)'}
          >
            {loading === 'approved' ? '…' : 'Approve'}
          </button>
          <button
            onClick={() => act('rejected')}
            disabled={!!loading}
            style={{
              padding: '0.45rem 1rem', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer',
              background: 'rgba(244,63,94,0.12)', border: '1px solid rgba(244,63,94,0.25)',
              color: '#fb7185', fontSize: '0.8rem', fontWeight: 600, fontFamily: 'inherit',
              opacity: loading === 'rejected' ? 0.6 : 1, transition: 'all 0.15s',
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.background = 'rgba(244,63,94,0.22)'; }}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(244,63,94,0.12)'}
          >
            {loading === 'rejected' ? '…' : 'Reject'}
          </button>
        </div>
      )}
    </div>
  );
}

export default function DoctorDashboardPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [filter, setFilter]             = useState('all');

  const load = () => {
    setLoading(true);
    getAppointmentRequests()
      .then(setAppointments)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const visible = filter === 'all' ? appointments : appointments.filter(a => a.status === filter);

  const counts = FILTERS.reduce((acc, f) => {
    acc[f] = f === 'all' ? appointments.length : appointments.filter(a => a.status === f).length;
    return acc;
  }, {});

  return (
    <PageWrapper title="Appointment Requests">
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '0.45rem 1rem', borderRadius: '8px', cursor: 'pointer',
            fontSize: '0.82rem', fontWeight: 500, fontFamily: 'inherit',
            border: filter === f ? '1px solid #14b8a6' : '1px solid rgba(255,255,255,0.1)',
            background: filter === f ? 'rgba(20,184,166,0.15)' : 'rgba(255,255,255,0.05)',
            color: filter === f ? '#2dd4bf' : 'rgba(255,255,255,0.45)',
            transition: 'all 0.15s',
          }}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {counts[f] > 0 && (
              <span style={{
                marginLeft: '0.4rem', fontSize: '0.7rem', fontWeight: 700,
                background: filter === f ? 'rgba(20,184,166,0.3)' : 'rgba(255,255,255,0.1)',
                padding: '0.05rem 0.4rem', borderRadius: '20px',
              }}>{counts[f]}</span>
            )}
          </button>
        ))}
      </div>

      {counts.pending > 0 && (
        <div style={{
          padding: '0.75rem 1.25rem', borderRadius: '10px',
          background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.25)',
          color: '#fbbf24', fontSize: '0.82rem',
        }}>
          You have {counts.pending} pending request{counts.pending > 1 ? 's' : ''} waiting for action.
        </div>
      )}

      {loading ? (
        <div style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', paddingTop: '3rem' }}>Loading requests…</div>
      ) : visible.length === 0 ? (
        <div style={{ textAlign: 'center', paddingTop: '3rem' }}>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.875rem' }}>
            {filter === 'all' ? 'No appointment requests yet.' : `No ${filter} requests.`}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {visible.map(a => <RequestCard key={a.id} appt={a} onAction={load} />)}
        </div>
      )}
    </PageWrapper>
  );
}
