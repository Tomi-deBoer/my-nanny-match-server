const router = require("express").Router();

const NannyProfile = require("../models/nannyProfile.model");

router.get("/", async (req, res, next) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);

    const limit = Math.min(
      Math.max(Number(req.query.limit) || 10, 1),
      50
    );

    const skip = (page - 1) * limit;

    const [nannies, total] = await Promise.all([
      NannyProfile.find()
        .populate("userId", "name")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),

      NannyProfile.countDocuments()
    ]);

    const data = nannies.map((nanny) => ({
      id: nanny._id,
      name: nanny.userId.name,
      profileImage: nanny.profileImage,
      experienceInYears: nanny.experienceInYears,
      hourlyRate: nanny.hourlyRate,
      skills: nanny.skills,
      availability: nanny.availability,
      isVerified: nanny.isVerified
    }));

    res.json({
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;