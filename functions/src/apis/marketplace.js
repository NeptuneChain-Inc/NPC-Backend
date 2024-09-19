const { getMarketplaceInteractions } = require("../smart_contracts/interactions/marketplace");
const { getSigner } = require("./ethereum");
const { UserDB } = require("./database");

const signer = getSigner();
const marketplaceInteractions = getMarketplaceInteractions(signer);

/********************************** Marketplace Seller Functions ***********************************/

const handleApproveAndListNFT = async (tokenAddress, tokenId, price, value) => {
  try {
    const receipt = await marketplaceInteractions.Functions.Seller.approveAndListNFT(tokenAddress, tokenId, price, value);
    if (UserDB.get.marketplace.add.listing(tokenAddress, tokenId, receipt?.hash)) {
      return { receipt };
    }
    throw new Error("DB Not Updated!");
  } catch (error) {
    throw error;
  }
};

const handleCancelListing = async (listingId) => {
  try {
    const receipt = await marketplaceInteractions.Functions.Seller.cancelListing(listingId);
    if (UserDB.get.marketplace.update.cancel(listingId, receipt?.hash)) {
      return { receipt };
    }
    throw new Error("DB Not Updated!");
  } catch (error) {
    throw error;
  }
};

const handleAcceptBid = async (listingId) => {
  try {
    const receipt = await marketplaceInteractions.Functions.Seller.acceptBid(listingId);
    if (UserDB.get.marketplace.update.bidAccepted(listingId, receipt?.hash)) {
      return { receipt };
    }
    throw new Error("DB Not Updated!");
  } catch (error) {
    throw error;
  }
};

/********************************** Marketplace Buyer Functions ***********************************/

const handleBuyNFT = async (listingId, value) => {
  try {
    const receipt = await marketplaceInteractions.Functions.Buyer.buyNFT(listingId, value);
    if (UserDB.get.marketplace.add.purchase(listingId, receipt?.hash)) {
      return { receipt };
    }
    throw new Error("DB Not Updated!");
  } catch (error) {
    throw error;
  }
};

const handlePlaceBid = async (listingId, value) => {
  try {
    const receipt = await marketplaceInteractions.Functions.Buyer.placeBid(listingId, value);
    if (UserDB.get.marketplace.add.bid(listingId, receipt?.hash)) {
      return { receipt };
    }
    throw new Error("DB Not Updated!");
  } catch (error) {
    throw error;
  }
};

/********************************** Marketplace Getters ***********************************/

const handleGetListingFee = async () => {
  try {
    return await marketplaceInteractions.Functions.Getters.getListingFee();
  } catch (error) {
    throw error;
  }
};

const handleGetHighestBids = async (listingId) => {
  try {
    return await marketplaceInteractions.Functions.Getters.getHighestBids(listingId);
  } catch (error) {
    throw error;
  }
};

/*************************************MArketplace Events with filtering ****************************************** */
const listAvailableNFTs = async () => {
  try {
    return await marketplaceInteractions.Events.listAvailableNFTs();
  } catch (error) {
    throw error;
  }
}

const getAllEvents = async (fromBlock = null, toBlock = "latest") => {
  try {
    return await marketplaceInteractions.Events.getAllEvents(fromBlock, toBlock);
  } catch (error) {
    throw error;
  }
}

/**********FILTERS*********** */
const filterListedEvents = async (fromBlock = null, toBlock = "latest") => {
  return await marketplaceInteractions.Events.filtered.listed(fromBlock, toBlock);
}

const filterSaleEvents = async (fromBlock = null, toBlock = "latest") => {
  return await marketplaceInteractions.Events.filtered.sale(fromBlock, toBlock);
}

const filterDelistedEvents =  async (fromBlock = null, toBlock = "latest") => {
  return await marketplaceInteractions.Events.filtered.delisted(fromBlock, toBlock);
}

const filterBiddedEvents = async (fromBlock = null, toBlock = "latest") => {
  return await marketplaceInteractions.Events.filtered.bidded(fromBlock, toBlock);
}

