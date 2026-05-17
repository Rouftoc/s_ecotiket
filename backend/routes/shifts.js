const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('../middleware/auth');
const shiftController = require('../controllers/shiftController');

// Petugas: mulai shift
router.post('/start', authenticateToken, requireRole(['petugas']), shiftController.startShift);

// Petugas: akhiri shift
router.post('/end', authenticateToken, requireRole(['petugas']), shiftController.endShift);

// Petugas: get shift aktif milik sendiri
router.get('/active', authenticateToken, requireRole(['petugas']), shiftController.getActiveShift);

// Petugas/Admin: get riwayat shift petugas tertentu
router.get('/history/:petugasId', authenticateToken, shiftController.getShiftHistory);

// Admin: get semua shift yang sedang aktif
router.get('/active-all', authenticateToken, requireRole(['admin']), shiftController.getAllActiveShifts);

module.exports = router;
