const router = require("express").Router();

const authRouter = require("./auth.routes");
const usersRouter = require("./users.routes");
const nanniesRouter = require("./nannies.routes");
const bookingsRouter = require("./bookings.routes");
const reviewsRouter = require("./reviews.routes");

router.use("/auth", authRouter);
router.use("/users", usersRouter);
router.use("/nannies", nanniesRouter);
router.use("/bookings", bookingsRouter);
router.use("/reviews", reviewsRouter);

module.exports = router;