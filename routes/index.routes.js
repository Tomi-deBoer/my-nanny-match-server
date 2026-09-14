const router = require("express").Router();

const authRouter = require("./auth.routes");
const usersRouter = require("./users.routes");
const nanniesRouter = require("./nannies.routes");

router.use("/auth", authRouter);
router.use("/users", usersRouter);
router.use("/nannies", nanniesRouter);

module.exports = router;