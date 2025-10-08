const express = require('express');
const bcrypt = require('bcrypt');
const { pool } = require('../config/database');
const { authenticateToken, requireRole } = require('../middleware/auth');
const router = express.Router();

const validateNIK = (nik) => {
  return /^\d{16}$/.test(nik);
};

router.get('/', authenticateToken, requireRole(['admin', 'petugas']), async (req, res) => {
  try {
    const { role, status, search } = req.query;
    
    let query = 'SELECT id, email, nik, name, role, phone, address, qr_code, tickets_balance, points, status, created_at FROM users WHERE 1=1';
    const params = [];

    if (role) {
      query += ' AND role = ?';
      params.push(role);
    }

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    if (search) {
      query += ' AND (name LIKE ? OR email LIKE ? OR nik LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY created_at DESC';

    const [users] = await pool.execute(query, params);

    res.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;

    const [users] = await pool.execute(
      'SELECT id, email, nik, name, role, phone, address, qr_code, tickets_balance, points, status, created_at FROM users WHERE id = ?',
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: users[0] });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const userId = req.user.id;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    await pool.execute(
      'UPDATE users SET name = ?, phone = ?, address = ? WHERE id = ?',
      [name, phone || null, address || null, userId]
    );

    // Get updated user
    const [users] = await pool.execute(
      'SELECT id, email, nik, name, role, phone, address, qr_code, tickets_balance, points, status FROM users WHERE id = ?',
      [userId]
    );

    res.json({
      message: 'Profile updated successfully',
      user: users[0]
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, nik, phone, address, status, ticketsBalance, points } = req.body;

    const [existingUsers] = await pool.execute(
      'SELECT id, role FROM users WHERE id = ?',
      [id]
    );

    if (existingUsers.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userRole = existingUsers[0].role;

    if (userRole === 'penumpang' && nik && !validateNIK(nik)) {
      return res.status(400).json({ error: 'NIK must be 16 digits' });
    }

    if (email && userRole !== 'penumpang') {
      const [emailCheck] = await pool.execute(
        'SELECT id FROM users WHERE email = ? AND id != ?',
        [email, id]
      );

      if (emailCheck.length > 0) {
        return res.status(400).json({ error: 'Email already taken by another user' });
      }
    }

    if (nik && userRole === 'penumpang') {
      const [nikCheck] = await pool.execute(
        'SELECT id FROM users WHERE nik = ? AND id != ?',
        [nik, id]
      );

      if (nikCheck.length > 0) {
        return res.status(400).json({ error: 'NIK already taken by another user' });
      }
    }

    const updates = [];
    const params = [];

    if (name) {
      updates.push('name = ?');
      params.push(name);
    }
    if (email && userRole !== 'penumpang') {
      updates.push('email = ?');
      params.push(email);
    }
    if (nik && userRole === 'penumpang') {
      updates.push('nik = ?');
      params.push(nik);
    }
    if (phone !== undefined) {
      updates.push('phone = ?');
      params.push(phone || null);
    }
    if (address !== undefined) {
      updates.push('address = ?');
      params.push(address || null);
    }
    if (status) {
      updates.push('status = ?');
      params.push(status);
    }
    if (ticketsBalance !== undefined) {
      updates.push('tickets_balance = ?');
      params.push(ticketsBalance);
    }
    if (points !== undefined) {
      updates.push('points = ?');
      params.push(points);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    params.push(id);

    await pool.execute(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      params
    );

    const [users] = await pool.execute(
      'SELECT id, email, nik, name, role, phone, address, qr_code, tickets_balance, points, status, created_at FROM users WHERE id = ?',
      [id]
    );

    res.json({
      message: 'User updated successfully',
      user: users[0]
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;

    const [existingUsers] = await pool.execute(
      'SELECT id, role FROM users WHERE id = ?',
      [id]
    );

    if (existingUsers.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (existingUsers[0].role === 'admin') {
      return res.status(400).json({ error: 'Cannot delete admin users' });
    }

    await pool.execute('DELETE FROM users WHERE id = ?', [id]);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;