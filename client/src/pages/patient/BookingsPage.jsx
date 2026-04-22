import { useState, useEffect } from 'react';
import { getMyAppointments } from '../../services/appointment.service';
import Badge from '../../components/ui/Badge';
import PageWrapper from '../../components/layout/PageWrapper';

const FILTERS = ['all', 'pending', 'approved', 'rejected'];

function AppointmentCard({ appt }) {
  const date = new Date(appt.slot_time);
  const dateStr = date.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
  const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <div style={{
      background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '14px', padding: '1.25rem',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff' }}>
            Dr. {appt.doctor_name}
          </span>
          <Badge label={appt.status} />
        </div>
        <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>
          {appt.specialization || 'General Practice'}
        </span>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.25rem' }}>
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
    </div>
  );
}

export default function PatientBookingsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [filter, setFilter]             = useState('all');

  useEffect(() => {
    getMyAppointments()
      .then(setAppointments)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const visible = filter === 'all' ? appointments : appointments.filter(a => a.status === filter);

  const counts = FILTERS.reduce((acc, f) => {
    acc[f] = f === 'all' ? appointments.length : appointments.filter(a => a.status === f).length;
    return acc;
  }, {});

  return (
    <PageWrapper title="My Bookings">
      {/* Filter tabs */}
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

      {/* List */}
      {loading ? (
        <div style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', paddingTop: '3rem' }}>Loading bookings…</div>
      ) : visible.length === 0 ? (
        <div style={{ textAlign: 'center', paddingTop: '3rem' }}>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.875rem' }}>
            {filter === 'all' ? 'No bookings yet. Browse doctors to make your first appointment.' : `No ${filter} appointments.`}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {visible.map(a => <AppointmentCard key={a.id} appt={a} />)}
        </div>
      )}
    </PageWrapper>
  );
}
