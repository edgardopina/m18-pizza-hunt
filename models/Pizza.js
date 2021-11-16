const { Schema, model } = require('mongoose'); // import Schema ctor and model function

// create Pizza schema
const PizzaSchema = new Schema({
   pizzaName: { type: String },
   createdBy: { type: String },
   createdAt: { type: Date, default: Date.now() },
   size: { type: String, default: 'Large' },
   toppings: [],
});

// create Pizza model using PizzaSchema
const Pizza = model('Pizza', PizzaSchema);

module.exports = Pizza; // exports the Pizza model
