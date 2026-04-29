const db = require('../config/database');

// Helper to get or create open session
async function getOpenSession(userId) {
    const [sessions] = await db.pool.query(
        "SELECT * FROM chat_sessions WHERE user_id = ? AND status = 'open' LIMIT 1",
        [userId]
    );
    if (sessions.length > 0) return sessions[0];

    const [result] = await db.pool.query(
        "INSERT INTO chat_sessions (user_id) VALUES (?)",
        [userId]
    );
    return { id_session: result.insertId, user_id: userId, status: 'open' };
}

exports.sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const userId = req.user.id_user; // From auth middleware

        if (!message) return res.status(400).json({ error: 'Message required' });

        const session = await getOpenSession(userId);

        // 1. Save User Message
        await db.pool.query(
            "INSERT INTO chat_messages (session_id, sender_type, message) VALUES (?, 'user', ?)",
            [session.id_session, message]
        );

        // 2. Bot Logic
        let botReply = null;
        const lowerMsg = message.toLowerCase();

        if (lowerMsg.includes('saldo') || lowerMsg.includes('tiket')) {
            // Fetch balance
            const [users] = await db.pool.query("SELECT ticketsBalance FROM users WHERE id_user = ?", [userId]);
            const balance = users[0]?.ticketsBalance || 0;
            botReply = `Saldo tiket kamu saat ini adalah: ${balance} tiket.`;
        }
        else if (lowerMsg.includes('lokasi') || lowerMsg.includes('tempat')) {
            botReply = `Lokasi penukaran aktif:\n- Siring Menara Pandang\n- Taman Kamboja\n- Kantor Dishub Banjarmasin (Kuin Cerucuk)\n\nCek menu Lokasi untuk detailnya.`;
        }
        else if (lowerMsg.includes('cara') || lowerMsg.includes('tukar')) {
            botReply = `Cara Penukaran:\n1. Bawa botol ke lokasi.\n2. Tunjukkan QR Code di HP kamu.\n3. Petugas scan & tiket masuk otomatis!`;
        }
        else if (lowerMsg.includes('jadwal') || lowerMsg.includes('jam')) {
            botReply = `Jadwal Operasional:\nSenin - Jumat: 08.00 - 15.00 WITA\nSabtu - Minggu: Car Free Day (Siring) 06.00 - 10.00 WITA`;
        }
        else if (lowerMsg.includes('halo') || lowerMsg.includes('hai')) {
            botReply = `Halo! Saya EcoBot. Ada yang bisa dibantu? (Cek Saldo, Lokasi, Cara Tukar)`;
        }

        // 3. If Bot has reply, save it
        if (botReply) {
            await db.pool.query(
                "INSERT INTO chat_messages (session_id, sender_type, message) VALUES (?, 'bot', ?)",
                [session.id_session, botReply]
            );
        }

        res.json({ status: 'sent', botReply });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getMessages = async (req, res) => {
    try {
        const userId = req.user.id_user;
        const session = await getOpenSession(userId);

        const [messages] = await db.pool.query(
            "SELECT * FROM chat_messages WHERE session_id = ? ORDER BY created_at ASC",
            [session.id_session]
        ); // Order ASC for chronological chat

        res.json({ session_id: session.id_session, messages });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// --- Admin Functions ---

exports.getAllSessions = async (req, res) => {
    try {
        // Get all open sessions with user info and last message
        const query = `
            SELECT s.*, u.name as user_name, u.email as user_email,
            (SELECT message FROM chat_messages WHERE session_id = s.id_session ORDER BY created_at DESC LIMIT 1) as last_message,
            (SELECT created_at FROM chat_messages WHERE session_id = s.id_session ORDER BY created_at DESC LIMIT 1) as last_time,
            (SELECT COUNT(*) FROM chat_messages WHERE session_id = s.id_session AND sender_type = 'user' AND is_read = 0) as unread_count
            FROM chat_sessions s
            JOIN users u ON s.user_id = u.id_user
            WHERE s.status = 'open'
            AND u.role = 'penumpang'
            ORDER BY last_time DESC
        `;
        const [sessions] = await db.pool.query(query);
        res.json(sessions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getSessionMessages = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const [messages] = await db.pool.query(
            "SELECT * FROM chat_messages WHERE session_id = ? ORDER BY created_at ASC",
            [sessionId]
        );

        // Mark as read (simple version: mark all user messages as read when admin opens)
        await db.pool.query(
            "UPDATE chat_messages SET is_read = 1 WHERE session_id = ? AND sender_type = 'user'",
            [sessionId]
        );

        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.adminReply = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const { message } = req.body;

        await db.pool.query(
            "INSERT INTO chat_messages (session_id, sender_type, message) VALUES (?, 'admin', ?)",
            [sessionId, message]
        );

        res.json({ status: 'sent' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
