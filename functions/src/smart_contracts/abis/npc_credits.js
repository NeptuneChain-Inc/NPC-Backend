const NeptuneChainCreditsContract = {
  Address: '0xb0503d32A0649F046a2537b2Ea1c710C30d1DEb6',
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
      "function issueCredits(string memory senderID, uint256 nftTokenId, string memory producer, string memory verifier, string memory creditType, uint256 amount) external returns (bool)",
      "function buyCredits(string memory accountID, string memory producer, string memory verifier, string memory creditType, uint256 amount, uint256 price) external",
      "function transferCredits(string memory senderID, string memory recipientID, string memory producer, string memory verifier, string memory creditType, uint256 amount, uint256 price) external",
      "function donateCredits(string memory senderID, string memory producer, string memory verifier, string memory creditType, uint256 amount) external",
      "function ownerOf(uint256 tokenId) external view returns (address)",
      "function getCreditTypes(uint256 tokenId) external view returns (string[] memory)",
      "function getCreditSupplyLimit(uint256 tokenId, string calldata creditType) external view returns (uint256)",

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
