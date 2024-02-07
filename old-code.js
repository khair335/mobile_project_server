// V0944c3wdBVTGNK9
// shahadathossain4536

const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

app.use(express.json());
app.use(cors());

// mongodb+srv://shahadathossain4536:<password>@cluster0.nykjldb.mongodb.net/
const uri = `mongodb+srv://shahadathossain4536:V0944c3wdBVTGNK9@cluster0.nykjldb.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});


async function run() {
  try {
    await client.connect();

    const brandName_collection = client
      .db("mobile_project")
      .collection("brandName");

    app.get("/brand-name", async (req, res) => {

      const brandName = await brandName_collection.find();

      console.log("brandName", {brandName});

      // res.send(brandName);
    });



  } finally {
    await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("mobile project");
});

app.listen(port, () => {
  console.log(`Example app listening on port mobile project ${port}`);
});