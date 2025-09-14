const express = require('express');
const dbConnection = require('./db');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();

// Load environment variables FIRST
dotenv.config();

// Then establish database connection
dbConnection();

// Middleware - MUST come before routes!
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: "http://localhost:5173", // or React port
  methods: ["GET","POST"],
  allowedHeaders: ["Content-Type"],
}));

// Test route
app.get('/', (req, res) => {
  res.send('MSCO Server is running!');
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'Server is running', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Contact routes
app.use('/api/contact', require('./routes/contact'));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
});