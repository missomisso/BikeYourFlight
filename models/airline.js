const { ObjectId } = require("mongodb");
const { db } = require("../db");

// ✅ Get all airlines
async function getAllAirlines() {
  return await db.airlines.find({}).toArray();
}

// ✅ Get airline by MongoDB _id
async function getAirlineById(id) {
  const airline = await db.airlines.findOne({ _id: new ObjectId(id) });
  if (!airline) throw new Error(`No airline found with ID ${id}`);
  return airline;
}

// ✅ Create a new airline
async function createAirline(data) {
  const result = await db.airlines.insertOne({
    AirlineName: data.AirlineName,
    IATA_Code: data.IATA_Code,
    ICAO_Code: data.ICAO_Code,
    BicyclePolicy: data.BicyclePolicy,
    createdAt: new Date()
  });

  return getAirlineById(result.insertedId);
}

// ✅ Search by name (partial match using regex)
async function getBicyclePolicyByAirlineName(name) {
  const airline = await db.airlines.findOne({
    AirlineName: { $regex: new RegExp(name, "i") }
  });

  if (!airline) throw new Error(`No airline found matching "${name}"`);
  return airline.BicyclePolicy;
}

// ✅ Get policy by ID
async function getBicyclePolicyByAirlineId(id) {
  const airline = await getAirlineById(id);
  return airline.BicyclePolicy;
}

// ✅ Delete airline only
async function deleteAirline(id) {
  const objId = new ObjectId(id);
  await db.airlines.deleteOne({ _id: objId });
}

// ✅ Update airline
async function updateAirline(id, data) {
  const objId = new ObjectId(id);

  const result = await db.airlines.updateOne(
    { _id: objId },
    {
      $set: {
        AirlineName: data.AirlineName,
        IATA_Code: data.IATA_Code,
        ICAO_Code: data.ICAO_Code,
        BicyclePolicy: data.BicyclePolicy,
        updatedAt: new Date(),
      },
    }
  );

  return result.modifiedCount > 0;
}

async function getAirlineByName(name) {
  return await db.collection("airlines").findOne({
    AirlineName: { $regex: new RegExp(name, "i") }
  });
}

module.exports = {
  getAllAirlines,
  getAirlineById,
  createAirline,
  getBicyclePolicyByAirlineName,
  getBicyclePolicyByAirlineId,
  deleteAirline,
  updateAirline,
  getAirlineByName
};
