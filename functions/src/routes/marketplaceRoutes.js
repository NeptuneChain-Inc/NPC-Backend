const express = require("express");
const { Marketplace } = require("../apis/marketplace");  // Assuming this is the path to the Marketplace object
const router = express.Router();

/**
 * @api {post} /marketplace/list_nft
 * @apiName ListNFT
 * @apiDescription Approve and List an NFT on the marketplace.
 * @apiGroup Marketplace
 *
 * @apiParam {String} tokenAddress - The contract address of the NFT.
 * @apiParam {String} tokenId - The ID of the NFT.
 * @apiParam {String} price - The price of the NFT.
 * @apiParam {String} value - Additional value for gas fees or listings.
 *
 * @apiSuccess {Object} receipt - Transaction receipt of the listing.
 *
 * @apiError {Object} error - Error message.
 */
router.post("/list_nft", async (req, res) => {
  try {
    const { tokenAddress, tokenId, price, value } = req.body;
    const receipt = await Marketplace.Seller.approveAndListNFT(
      tokenAddress,
      tokenId,
      price,
      value
    );
    return res.send({ receipt });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

/**
 * @api {post} /marketplace/cancel_listing
 * @apiName CancelListing
 * @apiDescription Cancel a listed NFT from the marketplace.
 * @apiGroup Marketplace
 *
 * @apiParam {String} listingId - The ID of the listing to cancel.
 *
 * @apiSuccess {Object} receipt - Transaction receipt of the cancellation.
 *
 * @apiError {Object} error - Error message.
 */
router.post("/cancel_listing", async (req, res) => {
  try {
    const { listingId } = req.body;
    const receipt = await Marketplace.Seller.cancelListing(listingId);
    return res.send({ receipt });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

/**
 * @api {post} /marketplace/buy_nft
 * @apiName BuyNFT
 * @apiDescription Buy an NFT from the marketplace.
 * @apiGroup Marketplace
 *
 * @apiParam {String} listingId - The ID of the NFT listing.
 * @apiParam {String} value - The value to pay for the NFT.
 *
 * @apiSuccess {Object} receipt - Transaction receipt of the purchase.
 *
 * @apiError {Object} error - Error message.
 */
router.post("/buy_nft", async (req, res) => {
  try {
    const { listingId, value } = req.body;
    const receipt = await Marketplace.Buyer.buyNFT(listingId, value);
    return res.send({ receipt });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

/**
 * @api {post} /marketplace/place_bid
 * @apiName PlaceBid
 * @apiDescription Place a bid on a listed NFT.
 * @apiGroup Marketplace
 *
 * @apiParam {String} listingId - The ID of the NFT listing.
 * @apiParam {String} value - The bid amount.
 *
 * @apiSuccess {Object} receipt - Transaction receipt of the bid.
 *
 * @apiError {Object} error - Error message.
 */
router.post("/place_bid", async (req, res) => {
  try {
    const { listingId, value } = req.body;
    const receipt = await Marketplace.Buyer.placeBid(listingId, value);
    return res.send({ receipt });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

/**
 * @api {post} /marketplace/accept_bid
 * @apiName AcceptBid
 * @apiDescription Accept a bid for an NFT listing.
 * @apiGroup Marketplace
 *
 * @apiParam {String} listingId - The ID of the NFT listing.
 *
 * @apiSuccess {Object} receipt - Transaction receipt of the accepted bid.
 *
 * @apiError {Object} error - Error message.
 */
router.post("/accept_bid", async (req, res) => {
  try {
    const { listingId } = req.body;
    const receipt = await Marketplace.Seller.acceptBid(listingId);
    return res.send({ receipt });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

/**
 * @api {get} /marketplace/get_listing_fee
 * @apiName GetListingFee
 * @apiDescription Get the current listing fee for the marketplace.
 * @apiGroup Marketplace
 *
 * @apiSuccess {Object} fee - The current listing fee.
 *
 * @apiError {Object} error - Error message.
 */
router.get("/get_listing_fee", async (req, res) => {
  try {
    const fee = await Marketplace.Getters.getListingFee();
    return res.send({ fee });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

/**
 * @api {post} /marketplace/get_highest_bids
 * @apiName GetHighestBids
 * @apiDescription Get the highest bids for a specific listing.
 * @apiGroup Marketplace
 *
 * @apiParam {String} listingId - The ID of the NFT listing.
 *
 * @apiSuccess {Object} highestBids - The highest bid details.
 *
 * @apiError {Object} error - Error message.
 */
router.post("/get_highest_bids", async (req, res) => {
  try {
    const { listingId } = req.body;
    const highestBids = await Marketplace.Getters.getHighestBids(listingId);
    return res.send({ highestBids });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

/**
 * @api {get} /marketplace/list_available_nfts
 * @apiName ListAvailableNFTs
 * @apiDescription List all available NFTs on the marketplace.
 * @apiGroup Marketplace
 *
 * @apiSuccess {Array} nfts - The available NFTs.
 *
 * @apiError {Object} error - Error message.
 */
router.get("/list_available_nfts", async (req, res) => {
  try {
    const nfts = await Marketplace.Getters.listAvailableNFTs();
    return res.send({ nfts });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

module.exports = router;
