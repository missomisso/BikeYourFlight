const { ObjectId } = require("mongodb");
const { db } = require("../db");

// ✅ Create a new passenger
async function createPassenger(data) {
  const result = await db.collection("passengers").insertOne({
    FullName: data.FullName,
    Email: data.Email,
    PhoneNumber: data.PhoneNumber,
    AirlineID: data.AirlineID,
    createdAt: new Date(),
  });

  return result.insertedId; // MongoDB _id
}

// ✅ Get a passenger with their airline info
async function getPassengerWithAirline(id) {
  // First: fetch passenger
  const passenger = await db.collection("passengers").findOne({
    _id: new ObjectId(id),
  });

  if (!passenger) {
    return null;
  }

  // Second: fetch airline
  const airline = await db.collection("airlines").findOne({
    _id: new ObjectId(passenger.AirlineID),
  });

  return {
    ...passenger,
    AirlineName: airline ? airline.AirlineName : null,
    BicyclePolicy: airline ? airline.BicyclePolicy : null,
  };
}

module.exports = {
  createPassenger,
  getPassengerWithAirline,
};
