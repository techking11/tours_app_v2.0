const Tour = require('../models/tourModel');
const AppError = require('../utils/appError');
const AppSuccess = require('../utils/appSuccess');
const catchAsync = require('../utils/catchAsync');

const {
  updateOne,
  createOne,
  deleteOne,
  getOne,
  getAll,
} = require('./handleFactory');

exports.topAliasTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'ratingsAverage,price,name,defficulty,summary';
  next();
};

exports.getTourStats = catchAsync(async (req, res, next) => {
  const tourStats = await Tour.aggregate([
    { $match: { ratingsAverage: { $gte: 4.1 } } },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsAverage' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    { $sort: { price: 1 } },
  ]);
  if (tourStats.length > 0)
    return new AppSuccess(200, tourStats, tourStats.length).select(res);

  next(new AppError('Tour status not found', 404));
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const monthlyPlan = await Tour.aggregate([
    { $unwind: '$startDates' },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStats: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    { $addFields: { month: '$_id' } },
    { $project: { _id: 0 } },
    { $sort: { numTourStats: -1 } },
    { $limit: 10 },
  ]);
  if (monthlyPlan.length > 0)
    return new AppSuccess(200, monthlyPlan, monthlyPlan.length).select(res);

  next(new AppError(`Invalid year: ${req.params.year}`, 404));
});

exports.getAllTours = getAll(Tour);
exports.getTour = getOne(Tour, { path: 'reviews' });
exports.createdTour = createOne(Tour);
exports.updatedTour = updateOne(Tour);
exports.deletedTour = deleteOne(Tour);
