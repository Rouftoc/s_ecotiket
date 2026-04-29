const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// Get all bottle rates
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM bottle_rates ORDER BY id_bottle_rate ASC');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching bottle rates:', error);
        res.status(500).json({ error: 'Failed to fetch bottle rates' });
    }
});

// Update a bottle rate
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { bottles_required, tickets_earned, points_earned } = req.body;

    try {
        const [result] = await pool.query(
            'UPDATE bottle_rates SET bottles_required = ?, tickets_earned = ?, points_earned = ?, updated_at = NOW() WHERE id_bottle_rate = ?',
            [bottles_required, tickets_earned, points_earned || 0, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Bottle rate not found' });
        }

        const [updatedRate] = await pool.query('SELECT * FROM bottle_rates WHERE id_bottle_rate = ?', [id]);
        res.json(updatedRate[0]);
    } catch (error) {
        console.error('Error updating bottle rate:', error);
        res.status(500).json({ error: 'Failed to update bottle rate' });
    }
});

// Create a new bottle rate
router.post('/', async (req, res) => {
    const { bottle_type, bottles_required, tickets_earned, points_earned } = req.body;

    if (!bottle_type || !bottles_required || !tickets_earned) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const [result] = await pool.query(
            'INSERT INTO bottle_rates (bottle_type, bottles_required, tickets_earned, points_earned) VALUES (?, ?, ?, ?)',
            [bottle_type, bottles_required, tickets_earned, points_earned || 0]
        );

        const [newRate] = await pool.query('SELECT * FROM bottle_rates WHERE id_bottle_rate = ?', [result.insertId]);
        res.status(201).json(newRate[0]);
    } catch (error) {
        console.error('Error creating bottle rate:', error);
        res.status(500).json({ error: 'Failed to create bottle rate' });
    }
});

// Delete a bottle rate
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await pool.query('DELETE FROM bottle_rates WHERE id_bottle_rate = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Bottle rate not found' });
        }

        res.json({ message: 'Bottle rate deleted successfully' });
    } catch (error) {
        console.error('Error deleting bottle rate:', error);
        res.status(500).json({ error: 'Failed to delete bottle rate' });
    }
});

module.exports = router;
