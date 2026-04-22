const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/doctorsController');
const { requireAuth, requireRole } = require('../middleware/auth');

// Patient: browse doctors
router.get('/',          requireAuth, requireRole('patient'), controller.getAllDoctors);
router.get('/available', requireAuth, requireRole('patient'), controller.getAvailableDoctors);

// Doctor: manage own profile & availability
router.get('/me',   requireAuth, requireRole('doctor'), controller.getMyProfile);
router.patch('/me', requireAuth, requireRole('doctor'), controller.updateMyProfile);

module.exports = router;
