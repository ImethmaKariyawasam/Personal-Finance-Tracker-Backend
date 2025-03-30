const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const goalRoutes = require('./routes/goalRoutes');
const reportRoutes = require('./routes/reportRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const adminRoutes = require('./routes/adminRoutes');

require('./services/notificationService'); // Start the notification service

const swaggerSetup = require('./swagger');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  //console.log(`${req.method} ${req.url}`);
  next();
});

// Connect to MongoDB
const connectDB = async () => {
  try {
    const mongoUri =
      process.env.NODE_ENV === 'test'
        ? process.env.MONGODB_URI_TEST // Use test database for testing
        : process.env.MONGODB_URI; // Use production/development database otherwise

    await mongoose.connect(mongoUri, {
      ssl: true,
      serverSelectionTimeoutMS: 5000 
    });
    console.log('Connected to MongoDB');
  
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err; // Exit the process if the connection fails
  }
};

connectDB();

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'API is running',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

swaggerSetup(app);

// Export the app for testing
module.exports = app;

// Start the server only if not in test environment
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3000;
  const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('SIGINT received. Shutting down gracefully...');
    server.close(() => {
      console.log('Server closed.');
      process.exit(0);
    });
  });

  process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
      console.log('Server closed.');
      process.exit(0);
    });
  });
}