const { ObjectId } = require("mongodb");
const BicycleSizeRestriction = require("../models/bicycleSizeRestriction");

// ✅ Add new restrictions
const addRestrictions = async (req, res) => {
  try {
    const { AirlineID, MaxWeight, MaxLength, MaxWidth, MaxHeight } = req.body;
    console.log("🚀 Adding restrictions for AirlineID:", AirlineID);

    if (!AirlineID) {
      return res.status(400).json({
        success: false,
        message: "AirlineID is required.",
      });
    }

    await BicycleSizeRestriction.addRestrictions(
      AirlineID,
      MaxWeight,
      MaxLength,
      MaxWidth,
      MaxHeight
    );

    res.status(201).json({ success: true, message: "Restrictions added successfully." });
  } catch (error) {
    console.error("❌ Error adding restrictions:", error);
    res.status(500).json({ success: false, message: "Error adding restrictions." });
  }
};

// ✅ Find restrictions by airline name
const findRestrictionsByAirlineName = async (req, res) => {
  try {
    const airlineName = req.params.name;
    const restrictions = await BicycleSizeRestriction.getByAirlineName(airlineName);

    if (restrictions.length > 0) {
      res.status(200).json({ success: true, data: restrictions });
    } else {
      res.status(404).json({ success: false, message: "No restrictions found for this airline." });
    }
  } catch (error) {
    console.error("❌ Error retrieving restrictions:", error);
    res.status(500).json({ success: false, message: "Error retrieving restrictions." });
  }
};

// ✅ Delete restriction by MongoDB _id
const deleteRestriction = async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid restriction ID.",
      });
    }

    const restrictionExists = await BicycleSizeRestriction.getRestrictionById(id);
    if (!restrictionExists) {
      return res.status(404).json({
        success: false,
        message: "Restriction not found.",
      });
    }

    await BicycleSizeRestriction.deleteRestriction(id);

    res.json({
      success: true,
      message: "Bicycle restriction deleted successfully!",
    });
  } catch (error) {
    console.error("❌ Error deleting restriction:", error);
    res.status(500).json({ success: false, message: "Error deleting restriction." });
  }
};

module.exports = {
  addRestrictions,
  findRestrictionsByAirlineName,
  deleteRestriction,
};
