var mongoose = require("mongoose");

// Connect Database mongoose
mongoose.connect('mongodb://localhost/api');

// Create Schema
var customerSchema = new mongoose.Schema({
  name : String,
  email : String
}, {collection: 'customer'}
);

// Export modules to use in another file. like = key, value
module.exports = {Mongoose: mongoose, CustomerSchema: customerSchema}
