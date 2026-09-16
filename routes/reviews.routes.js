const router = require("express").Router();

const Review = require("../models/review.model");
const NannyProfile = require("../models/nannyProfile.model");

// ========================================
// CREATE REVIEW
// ========================================

router.post("/", async (req, res, next) => {
  try {
    const { nannyId, rating, comment } = req.body;

    // Make sure the nanny exists
    const nanny = await NannyProfile.findById(nannyId);

    if (!nanny) {
      return res.status(404).json({
        error: "Nanny profile not found"
      });
    }

    const review = await Review.create({
      parentId: req.user.id,
      nannyId,
      rating,
      comment
    });

    // Return the related user information as well
    await review.populate([
      {
        path: "parentId",
        select: "name"
      },
      {
        path: "nannyId",
        populate: {
          path: "userId",
          select: "name"
        }
      }
    ]);

    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
});

// ========================================
// GET ALL REVIEWS
// ========================================

router.get("/", async (req, res, next) => {
  try {
    const reviews = await Review.find()
      .populate("parentId", "name")
      .populate({
        path: "nannyId",
        populate: {
          path: "userId",
          select: "name"
        }
      })
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    next(error);
  }
});

// ========================================
// GET REVIEWS FOR A NANNY
// ========================================

router.get("/nanny/:nannyId", async (req, res, next) => {
  try {
    const reviews = await Review.find({
      nannyId: req.params.nannyId
    })
      .populate("parentId", "name")
      .populate({
        path: "nannyId",
        populate: {
          path: "userId",
          select: "name"
        }
      })
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    next(error);
  }
});

// ========================================
// GET ONE REVIEW
// ========================================

router.get("/:id", async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate("parentId", "name")
      .populate({
        path: "nannyId",
        populate: {
          path: "userId",
          select: "name"
        }
      });

    if (!review) {
      return res.status(404).json({
        error: "Review not found"
      });
    }

    res.json(review);
  } catch (error) {
    next(error);
  }
});

// ========================================
// UPDATE REVIEW
// ========================================

router.put("/:id", async (req, res, next) => {
  try {
    const { rating, comment } = req.body;

    // Only the parent who created the review
    // is allowed to update it.
    const review = await Review.findOne({
      _id: req.params.id,
      parentId: req.user.id
    });

    if (!review) {
      return res.status(404).json({
        error: "Review not found"
      });
    }

    review.rating = rating;
    review.comment = comment;

    await review.save();

    await review.populate([
      {
        path: "parentId",
        select: "name"
      },
      {
        path: "nannyId",
        populate: {
          path: "userId",
          select: "name"
        }
      }
    ]);

    res.json(review);
  } catch (error) {
    next(error);
  }
});

// ========================================
// DELETE REVIEW
// ========================================

router.delete("/:id", async (req, res, next) => {
  try {
    // Only the parent who created the review
    // is allowed to delete it.
    const review = await Review.findOneAndDelete({
      _id: req.params.id,
      parentId: req.user.id
    });

    if (!review) {
      return res.status(404).json({
        error: "Review not found"
      });
    }

    res.json({
      message: "Review deleted successfully"
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;