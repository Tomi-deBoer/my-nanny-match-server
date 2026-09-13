const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = require("../models/user.model");

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  console.log(`Login attempt for: ${email}`);

  try {
    const user = await User.findOne({ email });

    if (!user) {
      console.log("Login failed: user not found");

      return res.status(401).json({
        error: "Invalid email or password"
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatches) {
      console.log("Login failed: incorrect password");

      return res.status(401).json({
        error: "Invalid email or password"
      });
    }

    console.log(`Credentials verified for: ${user.email}`);

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log(`JWT created successfully for: ${user.email}`);

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    next(error);
  }
});

router.get("/me", (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;