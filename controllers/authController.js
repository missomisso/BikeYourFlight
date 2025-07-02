const User = require("../models/user");
const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET || "your-secret-key"; 


// Register User
const register = async (req, res) => {
    try {
        console.log("🚀 Received Registration Data:", req.body); // ✅ Log request data

        const { name, email, password } = req.body;

        // Check if email already exists
        const existingUser = await User.getUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ success: false, message: "Email already registered!" });
        }

        // Hash Password
        const bcrypt = require("bcryptjs");
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create New User
        const newUser = await User.registerUser(name, email, hashedPassword);

        console.log("✅ User Registered:", newUser);
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
        return res.status(405).json({ success: false, message: "Method Not Allowed. Use POST instead of GET." });
    }

    try {
        const { email, password } = req.body;
        console.log("Attempting to log in:", email);

        const user = await User.verifyUser(email, password);
        if (!user) {  
            console.log("Invalid credentials.");
            return res.status(401).json({ success: false, message: "Invalid credentials." });
        }

        console.log("User Verified, Generating JWT...");
        const token = jwt.sign({ userId: user.UserID, email: user.Email }, "your-secret-key", { expiresIn: "1h" });

        res.json({ success: true, message: "Login successful!", token });
    } catch (error) {
        console.error("Error in login:", error);
        res.status(500).json({ success: false, message: "Internal server error.", error: error.message });
    }
};


const authenticate = (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ success: false, message: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), secretKey);
        req.user = decoded; // Store user info for use in protected routes
        next(); // Continue to the next middleware or route handler
    } catch (error) {
        res.status(400).json({ success: false, message: "Invalid token." });
    }
};

module.exports = { register, login, authenticate };
