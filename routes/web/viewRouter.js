const express = require('express');

const {
  getOverview,
  getTourDetails,
  getLoginForm,
  getUserAccount,
} = require('../../controllers/viewsController');
const { isLoggedIn, protector } = require('../../controllers/authController');

const viewRouter = express.Router();

viewRouter.route('/').get(isLoggedIn, getOverview);
viewRouter.route('/tours/:slug').get(isLoggedIn, getTourDetails);
viewRouter.route('/login').get(isLoggedIn, getLoginForm);
viewRouter.route('/me').get(protector, getUserAccount);

module.exports = viewRouter;
