const { ethers } = require("ethers");

const getSigner = () => {
  const network =
    process.env.NETWORK_TYPE === "production" ? "mainnet" : "testnet";
  const rpc = process.env[`${network.toUpperCase()}_RPC`];
  const key = process.env.APP_WALLET_KEY;

  if (rpc && key) {
    try {
      const provider = new ethers.JsonRpcProvider(rpc);
      const wallet = new ethers.Wallet(key, provider);
      const signer = wallet.connect(provider);
      return signer;
    } catch (error) {
      throw error;
    }
  }

  return null;
};

module.exports = { getSigner };
