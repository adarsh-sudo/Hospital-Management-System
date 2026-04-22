const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/appointmentsController');
const { requireAuth, requireRole } = require('../middleware/auth');

// Patient routes
router.post('/',     requireAuth, requireRole('patient'), controller.bookAppointment);
router.get('/mine',  requireAuth, requireRole('patient'), controller.getMyAppointments);

// Doctor routes
router.get('/requests',        requireAuth, requireRole('doctor'), controller.getRequests);
router.patch('/:id/status',    requireAuth, requireRole('doctor'), controller.updateStatus);

module.exports = router;
