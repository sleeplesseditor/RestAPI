const express = require('express');
const bodyParser = require('body-parser');
const mongojs = require('mongojs');
const db = mongojs('catalog', ['products']);

const app = express();

const port = 3000;

app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Home
app.get('/', (req, res, next) => {
  res.send('Please use /api/products');
});

// Fetch All Products
app.get('/api/products', (req, res, next) => {
  db.products.find((err, docs) => {
    if(err){
      res.send(err);
    }
    console.log('Products Found...');
    res.json(docs);
  });
});

// Fetch Single Product
app.get('/api/products/:id', (req, res, next) => {
  db.products.findOne({_id: mongojs.ObjectId(req.params.id)}, (err, doc) => {
    if(err){
      res.send(err);
    }
    console.log('Product Found...');
    res.json(doc);
  });
});

// Add Product
app.post('/api/products', (req, res, next) => {
  db.products.insert(req.body, (err, doc) => {
    if(err){
      res.send(err);
    }
    console.log('Adding Product..');
    res.json(doc);
  });
});

// Update Product
app.put('/api/products/:id', (req, res, next) => {
  db.products.findAndModify({query: {_id: mongojs.ObjectId(req.params.id)},
    update:{
      $set:{
        name: req.body.name,
        category: req.body.category,
        details: req.body.details
      }},
      new: true }, (err, doc) => {
        if(err){
          res.send(err);
        }
        console.log('Updating Product...');
        res.json(doc);
      })
});

// Delete Product
app.delete('/api/products/:id', (req, res, next) => {
  db.products.remove({_id: mongojs.ObjectId(req.params.id)}, (err, doc) => {
    if(err){
      res.send(err);
    }
    console.log('Removing Product...');
    res.json(doc);
  });
});


app.listen(port, () => {
  console.log('Server started on port '+port);
});
