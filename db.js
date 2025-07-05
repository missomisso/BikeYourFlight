// db.js
const { MongoClient } = require("mongodb");
const { uri } = require("./dbConfig");

const client = new MongoClient(uri);
let database;

async function connectDb() {
  try {
    await client.connect();
    // This will use the database name from your connection string
    database = client.db();
    console.log("✅ MongoDB connected.");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
}

// Safely get the connected db
function getDb() {
  if (!database) {
    throw new Error("❌ Database not initialized. Call connectDb() first.");
  }
  return database;
}

// Create a Proxy so you can call db.collectionName directly
module.exports = {
  connectDb,
  db: new Proxy(
    {},
    {
      get(_, collectionName) {
        return getDb().collection(collectionName);
      },
    }
  ),
};

