import { useState, useEffect } from 'react';
import useAppointments from '../hooks/useAppointments';
import { authHeaders, getUserRole } from '../utils/auth';
import AppointmentTable from '../components/tables/AppointmentTable';
import AppointmentForm from '../components/forms/AppointmentForm';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import PageWrapper from '../components/layout/PageWrapper';

export default function AppointmentsPage() {
  const { appointments, loading, error, add, edit, remove } = useAppointments();
  const [patients,    setPatients]    = useState([]);
  const [doctors,     setDoctors]     = useState([]);
  const [departments, setDepartments] = useState([]);
  const [modal,       setModal]       = useState(null);
  const [selected,    setSelected]    = useState(null);
  const [searchTerm,  setSearchTerm]  = useState('');

  const filteredAppointments = appointments.filter(a => {
    const patient = patients.find(p => p.id === a.patient_id);
    const doctor = doctors.find(d => d.id === a.doctor_id);
    const patientName = patient?.name || '';
    const doctorName = doctor?.name || '';
    const searchLower = searchTerm.toLowerCase();
    return patientName.toLowerCase().includes(searchLower) || doctorName.toLowerCase().includes(searchLower);
  });

  useEffect(() => {
    fetch('/api/patients', { headers: authHeaders() }).then(r    => r.json()).then(setPatients).catch(() => {});
    fetch('/api/doctors', { headers: authHeaders() }).then(r     => r.json()).then(setDoctors).catch(() => {});
    fetch('/api/departments', { headers: authHeaders() }).then(r => r.json()).then(setDepartments).catch(() => {});
  }, []);

  const openAdd  = () => { setSelected(null); setModal('add'); };
  const openEdit = (a) => { setSelected(a);   setModal('edit'); };
  const close    = () => { setModal(null); setSelected(null); };

  const handleSubmit = async (data) => {
    if (modal === 'add') await add(data);
    else await edit(selected.id, data);
    close();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this appointment?')) await remove(id);
  };

  return (
    <PageWrapper title="Appointments" action={<Button onClick={openAdd}>+ Book Appointment</Button>}>
      <div style={{ marginBottom: '1.5rem' }}>
        <input
          type="text"
          placeholder="Search by patient or doctor name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            maxWidth: '300px',
            padding: '0.75rem',
            fontSize: '0.9rem',
            border: '1px solid #ccc',
            borderRadius: '6px',
            outline: 'none',
            fontFamily: 'inherit',
          }}
        />
      </div>
      <AppointmentTable appointments={filteredAppointments} loading={loading} error={error} patients={patients} doctors={doctors} departments={departments} onEdit={openEdit} onDelete={handleDelete} userRole={getUserRole()} />
      {modal && (
        <Modal title={modal === 'add' ? 'Book Appointment' : 'Edit Appointment'} onClose={close}>
          <AppointmentForm initial={selected || undefined} patients={patients} doctors={doctors} departments={departments} onSubmit={handleSubmit} onCancel={close} userRole={getUserRole()} />
        </Modal>
      )}
    </PageWrapper>
  );
}
