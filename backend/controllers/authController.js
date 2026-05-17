const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');
const { notifyAllAdmins } = require('../utils/notificationHelper');
require('dotenv').config();

const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });
};

const generateQRCode = async (role) => {
    const prefix = role === 'admin' ? 'ECO-ADMIN' :
        role === 'petugas' ? 'ECO-OFFICER' : 'ECO-USER';

    let qrCode;
    let isUnique = false;
    let counter = 1;

    while (!isUnique) {
        qrCode = `${prefix}-${counter.toString().padStart(3, '0')}`;

        const [existing] = await pool.execute(
            'SELECT id_user FROM users WHERE qr_code = ?',
            [qrCode]
        );

        if (existing.length === 0) {
            isUnique = true;
        } else {
            counter++;
        }
    }

    return qrCode;
};

const validateNIK = (nik) => {
    return /^\d{16}$/.test(nik);
};

exports.register = async (req, res) => {
    try {
        const { email, nik, password, name, role, phone, address } = req.body;

        if (!name || !role) {
            return res.status(400).json({ error: 'Name and role are required' });
        }

        // For non-penumpang, password is required
        if (role !== 'penumpang' && !password) {
            return res.status(400).json({ error: 'Password is required' });
        }

        if (role === 'penumpang') {
            if (!nik) {
                return res.status(400).json({ error: 'NIK is required for penumpang' });
            }
            if (!validateNIK(nik)) {
                return res.status(400).json({ error: 'NIK must be 16 digits' });
            }
        } else if (role === 'admin' || role === 'petugas') {
            if (!email) {
                return res.status(400).json({ error: 'Email is required for admin and petugas' });
            }
        }

        let existingQuery, existingParams;
        if (role === 'penumpang') {
            existingQuery = 'SELECT id_user FROM users WHERE nik = ?';
            existingParams = [nik];
        } else {
            existingQuery = 'SELECT id_user FROM users WHERE email = ?';
            existingParams = [email];
        }

        const [existingUsers] = await pool.execute(existingQuery, existingParams);

        if (existingUsers.length > 0) {
            const identifier = role === 'penumpang' ? 'NIK' : 'email';
            return res.status(400).json({ error: `User with this ${identifier} already exists` });
        }

        const saltRounds = 10;
        // Default password to NIK for passengers if not provided
        const finalPassword = (role === 'penumpang' && !password) ? nik : password;
        const hashedPassword = await bcrypt.hash(finalPassword, saltRounds);

        const qrCode = await generateQRCode(role);

        const ticketsBalance = role === 'penumpang' ? 0 : 0;
        const points = role === 'penumpang' ? 0 : 0;

        // Generate placeholder email for penumpang if database requires NOT NULL
        // Using NIK@ecotiket.id to ensure uniqueness
        const finalEmail = role === 'penumpang' ? `${nik}@ecotiket.id` : email;

        const [result] = await pool.execute(
            'INSERT INTO users (email, nik, password, name, role, phone, address, qr_code, tickets_balance, points, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                finalEmail,
                role === 'penumpang' ? nik : null,
                hashedPassword,
                name,
                role,
                phone || null,
                address || null,
                qrCode,
                ticketsBalance,
                points,
                'active'
            ]
        );

        const [users] = await pool.execute(
            'SELECT id_user, email, nik, name, role, phone, address, qr_code, tickets_balance, points, status, created_at FROM users WHERE id_user = ?',
            [result.insertId]
        );

        const user = users[0];
        const token = generateToken(user.id_user);

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id_user: user.id_user,
                email: user.email,
                nik: user.nik,
                name: user.name,
                role: user.role,
                phone: user.phone,
                address: user.address,
                qrCode: user.qr_code,
                ticketsBalance: user.tickets_balance,
                points: user.points,
                status: user.status
            }
        });

        // Notifikasi ke admin: pengguna baru daftar
        if (role === 'penumpang') {
            notifyAllAdmins({
                type: 'info',
                title: 'Pengguna Baru Mendaftar',
                message: `${name} baru saja mendaftar sebagai penumpang.`
            }).catch(() => {});
        }
    } catch (error) {
        console.error('Register error:', error);
        // Clean up error message for duplicate entry
        if (error.code === 'ER_DUP_ENTRY') {
            if (error.message.includes('email')) {
                return res.status(400).json({ error: 'Email already registered' });
            }
            if (error.message.includes('nik')) {
                return res.status(400).json({ error: 'NIK already registered' });
            }
        }
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, nik, password, qrCode } = req.body;

        let query, params;

        if (qrCode) {
            query = 'SELECT * FROM users WHERE qr_code = ? AND status = "active"';
            params = [qrCode];
        } else if (email && password) {
            query = 'SELECT * FROM users WHERE email = ? AND status = "active"';
            params = [email];
        } else if (nik && password) {
            if (!validateNIK(nik)) {
                return res.status(400).json({ error: 'NIK must be 16 digits' });
            }
            query = 'SELECT * FROM users WHERE nik = ? AND status = "active"';
            params = [nik];
        } else {
            return res.status(400).json({ error: 'Email/NIK and password, or QR code required' });
        }

        const [users] = await pool.execute(query, params);

        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = users[0];

        if ((email || nik) && password) {
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
        }

        const token = generateToken(user.id_user);

        res.json({
            message: 'Login successful',
            token,
            user: {
                id_user: user.id_user,
                email: user.email,
                nik: user.nik,
                name: user.name,
                role: user.role,
                phone: user.phone,
                address: user.address,
                qrCode: user.qr_code,
                ticketsBalance: user.tickets_balance,
                points: user.points,
                status: user.status
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'Access token required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const [users] = await pool.execute(
            'SELECT id_user, email, nik, name, role, phone, address, qr_code, tickets_balance, points, status FROM users WHERE id_user = ? AND status = "active"',
            [decoded.userId]
        );

        if (users.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = users[0];
        res.json({
            user: {
                id_user: user.id_user,
                email: user.email,
                nik: user.nik,
                name: user.name,
                role: user.role,
                phone: user.phone,
                address: user.address,
                qrCode: user.qr_code,
                ticketsBalance: user.tickets_balance,
                points: user.points,
                status: user.status
            }
        });
    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
