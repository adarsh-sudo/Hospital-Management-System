const db = require('../db/doctors');

async function getAllDoctors(req, res) {
  try {
    const doctors = await db.getAllDoctors();
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getDoctorById(req, res) {
  try {
    const doctor = await db.getDoctorById(req.params.id);
    if (!doctor) return res.status(404).json({ error: 'Doctor not found' });
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function createDoctor(req, res) {
  const { name, specialization, phone, email, department_id } = req.body;
  if (!name) return res.status(400).json({ error: 'name is required' });
  if (department_id !== undefined && isNaN(Number(department_id))) {
    return res.status(400).json({ error: 'department_id must be a number' });
  }
  try {
    const doctor = await db.createDoctor({ name, specialization, phone, email, department_id });
    res.status(201).json(doctor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateDoctor(req, res) {
  const { name, specialization, phone, email, department_id } = req.body;
  if (!name) return res.status(400).json({ error: 'name is required' });
  if (department_id !== undefined && isNaN(Number(department_id))) {
    return res.status(400).json({ error: 'department_id must be a number' });
  }
  try {
    const doctor = await db.updateDoctor(req.params.id, { name, specialization, phone, email, department_id });
    if (!doctor) return res.status(404).json({ error: 'Doctor not found' });
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteDoctor(req, res) {
  try {
    const doctor = await db.deleteDoctor(req.params.id);
    if (!doctor) return res.status(404).json({ error: 'Doctor not found' });
    res.json({ message: 'Doctor deleted', doctor });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getAllDoctors, getDoctorById, createDoctor, updateDoctor, deleteDoctor };
