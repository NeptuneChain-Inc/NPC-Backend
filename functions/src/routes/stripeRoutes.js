const express = require("express");

const router = express.Router();

const stripe = require("../apis/stripe");

/**
 * @api {get} /stripe/config
 * @apiName GetStripeConfig
 * @apiDescription Get Stripe Configuration
 * @apiGroup Stripe
 *
 * @apiSuccess {Object} result - Result object with publishableKey.
 * @apiError {Object} error - Error message.
 */
router.post("/config", (req, res) => {
  return res.send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});

/**
 * @api {post} /stripe/create/payment_intent
 * @apiName CreatePaymentIntent
 * @apiDescription Create Payment Intent
 * @apiGroup Stripe
 *
 * @apiParam {String} amount - Amount to charge.
 * @apiParam {String} currency - Currency of the charge.
 *
 * @apiSuccess {Object} payment_intent - Returns payment intent details
 *
 * @apiError {Object} error - Error message.
 */
router.post("/create/payment_intent", async (req, res) => {
  const { amount, currency, optional_params } = req.body;
  try {
    const payment_intent = await stripe.createPaymentIntent(amount, currency, optional_params);
    return res.send({ payment_intent });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

/**
 * @api {get} /stripe/get/price
 * @apiName GetStripePrice
 * @apiDescription Get Stripe Price
 * @apiGroup Stripe
 *
 * @apiParam {String} priceID - Price ID to retrieve.
 *
 * @apiSuccess {Object} price - Returns price details
 *
 * @apiError {Object} error - Error message.
 */
router.post("/get/price", async (req, res) => {
  const { priceID } = req.body;
  try {
    const price = await stripe.getPrice(priceID);
    return res.send({ price });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

module.exports = router;