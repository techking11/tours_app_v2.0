const mongoose = require('mongoose');
const { info } = require('console');
require('dotenv').config();

const DB = process.env.DATABASE_URI;
const dbConnection = () => {
  mongoose
    .connect(DB, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
    })
    .then(() => info('DB connection successful'));
};

module.exports = dbConnection;
