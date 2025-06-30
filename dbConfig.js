module.exports = {
  uri: process.env.MONGODB_URI || "mongodb://localhost:27017/Bicycle",
};
// This file exports the MongoDB URI for connecting to the database.
// It uses an environment variable for the URI, falling back to a default if not set.


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://laurentmisso:<MyFamily6!>@bikeyourflight.c3mb7cl.mongodb.net/?retryWrites=true&w=majority&appName=BikeYourFlight";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
// This code connects to a MongoDB database using the MongoDB Node.js driver.
// It uses a connection string with the database name and credentials.