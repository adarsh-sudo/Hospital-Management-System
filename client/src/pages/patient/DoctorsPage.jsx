import { useState, useEffect } from 'react';
import { getAllDoctors, getAvailableDoctors } from '../../services/doctor.service';
import { bookAppointment } from '../../services/appointment.service';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import PageWrapper from '../../components/layout/PageWrapper';

function formatSlotDate(dateStr) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
  });
}

function DoctorCard({ doctor, onBook }) {
  const slots = doctor.available_slots || [];
  return (
    <div style={{
      background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem',
      transition: 'border-color 0.2s',
    }}
    onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(20,184,166,0.3)'}
    onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#fff', marginBottom: '0.25rem' }}>
            Dr. {doctor.name}
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>
            {doctor.specialization || 'General Practice'}
          </p>
        </div>
        <Badge label={doctor.is_available ? 'available' : 'busy'} />
      </div>

      {slots.length > 0 && (
        <div>
          <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            Available Slots
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {slots.map((s, i) => (
              <span key={i} style={{
                fontSize: '0.72rem', padding: '0.2rem 0.6rem', borderRadius: '20px',
                background: 'rgba(20,184,166,0.1)', color: '#2dd4bf',
                border: '1px solid rgba(20,184,166,0.2)',
              }}>
                {formatSlotDate(s.date)} · {s.start}–{s.end}
              </span>
            ))}
          </div>
        </div>
      )}

      <button
        disabled={!doctor.is_available || slots.length === 0}
        onClick={() => onBook(doctor)}
        style={{
          marginTop: 'auto', padding: '0.55rem 1rem',
          background: (doctor.is_available && slots.length > 0) ? 'linear-gradient(135deg, #14b8a6, #0ea5e9)' : 'rgba(255,255,255,0.06)',
          border: 'none', borderRadius: '8px', color: '#fff',
          fontSize: '0.82rem', fontWeight: 600, cursor: (doctor.is_available && slots.length > 0) ? 'pointer' : 'not-allowed',
          opacity: (doctor.is_available && slots.length > 0) ? 1 : 0.4,
          fontFamily: 'inherit', transition: 'opacity 0.2s',
        }}
      >
        {!doctor.is_available ? 'Not Available' : slots.length === 0 ? 'No Slots Set' : 'Book Appointment'}
      </button>
    </div>
  );
}

function BookingModal({ doctor, onClose, onSuccess }) {
  const slots = doctor.available_slots || [];
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [err, setErr]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleBook = async () => {
    if (!selectedSlot) { setErr('Please select a time slot.'); return; }
    setErr('');
    setLoading(true);
    try {
      await bookAppointment({
        doctor_id:  doctor.id,
        slot_label: `${formatSlotDate(selectedSlot.date)} · ${selectedSlot.start}–${selectedSlot.end}`,
        slot_time:  `${selectedSlot.date}T${selectedSlot.start}:00`,
      });
      onSuccess();
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title={`Book with Dr. ${doctor.name}`} onClose={onClose}>
      <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginBottom: '1rem' }}>
        {doctor.specialization || 'General Practice'}
      </p>

      <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
        Select a time slot
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
        {slots.map((s, i) => {
          const active = selectedSlot === s;
          return (
            <button key={i} onClick={() => setSelectedSlot(s)} style={{
              padding: '0.6rem 1rem', borderRadius: '10px', cursor: 'pointer',
              fontSize: '0.82rem', fontWeight: 500, fontFamily: 'inherit', textAlign: 'left',
              border: active ? '1px solid #14b8a6' : '1px solid rgba(255,255,255,0.12)',
              background: active ? 'rgba(20,184,166,0.15)' : 'rgba(255,255,255,0.04)',
              color: active ? '#2dd4bf' : 'rgba(255,255,255,0.65)',
              transition: 'all 0.15s',
            }}>
              {formatSlotDate(s.date)} &nbsp;·&nbsp; {s.start} – {s.end}
            </button>
          );
        })}
      </div>

      {err && <p style={{ fontSize: '0.78rem', color: '#f43f5e', marginBottom: '0.75rem' }}>{err}</p>}

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button onClick={onClose} style={{
          flex: 1, padding: '0.65rem', background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
          color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem', fontFamily: 'inherit', cursor: 'pointer',
        }}>Cancel</button>
        <button onClick={handleBook} disabled={loading} style={{
          flex: 2, padding: '0.65rem',
          background: 'linear-gradient(135deg, #14b8a6, #0ea5e9)',
          border: 'none', borderRadius: '8px', color: '#fff',
          fontSize: '0.875rem', fontWeight: 600, fontFamily: 'inherit',
          cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
        }}>
          {loading ? 'Booking…' : 'Confirm Booking'}
        </button>
      </div>
    </Modal>
  );
}

export default function PatientDoctorsPage() {
  const [doctors, setDoctors]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState('all');
  const [booking, setBooking]   = useState(null);
  const [success, setSuccess]   = useState(false);
  const [search, setSearch]     = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const data = filter === 'available' ? await getAvailableDoctors() : await getAllDoctors();
      setDoctors(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [filter]);

  const visible = doctors.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    (d.specialization || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageWrapper title="Browse Doctors">
      {/* Controls */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          placeholder="Search by name or specialization…"
          value={search} onChange={e => setSearch(e.target.value)}
          style={{
            flex: 1, minWidth: '200px', background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px',
            padding: '0.6rem 1rem', fontSize: '0.875rem', color: 'rgba(255,255,255,0.85)',
            fontFamily: 'inherit', outline: 'none',
          }}
        />
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {['all', 'available'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer',
              fontSize: '0.82rem', fontWeight: 500, fontFamily: 'inherit',
              border: filter === f ? '1px solid #14b8a6' : '1px solid rgba(255,255,255,0.12)',
              background: filter === f ? 'rgba(20,184,166,0.15)' : 'rgba(255,255,255,0.06)',
              color: filter === f ? '#2dd4bf' : 'rgba(255,255,255,0.5)',
              transition: 'all 0.15s',
            }}>
              {f === 'all' ? 'All Doctors' : 'Available Only'}
            </button>
          ))}
        </div>
      </div>

      {success && (
        <div style={{
          padding: '0.75rem 1.25rem', borderRadius: '10px',
          background: 'rgba(20,184,166,0.15)', border: '1px solid rgba(20,184,166,0.3)',
          color: '#2dd4bf', fontSize: '0.875rem',
        }}>
          Appointment booked successfully! View it in My Bookings.
        </div>
      )}

      {loading ? (
        <div style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', paddingTop: '3rem' }}>Loading doctors…</div>
      ) : visible.length === 0 ? (
        <div style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', paddingTop: '3rem' }}>No doctors found.</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {visible.map(d => (
            <DoctorCard key={d.id} doctor={d} onBook={setBooking} />
          ))}
        </div>
      )}

      {booking && (
        <BookingModal
          doctor={booking}
          onClose={() => setBooking(null)}
          onSuccess={() => { setBooking(null); setSuccess(true); setTimeout(() => setSuccess(false), 5000); }}
        />
      )}
    </PageWrapper>
  );
}
