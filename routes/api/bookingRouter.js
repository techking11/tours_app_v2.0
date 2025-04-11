const express = require('express');

const { getCheckoutSession } = require('../../controllers/bookingController');

const { protector } = require('../../controllers/authController');

const router = express.Router();

router.route('/checkout-session/:tourId').get(protector, getCheckoutSession);

module.exports = router;
