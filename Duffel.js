
require("dotenv").config(); // Load environment variables
const { db, connectDb } = require("./db");
const express = require("express"); // Import Express
const app = express(); // Initialize Express app
const PORT = process.env.PORT || 3000; // Use environment variable or default to 3000
const bodyParser = require("body-parser"); // Body parsing middleware
const cors = require("cors");
const { Duffel } = require("@duffel/api"); // Duffel API library
const { errorHandler } = require("./middlewares/errorMiddleware"); // Custom error handler
const { authenticate } = require("./controllers/authController");
console.log("MONGODB_URI:", process.env.MONGODB_URI);

// Middleware
app.use(cors());
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// ✅ Serve static files first
app.use(express.static("public"));

// Route imports

/* app.get("/", (req, res) => {
  res.send("✅ Server is working!");
});

app.get("/ping", (req, res) => {
  res.send("pong");
});

app.get("/api/test-insert-airline", async (req, res) => {
  await db.airlines.insertOne({
    AirlineName: "Debug Airline",
    createdAt: new Date(),
  });
  res.send("✅ Airline inserted.");
}); */

const flightRoutes = require("./routes/flightRoutes"); // Flight routes
const airlineRoutes = require("./routes/airlineRoutes"); // Airline routes
const passengerRoutes = require("./routes/passengerRoutes"); // Passenger routes
const bicycleSizeRoutes = require("./routes/bicycleSizeRoutes"); // Bicycle size restriction routes
const authRoutes = require("./routes/authRoutes"); // Ensure correct path
console.log("✅ Auth Routes Loaded: ", authRoutes);


app.get("/api/test-insert", async (req, res) => {
  await db.passengers.insertOne({
    FullName: "Debug User",
    createdAt: new Date()
  });
  res.send("Inserted test document.");
});


// Duffel API initialization
const duffel = new Duffel({
  token: process.env.DUFFEL_ACCESS_TOKEN,
});

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
connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Duffel API is running on http://localhost:${PORT}`);
  });
});