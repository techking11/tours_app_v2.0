/* eslint-disable */

const stripe = Stripe(process.env.STRIPE_PUBLIC_KEY);
const { showAlert } = require("./alert");

exports.bookingTour = async function (tourId) {
  try {
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    showAlert(err.message, 'danger', 5000);
  }
};
