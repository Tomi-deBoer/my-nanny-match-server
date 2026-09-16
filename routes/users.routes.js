const router = require("express").Router();
const bcrypt = require("bcrypt");

const User = require("../models/user.model");


// CREATE USER / REGISTER
router.post("/", async (req, res, next) => {
  try {
    const {
      name,
      email,
      phoneNr,
      password,
      role
    } = req.body;

    // Validate required fields
    if (!name || !email || !phoneNr || !password || !role) {
      return res.status(400).json({
        message:
          "Name, email, phone number, password and role are required."
      });
    }

    // Only these roles can be created through public registration.
    // Admin accounts must never be created through this endpoint.
    if (!["parent", "nanny"].includes(role)) {
      return res.status(400).json({
        message: "Invalid account role."
      });
    }

    // Basic password validation
    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long."
      });
    }

    // Check whether the email is already registered
    const existingUser = await User.findOne({
      email: email.toLowerCase().trim()
    });

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists."
      });
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phoneNr: phoneNr.trim(),
      password: hashedPassword,
      role
    });

    // Never send the password back to the client
    res.status(201).json({
      message: "Account created successfully.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phoneNr: user.phoneNr,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
});


module.exports = router;