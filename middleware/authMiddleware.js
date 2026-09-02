// middleware/authMiddleware.js

const requireAdminAuth = (req, res, next) => {
  // Ensure response is never cached
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, private');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  const adminApiKey = process.env.ADMIN_API_KEY || process.env.ADMIN_SECRET;
  
  // Extract token from Authorization header or x-admin-key header
  const authHeader = req.headers['authorization'];
  const customHeader = req.headers['x-admin-key'];

  let token = null;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  } else if (customHeader) {
    token = String(customHeader).trim();
  }

  // If no admin key is configured on server or token does not match
  if (!adminApiKey || !token || token !== adminApiKey) {
    return res.status(401).json({
      success: false,
      message: 'Access Denied: Administrator authentication required.'
    });
  }

  next();
};

module.exports = {
  requireAdminAuth
};
