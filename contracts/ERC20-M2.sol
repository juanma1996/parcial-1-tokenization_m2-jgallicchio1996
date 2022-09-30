//SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import "./NFT_Floor.sol";

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
        _isZeroAddress(_nftContract, "Invalid address");
        name = "ERC20_M2";
        symbol = "M2";
        decimals = 0;
        nftContract = _nftContract;
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
        _isZeroAddress(_to, "Invalid '_to' address");
        _isSenderAccount(msg.sender, _to, "Invalid recipient, same as remittent");
        _isZeroAmount(_m2, "Invalid _m2");
        _hasSufficientBalance(msg.sender, _m2);
        balanceOf[msg.sender] -= _m2;
        balanceOf[_to] += _m2;
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
        _isZeroAmount(_m2, "Invalid quantity");
        _isZeroAddress(_recipient, "Invalid _recipient address");
        if (msg.sender != nftContract) {
            revert("Not authorized");
        }
        totalSupply += _m2;
        balanceOf[_recipient] += _m2;
    }

    /**
     * @notice Allows assembling square meters in a new NFT_floors token
     * @dev Throw if `_quantity` is zero. Message: "Invalid quantity"
     * @dev Throw if sender account has insufficient tokens to assemble. Message: "Insufficient balance"
     * @param _quantity It is the number of tokens to assemble
     */
    function assemble(uint256 _quantity) external {
        _isZeroAmount(_quantity, "Invalid quantity");
        _hasSufficientBalance(msg.sender, _quantity);
        NFT_Floor(nftContract).mint(msg.sender, _quantity);
        balanceOf[msg.sender] -= _quantity;
        totalSupply -= _quantity;
    }

    /// -----------------------------------------------------------------------------------------------------------------
    /// PRIVATE FUNCTIONS
    /// -----------------------------------------------------------------------------------------------------------------

    function _isZeroAddress(address _address, string memory _errorMessage) private pure {
        if (_address == address(0)) {
            revert(_errorMessage);
        }
    }

    function _isSenderAccount(address _sender, address _address,string memory _errorMessage) private pure {
        if (_sender == _address) {
            revert(_errorMessage);
        }
    }

    function _isZeroAmount(uint256 _value, string memory _errorMessage) private pure {
        if (_value == 0) {
            revert(_errorMessage);
        }
    }

    function _hasSufficientBalance(address _address, uint256 _value) private view {
        if (balanceOf[_address] < _value) {
            revert("Insufficient balance");
        }
    }
}