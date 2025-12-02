require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { testConnection, disconnect } = require('./config/database');
const { supabase } = require('./config/supabase');

// Import routes
const authRoutes = require('./routes/auth');
const portfolioRoutes = require('./routes/portfolio');
const budgetRoutes = require('./routes/budget');
const retirementRoutes = require('./routes/retirement');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'WealthWise API is running' });
});

// API health (for clients expecting /api/health)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'WealthWise API is running' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/retirement', retirementRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

// Start server
async function startServer() {
  try {
    if (process.env.USE_SUPABASE === '1' && supabase) {
    } else {
      await testConnection();
    }

    // Start listening
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  if (process.env.USE_SUPABASE === '1') {
  } else {
    await disconnect();
  }
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\nShutting down gracefully...');
  if (process.env.USE_SUPABASE === '1') {
  } else {
    await disconnect();
  }
  process.exit(0);
});

startServer();
