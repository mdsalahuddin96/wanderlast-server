const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
const port = process.env.PORT;
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = process.env.MONGO_URI;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const db = client.db("wanderlastDB");
    const destinationColl = db.collection("destinations");
    const bookingColl = db.collection("bookings");
    app.get("/featuredDes", async (req, res) => {
      const result = await destinationColl.find().limit(5).toArray();
      res.json(result);
    });
    app.get("/destination", async (req, res) => {
      const result = await destinationColl.find().toArray();
      res.json(result);
    });
    app.get("/destinationDetails/:id", async (req, res) => {
      const { id } = req.params;
      const result = await destinationColl.findOne({ _id: new ObjectId(id) });
      res.json(result);
    });
    app.get("/mybookings/:id",async(req,res)=>{
      const {id}=req.params;
      const result=await bookingColl.find({userId:id}).toArray();
      res.json(result);
    })
    app.post("/addDestination", async (req, res) => {
      const destination = req.body;
      const result = await destinationColl.insertOne(destination);
      res.send(result);
    });
    app.post("/bookings", async (req, res) => {
      const data = req.body;
      const result = await bookingColl.insertOne(data);
      res.json(result);
    });
    app.patch("/updateDestination/:id", async (req, res) => {
      const { id } = req.params;
      const updatedData = req.body;
      const result = await destinationColl.updateOne(
        { _id: new ObjectId(id) },
        {
          $set: updatedData,
        },
      );
      res.json(result);
    });

    app.delete("/deleteDestination/:id", async (req, res) => {
      const { id } = req.params;
      const result = await destinationColl.deleteOne({ _id: new ObjectId(id) });
      res.json(result);
    });
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    // await client.close()
  }
}
run().catch(console.dir);

// app.get("/",(req,res)=>{
//   res.send("Hello from server")
// })

app.listen(port, () => {
  console.log(`Wanderlast-server listening on port ${port}`);
});
