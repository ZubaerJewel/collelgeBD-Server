const express = require('express');
const cors = require('cors');
const app=express()
const port=process.env.PORT||5000;
require('dotenv').config()
// const colleges=require('./colleges.json')
const sixColleges=require('./sixCollege.json')

// middleware
app.use(cors())
app.use(express.json())



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.snwbd1q.mongodb.net/?retryWrites=true&w=majority`;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qrbm9en.mongodb.net/?retryWrites=true&w=majority`;
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

    const admissionCollection=client.db('collegeDB').collection('admission')
    const reviewCollection=client.db('collegeDB').collection('reviews')
    const threeCollection=client.db('collegeDB').collection('colleges')

    app.get('/allPost',async(req,res)=>{
      let query={}
      if(req.query?.email){
          query={email:req.query.email}
      }
      
      const result=await admissionCollection.find(query).toArray();
      res.send(result)
  });

    app.post('/addPost',async(req,res)=>{
      const add=req.body;
      const result=await admissionCollection.insertOne(add)
      res.send(result)
    });

    app.post('/addReview',async(req,res)=>{
      const add=req.body;
      const result=await reviewCollection.insertOne(add);
      res.send(result)
    });

    app.get('/getReview',async(req,res)=>{
      const result=await reviewCollection.find().toArray();
      res.send(result)
    })



//three collections
app.get('/threeCard',async(req,res)=>{
    const result=await threeCollection.find().toArray();
    res.send(result)
  });

  app.get('/threeCard/:id',async(req,res)=>{
    const id=req.params.id;
      const query={_id:new ObjectId(id)};
      const result=await threeCollection.findOne(query);
      res.send(result)

  })





    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);









// app.get('/colleges',(req,res)=>{
//     res.send(colleges)
// })
app.get('/sixCollege',(req,res)=>{
  res.send(sixColleges)
})

app.get('/',(req,res)=>{
    res.send('colleges Is running')
})

app.listen(port,()=>{
    console.log(`College is running on port: ${port}`)
})