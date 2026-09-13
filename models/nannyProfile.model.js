const { Schema, model } = require("mongoose");

const nannyProfileSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    experienceInYears: {
      type: Number,
      required: true,
      min: 0
    },

    hourlyRate: {
      type: Number,
      required: true,
      min: 0
    },

    skills: {
      type: [String],
      default: []
    },

    availability: {
      type: [Schema.Types.Mixed],
      default: []
    },

    isVerified: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const NannyProfile = model("NannyProfile", nannyProfileSchema);

module.exports = NannyProfile;