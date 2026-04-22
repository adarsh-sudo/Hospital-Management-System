import { useState } from 'react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

const empty = { name: '', specialization: '', phone: '', email: '', department_id: '' };

export default function DoctorForm({ initial = empty, departments = [], onSubmit, onCancel, userRole }) {
  const [form, setForm]           = useState(initial);
  const [errors, setErrors]       = useState({});
  const [submitErr, setSubmitErr] = useState('');
  const [loading, setLoading]     = useState(false);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setLoading(true);
    setSubmitErr('');
    try {
      await onSubmit({ ...form, department_id: form.department_id || null });
    } catch (err) {
      setSubmitErr(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deptOptions = departments.map((d) => ({ value: d.id, label: d.name }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Full Name *" value={form.name} onChange={set('name')} error={errors.name} placeholder="Dr. Jane Smith" />
      <Input label="Specialization" value={form.specialization} onChange={set('specialization')} placeholder="Cardiology" />
      <Input label="Phone" value={form.phone} onChange={set('phone')} placeholder="+1 234 567 8900" />
      <Input label="Email" type="email" value={form.email} onChange={set('email')} placeholder="doctor@hospital.com" />
      <Select label="Department" value={form.department_id} onChange={set('department_id')} options={deptOptions} />
      {submitErr && <p className="text-sm text-red-600">{submitErr}</p>}
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button
          type="submit"
          disabled={userRole !== 'admin'}
          loading={loading}
        >
          Save Doctor
        </Button>
      </div>
    </form>
  );
}
