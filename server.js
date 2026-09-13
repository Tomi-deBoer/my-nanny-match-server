//
// ℹ️ Loads environment variables from a .env file into process.env
//
try {
  process.loadEnvFile();
  console.log("MONGODB_URI:", process.env.MONGODB_URI);
} catch (error) {
  console.warn(".env file not found, using default environment values");
}


//
// Imports Express and initializes the server
//
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());


//
// ℹ️ Loads and applies global middleware
// CORS, JSON parsing, etc.
//
const config = require("./config");
config(app);


//
// ℹ️ Middleware that establishes a database connection
//
const connectDB = require("./db");

app.use(async (req, res, next) => {
  await connectDB();
  next();
});


//
// ℹ️ Test Route
// Can be left and used for waking up the server if idle
//
app.get("/", (req, res, next) => {
  res.json("All good in here");
});


//
// 🔐 Authentication middleware
// This is registered globally, so every request
// going through the routes below passes through it.
//
const authMiddleware = require("./middleware/auth.middleware");

app.use(authMiddleware);


//
// 👇 Defines and applies route handlers
//
const indexRouter = require("./routes/index.routes");

app.use("/api", indexRouter);


//
// ❗ Centralized error handling
// Must be placed after routes
//
const handleErrors = require("./errors");

handleErrors(app);


//
// ℹ️ Defines the server port
//
const PORT = process.env.PORT || 5005;

app.listen(PORT, () => {
  console.log(`Server listening. Local access on http://localhost:${PORT}`);
});