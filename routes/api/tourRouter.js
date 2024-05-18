const express = require('express');

const tourRouter = express.Router();

const {
  getAllTours,
  getTour,
  createdTour,
  updatedTour,
  deletedTour,
  topAliasTours,
} = require('../../controllers/toursController');

tourRouter.route('/top-5-cheap').get(topAliasTours, getAllTours);
tourRouter.route('/').get(getAllTours).post(createdTour);
tourRouter.route('/:id').get(getTour).patch(updatedTour).delete(deletedTour);

module.exports = tourRouter;
