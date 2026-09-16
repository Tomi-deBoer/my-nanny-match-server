const { Schema, model } = require("mongoose");

const reviewSchema = new Schema(
  {
    parentId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    nannyId: {
      type: Schema.Types.ObjectId,
      ref: "NannyProfile",
      required: true
    },

    rating: {
      type: Number,
      required: [true, "Rating is required."],
      min: 1,
      max: 5
    },

    comment: {
      type: String,
      required: [true, "Comment is required."],
      trim: true,
      maxlength: 500
    }
  },
  {
    timestamps: true
  }
);

// A parent can review each nanny only once.
reviewSchema.index(
  { parentId: 1, nannyId: 1 },
  { unique: true }
);

const Review = model("Review", reviewSchema);

module.exports = Review;