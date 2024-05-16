const mongoose = require('mongoose');
const app = require('./app');
const dbConnection = require('./config/connection');
require('dotenv').config();

dbConnection();

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
});

const Tour = mongoose.model('Tour', tourSchema);

const testTour = new Tour({
  name: 'Happier',
  rating: 98,
  price: 9.7,
});

testTour.save().then((doc) => console.log(doc));

const port = process.env.PORT;
const host = process.env.HOST;

app.listen(port, host, () => {
  console.log(process.env.NODE_ENV);
  console.log(`Server running at http://${host}:${port}`);
});
