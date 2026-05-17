const { pool } = require('../config/database');
const { sendNotification, checkLowTickets } = require('../utils/notificationHelper');

const calculateExpiredTickets = async (connection, userId) => {
    try {
        const [ticketExpirations] = await connection.execute(
            'SELECT id_ticket_expiration, tickets_earned, expiry_date FROM ticket_expirations WHERE id_user = ? AND expiry_date < NOW() AND is_expired = false',
            [userId]
        );

        let totalExpiredTickets = 0;

        for (const expiration of ticketExpirations) {
            totalExpiredTickets += expiration.tickets_earned;
            await connection.execute(
                'UPDATE ticket_expirations SET is_expired = true WHERE id_ticket_expiration = ?',
                [expiration.id_ticket_expiration]
            );
        }

        if (totalExpiredTickets > 0) {
            await connection.execute(
                'UPDATE users SET tickets_balance = tickets_balance - ? WHERE id_user = ?',
                [totalExpiredTickets, userId]
            );

            await connection.execute(
                'INSERT INTO transactions (id_user, id_petugas, type, description, tickets_change, status) VALUES (?, ?, ?, ?, ?, ?)',
                [userId, null, 'ticket_expiration', `${totalExpiredTickets} tiket hangus (expired)`, -totalExpiredTickets, 'completed']
            );
        }

        return totalExpiredTickets;
    } catch (error) {
        console.error('Calculate expired tickets error:', error);
        return 0;
    }
};

