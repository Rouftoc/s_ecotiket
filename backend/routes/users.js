const express = require('express');
const { authenticateToken, requireRole } = require('../middleware/auth');
const userController = require('../controllers/userController');
const router = express.Router();

router.get('/', authenticateToken, requireRole(['admin', 'petugas']), userController.getAllUsers);

router.get('/:id', authenticateToken, requireRole(['admin']), userController.getUserById);

router.put('/profile', authenticateToken, userController.updateProfile);

router.put('/:id', authenticateToken, requireRole(['admin']), userController.updateUser);

router.delete('/:id', authenticateToken, requireRole(['admin']), userController.deleteUser);

module.exports = router;