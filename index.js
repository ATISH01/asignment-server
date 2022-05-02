const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { send } = require('express/lib/response');
require('dotenv').config();
const app = express();
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

//JWT Verification
/* function JWTVerification(req,res,next){
    const authHeaders=req.headers.authorize;
    if(!authHeaders){
        return res.status(401).send({message: "Access not valid"})
    }
    const token=authHeaders.split(' ')[1];
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,decoded)=>{
        if(err){
            return res.status(403).send({message: "Access not valid"});
        }
        console.log('decoded',decoded);
        req.decoded=decoded;
    })
    
    next();
} */



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uy572.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
    try{
        await client.connect();
        const itemsCollection = client.db('Electronics').collection('allItems');
        // get All Items
        app.get('/allItems',async(req,res)=>{
            const query ={};
            const cursor = itemsCollection.find(query);
            const items = await cursor.toArray();
            res.send(items)
        })
        //get single Item
        app.get('/allItems/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const singleItem = await itemsCollection.findOne(query);
            res.send(singleItem)
        })
        //update
        app.put('/allItems/:id', async(req, res) =>{
            const id = req.params.id;
            const updatedUser = req.body;
            const filter = {_id: ObjectId(id)};
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    quentity: updatedUser.quentity
                }
            };
            const result = await itemsCollection.updateOne(filter, updatedDoc, options);
            res.send(result);

        })

        //Delete items
        app.delete('/allItems/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)}
            const result = await itemsCollection.deleteOne(query);
            res.send(result)
        })
        //Add new Items
        app.post('/allItems',async(req,res)=>{
            const newItems = req.body;
            const result = await itemsCollection.insertOne(newItems);
            res.send(result);
        })
        // get user matched Items
        app.get('/myItems',async(req,res)=>{
            
            const email = req.query.email;
            console.log(email);
            const query = {email};
            const cursor = itemsCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })
        

    }
    finally{}
}
run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send('Running Server')
})
app.listen(port,()=>{
    console.log('Listening POrt',port);
})