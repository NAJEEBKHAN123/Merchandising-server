const express = require('express');
const dbConnection = require('./db');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables FIRST
dotenv.config();

const app = express();

// Establish database connection
dbConnection();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Comprehensive Production & Development CORS configuration
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "http://127.0.0.1:3000",
  "https://merchandising-client.vercel.app",
  "https://mymirage.fr",
  "https://www.mymirage.fr"
];

if (process.env.CLIENT_URL) {
  allowedOrigins.push(process.env.CLIENT_URL);
}

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (curl, mobile apps, server-to-server)
    if (!origin) return callback(null, true);

    const isExplicitlyAllowed = allowedOrigins.includes(origin);
    const isVercelPreview = /^https:\/\/.*\.vercel\.app$/.test(origin);
    const isLocalhost = /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);
    const isMyMirageDomain = /^https:\/\/(.*\.)?mymirage\.fr$/.test(origin);

    if (isExplicitlyAllowed || isVercelPreview || isLocalhost || isMyMirageDomain) {
      return callback(null, true);
    } else {
      console.warn(`[CORS Warning] Origin blocked: ${origin}`);
      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "x-admin-key"],
  credentials: true,
  optionsSuccessStatus: 200
}));

// Root endpoint
app.get('/', (req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.json({
    name: 'Mirage Merchandising API',
    status: 'online',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      contact: '/api/contact',
      newsletter: '/api/contact/newsletter'
    }
  });
});

// Fallback for legacy POST / calls (routes directly to contact handler)
const { submitContactForm } = require('./controllers/contactController');
app.post('/', submitContactForm);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Contact & Lead generation routes
app.use('/api/contact', require('./routes/contact'));

// Global 404 handler for undefined API routes
app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint ${req.originalUrl} not found.`
  });
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('🔥 Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Start server when run directly (local development)
const PORT = process.env.PORT || 5001;
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  });
}

// Export for Vercel serverless handler
module.exports = app;