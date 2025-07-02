const Passenger = require("../models/passenger");
const Airlines = require("../models/airline");
const BicycleSizeRestriction = require("../models/bicycleSizeRestriction");

const createPassenger = async (req, res) => {
  try {
    const { FullName, Email, PhoneNumber, AirlineID } = req.body;

    // Validate required fields
    if (!FullName || !Email || !AirlineID) {
      return res.status(400).json({
        success: false,
        message: "FullName, Email, and AirlineID are required.",
      });
    }

    // Call the model to create a passenger
    const passengerId = await Passenger.createPassenger({
      FullName,
      Email,
      PhoneNumber,
      AirlineID,
    });

    // Fetch restrictions
    const restrictions = await BicycleSizeRestriction.getByAirlineId(AirlineID);

    res.status(201).json({
      success: true,
      data: { PassengerID: passengerId, restrictions },
    });
  } catch (error) {
    console.error("Error in createPassenger:", error.message);
    res.status(500).json({ success: false, message: "Error creating passenger." });
  }
};


module.exports = { createPassenger };
