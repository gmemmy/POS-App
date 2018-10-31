const app = require('express')();
const server = require('http').Server(app);
const bodyParser = require('body-parser');
const Datastore = require('nedb');
const async = require('async');

app.use(bodyParser.json());

module.exports = app;

//creates Database
const inventoryDB = new Datastore({
    filename: "./server/databases/inventory.db",
    autoload = true
});

//GET inventory
app.get("/", (req, res) => {
    res.send("Inventory API");
});

//GET a product from inventory by _id
app.get("/product/:productId", (req, res) => {
    if(!req.params.productId) {
        res.status(500).send("ID field is required.");
    } else {
      inventoryDB.findOne({ _id: req.params.productId }, (err, product) => {
         res.send(product);
      });
    }
});

//GET all inventory products
app.get("/products", (req, res) => {
   inventoryDB.find({}, (err, docs) => {
      console.log("sending inventory products");
      res.send(docs);
   });
});

//Create inventory product
app.post("/product", (req, res) => {
   let newProduct = req.body;

   inventoryDB.insert(newProduct, (err, product) => {
      if (err) res.status(500).send(err);
      else res.send(product)
   });
});

app.delete("/product/product:Id", (req, res) => {
   inventoryDB.remove({ _id: req.params.productId }, (err, numRemoved) => {
      if (err) res.status(500).send(err);
      else res.sendStatus(200);
   });
});

//Updates inventory product
app.put("/product", (req, res) => {
   let productId = req.body._id;

   inventoryDB.update({ _id: productId }, req.body, {}, (err, numReplaced, product) => {
      if (err) res.status(500).send(err);
      else res.sendStatus(200);
   });
})

