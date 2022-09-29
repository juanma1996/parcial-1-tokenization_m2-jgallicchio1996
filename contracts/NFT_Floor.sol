//SPDX-License-Identifier:MIT
pragma solidity 0.8.16;

import "./ERC20-M2.sol";

/// @notice This contract allow to mint, transfer and manage NFT 
/// representing square meters of buildings
/// @dev Comment follow the Ethereum ´Natural Specification´ language format (´natspec´)
/// Referencia: https://docs.soliditylang.org/en/v0.8.16/natspec-format.html
contract NFT_Floor {

    /// State variables
    string public name;         // Collection name
    string public symbol;       // Collection symbol
    uint8 public decimals;      // Number of decimals
    uint256 public totalSupply; // The total number of NFT minted
    uint256 public m2Price;     // Square meters price.

    address public owner;
    address public m2Contract;

    /// State mappings
    mapping(address => uint256) public balanceOf;   // NFT owner => amount of NFT
    mapping(uint256 => address) public ownerOf;     // tokenID => owner address
    mapping(uint256 => address) public allowance;   // tokenID => Authorised address
    mapping(uint256 => uint256) public floor;       // tokenID => Square meters

    /// modifiers
    /// ToDo: Place your modifiers here if you need any

    /// @notice Initialize the NFT collection
    /// @dev Throw if `_name` or '_symbol' are empry, message: "Name and symbol are mandatory parameters".
    ///  Throw if `_m2Price` is zero, message: "Invalid price".
    /// @param _name The name of the NFT collection
    /// @param _symbol The symbol of the NFT collection
    /// @param _m2Price Square meters price
    constructor(string memory _name, string memory _symbol, uint256 _m2Price) {
        /// ToDo: Place your code here
        decimals = 18;
    }

    /// @notice Mint a new floor NFT from the collection and assign the ownership to sender address.
    /// The sender must transfer at least the required amount of ethers to mint the required square meters, 
    /// otherwise throw with message "Insufficient amount"
    /// Each square meter minted should decrease the price by 2%
    /// @dev Throw if `_m2` is zero, message: "Invalid square meters".
    /// @param _m2 The square meters of the new floor
    function mint(uint256 _m2) external payable {
        /// ToDo: Place your code here
    }

    /// @notice Mint a new floor NFT from the collection and assign the ownership to '_to' address parameter.
    /// This method can only be invoked by the ERC-20 M2 contract, otherwise throw with message "Not authorized"
    /// Each square meter minted should decrease the price by 2%
    /// @dev Throw if `_to` is the zero address, message: "Invalid address".
    /// Throw if `_m2` is zero, message: "Invalid square meters".
    /// @param _to The address of new owner
    /// @param _m2 The square meters of the new floor
    function mint(address _to, uint256 _m2) external {
        /// ToDo: Place your code here
    }

    /// @notice Transfers the ownership of an NFT from address '_from' to address '_to'
    /// @dev Throw unless `msg.sender` is the current owner or an authorized address for the NFT. Message "Not authorized". 
    /// Throw if `_from` is not the current owner with message "Not the owner".
    /// Throw if `_to` is the zero address with "Invalid '_to' address". 
    /// Throw if `_tokenId` is not a valid NFT with "Invalid tokenId". Valid tokenId has metadata.
    /// Throw if `_from` and `_to` are the same address with "The _from and _to addresses must diverge".
    /// @param _from The current owner of the NFT
    /// @param _to The new owner
    /// @param _tokenId The NFT to transfer
    function safeTransferFrom(address _from, address _to, uint256 _tokenId) external {
        /// ToDo: Place your code here
    }

    /// @notice Change or reaffirm the approved address for an NFT
    /// @dev The zero address indicates there is no approved address.
    /// Throw unless `msg.sender` is the current NFT owner or an authorized address of the NFT. Message "Not authorized".
    /// Throw if `_tokenId` is not a valid NFT with "Invalid tokenId". Valid tokenId has metadata.
    /// @param _approved The new administrator of the NFT
    /// @param _tokenId The NFT to approve
    function approve(address _approved, uint256 _tokenId) external payable {
        /// ToDo: Place your code here
    }

    /// @notice Divide a floor NFT into the number of M2 tokens equal to the number of square meters of the floor and burn the floor NFT.
    /// Instructs the M2 contract to credit the number of tokens to the NFT owner.
    /// This operation has a cost of 30% of the price of the square meter per square meter burned. Error message "Insufficient amount".
    /// Each square meter burner should increase the price by 5%
    /// @dev Throw unless `msg.sender` is the current owner or an authorized address for the NFT. Message "Not authorized". 
    /// Throw if `_tokenId` is not a valid NFT with "Invalid tokenId". Valid tokenId has metadata.
    /// @param _tokenId The NFT to split
    function splitFloor(uint256 _tokenId) external payable {
        /// ToDo: Place your code here
    }

    /// @notice Allow only to the protocol owner to withdraw collected ether
    /// @dev Throw unless `msg.sender` is the owner of the protocol. Message "Not authorized". 
    /// @dev Throw if contract balance is zero. Message "Zero balance". 
    function withdraw() external {
        /// ToDo: Place your code here
    }

    /// @notice Set the ERC-20 M2 contract address
    /// @dev Throw unless `msg.sender` is the owner of the protocol. Message "Not authorized". 
    /// @dev Throw if '_m2ContractAddress' is zero address. Message "Invalid address".
    /// @dev Throw if '_m2ContractAddress' is not an smart contract. Message "EOA not allowed". 
    /// Function '_isSmartContractAddress' provided
    /// @dev Throw if the ERC-20 M2 contract address already been set. Message "M2 contract already set". 
    /// @param _m2ContractAddress The ERC-20 M2 contract address
    function setM2ContractAddress(address _m2ContractAddress) external {
        /// ToDo: Place your code here
    }

    /// -----------------------------------------------------------------------------------------------------------------
    /// PRIVATE FUNCTIONS
    /// -----------------------------------------------------------------------------------------------------------------
    
    /// @notice Validate if a given address is a smart contract
    /// @param _address The address to validate
    function _isSmartContractAddress(address _address) private view returns (bool) {
        bytes32 zeroAccountHash = 0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470;
        bytes32 codeHash;    
        assembly { codeHash := extcodehash(_address) }
        return (codeHash != zeroAccountHash && codeHash != 0x0);
    }
}