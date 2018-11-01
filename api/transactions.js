const app = require('express')();
const server 	= require('http').Server(app);
const bodyParser = require('body-parser');
const Datastore = require('nedb');

const Inventory = require('./inventory');

app.use(bodyParser.json());

module.exports = app;

//create Database
const Transactions = new Datastore({
    filename: './server/databases/transactions.db',
    autoload: true
});

app.get("/", (req, res) => {
    res.send('Transactions API')
})

//GET all transactions
app.get("/all", (req, res) => {
    Transactions.find({}, (err, docs) => {
        res.send(docs)
    });
});

app.get("/limit", (req, res) => {
    let limit = parseInt(req.query.limit, 10)
    if(!limit) limit = 5;

    Transactions.find({}).limit(limit).sort({ date: -1 })
    .exec((err, docs) => {
        res.send(docs);
    });
});