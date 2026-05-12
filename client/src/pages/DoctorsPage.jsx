import { useState, useEffect } from 'react';
import useDoctors from '../hooks/useDoctors';
import { authHeaders, getUserRole } from '../utils/auth';
import DoctorTable from '../components/tables/DoctorTable';
import DoctorForm from '../components/forms/DoctorForm';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import PageWrapper from '../components/layout/PageWrapper';

export default function DoctorsPage() {
  const { doctors, loading, error, add, edit, remove } = useDoctors();
  const [modal, setModal]             = useState(null);
  const [selected, setSelected]       = useState(null);
  const [searchTerm, setSearchTerm]   = useState('');

  const filteredDoctors = doctors.filter(d =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAdd  = () => { setSelected(null); setModal('add'); };
  const openEdit = (d) => { setSelected(d);   setModal('edit'); };
  const close    = () => { setModal(null); setSelected(null); };

  const handleSubmit = async (data) => {
    if (modal === 'add') await add(data);
    else await edit(selected.id, data);
    close();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this doctor?')) await remove(id);
  };

  const role = getUserRole();

  return (
    <PageWrapper title="Doctors" action={role !== 'clerk' ? <Button onClick={openAdd}>+ Add Doctor</Button> : null}>
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
      <DoctorTable doctors={filteredDoctors} loading={loading} error={error} onEdit={openEdit} onDelete={handleDelete} userRole={role} />
      {modal && (
        <Modal title={modal === 'add' ? 'Add Doctor' : 'Edit Doctor'} onClose={close}>
          <DoctorForm initial={selected || undefined} onSubmit={handleSubmit} onCancel={close} userRole={getUserRole()} />
        </Modal>
      )}
    </PageWrapper>
  );
}
