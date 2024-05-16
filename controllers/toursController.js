const fs = require('fs');
const { tours } = require('../models/toursModel');

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 200,
    requestedAt: req.requestTime,
    total: tours.length,
    message: 'Successfully retrived all tours',
    data: tours,
  });
};

exports.getTour = (req, res) => {
  const tour = tours.find((el) => el.id === req.params.id * 1);
  res.status(200).json({
    status: 200,
    requestedAt: req.requestTime,
    message: 'Successfully retrived tour',
    data: tour,
  });
};

exports.createdTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/data/tours-simple.json`,
    JSON.stringify(tours),
    () => {
      res.status(201).json({
        status: 201,
        requestedAt: req.requestTime,
        message: 'Successfully created new tour',
        data: newTour,
      });
    },
  );
};

exports.updatedTour = (req, res) => {
  res.status(200).json({
    status: 200,
    requestedAt: req.requestTime,
    message: 'Successfully updated tour',
    data: 'Updated tour',
  });
};

exports.deletedTour = (req, res) => {
  res.status(200).json({
    status: 204,
    requestedAt: req.requestTime,
    message: 'Successfully deleted tour',
    data: 'deleted tour',
  });
};
