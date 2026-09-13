const router = require("express").Router();

// Temporary hardcoded users
const users = [
  {
    id: 1,
    email: "parent@test.com",
    password: "password123",
    role: "parent"
  },
  {
    id: 2,
    email: "nanny@test.com",
    password: "password123",
    role: "nanny"
  }
];

// POST /api/auth/login
router.post("/login", (req, res, next) => {
  const { email, password } = req.body;

  // Find the user with the supplied email
  const user = users.find((user) => user.email === email);

  // User doesn't exist
  if (!user) {
    return res.status(401).json({
      error: "Invalid email or password"
    });
  }

  // Password doesn't match
  if (user.password !== password) {
    return res.status(401).json({
      error: "Invalid email or password"
    });
  }

  // Login successful
  res.status(200).json({
    message: "Login successful",
    user: {
      id: user.id,
      email: user.email,
      role: user.role
    }
  });
});

module.exports = router;