import { useState } from 'react';
import Select from '../ui/Select';
import Input from '../ui/Input';
import Button from '../ui/Button';

const empty = { patient_id: '', doctor_id: '', date: '', status: 'scheduled' };

const STATUS_OPTIONS = [
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default function AppointmentForm({ initial = empty, patients = [], doctors = [], departments = [], onSubmit, onCancel, userRole }) {
  const [form, setForm]           = useState(initial);
  const [errors, setErrors]       = useState({});
  const [submitErr, setSubmitErr] = useState('');
  const [loading, setLoading]     = useState(false);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.patient_id) e.patient_id = 'Patient is required';
    if (!form.doctor_id)  e.doctor_id  = 'Doctor is required';
    if (!form.date)       e.date       = 'Date is required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setLoading(true);
    setSubmitErr('');
    try {
      await onSubmit(form);
    } catch (err) {
      setSubmitErr(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deptMap        = Object.fromEntries(departments.map((d) => [d.id, d.name]));
  const patientOptions = patients.map((p) => ({ value: p.id, label: p.name }));
  const doctorOptions  = doctors.map((d) => ({
    value: d.id,
    label: d.department_id
      ? `${d.name} — ${deptMap[d.department_id] || 'Unknown Dept'}`
      : d.name,
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select label="Patient *" value={form.patient_id} onChange={set('patient_id')} options={patientOptions} error={errors.patient_id} />
      <Select label="Doctor *"  value={form.doctor_id}  onChange={set('doctor_id')}  options={doctorOptions}  error={errors.doctor_id} />
      <Input  label="Date & Time *" type="datetime-local" value={form.date} onChange={set('date')} error={errors.date} />
      <Select label="Status" value={form.status} onChange={set('status')} options={STATUS_OPTIONS} />
      {submitErr && <p className="text-sm text-red-600">{submitErr}</p>}
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button
          type="submit"
          disabled={userRole !== 'clerk'}
          loading={loading}
        >
          Create Appointment
        </Button>
      </div>
    </form>
  );
}
