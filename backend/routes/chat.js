const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { authenticateToken, requireRole } = require('../middleware/auth');
const isAdmin = requireRole(['admin']);

router.post('/send', authenticateToken, chatController.sendMessage);
router.get('/messages', authenticateToken, chatController.getMessages);

router.get('/sessions', authenticateToken, isAdmin, chatController.getAllSessions);
router.get('/sessions/:sessionId/messages', authenticateToken, isAdmin, chatController.getSessionMessages);
router.post('/sessions/:sessionId/reply', authenticateToken, isAdmin, chatController.adminReply);

module.exports = router;
