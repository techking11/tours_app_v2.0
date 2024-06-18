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
} = require('../../controllers/toursController');

const { protector, restrictTo } = require('../../controllers/authController');

tourRouter.use('/:tourId/reviews', reviewRouter);
tourRouter.route('/tour-stats').get(getTourStats);
tourRouter.route('/top-5-cheap').get(topAliasTours, getAllTours);
tourRouter.route('/').get(getAllTours).post(createdTour);
tourRouter
  .route('/monthly-plan/:year')
  .get(protector, restrictTo('user'), getMonthlyPlan);

tourRouter
  .route('/:id')
  .get(getTour)
  .patch(protector, restrictTo('lead-guide', 'admin'), updatedTour)
  .delete(protector, restrictTo('lead-guide', 'admin'), deletedTour);

module.exports = tourRouter;
