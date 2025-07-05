const express = require("express");
const bicycleSizeRestrictionController = require("../controllers/bicycleSizeRestrictionController");
const { addRestrictions } = require("../controllers/bicycleSizeRestrictionController");

const router = express.Router();

router.get("/name/:name", bicycleSizeRestrictionController.findRestrictionsByAirlineName); 
router.post("/", bicycleSizeRestrictionController.addRestrictions); // POST /api/restrictions
router.delete("/:id", bicycleSizeRestrictionController.deleteRestriction); // DELETE /api/restrictions/:id

module.exports = router;