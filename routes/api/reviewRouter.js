const express = require('express');

const {
  getAllReviews,
  createNewReview,
  deleteReview,
  updateReview,
  getReview,
  setTourUsersId,
} = require('../../controllers/reviewController');

const { protector, restrictTo } = require('../../controllers/authController');

const reviewRouter = express.Router({ mergeParams: true });

reviewRouter
  .route('/')
  .get(protector, getAllReviews)
  .post(protector, restrictTo('user'), setTourUsersId, createNewReview);

reviewRouter
  .route('/:id')
  .delete(deleteReview)
  .patch(updateReview)
  .get(getReview);

module.exports = reviewRouter;
