const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const AppSuccess = require('../utils/appSuccess');
const catchAsync = require('../utils/catchAsync');

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

exports.getAllTours = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Tour.find(), req.query)
    .filtering()
    .sorting()
    .limiting()
    .paginating();
  const tours = await features.query;
  if (tours.length > 0)
    return new AppSuccess(200, tours, tours.length).select(res);

  next(new AppError('Tours not found', 400));
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  if (tour) return new AppSuccess(200, tour).select(res);
  next(new AppError(`Tour invalid _id: ${req.params.id}`, 404));
});

exports.createdTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);
  return new AppSuccess(201, newTour).select(res);
});

exports.updatedTour = catchAsync(async (req, res, next) => {
  const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (updatedTour) return new AppSuccess(res, 200, updatedTour).select(res);
  next(new AppError(`Tour invalid _id: ${req.params.id}`, 404));
});

exports.deletedTour = catchAsync(async (req, res, next) => {
  const deletedTour = await Tour.findByIdAndDelete(req.params.id);
  if (deletedTour) return new AppSuccess(200, deletedTour).select(res);
  next(new AppError(`Tour invalid _id: ${req.params.id}`, 404));
});
