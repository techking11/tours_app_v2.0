const Tour = require('../models/tourModel');
const {
  responseError,
  responseSuccess,
  responseSuccessTotal,
} = require('../services/responses');
const APIFeatures = require('../utils/apiFeatures');

exports.topAliasTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'ratingsAverage,price,name,defficulty,summary';
  next();
};

exports.getAllTours = async (req, res) => {
  try {
    const features = new APIFeatures(Tour.find(), req.query)
      .filtering()
      .sorting()
      .limiting()
      .paginating();
    const tours = await features.query;
    responseSuccessTotal(res, 200, tours);
  } catch (err) {
    responseError(res, 404, err.message);
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (tour) responseSuccess(res, 200, tour);
    else responseError(res, 404);
  } catch (err) {
    responseError(res, 404, err.message);
  }
};

exports.createdTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    responseSuccess(res, 201, newTour);
  } catch (err) {
    responseError(res, 400, err.message);
  }
};

exports.updatedTour = async (req, res) => {
  try {
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (updatedTour) responseSuccess(res, 200, updatedTour);
    else responseError(res, 404);
  } catch (err) {
    responseError(res, 400, err.message);
  }
};

exports.deletedTour = async (req, res) => {
  try {
    const deletedTour = await Tour.findByIdAndDelete(req.params.id);
    if (deletedTour) responseSuccess(res, 200, deletedTour);
    else responseError(res, 404);
  } catch (err) {
    responseError(res, 400, err.message);
  }
};
