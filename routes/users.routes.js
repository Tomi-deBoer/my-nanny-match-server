const router = require("express").Router();
const bcrypt = require("bcrypt");

const User = require("../models/user.model");

router.post("/", async (req, res, next) => {
  const { name, email, phoneNr, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phoneNr,
      password: hashedPassword,
      role
    });

    res.status(201).json({
      message: "User created successfully",
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