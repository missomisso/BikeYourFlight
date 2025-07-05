const express = require("express");

const {
  searchFlights,
  getFlightOffers,
  bookFlight,
} = require("../controllers/searchController");

const router = express.Router();

router.get("/offers", getFlightOffers);
router.post("/book", bookFlight);
router.post("/search", searchFlights);

module.exports = router;
