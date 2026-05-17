const { pool } = require('../config/database');
const fs = require('fs');
const path = require('path');
const { sendNotification } = require('../utils/notificationHelper');

// Get all news (optional: filter by featured, limit)
exports.getAllNews = async (req, res) => {
    try {
        const { featured, limit } = req.query;
        let query = `
            SELECT n.*, u.name as author_name 
            FROM news n 
            LEFT JOIN users u ON n.created_by = u.id_user 
            ORDER BY n.created_at DESC
        `;
        let params = [];

        if (featured === 'true') {
            query = `
                SELECT n.*, u.name as author_name 
                FROM news n 
                LEFT JOIN users u ON n.created_by = u.id_user 
                WHERE n.is_featured = TRUE 
                ORDER BY n.created_at DESC
            `;
        }

        if (limit) {
            query += ' LIMIT ?';
            params.push(parseInt(limit));
        }

        const [rows] = await pool.query(query, params);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get single news by ID or Slug
exports.getNewsById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query(`
            SELECT n.*, u.name as author_name 
            FROM news n 
            LEFT JOIN users u ON n.created_by = u.id_user 
            WHERE n.id_news = ? OR n.slug = ?
        `, [id, id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'News not found' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching news detail:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Create news
exports.createNews = async (req, res) => {
    try {
        const { title, content, is_featured } = req.body;
        const image = req.file ? req.file.filename : null;
        const created_by = req.user.id_user; // From auth middleware

        // Generate basic slug from title
        const slug = title.toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-') + '-' + Date.now();

        const [result] = await pool.query(
            'INSERT INTO news (title, slug, content, image, is_featured, created_by) VALUES (?, ?, ?, ?, ?, ?)',
            [title, slug, content, image, is_featured === 'true' || is_featured === true, created_by]
        );

        res.status(201).json({
            message: 'News created successfully',
            id_news: result.insertId,
            image
        });

        // Broadcast notifikasi ke semua penumpang aktif
        const [penumpang] = await pool.execute(
            'SELECT id_user FROM users WHERE role = "penumpang" AND status = "active"'
        );
        for (const p of penumpang) {
            sendNotification(null, {
                id_user: p.id_user,
                type: 'info',
                title: 'Berita Baru',
                message: `Ada berita terbaru: "${title}". Cek sekarang di menu Berita!`
            }).catch(() => {});
        }
    } catch (error) {
        console.error('Error creating news:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update news
exports.updateNews = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, is_featured } = req.body;

        // Fetch existing to handle image replacement
        const [existing] = await pool.query('SELECT image FROM news WHERE id_news = ?', [id]);
        if (existing.length === 0) return res.status(404).json({ message: 'News not found' });

        let image = existing[0].image;
        if (req.file) {
            image = req.file.filename;
            // Optional: delete old image file here
            if (existing[0].image) {
                const oldPath = path.join(__dirname, '../public/uploads/news', existing[0].image);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
        }

        // Only update slug if title changed is complex, for simplicity we might keep slug or update it. 
        // Let's keep slug stable for now unless explicitly requested, or just update it.
        // Simple update:

        await pool.query(
            'UPDATE news SET title = ?, content = ?, image = ?, is_featured = ? WHERE id_news = ?',
            [title, content, image, is_featured === 'true' || is_featured === true, id]
        );

        res.json({ message: 'News updated successfully', image });
    } catch (error) {
        console.error('Error updating news:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Delete news
exports.deleteNews = async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await pool.query('SELECT image FROM news WHERE id_news = ?', [id]);
        if (rows.length > 0 && rows[0].image) {
            const filePath = path.join(__dirname, '../public/uploads/news', rows[0].image);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }

        const [result] = await pool.query('DELETE FROM news WHERE id_news = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'News not found' });
        }

        res.json({ message: 'News deleted successfully' });
    } catch (error) {
        console.error('Error deleting news:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
