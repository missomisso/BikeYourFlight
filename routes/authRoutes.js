const express = require("express");
const router = express.Router();
const { register, login, authenticate } = require("../controllers/authController");

// ✅ Authentication Routes
router.post("/register", register); // POST request for user registration
router.post("/login", login); //  POST request for user login

module.exports = router;
