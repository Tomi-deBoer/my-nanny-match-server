const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  // Public route - login does not require authentication
if (
  req.path === "/api/auth/login" ||
  (req.path === "/api/users" && req.method === "POST")
) {
    return next();
  }

  const authHeader = req.headers.authorization;

  // No Authorization header or wrong format
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Authentication required"
    });
  }

  // Extract the token from:
  // Authorization: Bearer <token>
  const token = authHeader.split(" ")[1];

  try {
    // Verify the token using our secret
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Make the logged-in user's information
    // available to everything further down the pipeline
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      error: "Invalid or expired token"
    });
  }
}

module.exports = authMiddleware;