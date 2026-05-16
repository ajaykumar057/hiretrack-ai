require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors({
  origin: true, // Automatically reflect the request origin to allow Vercel
  credentials: true
}));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: '🚀 HireTrack AI API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/network', require('./routes/networkRoutes'));
app.use('/api/goals', require('./routes/goalRoutes'));
app.use('/api/interview-vault', require('./routes/interviewVaultRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/linkedin', require('./routes/linkedinRoutes'));
app.use('/api/resume-intelligence', require('./routes/resumeIntelligenceRoutes'));
app.use('/api/resumes', require('./routes/resumeRoutes'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  // Set static folder
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  // For any route that doesn't match an API route, send the index.html file
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend', 'dist', 'index.html'));
  });
}

const server = app.listen(PORT, () => {
  console.log(`\n🚀 HireTrack AI Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
  console.log(`❤️  Health check: http://localhost:${PORT}/api/health\n`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

module.exports = app;
