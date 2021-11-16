const { Pizza } = require('../models/Pizza');
// const { Pizza } = require('../models');

const pizzaController = {
   //! get ALL pizzas - METHOD
   getAllPizza(req, res) {
      Pizza.find({})
         .then(dbPizzaData => res.json(dbPizzaData))
         .catch(err => {
            console.log(err);
            res.status(400).json(err);
         });
   },

   //! get ONE pizza by id - METHOD
   //* NOTE that we destructured params from req instead of passsing all req
   getPizzaById({ params }, res) {
      Pizza.findOne({ _id: params.id })
         .then(dbPizzaData => {
            if (!dbPizzaData) {
               res.status(404).json({ message: 'No pizza found with this id!' });
               return;
            }
            res.json(dbPizzaData);
         })
         .catch(err => {
            console.log(err);
            res.status(400).json(err);
         });
   },

   //! create pizza - METHOD
   //* NOTE that we destructured body from req instead of passsing all req
   //* MongoDB uses .insertOne() and .insertMany() methods
   //* Mongoose uses .create() to handle one or many inserts
   createPizza({ body }, res) {
      Pizza.create(body)
         .then(dbPizzaData => res.json(dbPizzaData))
         .catch(err => res.status(400).json(err));
   },

   //! update pizza by id - METHOD
   updatePizza({ params, body }, res) {
      Pizza.findOneAndUpdate(
         { _id: params.id },
         body,
         { new: true } //* return the updated version of the document
         //* the MongoDB and Mongoose methods .updateOne() and .updateMany(), update the doc without returning it
      )
         .then(dbPizzaData => {
            if (!dbPizzaData) {
               res.status(404).json({ message: 'No pizza found with this id!' });
               return;
            }
            res.json(dbPizzaData);
         })
         .catch(err => res.status(400).json(err));
   },

   //! delete pizza by id - METHOD
   deletePizza({ params }, res) {
      //* findOneAndDelete() returns more data than .deleteOne() and .deleteMany() methods
      Pizza.findOneAndDelete({ _id: params.id })
         .then(dbPizzaData => {
            if (!dbPizzaData) {
               res.status(404).json({ message: 'No pizza found with this id!' });
               return;
            }
            res.json(dbPizzaData);
         })
         .catch(err => {
            console.log(err);
            res.status(400).json(err);
         });
   },
};

module.exports = pizzaController;
