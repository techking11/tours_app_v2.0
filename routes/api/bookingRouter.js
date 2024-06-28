const express = require('express');

const { getCheckoutSession } = require('../../controllers/bookingController');

const { protector } = require('../../controllers/authController');

const bookingRouter = express.Router();

bookingRouter
  .route('/checkout-session/:tourId')
  .get(protector, getCheckoutSession);

module.exports = bookingRouter;
