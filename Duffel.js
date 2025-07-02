require("dotenv").config(); // Load environment variables
const express = require("express"); // Import Express
const app = express(); // Initialize Express app
const PORT = process.env.PORT || 3000; // Use environment variable or default to 3000
const bodyParser = require("body-parser"); // Body parsing middleware
const cors = require("cors");
const { Duffel } = require("@duffel/api"); // Duffel API library
const { errorHandler } = require("./middlewares/errorMiddleware"); // Custom error handler
const { authenticate } = require("./controllers/authController");

// Route imports
const flightRoutes = require("./routes/flightRoutes"); // Flight routes
const airlineRoutes = require("./routes/airlineRoutes"); // Airline routes
const passengerRoutes = require("./routes/passengerRoutes"); // Passenger routes
const bicycleSizeRoutes = require("./routes/bicycleSizeRoutes"); // Bicycle size restriction routes
const authRoutes = require("./routes/authRoutes"); // Ensure correct path
console.log("✅ Auth Routes Loaded: ", authRoutes);

// Duffel API initialization
const duffel = new Duffel({
  token: process.env.DUFFEL_ACCESS_TOKEN,
});

// Middleware
app.use(cors());
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies
app.use(express.static("public")); // Serve static files from 'public' directory

// Routes
app.use("/api/airlines", airlineRoutes); // Airline routes
app.use("/api/flights", flightRoutes); // Flight routes
app.use("/api/passengers", passengerRoutes); // Passenger routes
app.use("/api/restrictions", bicycleSizeRoutes); // Bicycle size restriction routes
app.use("/api/auth", authRoutes); // Adds /register and /login

// Test route
app.get("/api/test", (req, res) => {
  res.status(200).json({ success: true, message: "Test route working!" });
});


app.get("/api/protected", authenticate, (req, res) => {
  res.json({ success: true, message: "You have access!", user: req.user });
});

// Error handling middleware
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Duffel API is running on http://localhost:${PORT}`);
});
