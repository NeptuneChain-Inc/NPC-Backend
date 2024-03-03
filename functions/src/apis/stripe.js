const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-08-01",
});

/**
 * Creates a payment intent using the Stripe API.
 *
 * @param {Object} request_body - The request body containing the currency and amount.
 * @param {string} request_body.currency - The currency code (default: "USD").
 * @param {number} request_body.amount - The amount to be charged.
 * @returns {Object} - The payment intent client secret.
 * @throws {Error} - If there is an error creating the payment intent.
 */
const createPaymentIntent = async (request_body) => {
  try {
    const { currency = "USD", amount } = request_body || {};
    const paymentIntent = await stripe.paymentIntents.create({
      currency,
      amount,
      automatic_payment_methods: { enabled: true },
    });

    return {
      clientSecret: paymentIntent.client_secret,
    } || null;
  } catch (e) {
    throw e;
  }
};

const getPrice = async (params) => await stripe.prices.retrieve(params.priceID) || null;

module.exports = {
    createPaymentIntent,
    getPrice
}
