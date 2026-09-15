const { Schema, model } = require("mongoose");

const bookingSchema = new Schema(
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

    date: {
      type: Date,
      required: true
    },

    startTime: {
      type: String,
      required: true,
      trim: true
    },

    endTime: {
      type: String,
      required: true,
      trim: true
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending"
    },

    message: {
      type: String,
      trim: true,
      maxlength: 500
    }
  },
  {
    timestamps: true
  }
);

const Booking = model("Booking", bookingSchema);

module.exports = Booking;