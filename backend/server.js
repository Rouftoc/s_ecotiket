const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { testConnection } = require('./config/database');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const transactionRoutes = require('./routes/transactions');
const newsRoutes = require('./routes/news');
const locationRoutes = require('./routes/locations');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS - Must be first middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.set('trust proxy', 1);
// Removed duplicate trust proxy line
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3000,
  validate: {
    xForwardedForHeader: false
  },
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Old CORS removed


app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Eco-Tiket API is running',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/chat', require('./routes/chat'));
app.use('/api/bottle-rates', require('./routes/bottleRates'));
app.use('/api/shifts', require('./routes/shifts'));
app.use('/api/notifications', require('./routes/notifications'));

app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.use((error, req, res, next) => {
  console.error('Global error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

const startServer = async () => {
  try {
    await testConnection();

    app.listen(PORT, () => {
      console.log(`Eco-Tiket API server running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;