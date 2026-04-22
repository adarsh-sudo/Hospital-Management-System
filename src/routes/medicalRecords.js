const express = require('express');
const router = express.Router();
const controller = require('../controllers/medicalRecordsController');

router.get('/',                        controller.getAllMedicalRecords);
router.get('/:id',                     controller.getMedicalRecordById);
router.get('/:id/prescription',        controller.downloadPrescription);
router.post('/',                       controller.createMedicalRecordHandler, controller.createMedicalRecord);
router.put('/:id',                     controller.updateMedicalRecordHandler, controller.updateMedicalRecord);
router.delete('/:id',                  controller.deleteMedicalRecord);

module.exports = router;
