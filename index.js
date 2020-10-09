const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mvzhf.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(process.env.DB_USER)
const port = 5000

const app = express()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());




const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true  });
client.connect(err => {
  const dataCollection = client.db("charity").collection("data");
  const eventsCollection = client.db("charity").collection("events");
  const addEventsCollection = client.db("charity").collection("addedEvents");
 
//   adding homepage data to mongodb server
    app.post('/addData', (req, res) => {
        const data = req.body;
        dataCollection.insertMany(data)
        .then(result => {
            res.send(result.insertedCount)
        })
    })


// loading homepage data to UI
    app.get('/events', (req, res) => {
        dataCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
    })


// sending registration data to server
    app.post('/addEvents', (req, res) => {
        const event = req.body;
        eventsCollection.insertOne(event)
        .then(result => {
            res.send(result.insertedCount > 0)
            console.log(result);
        })
    })


// Showing loggedInUser's information in UI
    app.get('/userEvent', (req, res) => {
        console.log(req.query.email);
        eventsCollection.find({email: req.query.email})
        .toArray((err, documents) => {
            res.send(documents)
        })
    })


// Sending added event data by admit to server
    app.post('/addedEvents', (req, res) => {
        const event = req.body;
        addEventsCollection.insertOne(event)
        .then(result => {
            res.send(result.insertedCount > 0)
            console.log(result);
        })
    })


// loading added events by admin to UI
    app.get('/adminEvents', (req, res) => {
        addEventsCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
    })


// Deleting an event from Server
app.delete('/delete/:id', (req, res) => {
    console.log(req.params.id);
    eventsCollection.deleteOne({ _id: ObjectId(req.params.id) })
    .then((result) => {
        res.send(result.deletedCount > 0);
    })

})

// server homepage
    app.get('/', (req, res) => {
        res.send('Volunteer Network Server')
    })
});

app.listen(process.env.PORT || port);