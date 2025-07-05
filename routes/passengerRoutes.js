const express = require("express");
const { createPassenger, getPassengerWithAirline } = require("../controllers/passengerController");

const router = express.Router();

router.post("/", createPassenger);           // POST /api/passengers
router.get("/:id", getPassengerWithAirline); // GET /api/passengers/:id

module.exports = router;
