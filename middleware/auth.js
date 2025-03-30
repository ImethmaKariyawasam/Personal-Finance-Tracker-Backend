const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach the decoded user information to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};

// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: 'Access denied. Admin only.' });
  }
  next(); // Proceed to the next middleware or route handler
};

// Export the middleware functions
module.exports = { auth, isAdmin };
