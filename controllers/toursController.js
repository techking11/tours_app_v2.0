const Tour = require('../models/tourModel');
const { responseError, responseSuccess } = require('../services/utils');

exports.getAllTours = async (req, res) => {
  try {
    const queryObj = { ...req.query };
    const extendedFields = ['limit', 'sort', 'page', 'fields', 'offset'];
    extendedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = Tour.find(JSON.parse(queryStr));
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else query = query.sort('-createdAt');

    if (req.query.fields) {
      const fieldsBy = req.query.fields.split(',').join(' ');
      query = query.select(fieldsBy);
    } else query = query.select('-__v');
    const tours = await query;

    res.status(200).json({
      status: 'success',
      total: tours.length,
      data: tours,
    });
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
