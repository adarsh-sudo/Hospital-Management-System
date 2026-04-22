import { useState } from 'react';
import usePatients from '../hooks/usePatients';
import { getUserRole } from '../utils/auth';
import PatientTable from '../components/tables/PatientTable';
import PatientForm from '../components/forms/PatientForm';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import PageWrapper from '../components/layout/PageWrapper';

export default function PatientsPage() {
  const { patients, loading, error, add, edit, remove } = usePatients();
  const [modal, setModal]     = useState(null); // null | 'add' | 'edit'
  const [selected, setSelected] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAdd  = () => { setSelected(null); setModal('add'); };
  const openEdit = (p) => { setSelected(p);   setModal('edit'); };
  const close    = () => { setModal(null); setSelected(null); };

  const handleSubmit = async (data) => {
    if (modal === 'add') await add(data);
    else await edit(selected.id, data);
    close();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this patient?')) await remove(id);
  };

  const role = getUserRole();

  return (
    <PageWrapper title="Patients" action={role !== 'clerk' ? <Button onClick={openAdd}>+ Add Patient</Button> : null}>
      <div style={{ marginBottom: '1.5rem' }}>
        <input
          type="text"
          placeholder="Search by name..."
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
      <PatientTable patients={filteredPatients} loading={loading} error={error} onEdit={openEdit} onDelete={handleDelete} userRole={role} />
      {modal && (
        <Modal title={modal === 'add' ? 'Add Patient' : 'Edit Patient'} onClose={close}>
          <PatientForm initial={selected || undefined} onSubmit={handleSubmit} onCancel={close} userRole={getUserRole()} />
        </Modal>
      )}
    </PageWrapper>
  );
}
