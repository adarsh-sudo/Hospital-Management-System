const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/patientsController');
const { requireAuth, requireRole } = require('../middleware/auth');

router.get('/me',   requireAuth, requireRole('patient'), controller.getMyProfile);
router.patch('/me', requireAuth, requireRole('patient'), controller.updateMyProfile);

module.exports = router;
