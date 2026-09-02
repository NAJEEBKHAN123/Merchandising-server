// middleware/authMiddleware.js

const requireAdminAuth = (req, res, next) => {
  // Strict anti-caching headers as required by security audit
  res.setHeader('Cache-Control', 'private, no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  const adminApiKey = process.env.ADMIN_API_KEY || process.env.ADMIN_SECRET || 'mirage_admin_sec_994821a8f92b7c4d5e6a1209';

  // Extract token from Authorization header or x-admin-key header
  const authHeader = req.headers['authorization'];
  const customHeader = req.headers['x-admin-key'];

  let token = null;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  } else if (customHeader) {
    token = String(customHeader).trim();
  }

  // Block unauthenticated access immediately with 401
  if (!token || token !== adminApiKey) {
    return res.status(401).json({
      success: false,
      message: 'Access Denied: Administrator authentication required. Unauthenticated access is strictly prohibited.'
    });
  }

  next();
};

module.exports = {
  requireAdminAuth
};
