const mongoose = require('mongoose');
require('dotenv').config();

const DB = process.env.DATABASE_URI;
const dbConnection = () => {
  mongoose
    .connect(DB, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
    })
    .then(() => console.log('DB connection successful'));
};
module.exports = dbConnection;
