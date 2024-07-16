const ERC20 = {
  ABI: [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function decimals() view returns (uint8)",
    "function totalSupply() view returns (uint256)",
    "function balanceOf(address _owner) view returns (uint256)",
    "function transfer(address _to, uint256 _value) returns (bool)",
    "function approve(address _spender, uint256 _value) returns (bool)",
    "function allowance(address _owner, address _spender) view returns (uint256)",
    "event Transfer(address indexed _from, address indexed _to, uint256 _value)",
    "event Approval(address indexed _owner, address indexed _spender, uint256 _value)",
  ],
};

const ERC721 = {
  ABI: [
    "function balanceOf(address _owner) view returns (uint256)",
    "function ownerOf(uint256 _tokenId) view returns (address)",
    "function safeTransferFrom(address _from, address _to, uint256 _tokenId, bytes data)",
    "function safeTransferFrom(address _from, address _to, uint256 _tokenId)",
    "function transferFrom(address _from, address _to, uint256 _tokenId)",
    "function approve(address _approved, uint256 _tokenId)",
    "function getApproved(uint256 _tokenId) view returns (address)",
    "function setApprovalForAll(address _operator, bool _approved)",
    "function isApprovedForAll(address _owner, address _operator) view returns (bool)",
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function tokenURI(uint256 _tokenId) view returns (string)",
    "event Transfer(address indexed _from, address indexed _to, uint256 indexed _tokenId)",
    "event Approval(address indexed _owner, address indexed _approved, uint256 indexed _tokenId)",
    "event ApprovalForAll(address indexed _owner, address indexed _operator, bool _approved)",
  ],
};

module.exports = { ERC20, ERC721 };
