const express = require('express');
const { pool } = require('../config/database');
const { authenticateToken, requireRole } = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { isActive } = req.query;
    
    let query = `
      SELECT a.*, u.name as created_by_name 
      FROM announcements a 
      JOIN users u ON a.created_by = u.id 
      WHERE 1=1
    `;
    const params = [];

    if (isActive !== undefined) {
      query += ' AND a.is_active = ?';
      params.push(isActive === 'true');
    }

    query += ' ORDER BY a.created_at DESC';

    const [announcements] = await pool.execute(query, params);

    res.json({ announcements });
  } catch (error) {
    console.error('Get announcements error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [announcements] = await pool.execute(
      `SELECT a.*, u.name as created_by_name 
       FROM announcements a 
       JOIN users u ON a.created_by = u.id 
       WHERE a.id = ?`,
      [id]
    );

    if (announcements.length === 0) {
      return res.status(404).json({ error: 'Announcement not found' });
    }

    res.json({ announcement: announcements[0] });
  } catch (error) {
    console.error('Get announcement error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { title, content, type = 'info' } = req.body;
    const createdBy = req.user.id;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const [result] = await pool.execute(
      'INSERT INTO announcements (title, content, type, created_by) VALUES (?, ?, ?, ?)',
      [title, content, type, createdBy]
    );

    const [announcements] = await pool.execute(
      `SELECT a.*, u.name as created_by_name 
       FROM announcements a 
       JOIN users u ON a.created_by = u.id 
       WHERE a.id = ?`,
      [result.insertId]
    );

    res.status(201).json({
      message: 'Announcement created successfully',
      announcement: announcements[0]
    });
  } catch (error) {
    console.error('Create announcement error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, type, isActive } = req.body;

    const [existingAnnouncements] = await pool.execute(
      'SELECT id FROM announcements WHERE id = ?',
      [id]
    );

    if (existingAnnouncements.length === 0) {
      return res.status(404).json({ error: 'Announcement not found' });
    }

    const updates = [];
    const params = [];

    if (title) {
      updates.push('title = ?');
      params.push(title);
    }
    if (content) {
      updates.push('content = ?');
      params.push(content);
    }
    if (type) {
      updates.push('type = ?');
      params.push(type);
    }
    if (isActive !== undefined) {
      updates.push('is_active = ?');
      params.push(isActive);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    params.push(id);

    await pool.execute(
      `UPDATE announcements SET ${updates.join(', ')} WHERE id = ?`,
      params
    );

    const [announcements] = await pool.execute(
      `SELECT a.*, u.name as created_by_name 
       FROM announcements a 
       JOIN users u ON a.created_by = u.id 
       WHERE a.id = ?`,
      [id]
    );

    res.json({
      message: 'Announcement updated successfully',
      announcement: announcements[0]
    });
  } catch (error) {
    console.error('Update announcement error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;

    const [existingAnnouncements] = await pool.execute(
      'SELECT id FROM announcements WHERE id = ?',
      [id]
    );

    if (existingAnnouncements.length === 0) {
      return res.status(404).json({ error: 'Announcement not found' });
    }

    await pool.execute('DELETE FROM announcements WHERE id = ?', [id]);

    res.json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    console.error('Delete announcement error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;