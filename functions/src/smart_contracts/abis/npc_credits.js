const NeptuneChainCreditsContract = {
  Address: '0xb0Fa031F4da17bfC1E1CBC736f3942d17b820f23',
  ABI: [
      // ERC20 Standard Functions
      "function balanceOf(address account) view returns (uint256)",
      "function transfer(address recipient, uint256 amount) returns (bool)",
      "function approve(address spender, uint256 amount) returns (bool)",
      "function transferFrom(address sender, address recipient, uint256 amount) returns (bool)",
      "function allowance(address owner, address spender) view returns (uint256)",

      // ERC20 Standard Events
      "event Transfer(address indexed from, address indexed to, uint256 value)",
      "event Approval(address indexed owner, address indexed spender, uint256 value)",

      // Custom Functions
      "function issueCredits(string senderID, uint256 nftTokenId, string producer, string verifier, string creditType, uint256 amount) external returns (bool)",
      "function buyCredits(string accountID, string producer, string verifier, string creditType, uint256 amount, uint256 price) external",
      "function transferCredits(string senderID, string recipientID, string producer, string verifier, string creditType, uint256 amount, uint256 price) external",
      "function donateCredits(string senderID, string producer, string verifier, string creditType, uint256 amount) external",
      "function ownerOf(uint256 tokenId) external view returns (address)",
      "function getCreditTypes(uint256 tokenId) external view returns (string[] memory)",
      "function getCreditSupplyLimit(uint256 tokenId, string creditType) external view returns (uint256)",
      
      // Getter Functions
      "function getTotalCertificates() external view returns (int256)",
      "function getTotalSold() external view returns (int256)",
      "function isProducerRegistered(string producer) external view returns (bool)",
      "function isVerifierRegistered(string producer, string verifier) external view returns (bool)",
      "function getProducerVerifiers(string producer) external view returns (string[] memory)",
      "function getSupply(string producer, string verifier, string creditType) external view returns (uint256 issued, uint256 available, uint256 donated)",
      "function getCertificateById(int256 certificateId) external view returns (int256 id, string memory recipient, string memory producer, string memory verifier, string memory creditType, int256 balance, int256 price, uint256 timestamp)",
      "function getAccountCertificates(string accountID) external view returns (int256[] memory)",
      "function getAccountCreditBalance(string accountID, string producer, string verifier, string creditType) external view returns (uint256)",
      "function getCreditTypes() external view returns (string[] memory)",
      "function getProducers() external view returns (string[] memory)",
      "function getRecoveryDuration() external view returns (uint256)",

      // Custom Events
      "event CreditsIssued(string indexed producer, string verifier, string creditType, uint256 amount)",
      "event CreditsBought(string indexed accountID, string producer, string verifier, string creditType, uint256 amount, uint256 price)",
      "event CreditsTransferred(string indexed senderAccountID, string receiverAccountID, string producer, string verifier, string creditType, uint256 amount, uint256 price)",
      "event CreditsDonated(string indexed accountID, string producer, string verifier, string creditType, uint256 amount)",
      "event CertificateCreated(int256 indexed certificateId, string indexed accountID, string producer, string verifier, string creditType, uint256 balance)",
      "event TokensRecovered(string indexed accountID, uint256 amount)"
  ]
};

module.exports = { NeptuneChainCreditsContract };
