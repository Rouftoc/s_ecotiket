const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Auth Debug: Decoded UserID:', decoded.userId);

    const [users] = await pool.execute(
      'SELECT id_user, email, nik, name, role, phone, address, qr_code, tickets_balance, points, status FROM users WHERE id_user = ? AND status = "active"',
      [decoded.userId]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid token or user not found' });
    }

    req.user = users[0];
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ error: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ error: 'Token expired' });
    }

    console.error('Auth Middleware Error:', error);
    // If DB error, return 500 instead of 403 to avoid confusing frontend
    return res.status(500).json({ error: 'Internal server error during auth' });
  }
};

const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      console.log('Auth Debug: No user in request');
      return res.status(401).json({ error: 'Authentication required' });
    }

    console.log(`Auth Debug: Checking role ${req.user.role} against ${roles}`);
    if (!roles.includes(req.user.role)) {
      console.log(`Auth Debug: Role mismatch. Required: ${roles}, Found: ${req.user.role}`);
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};

module.exports = { authenticateToken, requireRole };