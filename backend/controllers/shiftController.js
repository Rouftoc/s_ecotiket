const { pool } = require('../config/database');

// Petugas mulai shift
exports.startShift = async (req, res) => {
    try {
        const petugasId = req.user.id_user;
        const { locationId, mode } = req.body;

        if (!locationId || !mode) {
            return res.status(400).json({ error: 'locationId dan mode wajib diisi' });
        }

        if (!['stand', 'karnet'].includes(mode)) {
            return res.status(400).json({ error: 'Mode harus stand atau karnet' });
        }

        // Cek apakah petugas sudah ada shift aktif
        const [activeShifts] = await pool.execute(
            'SELECT id_assignment FROM petugas_assignments WHERE id_petugas = ? AND is_active = 1',
            [petugasId]
        );

        if (activeShifts.length > 0) {
            return res.status(400).json({ error: 'Petugas masih memiliki shift aktif. Akhiri shift sebelumnya terlebih dahulu.' });
        }

        // Cek lokasi valid
        const [locations] = await pool.execute(
            'SELECT id_location, name FROM locations WHERE id_location = ? AND status = "active"',
            [locationId]
        );

        if (locations.length === 0) {
            return res.status(404).json({ error: 'Lokasi tidak ditemukan atau tidak aktif' });
        }

        const [result] = await pool.execute(
            'INSERT INTO petugas_assignments (id_petugas, id_location, mode, is_active) VALUES (?, ?, ?, 1)',
            [petugasId, locationId, mode]
        );

        const [newShift] = await pool.execute(
            `SELECT pa.*, l.name as location_name 
             FROM petugas_assignments pa 
             JOIN locations l ON pa.id_location = l.id_location 
             WHERE pa.id_assignment = ?`,
            [result.insertId]
        );

        res.status(201).json({
            success: true,
            message: 'Shift berhasil dimulai',
            shift: newShift[0]
        });
    } catch (error) {
        console.error('Start shift error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Petugas akhiri shift
exports.endShift = async (req, res) => {
    try {
        const petugasId = req.user.id_user;

        const [activeShifts] = await pool.execute(
            'SELECT id_assignment FROM petugas_assignments WHERE id_petugas = ? AND is_active = 1',
            [petugasId]
        );

        if (activeShifts.length === 0) {
            return res.status(404).json({ error: 'Tidak ada shift aktif yang ditemukan' });
        }

        const shiftId = activeShifts[0].id_assignment;

        await pool.execute(
            'UPDATE petugas_assignments SET is_active = 0, ended_at = NOW() WHERE id_assignment = ?',
            [shiftId]
        );

        res.json({
            success: true,
            message: 'Shift berhasil diakhiri'
        });
    } catch (error) {
        console.error('End shift error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get shift aktif petugas yang sedang login
exports.getActiveShift = async (req, res) => {
    try {
        const petugasId = req.user.id_user;

        const [shifts] = await pool.execute(
            `SELECT pa.*, l.name as location_name 
             FROM petugas_assignments pa 
             JOIN locations l ON pa.id_location = l.id_location 
             WHERE pa.id_petugas = ? AND pa.is_active = 1`,
            [petugasId]
        );

        res.json({
            success: true,
            shift: shifts.length > 0 ? shifts[0] : null
        });
    } catch (error) {
        console.error('Get active shift error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get riwayat shift petugas (untuk admin)
exports.getShiftHistory = async (req, res) => {
    try {
        const { petugasId } = req.params;

        // Admin bisa lihat semua, petugas hanya miliknya sendiri
        if (req.user.role !== 'admin' && req.user.id_user != petugasId) {
            return res.status(403).json({ error: 'Akses ditolak' });
        }

        const [shifts] = await pool.execute(
            `SELECT pa.*, l.name as location_name, u.name as petugas_name
             FROM petugas_assignments pa 
             JOIN locations l ON pa.id_location = l.id_location
             JOIN users u ON pa.id_petugas = u.id_user
             WHERE pa.id_petugas = ?
             ORDER BY pa.started_at DESC
             LIMIT 50`,
            [petugasId]
        );

        res.json({
            success: true,
            shifts
        });
    } catch (error) {
        console.error('Get shift history error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get semua shift aktif saat ini (untuk admin)
exports.getAllActiveShifts = async (req, res) => {
    try {
        const [shifts] = await pool.execute(
            `SELECT pa.*, l.name as location_name, u.name as petugas_name, u.phone as petugas_phone
             FROM petugas_assignments pa 
             JOIN locations l ON pa.id_location = l.id_location
             JOIN users u ON pa.id_petugas = u.id_user
             WHERE pa.is_active = 1
             ORDER BY pa.started_at DESC`
        );

        res.json({
            success: true,
            shifts
        });
    } catch (error) {
        console.error('Get all active shifts error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
