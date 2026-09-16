const router = require("express").Router();

const Booking = require("../models/booking.model");
const NannyProfile = require("../models/nannyProfile.model");

// CREATE booking
router.post("/", async (req, res, next) => {
  try {
    const { nannyId, date, startTime, endTime, message } = req.body;

    const nanny = await NannyProfile.findById(nannyId);

    if (!nanny) {
      return res.status(404).json({
        error: "Nanny profile not found"
      });
    }

    const booking = await Booking.create({
      parentId: req.user.id,
      nannyId,
      date,
      startTime,
      endTime,
      message
    });

    res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
});


// READ all bookings for the logged-in parent
router.get("/", async (req, res, next) => {
  try {
    const bookings = await Booking.find({
      parentId: req.user.id
    })
      .populate("nannyId")
      .sort({ date: 1 });

    res.json(bookings);
  } catch (error) {
    next(error);
  }
});


// READ one booking
router.get("/:id", async (req, res, next) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      parentId: req.user.id
    }).populate("nannyId");

    if (!booking) {
      return res.status(404).json({
        error: "Booking not found"
      });
    }

    res.json(booking);
  } catch (error) {
    next(error);
  }
});


// UPDATE booking
router.put("/:id", async (req, res, next) => {
  try {
    const {
      date,
      startTime,
      endTime,
      message
    } = req.body;

    const booking = await Booking.findOne({
      _id: req.params.id,
      parentId: req.user.id
    });

    if (!booking) {
      return res.status(404).json({
        error: "Booking not found"
      });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({
        error: "Cancelled bookings cannot be updated."
      });
    }

    booking.date = date;
    booking.startTime = startTime;
    booking.endTime = endTime;
    booking.message = message;

    // If a confirmed booking is changed,
    // it needs to be confirmed again.
    if (booking.status === "confirmed") {
      booking.status = "pending";
    }

    await booking.save();

    await booking.populate("nannyId");

    res.json(booking);
  } catch (error) {
    next(error);
  }
});


// DELETE booking
router.delete("/:id", async (req, res, next) => {
  try {
    const booking = await Booking.findOneAndDelete({
      _id: req.params.id,
      parentId: req.user.id
    });

    if (!booking) {
      return res.status(404).json({
        error: "Booking not found"
      });
    }

    res.json({
      message: "Booking deleted successfully"
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;