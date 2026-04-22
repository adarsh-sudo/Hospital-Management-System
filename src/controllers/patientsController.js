const db = require('../db/patients');

async function getAllPatients(req, res) {
  try {
    const patients = await db.getAllPatients();
    res.json(patients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getPatientById(req, res) {
  try {
    const patient = await db.getPatientById(req.params.id);
    if (!patient) return res.status(404).json({ error: 'Patient not found' });
    res.json(patient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function createPatient(req, res) {
  const { name, dob, gender, phone, email } = req.body;
  if (!name) return res.status(400).json({ error: 'name is required' });
  try {
    const patient = await db.createPatient({ name, dob, gender, phone, email });
    res.status(201).json(patient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updatePatient(req, res) {
  const { name, dob, gender, phone, email } = req.body;
  if (!name) return res.status(400).json({ error: 'name is required' });
  try {
    const patient = await db.updatePatient(req.params.id, { name, dob, gender, phone, email });
    if (!patient) return res.status(404).json({ error: 'Patient not found' });
    res.json(patient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deletePatient(req, res) {
  try {
    const patient = await db.deletePatient(req.params.id);
    if (!patient) return res.status(404).json({ error: 'Patient not found' });
    res.json({ message: 'Patient deleted', patient });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getAllPatients, getPatientById, createPatient, updatePatient, deletePatient };
