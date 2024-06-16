const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();

  res.status(200).json({
    status: 'success',
    total: reviews.length,
    data: reviews,
  });
});

exports.createNewReview = catchAsync(async (req, res, next) => {
  const newReviews = await Review.create(req.body);

  res.status(201).json({
    status: 'success',
    data: newReviews,
  });
});
