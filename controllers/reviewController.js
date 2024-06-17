const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');

const {
  deleteOne,
  getAll,
  getOne,
  updateOne,
  createOne,
} = require('./handleFactory');

exports.setTourUsersId = catchAsync(async (req, res, next) => {
  // Allow the nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
});

exports.getAllReviews = getAll(Review);
exports.createNewReview = createOne(Review);
exports.getReview = getOne(Review);
exports.updateReview = updateOne(Review);
exports.deleteReview = deleteOne(Review);
