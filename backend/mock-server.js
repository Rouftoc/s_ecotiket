const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

const { testConnection, mysqlConfig } = require('./config/database');
const locationsRoutes = require('./routes/locations');
const transactionsRoutes = require('./routes/transactions');
const pool = mysql.createPool(mysqlConfig);

const app = express();
const PORT = 5000;
const DB_FILE = path.join(__dirname, 'db.json');

let db = {
  users: [],
  transactions: []
};

app.use(express.json());

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.options('*', cors());

app.use('/api/locations', locationsRoutes);
app.use('/api/transactions', transactionsRoutes);

const loadDataFromFile = () => {
  try {
    if (fs.existsSync(DB_FILE)) {
      db = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
      console.log('Database loaded from db.json');
    } else {
      fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
      console.log('New db.json file created.');
    }
  } catch (error) {
    console.error('Failed to load database:', error);
    process.exit(1);
  }
};

const saveDataToFile = () => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
    console.log('Data saved to db.json');
  } catch (error) {
    console.error('Failed to save data:', error);
  }
};

const testMySQLConnection = async () => {
  try {
    await testConnection();
    return true;
  } catch (error) {
    console.error('MySQL connection failed:', error.message);
    return false;
  }
};

const generateQRCode = () => `ECO-USER-${String((db.users.length || 0) + 1).padStart(3, '0')}`;
const generateToken = () => crypto.randomBytes(20).toString('hex');

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  const token = authHeader.substring(7);
  const user = db.users.find(u => u.token === token);
  if (!user) {
    return res.status(403).json({ error: 'Invalid token' });
  }
  req.user = user;
  next();
};

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    server: 'Eco-Tiket Backend',
    version: '1.0.0'
  });
});

