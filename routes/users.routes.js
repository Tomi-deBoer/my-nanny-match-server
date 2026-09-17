const router = require("express").Router();
const bcrypt = require("bcrypt");

const User = require("../models/user.model");
const NannyProfile = require("../models/nannyProfile.model");
const requireAdmin = require("../middleware/admin.middleware");


// ============================================================
// PUBLIC REGISTRATION
// POST /api/users
// ============================================================

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

    // Public registration can only create
    // parent or nanny accounts.
    // Admin accounts must never be created publicly.
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

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Check whether the email already exists
    const existingUser = await User.findOne({
      email: normalizedEmail
    });

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists."
      });
    }

    // Hash password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      phoneNr: phoneNr.trim(),
      password: hashedPassword,
      role
    });

    // Create a nanny profile automatically
    // when the user registers as a nanny.
    if (role === "nanny") {
      await NannyProfile.create({
        userId: user._id,
        experienceInYears: 0,
        hourlyRate: 0
      });
    }

    // Never return the password
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


// ============================================================
// ADMIN USER MANAGEMENT
// Everything below this point requires an admin account.
// ============================================================

router.use(requireAdmin);


// ============================================================
// GET ALL USERS
// GET /api/users
// ============================================================

router.get("/", async (req, res, next) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    next(error);
  }
});


// ============================================================
// GET ONE USER
// GET /api/users/:id
// ============================================================

router.get("/:id", async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found."
      });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
});


// ============================================================
// UPDATE USER
// PUT /api/users/:id
// ============================================================

router.put("/:id", async (req, res, next) => {
  try {
    const {
      name,
      email,
      phoneNr,
      password,
      role
    } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found."
      });
    }

    // Prevent an admin from removing their own admin role
    if (
      user._id.toString() === req.user.id &&
      role &&
      role !== "admin"
    ) {
      return res.status(400).json({
        message: "You cannot remove your own admin role."
      });
    }

    // Validate role if supplied
    if (
      role &&
      !["parent", "nanny", "admin"].includes(role)
    ) {
      return res.status(400).json({
        message: "Invalid account role."
      });
    }

    // Validate password if supplied
    if (password !== undefined) {
      if (password.length < 8) {
        return res.status(400).json({
          message: "Password must be at least 8 characters long."
        });
      }

      user.password = await bcrypt.hash(password, 10);
    }

    // Update supplied fields
    if (name !== undefined) {
      user.name = name.trim();
    }

    if (email !== undefined) {
      user.email = email.toLowerCase().trim();
    }

    if (phoneNr !== undefined) {
      user.phoneNr = phoneNr.trim();
    }

    if (role !== undefined) {
      user.role = role;
    }

    await user.save();

    // Never return the password
    const userResponse = user.toObject();

    delete userResponse.password;

    res.json({
      message: "User updated successfully.",
      user: userResponse
    });
  } catch (error) {
    next(error);
  }
});


// ============================================================
// DELETE USER
// DELETE /api/users/:id
// ============================================================

router.delete("/:id", async (req, res, next) => {
  try {
    // Prevent an admin from deleting themselves
    if (req.params.id === req.user.id) {
      return res.status(400).json({
        message: "You cannot delete your own account."
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found."
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({
      message: "User deleted successfully."
    });
  } catch (error) {
    next(error);
  }
});


module.exports = router;