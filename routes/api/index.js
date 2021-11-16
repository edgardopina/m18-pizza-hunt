//! this file imports all API routes to prefix their endpoint names and package them up
const router = require('express').Router();
const pizzaRoutes = require('./pizza-routes')



router.use('/pizzas', pizzaRoutes); // pre-fixes '/pizzas' to routes in pizzaRoutes.js

module.exports = router
