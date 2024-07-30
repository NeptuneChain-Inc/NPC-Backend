const NPC_AccountManager = {
  Address: "0x6cE7c6b673e79e61e20E6580A9b0dfdFd6B3fd74",
  ABI: [
    // Standard Events
    "event AccountRegistered(string indexed accountID, string role, address txAddress)",
    "event AccountBlacklisted(string indexed accountID, bool isBlacklisted)",

    // Custom Functions
    "function verifyRole(string memory accountID, bytes32 role) public view returns (bool)",
    "function isRegistered(string memory accountID) public view returns (bool)",
    "function isNotBlacklisted(string memory accountID) public view returns (bool)",
    "function registerAccount(string memory accountID, string memory role, address txAddress) external",
    "function blacklistAccount(string memory accountID, bool status) external",
    "function getAccountData(string memory accountID) external view returns (tuple(string role, address txAddress, bool isBlacklisted, uint256 lastActive, bool registered))",
  ],
};

module.exports = { NPC_AccountManager };
