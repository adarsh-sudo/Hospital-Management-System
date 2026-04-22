import { useState, useEffect } from 'react';
import useMedicalRecords from '../hooks/useMedicalRecords';
import { authHeaders, getUserRole } from '../utils/auth';
import MedicalRecordTable from '../components/tables/MedicalRecordTable';
import MedicalRecordForm from '../components/forms/MedicalRecordForm';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import PageWrapper from '../components/layout/PageWrapper';

export default function MedicalRecordsPage() {
  const { records, loading, error, add, edit, remove } = useMedicalRecords();
  const [appointments,         setAppointments]         = useState([]);
  const [enrichedAppointments, setEnrichedAppointments] = useState([]);
  const [modal,                setModal]                = useState(null);
  const [selected,             setSelected]             = useState(null);
  const [searchTerm,           setSearchTerm]           = useState('');

  const filteredAppointments = enrichedAppointments.filter(a => {
    const searchLower = searchTerm.toLowerCase();
    return a.patientName.toLowerCase().includes(searchLower) || a.doctorName.toLowerCase().includes(searchLower);
  });

  useEffect(() => {
    Promise.all([
      fetch('/api/appointments', { headers: authHeaders() }).then(r => r.json()),
      fetch('/api/patients',     { headers: authHeaders() }).then(r => r.json()),
      fetch('/api/doctors',      { headers: authHeaders() }).then(r => r.json()),
    ]).then(([appts, patients, doctors]) => {
      const patientMap = Object.fromEntries(patients.map(p => [p.id, p.name]));
      const doctorMap  = Object.fromEntries(doctors.map(d => [d.id, d.name]));
      setAppointments(appts);
      setEnrichedAppointments(
        appts.map(a => ({
          ...a,
          patientName: patientMap[a.patient_id] || `#${a.patient_id}`,
          doctorName:  doctorMap[a.doctor_id]  || `#${a.doctor_id}`,
        }))
      );
    }).catch(() => {});
  }, []);

  const openAdd  = () => { setSelected(null); setModal('add'); };
  const openEdit = (r) => { setSelected(r);   setModal('edit'); };
  const close    = () => { setModal(null); setSelected(null); };

  const handleSubmit = async (data) => {
    if (modal === 'add') await add(data);
    else await edit(selected.id, data);
    close();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this medical record?')) await remove(id);
  };

  return (
    <PageWrapper title="Medical Records" action={<Button onClick={openAdd}>+ Add Record</Button>}>
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
      <MedicalRecordTable records={records} loading={loading} error={error} enrichedAppointments={filteredAppointments} onEdit={openEdit} onDelete={handleDelete} userRole={getUserRole()} />
      {modal && (
        <Modal title={modal === 'add' ? 'Add Medical Record' : 'Edit Medical Record'} onClose={close}>
          <MedicalRecordForm initial={selected || undefined} appointments={appointments} onSubmit={handleSubmit} onCancel={close} userRole={getUserRole()} />
        </Modal>
      )}
    </PageWrapper>
  );
}