exports.getBottleRates = async (req, res) => {
    try {
        const [rates] = await pool.execute(
            'SELECT * FROM bottle_rates WHERE is_active = true ORDER BY bottle_type'
        );

        res.json({ rates });
    } catch (error) {
        console.error('Get bottle rates error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.bottleExchange = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const { userQrCode, bottleType, bottleCount, locationId } = req.body;
        const petugasId = req.user.id_user;

        if (!userQrCode || !bottleType || !bottleCount) {
            return res.status(400).json({ error: 'User QR code, bottle type, and bottle count are required' });
        }

        const [users] = await connection.execute(
            'SELECT id_user, tickets_balance FROM users WHERE qr_code = ? AND status = "active" FOR UPDATE',
            [userQrCode]
        );

        if (users.length === 0) {
            await connection.rollback();
            return res.status(404).json({ error: 'User not found or inactive' });
        }
        const user = users[0];

        await calculateExpiredTickets(connection, user.id_user);

        // Get fresh user data setelah tiket hangus
        const [freshUser] = await connection.execute(
            'SELECT id_user, tickets_balance FROM users WHERE id_user = ? FOR UPDATE',
            [user.id_user]
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
            'UPDATE users SET tickets_balance = ?, points = points + ? WHERE id_user = ?',
            [newTicketBalance, pointsToAdd, user.id_user]
        );

        // Simpan record tiket dengan tanggal kadaluarsa
        await connection.execute(
            'INSERT INTO ticket_expirations (id_user, tickets_earned, expiry_date, is_expired) VALUES (?, ?, ?, ?)',
            [user.id_user, ticketsEarned, expiryDate, false]
        );

        await connection.execute(
            'INSERT INTO transactions (id_user, id_petugas, type, description, bottles_count, bottle_type, tickets_change, points_earned, status, id_location) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [user.id_user, petugasId, 'bottle_exchange', `Tukar ${bottleCount} botol ${bottleType} (expire ${expiryDate.toLocaleDateString('id-ID')})`, bottleCount, bottleType, ticketsEarned, pointsToAdd, 'completed', locationId || null]
        );

        await connection.commit();

        const [finalUser] = await connection.execute(
            'SELECT id_user, name, tickets_balance, points FROM users WHERE id_user = ?',
            [user.id_user]
        );

        // Notifikasi: tiket berhasil didapat
        await sendNotification(null, {
            id_user: user.id_user,
            type: 'ticket',
            title: 'Tiket Berhasil Didapat',
            message: `Kamu mendapatkan ${ticketsEarned} tiket dari penukaran ${bottleCount} botol ${bottleType}. Tiket berlaku 30 hari.`
        });

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
};

exports.ticketUsage = async (req, res) => {
    try {
        const { userQrCode, ticketCount, locationId } = req.body;
        const petugasId = req.user.id_user;

        if (!userQrCode || !ticketCount) {
            return res.status(400).json({ error: 'User QR code and ticket count are required' });
        }

        const [users] = await pool.execute(
            'SELECT id_user, name, tickets_balance, points FROM users WHERE qr_code = ? AND status = "active"',
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
            await calculateExpiredTickets(connection, user.id_user);

            // Get fresh user data
            const [freshUser] = await connection.execute(
                'SELECT tickets_balance FROM users WHERE id_user = ? FOR UPDATE',
                [user.id_user]
            );

            if (freshUser[0].tickets_balance < ticketCount) {
                await connection.rollback();
                return res.status(400).json({ error: 'Insufficient ticket balance (setelah tiket kadaluarsa dihitung)' });
            }

            await connection.execute(
                'UPDATE users SET tickets_balance = tickets_balance - ? WHERE id_user = ?',
                [ticketCount, user.id_user]
            );

            const [transactionResult] = await connection.execute(
                'INSERT INTO transactions (id_user, id_petugas, type, description, tickets_change, id_location, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [
                    user.id_user,
                    petugasId,
                    'ticket_usage',
                    `Menggunakan ${ticketCount} tiket untuk transportasi`,
                    -ticketCount,
                    locationId || null,
                    'completed'
                ]
            );

            // Update ticket expirations - gunakan tiket yang sudah hangus dulu
            const [expiredTickets] = await connection.execute(
                'SELECT id_ticket_expiration, tickets_earned FROM ticket_expirations WHERE id_user = ? AND is_expired = true ORDER BY expiry_date ASC',
                [user.id_user]
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
                    'SELECT id_ticket_expiration, tickets_earned FROM ticket_expirations WHERE id_user = ? AND is_expired = false ORDER BY expiry_date ASC',
                    [user.id_user]
                );

                for (const active of activeTickets) {
                    if (remainingTickets <= 0) break;
                    const used = Math.min(active.tickets_earned, remainingTickets);
                    if (used === active.tickets_earned) {
                        await connection.execute(
                            'UPDATE ticket_expirations SET is_expired = true WHERE id_ticket_expiration = ?',
                            [active.id_ticket_expiration]
                        );
                    } else {
                        await connection.execute(
                            'UPDATE ticket_expirations SET tickets_earned = tickets_earned - ? WHERE id_ticket_expiration = ?',
                            [used, active.id_ticket_expiration]
                        );
                    }
                    remainingTickets -= used;
                }
            }

            await connection.commit();

            const [updatedUsers] = await pool.execute(
                'SELECT id_user, name, tickets_balance, points FROM users WHERE id_user = ?',
                [user.id_user]
            );

            // Cek tiket hampir habis setelah digunakan
            const newBalance = updatedUsers[0].tickets_balance;
            await checkLowTickets(connection, user.id_user, newBalance).catch(() => {});

            res.json({
                message: 'Ticket usage successful',
                transaction: {
                    id: transactionResult.insertId,
                    ticketsUsed: ticketCount,
                    locationId
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
};

exports.getUserTransactions = async (req, res) => {
    try {
        const { userId } = req.params;

        if (req.user.role !== 'admin' && req.user.id_user != userId) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const [userResult] = await pool.execute(
            'SELECT role FROM users WHERE id_user = ?',
            [userId]
        );

        if (userResult.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        const userRole = userResult[0].role;

        let filterColumn = 't.id_user';
        if (userRole === 'petugas') {
            filterColumn = 't.id_petugas';
        }

        const query = `
      SELECT t.*, u.name as user_name, p.name as petugas_name, l.name as location_name
      FROM transactions t 
      LEFT JOIN users u ON t.id_user = u.id_user 
      LEFT JOIN users p ON t.id_petugas = p.id_user 
      LEFT JOIN locations l ON t.id_location = l.id_location
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
};

exports.getTicketExpirations = async (req, res) => {
    try {
        const { userId } = req.params;

        if (req.user.role !== 'admin' && req.user.id_user != userId) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const [expirations] = await pool.execute(
            'SELECT id_ticket_expiration, tickets_earned, expiry_date, is_expired, created_at FROM ticket_expirations WHERE id_user = ? ORDER BY expiry_date ASC',
            [userId]
        );

        res.json({ expirations });
    } catch (error) {
        console.error('Get ticket expirations error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getAllTransactions = async (req, res) => {
    try {
        const { type, startDate, endDate, limit = 100 } = req.query;

        let query = 'SELECT t.*, u.name as user_name, p.name as petugas_name, l.name as location_name ' +
            'FROM transactions t ' +
            'LEFT JOIN users u ON t.id_user = u.id_user ' +
            'LEFT JOIN users p ON t.id_petugas = p.id_user ' +
            'LEFT JOIN locations l ON t.id_location = l.id_location ' +
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
};

exports.deleteTransaction = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const transactionId = parseInt(req.params.id, 10);

        const [transactions] = await connection.execute(
            'SELECT * FROM transactions WHERE id_transaction = ?',
            [transactionId]
        );

        if (transactions.length === 0) {
            await connection.rollback();
            return res.status(404).json({ error: 'Transaction not found' });
        }

        const transaction = transactions[0];

        if (transaction.type === 'bottle_exchange') {
            await connection.execute(
                'UPDATE users SET tickets_balance = tickets_balance - ?, points = points - ? WHERE id_user = ?',
                [transaction.tickets_change, transaction.points_earned || 0, transaction.id_user]
            );

            // Hapus juga dari ticket_expirations
            const [ticketExp] = await connection.execute(
                'SELECT id_ticket_expiration FROM ticket_expirations WHERE id_user = ? ORDER BY created_at DESC LIMIT 1',
                [transaction.id_user]
            );
            if (ticketExp.length > 0) {
                await connection.execute(
                    'DELETE FROM ticket_expirations WHERE id_ticket_expiration = ?',
                    [ticketExp[0].id_ticket_expiration]
                );
            }
        }
        else if (transaction.type === 'ticket_usage') {
            await connection.execute(
                'UPDATE users SET tickets_balance = tickets_balance - ? WHERE id_user = ?',
                [transaction.tickets_change, transaction.id_user]
            );
        }

        await connection.execute(
            'DELETE FROM transactions WHERE id_transaction = ?',
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
};
