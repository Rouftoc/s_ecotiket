const { pool } = require('../config/database');

// Kirim notifikasi ke user tertentu (admin)
exports.sendNotification = async (req, res) => {
    try {
        const { id_user, type, title, message } = req.body;

        if (!id_user || !type || !title || !message) {
            return res.status(400).json({ error: 'id_user, type, title, dan message wajib diisi' });
        }

        // Pastikan user ada
        const [users] = await pool.execute('SELECT id_user, name FROM users WHERE id_user = ?', [id_user]);
        if (users.length === 0) {
            return res.status(404).json({ error: 'User tidak ditemukan' });
        }

        const [result] = await pool.execute(
            'INSERT INTO notifications (id_user, type, title, message) VALUES (?, ?, ?, ?)',
            [id_user, type, title, message]
        );

        res.status(201).json({
            success: true,
            message: `Notifikasi berhasil dikirim ke ${users[0].name}`,
            id_notification: result.insertId
        });
    } catch (error) {
        console.error('Send notification error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Kirim notifikasi ke semua penumpang (admin) - misal berita baru
exports.broadcastNotification = async (req, res) => {
    try {
        const { type, title, message } = req.body;

        if (!type || !title || !message) {
            return res.status(400).json({ error: 'type, title, dan message wajib diisi' });
        }

        const [penumpang] = await pool.execute(
            'SELECT id_user FROM users WHERE role = "penumpang" AND status = "active"'
        );

        if (penumpang.length === 0) {
            return res.status(200).json({ success: true, message: 'Tidak ada penumpang aktif', sent: 0 });
        }

        const values = penumpang.map(u => [u.id_user, type, title, message]);
        await pool.query(
            'INSERT INTO notifications (id_user, type, title, message) VALUES ?',
            [values]
        );

        res.json({ success: true, message: `Notifikasi dikirim ke ${penumpang.length} penumpang`, sent: penumpang.length });
    } catch (error) {
        console.error('Broadcast notification error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get notifikasi milik user yang login
exports.getMyNotifications = async (req, res) => {
    try {
        const userId = req.user.id_user;

        const [notifications] = await pool.execute(
            'SELECT * FROM notifications WHERE id_user = ? ORDER BY created_at DESC LIMIT 50',
            [userId]
        );

        const unreadCount = notifications.filter(n => !n.is_read).length;

        res.json({ success: true, notifications, unreadCount });
    } catch (error) {
        console.error('Get notifications error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Tandai semua notifikasi sebagai sudah dibaca
exports.markAllRead = async (req, res) => {
    try {
        const userId = req.user.id_user;

        await pool.execute(
            'UPDATE notifications SET is_read = 1 WHERE id_user = ? AND is_read = 0',
            [userId]
        );

        res.json({ success: true, message: 'Semua notifikasi ditandai sudah dibaca' });
    } catch (error) {
        console.error('Mark all read error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Tandai satu notifikasi sebagai sudah dibaca
exports.markOneRead = async (req, res) => {
    try {
        const userId = req.user.id_user;
        const { id } = req.params;

        await pool.execute(
            'UPDATE notifications SET is_read = 1 WHERE id_notification = ? AND id_user = ?',
            [id, userId]
        );

        res.json({ success: true });
    } catch (error) {
        console.error('Mark one read error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Hapus notifikasi
exports.deleteNotification = async (req, res) => {
    try {
        const userId = req.user.id_user;
        const { id } = req.params;

        await pool.execute(
            'DELETE FROM notifications WHERE id_notification = ? AND id_user = ?',
            [id, userId]
        );

        res.json({ success: true });
    } catch (error) {
        console.error('Delete notification error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Cek tiket kadaluarsa dan buat notifikasi jika perlu (dipanggil saat login)
exports.checkExpiringTickets = async (req, res) => {
    try {
        const userId = req.user.id_user;

        const [expiring] = await pool.execute(
            `SELECT SUM(tickets_earned) as total 
             FROM ticket_expirations 
             WHERE id_user = ? AND is_expired = 0 
             AND expiry_date BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 3 DAY)`,
            [userId]
        );

        const total = parseInt(expiring[0]?.total) || 0;
        if (total > 0) {
            // Cek apakah sudah ada notifikasi hari ini
            const [existing] = await pool.execute(
                `SELECT id_notification FROM notifications 
                 WHERE id_user = ? AND type = 'warning'
                 AND title LIKE '%Tiket Akan Kadaluarsa%'
                 AND DATE(created_at) = CURDATE()`,
                [userId]
            );
            if (existing.length === 0) {
                await pool.execute(
                    'INSERT INTO notifications (id_user, type, title, message) VALUES (?, ?, ?, ?)',
                    [userId, 'warning', 'Tiket Akan Kadaluarsa',
                        `${total} tiket kamu akan kadaluarsa dalam 3 hari ke depan. Gunakan sebelum hangus!`]
                );
            }
        }

        res.json({ success: true, expiringTickets: total });
    } catch (error) {
        console.error('Check expiring tickets error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
