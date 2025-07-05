const airline = require("../models/airline");
const bicycleSizeRestriction = require("../models/bicycleSizeRestriction");

// ✅ Get all airlines
const getAllAirlines = async (req, res) => {
  try {
    const airlines = await airline.getAllAirlines();
    res.status(200).json({ success: true, data: airlines });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error retrieving airlines." });
  }
};

// ✅ Get airline + bicycle restrictions by ID
const getAirlineDetails = async (req, res) => {
  try {
    const airlineId = req.params.id;
    const airlineData = await airline.getAirlineById(airlineId);
    if (!airlineData) {
      return res.status(404).json({ success: false, message: "Airline not found." });
    }

    const restrictions = await bicycleSizeRestriction.getByAirlineId(airlineId);
    res.status(200).json({ success: true, data: { airline: airlineData, restrictions } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error retrieving airline details." });
  }
};

// ✅ Find bicycle policy by airline name
const getBicyclePolicyByAirlineName = async (req, res) => {
  try {
    const airlineName = req.params.name;
    const bicyclePolicy = await airline.getBicyclePolicyByAirlineName(airlineName);
    res.status(200).json({ success: true, data: { airlineName, bicyclePolicy } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error retrieving bicycle policy." });
  }
};

// ✅ Get bicycle policy by airline MongoDB _id
const getBicyclePolicyByAirlineId = async (req, res) => {
  try {
    const airlineId = req.params.id;
    const bicyclePolicy = await airline.getBicyclePolicyByAirlineId(airlineId);
    res.status(200).json({ success: true, data: { airlineId, bicyclePolicy } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error retrieving bicycle policy." });
  }
};

// ✅ Create a new airline
const createAirline = async (req, res) => {
  try {
    const { AirlineName, IATA_Code, ICAO_Code, BicyclePolicy } = req.body;

    const newAirline = await airline.createAirline({
      AirlineName,
      IATA_Code,
      ICAO_Code,
      BicyclePolicy,
    });

    res.status(201).json({ success: true, data: newAirline });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error creating airline." });
  }
};

// ✅ Delete airline
const deleteAirline = async (req, res) => {
  try {
    const { id } = req.params;

    const airlineExists = await airline.getAirlineById(id);
    if (!airlineExists) {
      return res.status(404).json({ success: false, message: "Airline not found." });
    }

    await airline.deleteAirline(id);
    res.json({ success: true, message: "Airline deleted successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error deleting airline." });
  }
};

// ✅ Update airline
const updateAirline = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updated = await airline.updateAirline(id, updateData);

    if (!updated) {
      return res.status(404).json({ success: false, message: "Airline not found!" });
    }

    res.status(200).json({ success: true, message: "Airline updated successfully!" });
  } catch (error) {
    console.error("❌ Error updating airline:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error." });
  }
};

const createManyAirlines = async (req, res) => {
  try {
    const airlines = req.body;

    if (!Array.isArray(airlines) || airlines.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Request body must be a non-empty array of airlines."
      });
    }

    // Validate each item (optional)
    for (const airline of airlines) {
      if (!airline.AirlineName) {
        return res.status(400).json({
          success: false,
          message: "Each airline must have an AirlineName."
        });
      }
    }

    const result = await db.airlines.insertMany(
      airlines.map(a => ({
        AirlineName: a.AirlineName,
        IATA_Code: a.IATA_Code,
        ICAO_Code: a.ICAO_Code,
        BicyclePolicy: a.BicyclePolicy,
        createdAt: new Date()
      }))
    );

    res.status(201).json({
      success: true,
      insertedCount: result.insertedCount,
      ids: result.insertedIds
    });
  } catch (error) {
    console.error("Error bulk inserting airlines:", error);
    res.status(500).json({ success: false, message: "Error bulk inserting airlines." });
  }
};

module.exports = {
  getAllAirlines,
  getAirlineDetails,
  createAirline,
  getBicyclePolicyByAirlineName,
  getBicyclePolicyByAirlineId,
  deleteAirline,
  updateAirline,
  createManyAirlines
};
