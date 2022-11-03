const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

//middle ware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server is running for Fake Amazon Website')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.jjvuikj.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    const productsCollection = client.db('fakeAmazon').collection('products');

    try {
        app.get('/products', async (req, res) => {
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);
            console.log(page, size)
            const query = {};
            const cursor = productsCollection.find(query);
            const products = await cursor.skip(page * size).limit(size).toArray();
            const count = await productsCollection.estimatedDocumentCount();
            res.send({ count, products });
        });

        app.post('/productsByIds', async (req, res) => {
            const ids = req.body;
            console.log('ids should come here', ids);
            const objectIds = ids.map(id => ObjectId(id))
            const query = { _id: { $in: objectIds } }
            const cursor = productsCollection.find(query);
            const products = await cursor.toArray();
            res.send(products)
        })
    }
    finally {

    }


}
run().catch(err => console.log(err))

app.listen(port, () => {
    console.log(`Fake amazon server is running on ${port}`)
})
