const express = require('express');
const reviewRouter = require('./reviewRouter');

const router = express.Router();

const {
  getAllTours,
  getTour,
  createdTour,
  updatedTour,
  deletedTour,
  topAliasTours,
  getTourStats,
  getMonthlyPlan,
  getToursWithin,
  getDistances,
  uploadTourImages,
  resizeTourImages,
} = require('../../controllers/toursController');

const { protector, restrictTo } = require('../../controllers/authController');

router.use('/:tourId/reviews', reviewRouter);
router.route('/tour-stats').get(getTourStats);
router.route('/top-5-cheap').get(topAliasTours, getAllTours);

// /tours-within/:distance/center/:latlng/unit/:unit
// /tours-within/200/center/81.768,-67.232/unit/:mi
router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(protector, getToursWithin);

// /distances/:latlng/unit/:unit
// /distances/81.768,-67.232/unit/:mi
router.route('/distances/:latlng/unit/:unit').get(protector, getDistances);

router
  .route('/')
  .get(getAllTours)
  .post(protector, restrictTo('lead-guide', 'admin'), createdTour);

router
  .route('/monthly-plan/:year')
  .get(protector, restrictTo('admin', 'lead-guide', 'guide'), getMonthlyPlan);

router
  .route('/:id')
  .get(getTour)
  .patch(
    protector,
    restrictTo('lead-guide', 'admin'),
    uploadTourImages,
    resizeTourImages,
    updatedTour,
  )
  .delete(protector, restrictTo('lead-guide', 'admin'), deletedTour);

module.exports = router;
