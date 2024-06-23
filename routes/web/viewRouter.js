const express = require('express');

const {
  getOverview,
  getTourDetails,
  getLoginForm,
  getUserAccount,
  updatedUserData,
} = require('../../controllers/viewsController');
const { isLoggedIn, protector } = require('../../controllers/authController');

const viewRouter = express.Router();

viewRouter.route('/').get(isLoggedIn, getOverview);
viewRouter.route('/tours/:slug').get(isLoggedIn, getTourDetails);
viewRouter.route('/login').get(isLoggedIn, getLoginForm);
viewRouter.route('/me').get(protector, getUserAccount);

viewRouter.route('/update-user-data').post(protector, updatedUserData);

module.exports = viewRouter;
