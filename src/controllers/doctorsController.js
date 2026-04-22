const db = require('../db/doctors');

async function getAllDoctors(req, res) {
  try {
    const doctors = await db.getAllDoctors();
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getAvailableDoctors(req, res) {
  try {
    const doctors = await db.getAvailableDoctors();
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getMyProfile(req, res) {
  try {
    const doctor = await db.getDoctorByUserId(req.user.id);
    if (!doctor) return res.status(404).json({ error: 'Doctor profile not found' });
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateMyProfile(req, res) {
  const { is_available, available_slots, specialization, phone } = req.body;

  if (available_slots !== undefined && !Array.isArray(available_slots)) {
    return res.status(400).json({ error: 'available_slots must be an array' });
  }

  try {
    const doctor = await db.updateAvailability(req.user.id, {
      is_available: is_available ?? false,
      available_slots: available_slots ?? [],
      specialization,
      phone,
    });
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getAllDoctors, getAvailableDoctors, getMyProfile, updateMyProfile };
