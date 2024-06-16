const express = require('express');

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

tourRouter.route('/monthly-plan/:year').get(getMonthlyPlan);
tourRouter.route('/tour-stats').get(getTourStats);
tourRouter.route('/top-5-cheap').get(topAliasTours, getAllTours);
tourRouter.route('/').get(getAllTours).post(createdTour);
tourRouter
  .route('/:id')
  .get(getTour)
  .patch(updatedTour)
  .delete(protector, restrictTo('lead-guide', 'admin'), deletedTour);

module.exports = tourRouter;
