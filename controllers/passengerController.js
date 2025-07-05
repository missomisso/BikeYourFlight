const { ObjectId } = require("mongodb");
const Passenger = require("../models/passenger");
const BicycleSizeRestriction = require("../models/bicycleSizeRestriction");

const createPassenger = async (req, res) => {
  try {
    const { FullName, Email, PhoneNumber, AirlineID } = req.body;

    if (!FullName || !Email || !AirlineID) {
      return res.status(400).json({
        success: false,
        message: "FullName, Email, and AirlineID are required.",
      });
    }

    if (!ObjectId.isValid(AirlineID)) {
      return res.status(400).json({
        success: false,
        message: "Invalid AirlineID format.",
      });
    }

    const passengerId = await Passenger.createPassenger({
      FullName,
      Email,
      PhoneNumber,
      AirlineID: new ObjectId(AirlineID),
    });

    const restrictions = await BicycleSizeRestriction.getByAirlineId(AirlineID);

    res.status(201).json({
      success: true,
      data: { PassengerID: passengerId, restrictions },
    });
  } catch (error) {
    console.error("Error in createPassenger:", error);
    res.status(500).json({ success: false, message: "Error creating passenger." });
  }
};

const getPassengerWithAirline = async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid passenger ID." });
    }

    const passenger = await Passenger.getPassengerWithAirline(id);

    if (!passenger) {
      return res.status(404).json({ success: false, message: "Passenger not found." });
    }

    res.json({ success: true, data: passenger });
  } catch (error) {
    console.error("Error fetching passenger:", error);
    res.status(500).json({ success: false, message: "Error fetching passenger." });
  }
};

module.exports = {
  createPassenger,
  getPassengerWithAirline,
};

