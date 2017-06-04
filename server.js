// dependencies
var express = require("express");
var db = require("./db.js");
var bodyParser = require('body-parser');
require('body-parser-xml')(bodyParser);
var o2x = require('object-to-xml');
var xmlConverter = require("js2xmlparser");

//Create express app
var app = express()

//To parse the request body to json to use comment the line below
//app.use(bodyParser.json({ type: 'application/json' }));

//To parse the request body to xml to use comment the line above
app.use(bodyParser.xml({type: 'application/xml'}));

//Some route
app.get("/", function(req, res){
  res.json("id, 1234");
});

// GET route to get all customers
app.get("/customers/", function(req, res){
  var Customer = db.Mongoose.model('customers', db.CustomerSchema, 'customers');
  Customer.find({}).lean().exec(function(error, docs){
    res.json(docs);
    res.end();
  });
});

//GET a client by id
app.get("/customers/:id", function(req, res){
    var Customer = db.Mongoose.model('customers', db.CustomerSchema, 'customers');
    Customer.find({_id: req.params.id}).lean().exec(function(error, docs){
      res.json(docs);
      res.end();
    });
});

//DELETE customers
app.delete("/customers/:id", function(req, res, next){
  var Customer = db.Mongoose.model('customers', db.CustomerSchema, 'customers');
  Customer.find({_id: req.params.id}).remove(function(error){
    if(error){
      res.status(500).send(error.message);
      res.end();
    }
    res.json({sucess:true})
    res.end();
  });
})

app.put('/customers/:id', function (req, res, next) {
    var Customer = db.Mongoose.model('customers', db.CustomerSchema, 'customers');
    Customer.findOneAndUpdate({ _id: req.params.id }, req.body, { upsert: true }, function (err, doc) {
        if (err) {
            res.status(500).json({ error: err.message });
            res.end();
            return;
        }
        res.json(req.body);
        res.end();
    });
});

//POST create a new client
app.post("/customers/", function(req, res, next) {
  var Customer = db.Mongoose.model('customers', db.CustomerSchema, 'customers');
  var newClient = null;
  req.body.customers.customer.forEach(function(entry){
    console.log(entry.name);
    newClient = new Customer({
                      name: entry.name,
                      email: entry.email
                    });

    newClient.save(function(error){
      if(error){
        res.status(500).set('Content-Type', 'text/xml');
        res.send(o2x({
            '?xml version="1.0" encoding="utf-8"?' : null,
            response : error.message
        }));
        res.end();
        return;
      }
    });
  });
  var obj = { name: 'Paulo',
  email: 'paulo@gmail.com', _id: '593367597a98472556db94c6'}
  console.log(newClient);
  console.log(xmlConverter.parse("person", obj));

  res.set('Content-Type', 'text/xml');
  res.send(o2x({
      '?xml version="1.0" encoding="utf-8"?' : null,
      response : 'ok'
  }));
  res.end();
});

// Where your app will listen
app.listen(3000, function(){
  console.log("App is runnung on por 3000")
});
