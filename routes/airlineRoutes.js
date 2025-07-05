const express = require("express");
const airlineController = require("../controllers/airlineController");
const { createAirline } = require("../controllers/airlineController");

const router = express.Router();

router.get("/", airlineController.getAllAirlines);
router.get("/:id", airlineController.getAirlineDetails);
router.get("/bicycle-policy/name/:name", airlineController.getBicyclePolicyByAirlineName);
router.get("/bicycle-policy/id/:id", airlineController.getBicyclePolicyByAirlineId);
router.post("/", airlineController.createAirline); // POST /api/airlines
router.post("/bulk", airlineController.createManyAirlines); // POST /api/airlines/bulk
router.delete("/:id", airlineController.deleteAirline); // DELETE /api/airlines/:id
router.put("/:id", airlineController.updateAirline); // PUT /api/airlines/:id

 

module.exports = router;



