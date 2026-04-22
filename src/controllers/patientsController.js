const db = require('../db/patients');

async function getMyProfile(req, res) {
  try {
    const patient = await db.getPatientByUserId(req.user.id);
    if (!patient) return res.status(404).json({ error: 'Patient profile not found' });
    res.json(patient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateMyProfile(req, res) {
  const { dob, gender, phone } = req.body;
  try {
    const patient = await db.updatePatientProfile(req.user.id, { dob, gender, phone });
    res.json(patient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getMyProfile, updateMyProfile };
