//SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

/// @notice This contact partially follows the standard for ERC-20 fungible tokens.
/// Each token represents an indivisible square meter
/// @dev Comment follow the Ethereum ´Natural Specification´ language format (´natspec´)
/// Referencia: https://docs.soliditylang.org/en/v0.8.16/natspec-format.html
contract ERC20_M2 {

    /// STATE VARIABLES
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;

    address public nftContract;

    /// STATE MAPPINGS
    mapping(address => uint256) public balanceOf;

    /// @notice Initialize the state of the contract
    /// @dev Throw if `_nftContract` is the zero address, message: "Invalid address".
    /// @param _nftContract It is the NFT_Floor contract address
    constructor(address _nftContract) {
        // TODO: Implement method
        name = "ERC20_M2";
        symbol = "M2";
        decimals = 0;
    }

    /**
     * @notice Transfers `_m2` quantity of M2 tokens from sender balance to address `_to`.
     * @dev Throw if `_to` is zero address. Message: "Invalid '_to' address"
     * @dev Throw if `_to` is sender account. Message: "Invalid recipient, same as remittent"
     * @dev Throw if `_m2` is zero. Message: "Invalid _m2"
     * @dev Throw if remittent account has insufficient balance. Message: "Insufficient balance"
     * @param _to It is the recipient account address
     * @param _m2 It is the amount of tokens to transfer.
     */
    function transfer(address _to, uint256 _m2) external {
        // TODO: Implement method
    }

    /**
     * @notice Issues a new amount of tokens.
     * @dev Throw if msg.sender is not NFT_Floor contract. Message: "Not authorized"
     * @dev Throw if '_m2' is zero. Message: "Invalid quantity"
     * @dev Throw if `_recipient` is zero address. Message: "Invalid _recipient address"
     * @param _recipient It is the recipient account for the new tokens
     * @param _m2 It is the amount of tokens to mint
     */
    function mint(address _recipient, uint256 _m2) external {
        // TODO: Implement method
    }

    /**
     * @notice Allows assembling square meters in a new NFT_floors token
     * @dev Throw if `_quantity` is zero. Message: "Invalid quantity"
     * @dev Throw if sender account has insufficient tokens to assemble. Message: "Insufficient balance"
     * @param _quantity It is the number of tokens to assemble
     */
    function assemble(uint256 _quantity) external {
        // TODO: Implement method
    }
}