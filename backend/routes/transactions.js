const express = require('express');
const { authenticateToken, requireRole } = require('../middleware/auth');
const transactionController = require('../controllers/transactionController');
const router = express.Router();

router.get('/bottle-rates', transactionController.getBottleRates);

router.post('/bottle-exchange', authenticateToken, requireRole(['petugas']), transactionController.bottleExchange);

router.post('/ticket-usage', authenticateToken, requireRole(['petugas']), transactionController.ticketUsage);

router.get('/user/:userId', authenticateToken, transactionController.getUserTransactions);

router.get('/ticket-expirations/:userId', authenticateToken, transactionController.getTicketExpirations);

router.get('/', authenticateToken, requireRole(['admin', 'petugas']), transactionController.getAllTransactions);

router.delete('/:id', authenticateToken, requireRole(['admin']), transactionController.deleteTransaction);

module.exports = router;