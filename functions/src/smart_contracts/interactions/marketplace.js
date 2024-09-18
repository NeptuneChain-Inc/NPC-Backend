const { ethers } = require("ethers");
const { MarketplaceContract } = require("../abis/marketplace_contract");
const { ERC721 } = require("../abis/standards");
const {getNFTMetadata} = require("../../apis/alchemy");

const getMarketplaceInteractions = (signer) => {
  const contract = new ethers.Contract(
    MarketplaceContract.Address,
    MarketplaceContract.ABI,
    signer
  );
  const genBlock = Number(MarketplaceContract.GenesisBlock);
  return {
    contract: MarketplaceContract,
    Instance: contract,
    Functions: {
      Getters: {
        getListingFee: async () => {
          return await contract.listingFee();
        },
        getHighestBids: async (listingId) => {
          const { bidder, amount } = await contract.highestBids(listingId);
          return { bidder, bidAmount: ethers.formatEther(amount) };
        },
      },
      Seller: {
        approveAndListNFT: async (tokenAddress, tokenId, price, value) => {
          //First Check If Already Approved!!

          // Step 1: Approve the marketplace contract to transfer the NFT
          const nftContract = new ethers.Contract(
            tokenAddress,
            ERC721.ABI,
            signer
          );
          const approvalTx = await nftContract.approve(
            MarketplaceContract.Address,
            tokenId
          );
          await approvalTx.wait();

          // Step 2: List the NFT on the marketplace
          const listTx = await contract.listNFT(tokenAddress, tokenId, price, {
            value,
          });
          return await listTx.wait();
        },
        listNFT: async (tokenAddress, tokenId, price, value) => {
          console.log({ tokenAddress, tokenId, price, value });
          const tx = await contract.listNFT(tokenAddress, tokenId, price, {
            value,
          });
          return await tx.wait();
        },
        cancelListing: async (listingId) => {
          const tx = await contract.cancelListing(listingId);
          return await tx.wait();
        },
        acceptBid: async (listingId) => {
          const tx = await contract.acceptBid(listingId);
          return await tx.wait();
        },
      },
      Buyer: {
        buyNFT: async (listingId, value) => {
          const tx = await contract.buyNFT(listingId, { value });
          return await tx.wait();
        },
        placeBid: async (listingId, value) => {
          const tx = await contract.placeBid(listingId, { value });
          return await tx.wait();
        },
      },
    },
    Events: {
      listAvailableNFTs: async () => {
        try {
          // Fetch 'Listed' events within the limited block range
          const listedEvents = await contract.queryFilter(
            contract.filters.Listed(),
            genBlock
          );

          const listedNFTs = listedEvents.map((event) => ({
            block: event.blockNumber,
            listingId: Number(event.args.listingId),
            seller: event.args.seller,
            tokenAddress: event.args.tokenAddress,
            tokenId: Number(event.args.tokenId),
            price: ethers.formatEther(event.args.price),
          }));

          // Fetch all 'Sale' and 'ListingCancelled' events to find out which NFTs are no longer available
          const saleEvents = await contract.queryFilter(
            contract.filters.Sale(),
            genBlock
          );
          const cancelledEvents = await contract.queryFilter(
            contract.filters.ListingCancelled(),
            genBlock
          );
          const unavailableListingIds = new Set([
            ...saleEvents.map((event) => Number(event.args.listingId)),
            ...cancelledEvents.map((event) => Number(event.args.listingId)),
          ]);

          // Filter out NFTs that have been sold or cancelled
          const availableNFTs = listedNFTs.filter(
            (nft) => !unavailableListingIds.has(nft.listingId)
          );
          return Promise.all(
            availableNFTs.map(async (nft) => {
              const metadata = await getNFTMetadata(nft.tokenAddress, nft.tokenId) || {};
              console.log("metadata", metadata);
              const { name, symbol, tokenUri } = metadata || {};
              return {
                ...nft,
                name,
                symbol,
                uri: tokenUri || "neptunechain.io",
              };
            })
          );
        } catch (error) {
          throw error;
        }
      },
      getAllEvents: async (fromBlock = null, toBlock = "latest") => {
        try {
          // Retrieve all event types
          const listedEvents = await contract.queryFilter(
            contract.filters.Listed(),
            fromBlock || genBlock,
            toBlock
          );
          const saleEvents = await contract.queryFilter(
            contract.filters.Sale(),
            fromBlock || genBlock,
            toBlock
          );
          const listingCancelledEvents = await contract.queryFilter(
            contract.filters.ListingCancelled(),
            fromBlock || genBlock,
            toBlock
          );
          const bidPlacedEvents = await contract.queryFilter(
            contract.filters.BidPlaced(),
            fromBlock || genBlock,
            toBlock
          );
          const bidAcceptedEvents = await contract.queryFilter(
            contract.filters.BidAccepted(),
            fromBlock || genBlock,
            toBlock
          );
          const bidWithdrawnEvents = await contract.queryFilter(
            contract.filters.BidWithdrawn(),
            fromBlock || genBlock,
            toBlock
          );
          // Combine all events into a single array
          const allEvents = [
            ...listedEvents.map((event) => ({
              type: "Listing",
              block: event.blockNumber,
              listingId: Number(event.args.listingId),
              seller: event.args.seller,
              tokenAddress: event.args.tokenAddress,
              tokenId: Number(event.args.tokenId),
              price: ethers.formatEther(event.args.price),
            })),
            ...saleEvents.map((event) => ({
              type: "Sale",
              block: event.blockNumber,
              listingId: Number(event.args.listingId),
              buyer: event.args.buyer,
              tokenAddress: event.args.tokenAddress,
              tokenId: Number(event.args.tokenId),
              price: ethers.formatEther(event.args.price),
            })),
            ...listingCancelledEvents.map((event) => ({
              type: "Listing Cancelled",
              block: event.blockNumber,
              listingId: Number(event.args.listingId),
            })),
            ...bidPlacedEvents.map((event) => ({
              type: "Bid Placed",
              block: event.blockNumber,
              listingId: Number(event.args.listingId),
              bidder: event.args.bidder,
              amount: ethers.formatEther(event.args.amount),
            })),
            ...bidAcceptedEvents.map((event) => ({
              type: "Bid Accepted",
              block: event.blockNumber,
              listingId: Number(event.args.listingId),
              seller: event.args.seller,
              bidder: event.args.bidder,
              amount: ethers.formatEther(event.args.amount),
            })),
            ...bidWithdrawnEvents.map((event) => ({
              type: "Bid Withdrwan",
              block: event.blockNumber,
              user: event.args.user,
              amount: ethers.formatEther(event.args.amount),
            })),
          ];
          return allEvents;
        } catch (error) {
          throw error;
        }
      },
      filtered: {
        listed: async (fromBlock = null, toBlock = "latest") => {
          const listedEvents = await contract.queryFilter(
            contract.filters.Listed(),
            fromBlock || genBlock,
            toBlock
          );
          return listedEvents.map((event) => ({
            blockNumber: event.blockNumber,
            listingId: Number(event.args.listingId),
            seller: event.args.seller,
            tokenAddress: event.args.tokenAddress,
            tokenId: Number(event.args.tokenId),
            price: ethers.formatEther(event.args.price),
          }));
        },
        sale: async (fromBlock = null, toBlock = "latest") => {
          const saleEvents = await contract.queryFilter(
            contract.filters.Sale(),
            fromBlock || genBlock,
            toBlock
          );
          return saleEvents.map((event) => ({
            blockNumber: event.blockNumber,
            listingId: Number(event.args.listingId),
            buyer: event.args.buyer,
            tokenAddress: event.args.tokenAddress,
            tokenId: Number(event.args.tokenId),
            price: ethers.formatEther(event.args.price),
          }));
        },
        delisted: async (fromBlock = null, toBlock = "latest") => {
          const listingCancelledEvents = await contract.queryFilter(
            contract.filters.ListingCancelled(),
            fromBlock || genBlock,
            toBlock
          );
          return listingCancelledEvents.map((event) => ({
            blockNumber: event.blockNumber,
            listingId: Number(event.args.listingId),
          }));
        },
        bidded: async (fromBlock = null, toBlock = "latest") => {
          const bidPlacedEvents = await contract.queryFilter(
            contract.filters.BidPlaced(),
            fromBlock || genBlock,
            toBlock
          );
          return bidPlacedEvents.map((event) => ({
            blockNumber: event.blockNumber,
            listingId: Number(event.args.listingId),
            bidder: event.args.bidder,
            amount: ethers.formatEther(event.args.amount),
          }));
        },
        BidAccepted: async (fromBlock = null, toBlock = "latest") => {
          const bidAcceptedEvents = await contract.queryFilter(
            contract.filters.BidAccepted(),
            fromBlock || genBlock,
            toBlock
          );
          return bidAcceptedEvents.map((event) => ({
            blockNumber: event.blockNumber,
            listingId: Number(event.args.listingId),
            seller: event.args.seller,
            bidder: event.args.bidder,
            amount: ethers.formatEther(event.args.amount),
          }));
        },
        BidWithdrawn: async (fromBlock = null, toBlock = "latest") => {
          const bidWithdrawnEvents = await contract.queryFilter(
            contract.filters.BidWithdrawn(),
            fromBlock || genBlock,
            toBlock
          );
          return bidWithdrawnEvents.map((event) => ({
            blockNumber: event.blockNumber,
            user: event.args.user,
            amount: ethers.formatEther(event.args.amount),
          }));
        },
      },
    },
    Listeners: {
      onListed: (callback) => {
        contract.on(
          "Listed",
          (listingId, seller, tokenAddress, tokenId, price, event) => {
            // When an NFT is listed, this fires up.
            callback({
              listingId,
              seller,
              tokenAddress,
              tokenId,
              price,
              event,
            });
          }
        );
      },

      onSale: (callback) => {
        contract.on(
          "Sale",
          (listingId, buyer, tokenAddress, tokenId, price, event) => {
            // Sale event: when NFTs find their new home.
            callback({ listingId, buyer, tokenAddress, tokenId, price, event });
          }
        );
      },

      onListingCancelled: (callback) => {
        contract.on("ListingCancelled", (listingId, event) => {
          // Cancelled listing: It's not goodbye, it's see you later.
          callback({ listingId, event });
        });
      },

      onBidPlaced: (callback) => {
        contract.on("BidPlaced", (listingId, bidder, amount, event) => {
          // A new bid: The plot thickens in the NFT saga.
          callback({ listingId, bidder, amount, event });
        });
      },

      onBidAccepted: (callback) => {
        contract.on(
          "BidAccepted",
          (listingId, seller, bidder, amount, event) => {
            // Bid accepted: Let's shake on it, digitally!
            callback({ listingId, seller, bidder, amount, event });
          }
        );
      },
      onBidWithdrawn: (callback) => {
        contract.on("BidWithdrawn", (user, amount, event) => {
          callback({ user, amount, event });
        });
      },

      // Utility function to remove all listeners, because sometimes a clean slate is what you need.
      removeAllListeners: () => {
        contract.removeAllListeners();
      },
    },
  };
};

module.exports = { getMarketplaceInteractions };
