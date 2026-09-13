const router = require("express").Router();
const jwt = require("jsonwebtoken");

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

  console.log(`Login attempt for: ${email}`);

  // Find the user with the supplied email
  const user = users.find((user) => user.email === email);

  // User doesn't exist
  if (!user) {
    console.log("Login failed: user not found");

    return res.status(401).json({
      error: "Invalid email or password"
    });
  }

  // Password doesn't match
  if (user.password !== password) {
    console.log("Login failed: incorrect password");

    return res.status(401).json({
      error: "Invalid email or password"
    });
  }

  console.log(`Credentials verified for: ${user.email}`);

  // Create JWT
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h"
    }
  );

  console.log(`JWT created successfully for: ${user.email}`);

  // Login successful
  res.status(200).json({
    message: "Login successful",
    user: {
      id: user.id,
      email: user.email,
      role: user.role
    },
    token
  });
});

module.exports = router;
