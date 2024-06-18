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

reviewRouter.use(protector);

reviewRouter
  .route('/')
  .get(getAllReviews)
  .post(restrictTo('admin', 'user'), setTourUsersId, createNewReview);

reviewRouter
  .route('/:id')
  .delete(restrictTo('admin'), deleteReview)
  .patch(restrictTo('admin'), updateReview)
  .get(getReview);

module.exports = reviewRouter;
