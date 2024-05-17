const express = require('express');

const tourRouter = express.Router();

const {
  getAllTours,
  getTour,
  createdTour,
  updatedTour,
  deletedTour,
} = require('../../controllers/toursController');

tourRouter.route('/').get(getAllTours).post(createdTour);
tourRouter.route('/:id').get(getTour).patch(updatedTour).delete(deletedTour);

module.exports = tourRouter;
