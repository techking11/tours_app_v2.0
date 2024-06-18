const express = require('express');
const reviewRouter = require('./reviewRouter');

const tourRouter = express.Router();

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
} = require('../../controllers/toursController');

const { protector, restrictTo } = require('../../controllers/authController');

tourRouter.use('/:tourId/reviews', reviewRouter);
tourRouter.route('/tour-stats').get(getTourStats);
tourRouter.route('/top-5-cheap').get(topAliasTours, getAllTours);

// /tours-within/:distance/center/:latlng/unit/:unit
// /tours-within/200/center/81.768,-67.232/unit/:mi
tourRouter
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(protector, getToursWithin);

tourRouter
  .route('/')
  .get(getAllTours)
  .post(protector, restrictTo('lead-guide', 'admin'), createdTour);

tourRouter
  .route('/monthly-plan/:year')
  .get(protector, restrictTo('admin', 'lead-guide', 'guide'), getMonthlyPlan);

tourRouter
  .route('/:id')
  .get(getTour)
  .patch(protector, restrictTo('lead-guide', 'admin'), updatedTour)
  .delete(protector, restrictTo('lead-guide', 'admin'), deletedTour);

module.exports = tourRouter;
