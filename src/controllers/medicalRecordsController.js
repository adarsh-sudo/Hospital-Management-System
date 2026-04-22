const path   = require('path');
const db     = require('../db/medicalRecords');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

async function getAllMedicalRecords(req, res) {
  try {
    const records = await db.getAllMedicalRecords();
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getMedicalRecordById(req, res) {
  try {
    const record = await db.getMedicalRecordById(req.params.id);
    if (!record) return res.status(404).json({ error: 'Medical record not found' });
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

const createMedicalRecordHandler = upload.single('prescription');
const updateMedicalRecordHandler = upload.single('prescription');

async function createMedicalRecord(req, res) {
  const { appointment_id, diagnosis, notes } = req.body;
  if (!appointment_id) return res.status(400).json({ error: 'appointment_id is required' });
  try {
    const record = await db.createMedicalRecord({
      appointment_id, diagnosis, notes,
      prescriptionPath: req.file?.path || null,
    });
    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateMedicalRecord(req, res) {
  const { appointment_id, diagnosis, notes } = req.body;
  if (!appointment_id) return res.status(400).json({ error: 'appointment_id is required' });
  try {
    const record = await db.updateMedicalRecord(req.params.id, {
      appointment_id, diagnosis, notes,
      prescriptionPath: req.file?.path || null,
    });
    if (!record) return res.status(404).json({ error: 'Medical record not found' });
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function downloadPrescription(req, res) {
  try {
    const record = await db.getMedicalRecordById(req.params.id);
    if (!record) return res.status(404).json({ error: 'Medical record not found' });
    if (!record.prescription_path) return res.status(404).json({ error: 'No prescription uploaded' });
    const absPath = path.resolve(record.prescription_path);
    res.download(absPath, `prescription-${record.id}.pdf`);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteMedicalRecord(req, res) {
  try {
    const record = await db.deleteMedicalRecord(req.params.id);
    if (!record) return res.status(404).json({ error: 'Medical record not found' });
    res.json({ message: 'Medical record deleted', record });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getAllMedicalRecords, getMedicalRecordById,
  createMedicalRecordHandler, createMedicalRecord,
  updateMedicalRecordHandler, updateMedicalRecord,
  downloadPrescription,
  deleteMedicalRecord,
};
