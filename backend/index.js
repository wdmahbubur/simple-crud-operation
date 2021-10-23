const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const dbUsername = "root";
const dbPassword = "root";

const uri = `mongodb+srv://${dbUsername}:${dbPassword}@cluster0.ni4ot.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });




async function run() {
    try {
        await client.connect();

        const database = client.db("crud");

        const collection = database.collection("users");

        ///GET Method
        app.get('/users', async (req, res) => {
            const data = collection.find({});
            const users = await data.toArray();
            res.send(users);
        })

        app.get('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const data = await collection.findOne(query);
            res.send(data);
        })


        //POST Method
        app.post('/user', async (req, res) => {
            const newUser = req.body;
            const result = await collection.insertOne(newUser);
            res.send(result.insertedId);

        })

        //UPDATE Method
        app.put('/user/update/:id', async (req, res) => {
            const id = req.params.id;
            const updateUser = req.body;
            const query = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: updateUser.name,
                    email: updateUser.email
                }
            }

            const result = await collection.updateOne(query, updateDoc, options)
            res.send(result);

        })

        //DELETE Method
        app.delete('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await collection.deleteOne(query);
            res.send(result);
        })

    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send("Crud Operation");
})

app.listen(port)