const filterBidAccepted = async (fromBlock = null, toBlock = "latest") => {
  return await marketplaceInteractions.Events.filtered.BidAccepted(fromBlock, toBlock);
};

const filterBidWithdrawnEvents = async (fromBlock = null, toBlock = "latest") => {
  return await marketplaceInteractions.Events.filtered.BidWithdrawn(fromBlock, toBlock);
}

/********************************** Marketplace Event Listeners with Callbacks ***********************************/

const listenMarketplaceEvents = (callbacks = {}) => {
  const {
    onListed = () => {},     // Default no-op function if no callback is provided
    onSale = () => {},
    onBidPlaced = () => {},
    onBidAccepted = () => {},
    onListingCancelled = () => {},
  } = callbacks;

  // When an NFT is listed on the marketplace
  marketplaceInteractions.Listeners.onListed((event) => {
    const { listingId, seller, tokenAddress, tokenId, price } = event;
    // Example database update logic (you can customize this)
    UserDB.get.marketplace.add.listing(tokenAddress, tokenId, listingId, price, seller);
    // Call the provided callback
    onListed(event);
  });

  // When an NFT is sold on the marketplace
  marketplaceInteractions.Listeners.onSale((event) => {
    const { listingId, buyer, tokenAddress, tokenId, price } = event;
    UserDB.get.marketplace.update.sold(listingId, buyer, price);
    onSale(event);
  });

  // When a bid is placed on a listing
  marketplaceInteractions.Listeners.onBidPlaced((event) => {
    const { listingId, bidder, amount } = event;
    UserDB.get.marketplace.update.bidPlaced(listingId, bidder, amount);
    onBidPlaced(event);
  });

  // When a bid is accepted by the seller
  marketplaceInteractions.Listeners.onBidAccepted((event) => {
    const { listingId, seller, bidder, amount } = event;
    UserDB.get.marketplace.update.bidAccepted(listingId, bidder, amount);
    onBidAccepted(event);
  });

  // When a listing is cancelled
  marketplaceInteractions.Listeners.onListingCancelled((event) => {
    const { listingId } = event;
    UserDB.get.marketplace.update.cancel(listingId);
    onListingCancelled(event);
  });
};

const stopMarketplaceListeners = async () => {
  marketplaceInteractions.Listeners.removeAllListeners();
};

/********************************** Marketplace Object ***********************************/

const Marketplace = {
  Seller: {
    approveAndListNFT: handleApproveAndListNFT,
    cancelListing: handleCancelListing,
    acceptBid: handleAcceptBid,
  },
  Buyer: {
    buyNFT: handleBuyNFT,
    placeBid: handlePlaceBid,
  },
  Getters: {
    getListingFee: handleGetListingFee,
    getHighestBids: handleGetHighestBids,
  },
  Events: {
    listAvailableNFTs: listAvailableNFTs,
    getAllEvents: getAllEvents,
    filtered: {
      listed: filterListedEvents,
      sale: filterSaleEvents,
      delisted: filterDelistedEvents,
      bidded: filterBiddedEvents,
      bidAccepted: filterBidAccepted,
      bidWithdrawn: filterBidWithdrawnEvents
    }
  },
  Listeners: {
    startListening: listenMarketplaceEvents,
    stopListening: stopMarketplaceListeners,
    
  },
};

/********************************** Module Exports ***********************************/

module.exports = { Marketplace };


// Example: call Marketplace.Events.startListening() and pass in your custom callbacks for the events you're interested in:

// Marketplace.Events.startListening({
//   onListed: (event) => {
//     console.log("NFT Listed:", event);
//   },
//   onSale: (event) => {
//     console.log("NFT Sold:", event);
//   },
//   onBidPlaced: (event) => {
//     console.log("Bid Placed:", event);
//   },
//   onBidAccepted: (event) => {
//     console.log("Bid Accepted:", event);
//   },
//   onListingCancelled: (event) => {
//     console.log("Listing Cancelled:", event);
//   },
// });
