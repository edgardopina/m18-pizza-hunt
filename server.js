const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(require('./routes'));

// get Mongoose connect when we start the app
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost/pizza-hunt', {
   // useFindAndModify: false,
   useNewUrlParser: true,
   useUnifiedTopology: true,
});
mongoose.set('debug', true); // log mongo queries being executed

app.listen(PORT, () => console.log(`🌍 Connected on localhost:${PORT}`));
