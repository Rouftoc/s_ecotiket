const { pool } = require('../config/database');

/**
 * Kirim notifikasi ke satu user
 */
async function sendNotification(connection, { id_user, type, title, message }) {
    const db = connection || pool;
    await db.execute(
        'INSERT INTO notifications (id_user, type, title, message) VALUES (?, ?, ?, ?)',
        [id_user, type, title, message]
    );
}

/**
 * Kirim notifikasi ke semua admin
 */
async function notifyAllAdmins({ type, title, message }) {
    const [admins] = await pool.execute(
        'SELECT id_user FROM users WHERE role = "admin" AND status = "active"'
    );
    for (const admin of admins) {
        await pool.execute(
            'INSERT INTO notifications (id_user, type, title, message) VALUES (?, ?, ?, ?)',
            [admin.id_user, type, title, message]
        );
    }
}

/**
 * Cek tiket hampir habis dan kirim notifikasi jika perlu
 */
async function checkLowTickets(connection, userId, ticketsBalance) {
    if (ticketsBalance <= 3 && ticketsBalance > 0) {
        // Cek apakah sudah ada notifikasi low_ticket yang belum dibaca hari ini
        const [existing] = await connection.execute(
            `SELECT id_notification FROM notifications 
             WHERE id_user = ? AND type = 'warning' 
             AND title LIKE '%Tiket Hampir Habis%'
             AND DATE(created_at) = CURDATE()
             AND is_read = 0`,
            [userId]
        );
        if (existing.length === 0) {
            await sendNotification(connection, {
                id_user: userId,
                type: 'warning',
                title: 'Tiket Hampir Habis',
                message: `Saldo tiket kamu tinggal ${ticketsBalance} tiket. Segera tukar botol untuk mendapatkan tiket lebih banyak!`
            });
        }
    }
}

/**
 * Cek tiket kadaluarsa dalam 3 hari ke depan
 */
async function checkExpiringTickets(userId) {
    const [expiring] = await pool.execute(
        `SELECT SUM(tickets_earned) as total 
         FROM ticket_expirations 
         WHERE id_user = ? AND is_expired = 0 
         AND expiry_date BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 3 DAY)`,
        [userId]
    );

    const total = expiring[0]?.total || 0;
    if (total > 0) {
        // Cek apakah sudah ada notifikasi expiring hari ini
        const [existing] = await pool.execute(
            `SELECT id_notification FROM notifications 
             WHERE id_user = ? AND type = 'warning'
             AND title LIKE '%Tiket Akan Kadaluarsa%'
             AND DATE(created_at) = CURDATE()`,
            [userId]
        );
        if (existing.length === 0) {
            await sendNotification(null, {
                id_user: userId,
                type: 'warning',
                title: 'Tiket Akan Kadaluarsa',
                message: `${total} tiket kamu akan kadaluarsa dalam 3 hari ke depan. Gunakan sebelum hangus!`
            });
        }
    }
}

module.exports = { sendNotification, notifyAllAdmins, checkLowTickets, checkExpiringTickets };
