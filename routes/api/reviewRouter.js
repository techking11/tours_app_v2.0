const express = require('express');

const {
  getAllReviews,
  createNewReview,
} = require('../../controllers/reviewController');

const { protector, restrictTo } = require('../../controllers/authController');

const reviewRouter = express.Router();

reviewRouter
  .route('/')
  .get(protector, getAllReviews)
  .post(protector, restrictTo('user'), createNewReview);

module.exports = reviewRouter;
