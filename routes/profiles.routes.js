const router = require("express").Router();

const User = require("../models/user.model");
const NannyProfile = require("../models/nannyProfile.model");

// GET logged-in user's profile
router.get("/", async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select(
      "name email phoneNr role"
    );

    if (!user) {
      return res.status(404).json({
        error: "User not found"
      });
    }

    let nannyProfile = null;

    if (user.role === "nanny") {
      nannyProfile = await NannyProfile.findOne({
        userId: user._id
      });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phoneNr: user.phoneNr,
        role: user.role
      },
      nannyProfile
    });
  } catch (error) {
    next(error);
  }
});

// UPDATE logged-in user's profile
router.put("/", async (req, res, next) => {
  try {
    const {
      name,
      phoneNr,
      profileImage,
      experienceInYears,
      hourlyRate,
      skills,
      availability
    } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        error: "User not found"
      });
    }

    // Update personal information
    user.name = name;
    user.phoneNr = phoneNr;

    await user.save();

    // Only nanny users have a nanny profile
    if (user.role === "nanny") {
      const nannyProfile = await NannyProfile.findOne({
        userId: user._id
      });

      if (!nannyProfile) {
        return res.status(404).json({
          error: "Nanny profile not found"
        });
      }

      nannyProfile.profileImage = profileImage;
      nannyProfile.experienceInYears = experienceInYears;
      nannyProfile.hourlyRate = hourlyRate;
      nannyProfile.skills = skills;
      nannyProfile.availability = availability;

      await nannyProfile.save();

      return res.json({
        message: "Profile updated successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phoneNr: user.phoneNr,
          role: user.role
        },
        nannyProfile
      });
    }

    res.json({
      message: "Profile updated successfully",
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