app.post('/api/auth/register', (req, res) => {
  try {
    const { email, nik, password, name, role = 'penumpang', phone, address } = req.body;

    if (!name || !password || (!email && !nik)) {
      return res.status(400).json({
        error: 'Required fields missing',
        required: ['name', 'password', 'email or nik']
      });
    }

    if ((email && db.users.some(u => u.email === email)) ||
      (nik && db.users.some(u => u.nik === nik))) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const qrCode = generateQRCode();
    const newUser = {
      id: (db.users.length > 0 ? Math.max(...db.users.map(u => u.id)) : 0) + 1,
      email: email || null,
      nik: nik || null,
      password,
      name,
      role,
      phone: phone || null,
      address: address || null,
      qr_code: qrCode,
      qrCode: qrCode,
      tickets_balance: 0,
      ticketsBalance: 0,
      points: 0,
      status: 'active',
      token: generateToken(),
      created_at: new Date().toISOString(),
    };

    db.users.push(newUser);
    saveDataToFile();

    const { password: _, ...userResponse } = newUser;
    res.status(201).json({
      message: 'User registered successfully',
      user: userResponse
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error during registration' });
  }
});

app.post('/api/auth/login', (req, res) => {
  try {
    const { email, nik, password, qrCode } = req.body;
    let user;

    if (qrCode) {
      user = db.users.find(u => u.qr_code === qrCode || u.qrCode === qrCode);
    } else if (password) {
      user = db.users.find(u =>
        (u.email === email || u.nik === nik) && u.password === password
      );
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (user.status !== 'active') {
      return res.status(403).json({ error: 'Account is not active' });
    }

    user.qrCode = user.qr_code;
    user.ticketsBalance = user.tickets_balance;

    const { password: _, ...userResponse } = user;
    res.json({
      message: 'Login successful',
      user: userResponse,
      token: user.token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error during login' });
  }
});

app.get('/api/auth/profile', authenticate, (req, res) => {
  try {
    req.user.qrCode = req.user.qr_code;
    req.user.ticketsBalance = req.user.tickets_balance;

    const { password: _, ...userResponse } = req.user;
    res.json({ user: userResponse });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/users/:id', authenticate, (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);

    if (req.user.role !== 'admin' && req.user.role !== 'petugas' && req.user.id !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const user = db.users.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { password: _, ...userResponse } = user;
    userResponse.qrCode = userResponse.qr_code;
    userResponse.ticketsBalance = userResponse.tickets_balance;

    res.json({ user: userResponse });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/users/qr/:qrCode', authenticate, (req, res) => {
  try {
    const qrCode = decodeURIComponent(req.params.qrCode);

    const user = db.users.find(u => u.qr_code === qrCode || u.qrCode === qrCode);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { password: _, ...userResponse } = user;
    userResponse.qrCode = userResponse.qr_code;
    userResponse.ticketsBalance = userResponse.tickets_balance;

    res.json({ user: userResponse });
  } catch (error) {
    console.error('Get user by QR code error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/users/profile', authenticate, (req, res) => {
  try {
    const { name, phone, address } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const user = db.users.find(u => u.id === req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;

    user.qrCode = user.qr_code;
    user.ticketsBalance = user.tickets_balance;

    saveDataToFile();

    const { password: _, ...userResponse } = user;
    res.json({
      message: 'Profile updated successfully',
      user: userResponse
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/users/:id', authenticate, (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);

    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const user = db.users.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const {
      name,
      email,
      nik,
      phone,
      address,
      status,
      tickets_balance,
      ticketsBalance,
      points
    } = req.body;

    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (nik !== undefined) user.nik = nik;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;
    if (status !== undefined) user.status = status;
    if (points !== undefined) user.points = points;

    if (tickets_balance !== undefined) {
      user.tickets_balance = tickets_balance;
      user.ticketsBalance = tickets_balance;
    } else if (ticketsBalance !== undefined) {
      user.tickets_balance = ticketsBalance;
      user.ticketsBalance = ticketsBalance;
    }

    user.qrCode = user.qr_code;
    user.ticketsBalance = user.tickets_balance;

    saveDataToFile();

    const { password: _, ...userResponse } = user;
    res.json({
      message: 'User updated successfully',
      user: userResponse
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/users/:id', authenticate, (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);

    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const userIndex = db.users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (userId === req.user.id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    db.users.splice(userIndex, 1);
    saveDataToFile();

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/transactions/bottle-exchange', authenticate, (req, res) => {
  try {
    const { userQrCode, bottleType, bottleCount, location } = req.body;
    const petugas = req.user;

    if (!userQrCode || !bottleType || !bottleCount) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['userQrCode', 'bottleType', 'bottleCount']
      });
    }

    const user = db.users.find(u => u.qr_code === userQrCode || u.qrCode === userQrCode);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.status !== 'active') {
      return res.status(403).json({ error: 'User account is not active' });
    }

    let ticketsEarned = 0;
    switch (bottleType.toLowerCase()) {
      case 'jumbo':
        ticketsEarned = bottleCount * 2;
        break;
      case 'besar':
        ticketsEarned = Math.floor(bottleCount / 5);
        break;
      case 'sedang':
        ticketsEarned = Math.floor(bottleCount / 8);
        break;
      case 'kecil':
        ticketsEarned = Math.floor(bottleCount / 15);
        break;
      case 'cup':
        ticketsEarned = Math.floor(bottleCount / 20);
        break;
      default:
        ticketsEarned = Math.floor(bottleCount / 5);
    }

    const pointsEarned = bottleCount * 10;

    user.tickets_balance += ticketsEarned;
    user.ticketsBalance = user.tickets_balance;
    user.points += pointsEarned;

    const newTransaction = {
      id: (db.transactions.length > 0 ? Math.max(...db.transactions.map(t => t.id)) : 0) + 1,
      user_id: user.id,
      petugas_id: petugas.id,
      type: 'bottle_exchange',
      description: `${bottleCount} botol ${bottleType} ditukar`,
      tickets_change: ticketsEarned,
      points_earned: pointsEarned,
      location: location,
      status: 'completed',
      created_at: new Date().toISOString(),
      petugas_name: petugas.name,
      bottles_count: bottleCount,
      bottle_type: bottleType,
    };

    db.transactions.push(newTransaction);
    saveDataToFile();

    res.status(201).json({
      message: 'Bottle exchange successful',
      transaction: newTransaction,
      tickets_earned: ticketsEarned,
      points_earned: pointsEarned
    });
  } catch (error) {
    console.error('Bottle exchange error:', error);
    res.status(500).json({ error: 'Internal server error during bottle exchange' });
  }
});

app.post('/api/transactions/ticket-usage', authenticate, (req, res) => {
  try {
    const { userQrCode, ticketCount, location } = req.body;

    if (!userQrCode || !ticketCount) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['userQrCode', 'ticketCount']
      });
    }

    const user = db.users.find(u => u.qr_code === userQrCode || u.qrCode === userQrCode);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.status !== 'active') {
      return res.status(403).json({ error: 'User account is not active' });
    }

    if (user.tickets_balance < ticketCount) {
      return res.status(400).json({
        error: 'Insufficient tickets',
        available: user.tickets_balance,
        required: ticketCount
      });
    }

    user.tickets_balance -= ticketCount;
    user.ticketsBalance = user.tickets_balance;

    const newTransaction = {
      id: (db.transactions.length > 0 ? Math.max(...db.transactions.map(t => t.id)) : 0) + 1,
      user_id: user.id,
      petugas_id: req.user.id,
      type: 'ticket_usage',
      description: `Penggunaan ${ticketCount} tiket untuk transportasi`,
      tickets_change: -ticketCount,
      points_earned: 0,
      location: location,
      status: 'completed',
      created_at: new Date().toISOString(),
      petugas_name: req.user.name,
      bottles_count: 0,
      bottle_type: null,
    };

    db.transactions.push(newTransaction);
    saveDataToFile();

    res.status(201).json({
      message: 'Ticket used successfully',
      transaction: newTransaction,
      remaining_tickets: user.tickets_balance
    });
  } catch (error) {
    console.error('Ticket usage error:', error);
    res.status(500).json({ error: 'Internal server error during ticket usage' });
  }
});

app.get('/api/transactions/user/:userId', authenticate, (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    if (req.user.role === 'penumpang' && req.user.id !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    const userTransactions = db.transactions
      .filter(t => t.user_id === userId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    res.json({ transactions: userTransactions || [] });
  } catch (error) {
    console.error('Get user transactions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/transactions', authenticate, async (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'petugas') {
    return res.status(403).json({ error: 'Access denied' });
  }

  const { startDate, endDate, type, limit } = req.query;

  let sql = 'SELECT * FROM transactions WHERE 1=1';
  const params = [];

  if (startDate) {
    sql += ' AND created_at >= ?';
    params.push(`${startDate} 00:00:00`);
  }
  if (endDate) {
    sql += ' AND created_at <= ?';
    params.push(`${endDate} 23:59:59`);
  }

  if (type) {
    sql += ' AND type = ?';
    params.push(type);
  }

  sql += ' ORDER BY created_at DESC';

  if (limit) {
    const limitNum = parseInt(limit, 10);
    if (!isNaN(limitNum) && limitNum > 0) {
      sql += ` LIMIT ${limitNum}`;
    }
  }

  try {
    console.log('Executing SQL:', sql);
    console.log('With params:', params);

    const [transactions] = await pool.execute(sql, params);

    console.log(`Successfully fetched ${transactions.length} transactions from MySQL.`);

    res.json({
      success: true,
      transactions: transactions,
      total: transactions.length,
      filtered: !!(startDate || endDate || type || limit)
    });

  } catch (error) {
    console.error('MySQL query error in /api/transactions:', error);
    res.status(500).json({
      error: 'Failed to fetch transactions from database',
      message: error.message
    });
  }
});

app.delete('/api/transactions/:id', authenticate, async (req, res) => {
  try {
    const transactionId = parseInt(req.params.id, 10);

    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Only admin can delete transactions.' });
    }

    const checkSql = 'SELECT * FROM transactions WHERE id = ?';
    const [existingTransactions] = await pool.execute(checkSql, [transactionId]);

    if (existingTransactions.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    const transaction = existingTransactions[0];

    if (transaction.type === 'bottle_exchange') {
      const updateUserSql = `
        UPDATE users 
        SET tickets_balance = tickets_balance - ?, 
            points = points - ? 
        WHERE id = ?
      `;
      await pool.execute(updateUserSql, [
        transaction.tickets_change,
        transaction.points_earned || 0,
        transaction.user_id
      ]);
    } else if (transaction.type === 'ticket_usage') {
      const updateUserSql = `
        UPDATE users 
        SET tickets_balance = tickets_balance - ? 
        WHERE id = ?
      `;
      await pool.execute(updateUserSql, [transaction.tickets_change, transaction.user_id]);
    }

    const deleteSql = 'DELETE FROM transactions WHERE id = ?';
    const [result] = await pool.execute(deleteSql, [transactionId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    console.log(`Transaction ${transactionId} deleted successfully by admin ${req.user.name}`);

    res.json({
      message: 'Transaction deleted successfully',
      deletedTransaction: transaction
    });

  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({
      error: 'Internal server error during transaction deletion',
      message: error.message
    });
  }
});

app.get('/api/users', authenticate, (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'petugas') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { role, status, search } = req.query;
    let results = [...db.users];

    if (role) {
      results = results.filter(u => u.role === role);
    }

    if (status) {
      results = results.filter(u => u.status === status);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      results = results.filter(u =>
        u.name.toLowerCase().includes(searchLower) ||
        (u.email && u.email.toLowerCase().includes(searchLower)) ||
        (u.nik && u.nik.includes(search))
      );
    }

    const usersWithoutPassword = results.map(u => {
      const { password, ...rest } = u;
      return {
        ...rest,
        qrCode: rest.qr_code,
        ticketsBalance: rest.tickets_balance
      };
    });

    res.json({
      users: usersWithoutPassword,
      total: usersWithoutPassword.length,
      filtered: usersWithoutPassword.length !== db.users.length
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.originalUrl,
    method: req.method
  });
});

app.listen(PORT, async () => {
  console.log('='.repeat(50));
  console.log('ECO-TIKET BACKEND SERVER');
  console.log('='.repeat(50));

  loadDataFromFile();

  const mysqlConnected = await testMySQLConnection();
  if (!mysqlConnected) {
    console.log('MySQL locations feature will not work properly');
    console.log('Please check your MySQL server and configuration');
  }

  console.log(`Server running on: http://localhost:${PORT}`);
  console.log(`Database file: ${DB_FILE}`);

  if (typeof mysqlConfig !== 'undefined' && mysqlConfig.database) {
    console.log(`MySQL database: ${mysqlConfig.database}`);
  }

  console.log('\nAvailable Endpoints:');
  console.log('  GET  /health');
  console.log('  POST /api/auth/register');
  console.log('  POST /api/auth/login');
  console.log('  GET  /api/auth/profile (auth required)');
  console.log('  GET  /api/users (admin/petugas only)');
  console.log('  GET  /api/users/:id (auth required)');
  console.log('  GET  /api/users/qr/:qrCode (auth required)');
  console.log('  PUT  /api/users/profile (auth required)');
  console.log('  PUT  /api/users/:id (admin only)');
  console.log('  DELETE /api/users/:id (admin only)');
  console.log('  POST /api/transactions/bottle-exchange (auth required)');
  console.log('  POST /api/transactions/ticket-usage (auth required)');
  console.log('  GET  /api/transactions/user/:userId (auth required)');
  console.log('  GET  /api/transactions (admin/petugas only)');
  console.log('  DELETE /api/transactions/:id (admin only)');
  console.log('  GET  /api/locations (auth required)');
  console.log('  POST /api/locations (auth required)');
  console.log('  PUT  /api/locations/:id (auth required)');
  console.log('  DELETE /api/locations/:id (auth required)');
  console.log('='.repeat(50));
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  saveDataToFile();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\nSIGINT received. Shutting down gracefully...');
  saveDataToFile();
  process.exit(0);
});