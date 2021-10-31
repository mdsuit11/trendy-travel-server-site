const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config()


const app = express();
const port =process.env.PORT ||  5000;

//  middlewar
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.njvzx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  async function run () {
        try{
            await client.connect();
            const database = client.db("naturalHelthCare");
            const servicesCollection = database.collection("services");
            const spachialCollection = database.collection("spachial");
            // GET ALL DATA ||| API
            app.get('/services', async(req, res)=> {
                const cursor = servicesCollection.find({});
                const services = await cursor.toArray();
                res.send(services);
            })

            // POST API
            app.post('/services', async (req, res)=> {
                const service = req.body;
                console.log('hit the post api', service);


                const result = await servicesCollection.insertOne(service);
                // res.send('post hited')
                res.json(result);
            })

            // home spachial service


            app.get('/spachial', async(req, res)=> {
                const cursor = spachialCollection.find({});
                const spachial = await cursor.toArray();
                res.send(spachial);
            })
            
            app.post('/spachial', async (req, res)=> {
                const spachial = req.body;
                console.log('hit the post api', spachial);


                const result = await spachialCollection.insertOne(spachial);
                // res.send('post hited')
                res.json(result);
            })

        }
        finally{
            // await client.close();
        }
  }
  run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('traveling this places')
});
app.listen(port, ()=>{
    console.log('success runnig port', port);
})

