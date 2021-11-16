const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
var admin = require("firebase-admin");
const ObjectId = require('mongodb').ObjectId;



const app = express();
const port =process.env.PORT ||  5000;

    // firebase addmin 
    var admin = require("firebase-admin");

var serviceAccount = require("./set-login-from-firebase-adminsdk-j0tj5-710ba377f1.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
//  middlewar
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.njvzx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


 async function varifyToken  (req, res, next){
    if(req.headers?.authorization?.startsWith('Bearer')) {
        const idToken = req.headers.authorization.split('Bearer')[1];
        try{
        const decodedUser = await admin.auth().verifyIdToken(idToken);
        req.decodedUserEmail = decodedUser.email;
        // console.log(decodedUser.email);
        }
        catch{

        }
       
    }
     next();
 }

  async function run () {
        try{
            await client.connect();
            const database = client.db("naturalHelthCare");
            const servicesCollection = database.collection("services");
            const spachialCollection = database.collection("spachial");
            const ordersCollection = database.collection('orders');
            // GET ALL DATA ||| API
            app.get('/services', async(req, res)=> {
                const cursor = servicesCollection.find({});
                const services = await cursor.toArray();
                res.send(services);
            })

            // POST API
            // app.post('/services', async (req, res)=> {
            //     const service = req.body;
            //     console.log('hit the post api', service);


            //     const result = await servicesCollection.insertOne(service);
            //     // res.send('post hited')
            //     res.json(result);
            // })
            
             /* 
             axios.delete(URL, {
  headers: {
    Authorization: authorizationToken
  },
  data: {
    source: source
  }
}); */

            // ---------------------
            // home spachial service
            // make home setup 6 service 
            // --------------------------

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
            });

            // Add products Orders Detiles
            // pabo
            app.get('/orders', varifyToken, async (req, res)=> {
                const email = req.query.email;
                if(req.decodedUserEmail === email){
                    const query = {email: email}
               
                    const cursor = ordersCollection.find(query);
                    const orders = await cursor.toArray();
                    res.json(orders)

                }
                else {
                    res.status(401).json({massage: 'user not authorization'})
                }
               
               
                
               
            })
            // pathano/ 
            // app.post('/orders' , asy)
            app.post('/orders', async (req, res) => {
                const order = req.body;
                const result = await ordersCollection.insertOne(order);
                console.log(result);
                res.json(result)
            }) 
                // pathabo
            app.get('/orders', async (req, res)=> {
                const cursor = ordersCollection.find();
                const order = await cursor.toArray();
                res.send(order);
            })
            // delete item
            app.delete('/orders/:id', async (req, res)=> {
                const id = req.params.id;
                const query = {_id: ObjectId(id)};
                const result = await ordersCollection.deleteOne(query);
                console.log(result);
                res.json(result)
              
              });

        }
        finally{
            // await client.close();
        }
  }
  run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('traveling this places server is running')
});
app.listen(port, ()=>{
    console.log('success runnig port', port);
})

