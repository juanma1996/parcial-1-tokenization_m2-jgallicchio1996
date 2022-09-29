const { ethers } = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {

    console.log("---------------------------------------------------------------------------------------");
    console.log("-- Deploy contracts process start...");
    console.log("---------------------------------------------------------------------------------------");

    // Get Signer
    const [signer] = await ethers.getSigners();

    // Deploy contract
    const contractPath_ERC721 = "contracts/NFT_Floor.sol:NFT_Floor";
    const contractPath_ERC20 = "contracts/ERC20-M2.sol:ERC20_M2";

    const contractFactory_ERC721 = await ethers.getContractFactory(contractPath_ERC721, signer);
    const contractFactory_ERC20 = await ethers.getContractFactory(contractPath_ERC20, signer);

    /// --------------------------------------------------------------------------------------------------
    /// ToDo: Place your deploy code here and complete the deploy
    /// --------------------------------------------------------------------------------------------------
    const contractInstance_ERC721 = await contractFactory_ERC721.deploy();
    const contractInstance_ERC20 = await contractFactory_ERC20.deploy();

    /// --------------------------------------------------------------------------------------------------
    console.log("-- Contract ERC721 Address:", contractInstance_ERC721.address);
    console.log("-- Contract ERC720 Address:", contractInstance_ERC20.address);
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