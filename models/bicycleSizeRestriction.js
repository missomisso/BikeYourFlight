const { ObjectId } = require("mongodb");
const { db } = require("../db");

// ✅ Get all restrictions for a specific airline
async function getByAirlineId(airlineId) {
  return await db.collection("bicycleSizeRestrictions").find({
    AirlineID: airlineId
  }).toArray();
}

// ✅ Add new restrictions
async function addRestrictions(AirlineID, MaxWeight, MaxLength, MaxWidth, MaxHeight) {
  console.log("🚀 Adding restrictions for AirlineID:", AirlineID);
  
  await db.collection("bicycleSizeRestrictions").insertOne({
    AirlineID,
    MaxWeight,
    MaxLength,
    MaxWidth,
    MaxHeight,
    createdAt: new Date()
  });
}

// ✅ Get a single restriction by _id
async function getRestrictionById(id) {
  return await db.collection("bicycleSizeRestrictions").findOne({
    _id: new ObjectId(id)
  });
}

// ✅ Delete restriction by _id
async function deleteRestriction(id) {
  await db.collection("bicycleSizeRestrictions").deleteOne({
    _id: new ObjectId(id)
  });
}

// ✅ Optional: Get by airline name (joins not native in MongoDB)
async function getByAirlineName(airlineName) {
  // First get the airline
  const airline = await db.collection("airlines").findOne({
    AirlineName: { $regex: new RegExp(airlineName, "i") }
  });

  if (!airline) {
    throw new Error(`No airline found named "${airlineName}"`);
  }

  // Then get restrictions by AirlineID
  return await getByAirlineId(airline._id.toString());
}

module.exports = {
  getByAirlineId,
  addRestrictions,
  getRestrictionById,
  deleteRestriction,
  getByAirlineName,
};
