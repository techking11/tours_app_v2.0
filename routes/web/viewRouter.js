const express = require('express');

const {
  getOverview,
  getTourDetails,
} = require('../../controllers/viewsController');

const viewRouter = express.Router();

viewRouter.route('/').get(getOverview);
viewRouter.route('/tours/:slug').get(getTourDetails);

module.exports = viewRouter;
