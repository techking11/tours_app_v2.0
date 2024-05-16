const fs = require('fs');

module.exports.tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../data/tours-simple.json`),
);
