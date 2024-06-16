const fs = require('fs');
const { info, error } = require('console');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const Tour = require('../models/tourModel');
// const Review = require('../models/reviewModel');
// const User = require('../models/userModel');

dotenv.config();

// const DB = process.env.DATABASE.replace(
//   '<PASSWORD>',
//   process.env.DATABASE_PASSWORD,
// );
const DB = process.env.DATABASE_URI;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => info('DB connection successful!'));

// READ JSON FILE
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
// const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
// const reviews = JSON.parse(
//   fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'),
// );

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Tour.create(tours);
    // await User.create(users, { validateBeforeSave: false });
    // await Review.create(reviews);
    info('Data successfully loaded!');
  } catch (err) {
    error(err);
  }
  process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    // await User.deleteMany();
    // await Review.deleteMany();
    info('Data successfully deleted!');
  } catch (err) {
    error(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
