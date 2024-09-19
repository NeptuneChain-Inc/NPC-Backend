const express = require("express");
const { Marketplace } = require("../apis/marketplace");  // Assuming this is the path to the Marketplace object
const router = express.Router();

/**
 * @api {post} /marketplace/seller/list_nft
 * @apiName ListNFT
 * @apiDescription Approve and List an NFT on the marketplace.
 * @apiGroup MarketplaceSeller
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
router.post("/seller/list_nft", async (req, res) => {
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
 * @api {post} /marketplace/seller/cancel_listing
 * @apiName CancelListing
 * @apiDescription Cancel a listed NFT from the marketplace.
 * @apiGroup MarketplaceSeller
 *
 * @apiParam {String} listingId - The ID of the listing to cancel.
 *
 * @apiSuccess {Object} receipt - Transaction receipt of the cancellation.
 *
 * @apiError {Object} error - Error message.
 */
router.post("/seller/cancel_listing", async (req, res) => {
  try {
    const { listingId } = req.body;
    const receipt = await Marketplace.Seller.cancelListing(listingId);
    return res.send({ receipt });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

/**
 * @api {post} /marketplace/seller/accept_bid
 * @apiName AcceptBid
 * @apiDescription Accept a bid for an NFT listing.
 * @apiGroup MarketplaceSeller
 *
 * @apiParam {String} listingId - The ID of the NFT listing.
 *
 * @apiSuccess {Object} receipt - Transaction receipt of the accepted bid.
 *
 * @apiError {Object} error - Error message.
 */
router.post("/seller/accept_bid", async (req, res) => {
  try {
    const { listingId } = req.body;
    const receipt = await Marketplace.Seller.acceptBid(listingId);
    return res.send({ receipt });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

/**************************BUYER ROUTES************************************ */
/**
 * @api {post} /marketplace/buyer/buy_nft
 * @apiName BuyNFT
 * @apiDescription Buy an NFT from the marketplace.
 * @apiGroup MarketplaceBuyer
 *
 * @apiParam {String} listingId - The ID of the NFT listing.
 * @apiParam {String} value - The value to pay for the NFT.
 *
 * @apiSuccess {Object} receipt - Transaction receipt of the purchase.
 *
 * @apiError {Object} error - Error message.
 */
router.post("/buyer/buy_nft", async (req, res) => {
  try {
    const { listingId, value } = req.body;
    const receipt = await Marketplace.Buyer.buyNFT(listingId, value);
    return res.send({ receipt });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

/**
 * @api {post} /marketplace/buyer/place_bid
 * @apiName PlaceBid
 * @apiDescription Place a bid on a listed NFT.
 * @apiGroup MarketplaceBuyer
 *
 * @apiParam {String} listingId - The ID of the NFT listing.
 * @apiParam {String} value - The bid amount.
 *
 * @apiSuccess {Object} receipt - Transaction receipt of the bid.
 *
 * @apiError {Object} error - Error message.
 */
router.post("/buyer/place_bid", async (req, res) => {
  try {
    const { listingId, value } = req.body;
    const receipt = await Marketplace.Buyer.placeBid(listingId, value);
    return res.send({ receipt });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

/*******************GETTER ROUTES***************************************** */

/**
 * @api {get} /marketplace/get/listing_fee
 * @apiName GetListingFee
 * @apiDescription Get the current listing fee for the marketplace.
 * @apiGroup MarketplaceGet
 *
 * @apiSuccess {Object} fee - The current listing fee.
 *
 * @apiError {Object} error - Error message.
 */
router.post("/get/listing_fee", async (req, res) => {
  try {
    const fee = await Marketplace.Getters.getListingFee();
    return res.send({ fee });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

/**
 * @api {post} /marketplace/get/highest_bids
 * @apiName GetHighestBids
 * @apiDescription Get the highest bids for a specific listing.
 * @apiGroup MarketplaceGet
 *
 * @apiParam {String} listingId - The ID of the NFT listing.
 *
 * @apiSuccess {Object} highestBids - The highest bid details.
 *
 * @apiError {Object} error - Error message.
 */
router.post("/get/highest_bids", async (req, res) => {
  try {
    const { listingId } = req.body;
    const highestBids = await Marketplace.Getters.getHighestBids(listingId);
    return res.send({ highestBids });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

/*******************EVENT ROUTES ************************************ */



/**
 * @api {get} /marketplace/events/listings
 * @apiName ListAvailableNFTs
 * @apiDescription List all available NFTs on the marketplace.
 * @apiGroup MarketplaceEvents
 *
 * @apiSuccess {Array} nfts - The available NFTs.
 *
 * @apiError {Object} error - Error message.
 */
router.post("/events/listings", async (req, res) => {
  try {
    const nfts = await Marketplace.Events.listAvailableNFTs();
    return res.send({ nfts });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

/**
 * @api {get} /marketplace/events/all
 * @apiName GetAllMarketplaceEvents
 * @apiDescription Get all events on the marketplace.
 * @apiGroup MarketplaceEvents
 *
 * @apiSuccess {Array} events - event objects.
 *
 * @apiError {Object} error - Error message.
 */
router.post("/events/all", async (req, res) => {
  try {
    const events = await Marketplace.Events.getAllEvents();
    return res.send({ events });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

/**
 * @api {get} /marketplace/events/listed
 * @apiName GetListedMarketplaceEvents
 * @apiDescription Get listed events on the marketplace.
 * @apiGroup MarketplaceEvents
 *
 * @apiSuccess {Array} events - event objects.
 *
 * @apiError {Object} error - Error message.
 */
router.post("/events/listed", async (req, res) => {
  try {
    const { fromBlock, toBlock } = req.body;
    const events = await Marketplace.Events.filtered.listed(fromBlock, toBlock);
    return res.send({ events });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

/**
 * @api {get} /marketplace/events/sale
 * @apiName GetSaleMarketplaceEvents
 * @apiDescription Get sale events on the marketplace.
 * @apiGroup MarketplaceEvents
 *
 * @apiSuccess {Array} events - event objects.
 *
 * @apiError {Object} error - Error message.
 */
router.post("/events/sale", async (req, res) => {
  try {
    const { fromBlock, toBlock } = req.body;
    const events = await Marketplace.Events.filtered.sale(fromBlock, toBlock);
    return res.send({ events });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

/**
 * @api {get} /marketplace/events/delisted
 * @apiName GetDelistedMarketplaceEvents
 * @apiDescription Get delisted events on the marketplace.
 * @apiGroup MarketplaceEvents
 *
 * @apiSuccess {Array} events - event objects.
 *
 * @apiError {Object} error - Error message.
 */
router.post("/events/delisted", async (req, res) => {
  try {
    const { fromBlock, toBlock } = req.body;
    const events = await Marketplace.Events.filtered.delisted(fromBlock, toBlock);
    return res.send({ events });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

/**
 * @api {get} /marketplace/events/bidded
 * @apiName GetBiddedMarketplaceEvents
 * @apiDescription Get bidded events on the marketplace.
 * @apiGroup MarketplaceEvents
 *
 * @apiSuccess {Array} events - event objects.
 *
 * @apiError {Object} error - Error message.
 */
router.post("/events/bidded", async (req, res) => {
  try {
    const { fromBlock, toBlock } = req.body;
    const events = await Marketplace.Events.filtered.bidded(fromBlock, toBlock);
    return res.send({ events });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

/**
 * @api {get} /marketplace/events/bidAccepted
 * @apiName GetBidAcceptedMarketplaceEvents
 * @apiDescription Get bidAccepted events on the marketplace.
 * @apiGroup MarketplaceEvents
 *
 * @apiSuccess {Array} events - event objects.
 *
 * @apiError {Object} error - Error message.
 */
router.post("/events/bidAccepted", async (req, res) => {
  try {
    const { fromBlock, toBlock } = req.body;
    const events = await Marketplace.Events.filtered.bidAccepted(fromBlock, toBlock);
    return res.send({ events });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

/**
 * @api {get} /marketplace/events/bidWithdrwan
 * @apiName GetBidWithdrwanMarketplaceEvents
 * @apiDescription Get bidWithdrwan events on the marketplace.
 * @apiGroup MarketplaceEvents
 *
 * @apiSuccess {Array} events - event objects.
 *
 * @apiError {Object} error - Error message.
 */
router.post("/events/bidWithdrwan", async (req, res) => {
  try {
    const { fromBlock, toBlock } = req.body;
    const events = await Marketplace.Events.filtered.bidWithdrawn(fromBlock, toBlock);
    return res.send({ events });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

module.exports = router;
