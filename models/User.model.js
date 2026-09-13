const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
      trim: true
    },

    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true
    },

    phoneNr: {
      type: String,
      required: [true, "Phone number is required."],
      trim: true
    },

    password: {
      type: String,
      required: [true, "Password is required."]
    },

    role: {
      type: String,
      enum: ["parent", "nanny", "admin"],
      required: true
    }
  },
  {
    timestamps: true
  }
);

const User = model("User", userSchema);

module.exports = User;