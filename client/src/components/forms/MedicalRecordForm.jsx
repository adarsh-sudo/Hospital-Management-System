import { useState } from 'react';
import Select from '../ui/Select';
import Button from '../ui/Button';

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
  resize: 'vertical',
};

const labelStyle = {
  fontSize: '0.8rem',
  fontWeight: 500,
  color: 'rgba(255,255,255,0.55)',
  letterSpacing: '0.02em',
};

const empty = { appointment_id: '', diagnosis: '', notes: '' };

export default function MedicalRecordForm({ initial = empty, appointments = [], onSubmit, onCancel }) {
  const [form, setForm]               = useState({
    appointment_id: initial.appointment_id || '',
    diagnosis:      initial.diagnosis      || '',
    notes:          initial.notes          || '',
  });
  const [prescriptionFile, setPrescriptionFile] = useState(null);
  const [errors, setErrors]     = useState({});
  const [submitErr, setSubmitErr] = useState('');
  const [loading, setLoading]   = useState(false);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.appointment_id) e.appointment_id = 'Appointment is required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setLoading(true);
    setSubmitErr('');
    try {
      await onSubmit({ ...form, prescription: prescriptionFile });
    } catch (err) {
      setSubmitErr(err.message);
    } finally {
      setLoading(false);
    }
  };

  const apptOptions = appointments.map((a) => ({
    value: a.id,
    label: `#${a.id} — ${new Date(a.date).toLocaleDateString()}`,
  }));

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Select
        label="Appointment *"
        value={form.appointment_id}
        onChange={set('appointment_id')}
        options={apptOptions}
        error={errors.appointment_id}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        <label style={labelStyle}>Diagnosis</label>
        <textarea
          value={form.diagnosis}
          onChange={set('diagnosis')}
          rows={3}
          placeholder="Enter diagnosis..."
          style={fieldStyle}
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        <label style={labelStyle}>Notes</label>
        <textarea
          value={form.notes}
          onChange={set('notes')}
          rows={3}
          placeholder="Additional notes..."
          style={fieldStyle}
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        <label style={labelStyle}>Prescription (PDF)</label>
        {initial.prescription_path && !prescriptionFile && (
          <p style={{ fontSize: '0.75rem', color: '#2dd4bf', margin: 0 }}>Current prescription on file. Upload a new file to replace it.</p>
        )}
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setPrescriptionFile(e.target.files[0] || null)}
          style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)' }}
        />
      </div>
      {submitErr && <p style={{ fontSize: '0.875rem', color: '#f43f5e', margin: 0 }}>{submitErr}</p>}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '0.5rem' }}>
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" loading={loading}>Save Record</Button>
      </div>
    </form>
  );
}
