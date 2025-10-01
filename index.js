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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// FIXED CORS SETTINGS - Allow both localhost and your live domain
// FIXED CORS SETTINGS - Add your new domain
app.use(cors({
  origin: [
    "http://localhost:5173", // Development
    "http://localhost:3000", // Alternative dev port
    "https://merchandising-client.vercel.app", // Your Vercel frontend
    "https://mymirage.fr", // ADD THIS - your new domain
    "https://www.mymirage.fr" // ADD THIS - www version
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// Test route
app.get('/', (req, res) => {
  res.send('Mirage Server is running!');
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