const express = require('express');

const {
  getOverview,
  getTourDetails,
  getLoginForm,
  getUserAccount,
  getSignupForm,
} = require('../../controllers/viewsController');
const { isLoggedIn, protector } = require('../../controllers/authController');

const {
  createBookingCheckout,
} = require('../../controllers/bookingController');

const router = express.Router();

router.route('/').get(createBookingCheckout, isLoggedIn, getOverview);
router.route('/tours/:slug').get(isLoggedIn, getTourDetails);

router.route('/login').get(getLoginForm);
router.route('/signup').get(getSignupForm);
router.route('/me').get(protector, getUserAccount);

module.exports = router;
