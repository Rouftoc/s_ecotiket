const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('../middleware/auth');
const notifController = require('../controllers/notificationController');

// User: get notifikasi sendiri
router.get('/', authenticateToken, notifController.getMyNotifications);

// User: cek tiket kadaluarsa (dipanggil saat login)
router.post('/check-expiring', authenticateToken, notifController.checkExpiringTickets);

// User: tandai semua sudah dibaca
router.patch('/read-all', authenticateToken, notifController.markAllRead);

// User: tandai satu sudah dibaca
router.patch('/:id/read', authenticateToken, notifController.markOneRead);

// User: hapus notifikasi
router.delete('/:id', authenticateToken, notifController.deleteNotification);

// Admin: kirim notifikasi ke user tertentu
router.post('/send', authenticateToken, requireRole(['admin']), notifController.sendNotification);

// Admin: broadcast ke semua penumpang
router.post('/broadcast', authenticateToken, requireRole(['admin']), notifController.broadcastNotification);

module.exports = router;
