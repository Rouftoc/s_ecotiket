const express = require('express');
const { pool } = require('../config/database');
const { authenticateToken, requireRole } = require('../middleware/auth');
const router = express.Router();

router.get('/bottle-rates', async (req, res) => {
  try {
    const [rates] = await pool.execute(
      'SELECT * FROM bottle_rates WHERE is_active = true ORDER BY bottle_type'
    );

    res.json({ rates });
  } catch (error) {
    console.error('Get bottle rates error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Fungsi untuk menghitung tiket hangus
const calculateExpiredTickets = async (connection, userId) => {
  try {
    const [ticketExpirations] = await connection.execute(
      'SELECT id, tickets_earned, expiry_date FROM ticket_expirations WHERE user_id = ? AND expiry_date < NOW() AND is_expired = false',
      [userId]
    );

    let totalExpiredTickets = 0;
    
    for (const expiration of ticketExpirations) {
      totalExpiredTickets += expiration.tickets_earned;
      await connection.execute(
        'UPDATE ticket_expirations SET is_expired = true WHERE id = ?',
        [expiration.id]
      );
    }

    if (totalExpiredTickets > 0) {
      await connection.execute(
        'UPDATE users SET tickets_balance = tickets_balance - ? WHERE id = ?',
        [totalExpiredTickets, userId]
      );

      await connection.execute(
        'INSERT INTO transactions (user_id, petugas_id, type, description, tickets_change, status) VALUES (?, ?, ?, ?, ?, ?)',
        [userId, null, 'ticket_expiration', `${totalExpiredTickets} tiket hangus (expired)`, -totalExpiredTickets, 'completed']
      );
    }

    return totalExpiredTickets;
  } catch (error) {
    console.error('Calculate expired tickets error:', error);
    return 0;
  }
};

router.post('/bottle-exchange', authenticateToken, requireRole(['petugas']), async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { userQrCode, bottleType, bottleCount, location } = req.body;
    const petugasId = req.user.id;

    if (!userQrCode || !bottleType || !bottleCount) {
      return res.status(400).json({ error: 'User QR code, bottle type, and bottle count are required' });
    }

    const [users] = await connection.execute(
      'SELECT id, tickets_balance FROM users WHERE qr_code = ? AND status = "active" FOR UPDATE',
      [userQrCode]
    );

    if (users.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: 'User not found or inactive' });
    }
    const user = users[0];

    // Hitung tiket hangus sebelum menambah tiket baru
    await calculateExpiredTickets(connection, user.id);

    // Get fresh user data setelah tiket hangus
    const [freshUser] = await connection.execute(
      'SELECT id, tickets_balance FROM users WHERE id = ? FOR UPDATE',
      [user.id]
    );
    const oldTicketBalance = freshUser[0].tickets_balance;

    // PERBAIKAN: Untuk jumbo, 1 botol = 2 tiket
    let ticketsEarned = 0;
    
    if (bottleType.toLowerCase() === 'jumbo') {
      ticketsEarned = bottleCount * 2;  // 1 botol jumbo = 2 tiket
    } else {
      const [rates] = await connection.execute(
        'SELECT bottles_required FROM bottle_rates WHERE bottle_type = ? AND is_active = true',
        [bottleType]
      );

      if (rates.length === 0) {
        await connection.rollback();
        return res.status(404).json({ error: 'Bottle exchange rate not found' });
      }
      const rate = rates[0];
      ticketsEarned = Math.floor(bottleCount / rate.bottles_required);
    }

    if (ticketsEarned === 0) {
      await connection.rollback();
      const minBottles = bottleType.toLowerCase() === 'jumbo' ? 1 : 'beberapa';
      return res.status(400).json({ error: `Minimum ${minBottles} botol '${bottleType}' diperlukan untuk tiket` });
    }

    const newTicketBalance = oldTicketBalance + ticketsEarned;
    const pointsToAdd = Math.floor(newTicketBalance / 10) - Math.floor(oldTicketBalance / 10);

    // Hitung tanggal kadaluarsa (1 bulan = 30 hari)
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);

    await connection.execute(
      'UPDATE users SET tickets_balance = ?, points = points + ? WHERE id = ?',
      [newTicketBalance, pointsToAdd, user.id]
    );

    // Simpan record tiket dengan tanggal kadaluarsa
    await connection.execute(
      'INSERT INTO ticket_expirations (user_id, tickets_earned, expiry_date, is_expired) VALUES (?, ?, ?, ?)',
      [user.id, ticketsEarned, expiryDate, false]
    );

    await connection.execute(
      'INSERT INTO transactions (user_id, petugas_id, type, description, bottles_count, bottle_type, tickets_change, points_earned, status, location) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [user.id, petugasId, 'bottle_exchange', `Tukar ${bottleCount} botol ${bottleType} (expire ${expiryDate.toLocaleDateString('id-ID')})`, bottleCount, bottleType, ticketsEarned, pointsToAdd, 'completed', location]
    );

    await connection.commit();

    const [finalUser] = await connection.execute(
      'SELECT id, name, tickets_balance, points FROM users WHERE id = ?',
      [user.id]
    );

    res.json({
      message: 'Bottle exchange successful',
      user: finalUser[0],
      ticketsEarned,
      expiryDate: expiryDate.toLocaleDateString('id-ID')
    });

  } catch (error) {
    await connection.rollback();
    console.error('Bottle exchange error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    if (connection) connection.release();
  }
});

