import { authHeaders } from '../utils/auth';

export async function getMyPatientProfile() {
  const res = await fetch('/api/patients/me', { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to fetch profile');
  return res.json();
}

export async function updatePatientProfile(data) {
  const res = await fetch('/api/patients/me', {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to update profile');
  }
  return res.json();
}
