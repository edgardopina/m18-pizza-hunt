const { Schema, model } = require('mongoose'); //* import Schema ctor and model function
const dateFormat = require('../utils/dateFormat');

//! create Pizza schema
const PizzaSchema = new Schema(
   {
      pizzaName: { type: String },
      createdBy: { type: String },
      createdAt: {
         type: Date,
         default: Date.now(),
         //* define getter; each time we retrieve createdAt, it will be formatted by dateFormat()
         get: createdAtVal => dateFormat(createdAtVal),
      },
      size: { type: String, default: 'Large' },
      toppings: [],
      comments: [
         {
            type: Schema.Types.ObjectId,
            ref: 'Comment',
         },
      ],
   },
   {
      toJSON: {
         virtuals: true, //* enable mongoose virtuals for this schema
         getters: true, //* enable mongoose getters for this schema
      },
      id: false, //* mongoose virtuals do not need id
   }
);

//! get total count of comments and replies on retrieval
PizzaSchema.virtual('commentCount').get(function () {
   return this.comments.length;
});

//! create Pizza model using PizzaSchema
const Pizza = model('Pizza', PizzaSchema);

module.exports = Pizza; // exports the Pizza model
