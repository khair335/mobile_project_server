const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = 5000;

// MongoDB URI
const uri = 'mongodb+srv://shahadathossain4536:V0944c3wdBVTGNK9@cluster0.nykjldb.mongodb.net/?retryWrites=true&w=majority';

// Connect to MongoDB
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    await client.connect();
        const brandName_collection = client
      .db("mobile_project")
      .collection("brandName");

      app.get("/brand-name", async (req, res) => {
      const brandName = await brandName_collection.find().toArray();
      console.log("brandName", brandName);
      res.send(brandName);
    });
  } finally {

  }
}
run().catch(console.dir);



// Define a simple route
app.get('/', (req, res) => {
  res.send('Hello, this is your Express.js server!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
