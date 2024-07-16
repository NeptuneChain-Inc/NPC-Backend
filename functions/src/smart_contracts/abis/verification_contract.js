const VerificationContract = {
    Address: '0xdac2EE591A69dAc5D7137e3089D844a356e60AB7',
    ABI: [
      // ERC721 Standard Functions
      "function balanceOf(address owner) view returns (uint256)",
      "function ownerOf(uint256 tokenId) view returns (address)",
      "function safeTransferFrom(address from, address to, uint256 tokenId)",
      "function transferFrom(address from, address to, uint256 tokenId)",
      "function approve(address to, uint256 tokenId)",
      "function getApproved(uint256 tokenId) view returns (address)",
      "function setApprovalForAll(address operator, bool _approved)",
      "function isApprovedForAll(address owner, address operator) view returns (bool)",
      "function name() view returns (string)",
      "function symbol() view returns (string)",
      "function tokenURI(uint256 tokenId) view returns (string)",
  
      // ERC721 Standard Events
      "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
      "event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)",
      "event ApprovalForAll(address indexed owner, address indexed operator, bool approved)",
  
      // Custom Functions
      "function getCreditTypes(uint256 tokenId) external view returns (string[] memory)",
      "function getCreditSupplyLimit(uint256 tokenId, string calldata creditType) external view returns (uint256)",
      "function submitAsset(string memory accountID, string memory assetID) external returns (uint256)",
      "function approveAsset(string memory accountID, string memory assetID, string[] memory creditTypes, uint256[] memory creditSupplyLimits) external",
      "function raiseDispute(string memory accountID, string memory assetID, string memory reason) external",
      "function resolveDispute(string memory accountID, uint256 disputeID, string memory solution, string memory status) external",
      "function setQTime(int256 newQTime) external",
      "function pause() external",
      "function unpause() external",
      "function emergencyWithdraw() external",
  
      // Custom Events
      "event CreditTypesUpdated(uint256 indexed tokenId, string[] creditTypes)",
      "event CreditSupplyLimitUpdated(uint256 indexed tokenId, string creditType, uint256 supplyLimit)",
      "event AssetSubmitted(uint256 id, string assetID, string accountID)",
      "event AssetVerified(uint256 id, string assetID, string accountID)",
      "event DisputeRaised(string assetID, uint256 disputeID, string reason, string accountID)",
      "event DisputeResolved(string assetID, uint256 disputeID, string solution, string accountID)"
  ]
  
}

module.exports = {VerificationContract};