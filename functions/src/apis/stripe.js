const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-08-01",
});

/**
 * Creates a payment intent using the Stripe API.
 *
 * @param {string} currency - The currency code (default: "USD").
 * @param {number} amount - The amount to be charged.
 * @returns {Object} - The payment intent client secret.
 * @throws {Error} - If there is an error creating the payment intent.
 */
const createPaymentIntent = async (amount, currency = "usd", optional_params = {}) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      currency: currency?.toLowerCase(),
      amount,
      automatic_payment_methods: { enabled: true },
      ...optional_params
    });

    return {
      clientSecret: paymentIntent.client_secret,
    } || null;
  } catch (e) {
    throw e;
  }
};

const getPrice = async (priceID) => await stripe.prices.retrieve(priceID) || null;

module.exports = {
    createPaymentIntent,
    getPrice
}
