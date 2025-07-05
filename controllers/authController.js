const { registerUser, getUserByEmail, verifyUser } = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const secretKey = process.env.JWT_SECRET || "your-secret-key";

// Register User
const register = async (req, res) => {
  try {
    console.log("🚀 Received Registration Data:", req.body);
    const { name, email, password } = req.body;

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ success: false, message: "Email already registered!" });
    }

    // No need to hash manually here — your model handles it
    const userId = await registerUser(name, email, password);
    console.log("✅ User Registered:", userId);

    res.status(201).json({ success: true, message: "User registered successfully!" });
  } catch (error) {
    console.error("❌ Error in Registration:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error." });
  }
};

// Login User
const login = async (req, res) => {
  console.log("Login request received with method:", req.method);
  console.log("Request body:", req.body);

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method Not Allowed. Use POST." });
  }

  try {
    const { email, password } = req.body;
    console.log("Attempting to log in:", email);

    const user = await verifyUser(email, password);
    if (!user) {
      console.log("Invalid credentials.");
      return res.status(401).json({ success: false, message: "Invalid credentials." });
    }

    // ✅ Use user._id and user.email from Mongo
    const token = jwt.sign({ userId: user._id, email: user.email }, secretKey, { expiresIn: "1h" });

    res.json({ success: true, message: "Login successful!", token });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ success: false, message: "Internal server error.", error: error.message });
  }
};

// Auth Middleware
const authenticate = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ success: false, message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), secretKey);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ success: false, message: "Invalid token." });
  }
};

module.exports = { register, login, authenticate };
