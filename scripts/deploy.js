const { ethers } = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {

    console.log("---------------------------------------------------------------------------------------");
    console.log("-- Deploy contracts process start...");
    console.log("---------------------------------------------------------------------------------------");
    const confirmations_number  =  1;
    // Get Signer
    const [signer] = await ethers.getSigners();
    provider = ethers.provider;

    // Constructor parameters
    const name = "LAND_TOKEN";
    const symbol = "LAND";
    const price = ethers.utils.parseEther("100");

    // Deploy contract
    const contractPath_ERC721 = "contracts/NFT_Floor.sol:NFT_Floor";
    const contractPath_ERC20 = "contracts/ERC20-M2.sol:ERC20_M2";

    // Deploy contract
    const contractFactory_ERC721 = await ethers.getContractFactory(contractPath_ERC721, signer);
    contract_ERC721 = await contractFactory_ERC721.deploy(name, symbol, price);
    
    const contractFactory_ERC20 = await ethers.getContractFactory(contractPath_ERC20, signer);
    contract_ERC20 = await contractFactory_ERC20.deploy(contract_ERC721.address);

    const tx_result = await provider.waitForTransaction(contract_ERC20.deployTransaction.hash, confirmations_number);
    if(tx_result.confirmations < 0 || tx_result === undefined) {
        throw new Error("Transaction failed");
    }

    /// --------------------------------------------------------------------------------------------------
    console.log("-- Contract ERC721 Address:", contract_ERC721.address);
    console.log("-- Contract ERC720 Address:", contract_ERC20.address);
    console.log("---------------------------------------------------------------------------------------");
    console.log("-- Contracts have been successfully deployed");
    console.log("---------------------------------------------------------------------------------------");
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });