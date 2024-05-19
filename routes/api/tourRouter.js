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

tourRouter.route('/monthly-plan/:year').get(getMonthlyPlan);
tourRouter.route('/tour-stats').get(getTourStats);
tourRouter.route('/top-5-cheap').get(topAliasTours, getAllTours);
tourRouter.route('/').get(getAllTours).post(createdTour);
tourRouter.route('/:id').get(getTour).patch(updatedTour).delete(deletedTour);

module.exports = tourRouter;