router.post('/ticket-usage', authenticateToken, requireRole(['petugas']), async (req, res) => {
  try {
    const { userQrCode, ticketCount, location } = req.body;
    const petugasId = req.user.id;

    if (!userQrCode || !ticketCount) {
      return res.status(400).json({ error: 'User QR code and ticket count are required' });
    }

    const [users] = await pool.execute(
      'SELECT id, name, tickets_balance, points FROM users WHERE qr_code = ? AND status = "active"',
      [userQrCode]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found or inactive' });
    }

    const user = users[0];

    if (user.tickets_balance < ticketCount) {
      return res.status(400).json({ error: 'Insufficient ticket balance' });
    }

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Hitung tiket hangus
      await calculateExpiredTickets(connection, user.id);

      // Get fresh user data
      const [freshUser] = await connection.execute(
        'SELECT tickets_balance FROM users WHERE id = ? FOR UPDATE',
        [user.id]
      );

      if (freshUser[0].tickets_balance < ticketCount) {
        await connection.rollback();
        return res.status(400).json({ error: 'Insufficient ticket balance (setelah tiket kadaluarsa dihitung)' });
      }

      await connection.execute(
        'UPDATE users SET tickets_balance = tickets_balance - ? WHERE id = ?',
        [ticketCount, user.id]
      );

      const [transactionResult] = await connection.execute(
        'INSERT INTO transactions (user_id, petugas_id, type, description, tickets_change, location, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          user.id,
          petugasId,
          'ticket_usage',
          `Menggunakan ${ticketCount} tiket untuk transportasi`,
          -ticketCount,
          location,
          'completed'
        ]
      );

      // Update ticket expirations - gunakan tiket yang sudah hangus dulu
      const [expiredTickets] = await connection.execute(
        'SELECT id, tickets_earned FROM ticket_expirations WHERE user_id = ? AND is_expired = true ORDER BY expiry_date ASC',
        [user.id]
      );

      let remainingTickets = ticketCount;
      for (const expired of expiredTickets) {
        if (remainingTickets <= 0) break;
        const used = Math.min(expired.tickets_earned, remainingTickets);
        remainingTickets -= used;
      }

      // Gunakan tiket belum hangus
      if (remainingTickets > 0) {
        const [activeTickets] = await connection.execute(
          'SELECT id, tickets_earned FROM ticket_expirations WHERE user_id = ? AND is_expired = false ORDER BY expiry_date ASC',
          [user.id]
        );

        for (const active of activeTickets) {
          if (remainingTickets <= 0) break;
          const used = Math.min(active.tickets_earned, remainingTickets);
          if (used === active.tickets_earned) {
            await connection.execute(
              'UPDATE ticket_expirations SET is_expired = true WHERE id = ?',
              [active.id]
            );
          } else {
            await connection.execute(
              'UPDATE ticket_expirations SET tickets_earned = tickets_earned - ? WHERE id = ?',
              [used, active.id]
            );
          }
          remainingTickets -= used;
        }
      }

      await connection.commit();

      const [updatedUsers] = await pool.execute(
        'SELECT id, name, tickets_balance, points FROM users WHERE id = ?',
        [user.id]
      );

      res.json({
        message: 'Ticket usage successful',
        transaction: {
          id: transactionResult.insertId,
          ticketsUsed: ticketCount,
          location
        },
        user: updatedUsers[0]
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Ticket usage error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/user/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.user.role !== 'admin' && req.user.id != userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const [userResult] = await pool.execute(
      'SELECT role FROM users WHERE id = ?',
      [userId]
    );

    if (userResult.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const userRole = userResult[0].role;

    let filterColumn = 't.user_id';
    if (userRole === 'petugas') {
      filterColumn = 't.petugas_id';
    }

    const query = `
      SELECT t.*, u.name as user_name, p.name as petugas_name 
      FROM transactions t 
      LEFT JOIN users u ON t.user_id = u.id 
      LEFT JOIN users p ON t.petugas_id = p.id 
      WHERE ${filterColumn} = ? 
      ORDER BY t.created_at DESC
      LIMIT 100
    `;

    const [transactions] = await pool.execute(query, [userId]);

    res.json({ transactions });
  } catch (error) {
    console.error('Get user transactions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/ticket-expirations/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.user.role !== 'admin' && req.user.id != userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const [expirations] = await pool.execute(
      'SELECT id, tickets_earned, expiry_date, is_expired, created_at FROM ticket_expirations WHERE user_id = ? ORDER BY expiry_date ASC',
      [userId]
    );

    res.json({ expirations });
  } catch (error) {
    console.error('Get ticket expirations error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/', authenticateToken, requireRole(['admin', 'petugas']), async (req, res) => {
  try {
    const { type, startDate, endDate, limit = 100 } = req.query;

    let query = 'SELECT t.*, u.name as user_name, p.name as petugas_name ' +
      'FROM transactions t ' +
      'JOIN users u ON t.user_id = u.id ' +
      'LEFT JOIN users p ON t.petugas_id = p.id ' +
      'WHERE 1=1';

    const params = [];

    if (type) {
      query += ' AND t.type = ?';
      params.push(type);
    }

    if (startDate) {
      query += ' AND DATE(t.created_at) >= ?';
      params.push(startDate);
    }

    if (endDate) {
      query += ' AND DATE(t.created_at) <= ?';
      params.push(endDate);
    }

    const limitNum = parseInt(limit, 10);
    query += ` ORDER BY t.created_at DESC LIMIT ${limitNum}`;

    const [transactions] = await pool.execute(query, params);

    res.json({ transactions });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const transactionId = parseInt(req.params.id, 10);

    const [transactions] = await connection.execute(
      'SELECT * FROM transactions WHERE id = ?',
      [transactionId]
    );

    if (transactions.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: 'Transaction not found' });
    }

    const transaction = transactions[0];

    if (transaction.type === 'bottle_exchange') {
      await connection.execute(
        'UPDATE users SET tickets_balance = tickets_balance - ?, points = points - ? WHERE id = ?',
        [transaction.tickets_change, transaction.points_earned || 0, transaction.user_id]
      );

      // Hapus juga dari ticket_expirations
      const [ticketExp] = await connection.execute(
        'SELECT id FROM ticket_expirations WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
        [transaction.user_id]
      );
      if (ticketExp.length > 0) {
        await connection.execute(
          'DELETE FROM ticket_expirations WHERE id = ?',
          [ticketExp[0].id]
        );
      }
    } 
    else if (transaction.type === 'ticket_usage') {
      await connection.execute(
        'UPDATE users SET tickets_balance = tickets_balance - ? WHERE id = ?',
        [transaction.tickets_change, transaction.user_id]
      );
    }
    
    await connection.execute(
      'DELETE FROM transactions WHERE id = ?',
      [transactionId]
    );

    await connection.commit();

    res.json({
      message: 'Transaction deleted successfully',
      deletedTransaction: transaction
    });

  } catch (error) {
    await connection.rollback();
    console.error('Delete transaction error:', error);
    res.status(500).json({
      error: 'Internal server error during transaction deletion',
      message: error.message
    });
  } finally {
    if (connection) connection.release();
  }
});

module.exports = router;