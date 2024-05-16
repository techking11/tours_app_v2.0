const express = require('express');

const tourRouter = express.Router();

const { checkId } = require('../../services/service');
const { checkBody } = require('../../middleware/chain');

tourRouter.param('id', checkId);

const {
  getAllTours,
  getTour,
  createdTour,
  updatedTour,
  deletedTour,
} = require('../../controllers/toursController');

tourRouter.route('/').get(getAllTours).post(checkBody, createdTour);
tourRouter.route('/:id').get(getTour).patch(updatedTour).delete(deletedTour);

module.exports = tourRouter;
