import { useState, useEffect } from 'react';
import { getMyDoctorProfile, updateDoctorProfile } from '../../services/doctor.service';
import PageWrapper from '../../components/layout/PageWrapper';

const today = new Date().toISOString().split('T')[0];

const inputStyle = {
  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '10px', padding: '0.65rem 1rem', fontSize: '0.875rem',
  color: 'rgba(255,255,255,0.9)', fontFamily: 'inherit', outline: 'none',
  boxSizing: 'border-box', width: '100%', transition: 'border-color 0.2s',
  colorScheme: 'dark',
};

function formatSlotDate(dateStr) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
  });
}

export default function DoctorAvailabilityPage() {
  const [profile, setProfile] = useState({ specialization: '', phone: '', is_available: false });
  const [slots, setSlots]     = useState([]);
  const [newSlot, setNewSlot] = useState({ date: today, start: '09:00', end: '17:00' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const [err, setErr]         = useState('');

  useEffect(() => {
    getMyDoctorProfile()
      .then(d => {
        setProfile({ specialization: d.specialization || '', phone: d.phone || '', is_available: d.is_available });
        setSlots(d.available_slots || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const addSlot = () => {
    if (!newSlot.date)                      { setErr('Date is required.'); return; }
    if (!newSlot.start || !newSlot.end)     { setErr('Start and end times are required.'); return; }
    if (newSlot.start >= newSlot.end)       { setErr('End time must be after start time.'); return; }
    const duplicate = slots.some(s => s.date === newSlot.date && s.start === newSlot.start && s.end === newSlot.end);
    if (duplicate)                          { setErr('This slot already exists.'); return; }
    setErr('');
    setSlots(prev => [...prev, { ...newSlot }]);
  };

  const removeSlot = (i) => setSlots(prev => prev.filter((_, idx) => idx !== i));

  const handleSave = async () => {
    setSaving(true);
    setErr('');
    try {
      await updateDoctorProfile({
        is_available: profile.is_available,
        available_slots: slots,
        specialization: profile.specialization,
        phone: profile.phone,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      setErr(e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <PageWrapper title="My Availability">
      <div style={{ color: 'rgba(255,255,255,0.3)', paddingTop: '3rem', textAlign: 'center' }}>Loading profile…</div>
    </PageWrapper>
  );

  const sectionCard = {
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem',
  };

  const label = (text) => (
    <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
      {text}
    </p>
  );

  return (
    <PageWrapper title="My Availability">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '680px' }}>

        {/* Profile section */}
        <div style={sectionCard}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>Profile</h2>
          <div>
            {label('Specialization')}
            <input
              value={profile.specialization}
              onChange={e => setProfile(p => ({ ...p, specialization: e.target.value }))}
              placeholder="e.g. Cardiology, Dermatology…"
              style={inputStyle}
            />
          </div>
          <div>
            {label('Phone')}
            <input
              value={profile.phone}
              onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
              placeholder="e.g. +91 9876543210"
              style={inputStyle}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '0.9rem', fontWeight: 500, color: 'rgba(255,255,255,0.8)' }}>Accepting Appointments</p>
              <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', marginTop: '0.2rem' }}>
                When off, patients cannot book with you
              </p>
            </div>
            <button
              onClick={() => setProfile(p => ({ ...p, is_available: !p.is_available }))}
              style={{
                width: '3rem', height: '1.65rem', borderRadius: '20px',
                background: profile.is_available ? 'linear-gradient(135deg, #14b8a6, #0ea5e9)' : 'rgba(255,255,255,0.12)',
                border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.25s',
                boxShadow: profile.is_available ? '0 0 12px rgba(20,184,166,0.4)' : 'none',
              }}
            >
              <span style={{
                position: 'absolute', top: '3px',
                left: profile.is_available ? 'calc(100% - 22px)' : '3px',
                width: '19px', height: '19px', borderRadius: '50%',
                background: '#fff', transition: 'left 0.2s',
                boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
              }} />
            </button>
          </div>
        </div>

        {/* Slots section */}
        <div style={sectionCard}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>Time Slots</h2>

          {/* Add slot form */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div style={{ flex: '2 1 150px' }}>
              {label('Date')}
              <input
                type="date"
                value={newSlot.date}
                min={today}
                onChange={e => setNewSlot(s => ({ ...s, date: e.target.value }))}
                style={inputStyle}
              />
            </div>
            <div style={{ flex: '1 1 100px' }}>
              {label('Start Time')}
              <input
                type="time" value={newSlot.start}
                onChange={e => setNewSlot(s => ({ ...s, start: e.target.value }))}
                style={inputStyle}
              />
            </div>
            <div style={{ flex: '1 1 100px' }}>
              {label('End Time')}
              <input
                type="time" value={newSlot.end}
                onChange={e => setNewSlot(s => ({ ...s, end: e.target.value }))}
                style={inputStyle}
              />
            </div>
            <button onClick={addSlot} style={{
              padding: '0.65rem 1.25rem', borderRadius: '10px',
              background: 'linear-gradient(135deg, #14b8a6, #0ea5e9)',
              border: 'none', color: '#fff', fontSize: '0.875rem', fontWeight: 600,
              fontFamily: 'inherit', cursor: 'pointer', whiteSpace: 'nowrap',
              boxShadow: '0 0 16px rgba(20,184,166,0.3)',
            }}>
              + Add Slot
            </button>
          </div>

          {err && <p style={{ fontSize: '0.78rem', color: '#f43f5e' }}>{err}</p>}

          {slots.length === 0 ? (
            <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.25)', textAlign: 'center', padding: '1rem 0' }}>
              No slots added yet. Add your first availability slot above.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {slots.map((s, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0.65rem 1rem', borderRadius: '10px',
                  background: 'rgba(20,184,166,0.08)', border: '1px solid rgba(20,184,166,0.15)',
                }}>
                  <span style={{ fontSize: '0.875rem', color: '#2dd4bf', fontWeight: 500 }}>
                    {formatSlotDate(s.date)} &nbsp;·&nbsp; {s.start} – {s.end}
                  </span>
                  <button onClick={() => removeSlot(i)} style={{
                    background: 'rgba(244,63,94,0.15)', border: '1px solid rgba(244,63,94,0.25)',
                    borderRadius: '6px', color: '#fb7185', fontSize: '0.75rem', fontWeight: 600,
                    padding: '0.2rem 0.6rem', cursor: 'pointer', fontFamily: 'inherit',
                  }}>Remove</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {saved && (
          <div style={{
            padding: '0.75rem 1.25rem', borderRadius: '10px',
            background: 'rgba(20,184,166,0.15)', border: '1px solid rgba(20,184,166,0.3)',
            color: '#2dd4bf', fontSize: '0.875rem',
          }}>
            Profile and availability saved successfully.
          </div>
        )}

        <button onClick={handleSave} disabled={saving} style={{
          padding: '0.75rem', borderRadius: '12px',
          background: 'linear-gradient(135deg, #14b8a6, #0ea5e9)',
          border: 'none', color: '#fff', fontSize: '1rem', fontWeight: 600,
          fontFamily: 'inherit', cursor: saving ? 'not-allowed' : 'pointer',
          opacity: saving ? 0.7 : 1, boxShadow: '0 0 24px rgba(20,184,166,0.35)',
          transition: 'opacity 0.2s',
        }}>
          {saving ? 'Saving…' : 'Save All Changes'}
        </button>
      </div>
    </PageWrapper>
  );
}
