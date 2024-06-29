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

const router = express.Router({ mergeParams: true });

router.use(protector);

router
  .route('/')
  .get(getAllReviews)
  .post(restrictTo('admin', 'user'), setTourUsersId, createNewReview);

router
  .route('/:id')
  .delete(restrictTo('admin'), deleteReview)
  .patch(restrictTo('admin'), updateReview)
  .get(getReview);

module.exports = router;
