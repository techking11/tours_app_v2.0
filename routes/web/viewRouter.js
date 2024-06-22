const express = require('express');

const {
  getOverview,
  getTourDetails,
  getLoginForm,
} = require('../../controllers/viewsController');
const { isLoggedIn } = require('../../controllers/authController');

const viewRouter = express.Router();
viewRouter.use('/', isLoggedIn);

viewRouter.route('/').get(getOverview);
viewRouter.route('/tours/:slug').get(getTourDetails);
viewRouter.route('/login').get(getLoginForm);

module.exports = viewRouter;
