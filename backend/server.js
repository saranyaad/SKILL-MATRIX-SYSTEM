const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const resultsRoutes = require('./routes/results');
const dataViewerRoutes = require('./routes/dataViewer');

const app = express();
const PORT = process.env.PORT || 5000;

// Try to connect to MongoDB but don't block if it fails
let dbConnected = true;
(async () => {
  try {
    const connectDB = require('./config/db');
    const result = await connectDB();
    if (result) {
      dbConnected = true;
      console.log('✓ MongoDB Database connected!');
    } else {
      console.log('⚠ MongoDB not connected - Demo Mode enabled');
    }
  } catch (err) {
    console.log('⚠ Demo Mode - MongoDB not available');
  }
})();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Backend is running',
    dbConnected: dbConnected,
    mode: dbConnected ? 'Production' : 'Demo'
  });
});

app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to the backend API' });
});

// Auth routes
app.use('/api/auth', authRoutes);

// Results routes
app.use('/api/results', resultsRoutes);

// Data Viewer routes
app.use('/api/dataviewer', dataViewerRoutes);

app.get('/api/data', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 1, title: 'Item 1', description: 'Sample item' },
      { id: 2, title: 'Item 2', description: 'Another sample' }
    ]
  });
});

app.post('/api/data', (req, res) => {
  const { title, description } = req.body;
  res.json({
    success: true,
    message: 'Data received',
    data: { id: 3, title, description }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: 'Server error' });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`\n✓ Server running on http://localhost:${PORT}`);
  console.log(`Mode: ${dbConnected ? 'Production (MongoDB)' : 'Demo (Memory)'}\\n`);
});

// Handle errors
server.on('error', (err) => {
  console.error('Server error:', err.message);
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} is already in use. Try a different port.`);
  }
});
