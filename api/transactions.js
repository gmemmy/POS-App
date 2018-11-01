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

app.get('/', (req, res) => {
    res.send('Transactions API')
})

//GET all transactions