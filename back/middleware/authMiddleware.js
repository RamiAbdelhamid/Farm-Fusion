
const jwt = require("jsonwebtoken");





// Middleware to verify JWT token
// This middleware checks if the user is authenticated by verifying the JWT token
// If the token is valid, it allows the request to proceed; otherwise, it sends an error response
// It is used to protect routes that require authentication
// It checks for the token in the request cookies and verifies it using the secret key
/****************************************************************************************/
/****************************************************************************************/
/**
 * Middleware to verify JWT token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 */
/****************************************************************************************/
/****************************************************************************************/
const verifyToken = (req, res, next) => {
  const token = req.cookies.authToken;

  if (!token) {
    return res.status(401).json({ message: "Please Login First" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Save the decoded user data to req.user
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
/****************************************************************************************/
/****************************************************************************************/




module.exports = verifyToken;
