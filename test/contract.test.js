/// --------------------------------------------------------------------------------------------------
/// ToDo: Place your marketplace contract test code here
/// --------------------------------------------------------------------------------------------------
/// --------------------------------------------------------------------------------------------------
/// ToDo: Place your marketplace contract test code here
/// --------------------------------------------------------------------------------------------------
const { ethers } = require("hardhat");
const chai = require("chai");
const { solidity } = require( "ethereum-waffle");
const { sign } = require("crypto");
chai.use(solidity);
const { expect } = chai;

const contractPath_ERC721 = "contracts/NFT_Floor.sol:NFT_Floor";
const contractPath_ERC20 = "contracts/ERC20-M2.sol:ERC20_M2";

const confirmations_number  =  1;
const zeroAddress = '0x0000000000000000000000000000000000000000';
let signer, account1, account2, account3, account4;
let contract_ERC721, contract_ERC20, provider;

// Constructor parameters
const name = "LAND_TOKEN";
const symbol = "LAND";
const price = ethers.utils.parseEther("100");

describe("Contract tests", () => {
    before(async () => {
        console.log("-----------------------------------------------------------------------------------");
        console.log(" -- Contract tests start");
        console.log("-----------------------------------------------------------------------------------");

        // Get Signer and provider
        [signer, account1, account2, account3, account4] = await ethers.getSigners();
        provider = ethers.provider;

        // Deploy contract
        const contractFactory_ERC721 = await ethers.getContractFactory(contractPath_ERC721, signer);
        contract_ERC721 = await contractFactory_ERC721.deploy(name, symbol, price);
        
        const contractFactory_ERC20 = await ethers.getContractFactory(contractPath_ERC20, signer);
        contract_ERC20 = await contractFactory_ERC20.deploy(contract_ERC721.address);

        const tx_result = await provider.waitForTransaction(contract_ERC20.deployTransaction.hash, confirmations_number);
        if(tx_result.confirmations < 0 || tx_result === undefined) {
            throw new Error("Transaction failed");
        }
    });

    describe("ERC-721 Constructor tests", () => {
        it("Try send empty name", async () => {
            const contractFactory = await ethers.getContractFactory(contractPath_ERC721, signer);
            await expect(contractFactory.deploy("", "Test", 100)).to.be.revertedWith("Name and symbol are mandatory parameters");
        });

        it("Try send empty symbol", async () => {
            const contractFactory = await ethers.getContractFactory(contractPath_ERC721, signer);
            await expect(contractFactory.deploy("Test", "", 100)).to.be.revertedWith("Name and symbol are mandatory parameters");
        });

        it("Try send empty name and symbol", async () => {
            const contractFactory = await ethers.getContractFactory(contractPath_ERC721, signer);
            await expect(contractFactory.deploy("", "", 100)).to.be.revertedWith("Name and symbol are mandatory parameters");
        });

        it("Try send zero price", async () => {
            const contractFactory = await ethers.getContractFactory(contractPath_ERC721, signer);
            await expect(contractFactory.deploy("Test", "Test", 0)).to.be.revertedWith("Invalid price");
        });

        it("Initialization test", async () => {
            const receivedName = await contract_ERC721.name();
            const receivedSymbol = await contract_ERC721.symbol();
            const receivedPrice = await contract_ERC721.m2Price();
            const receivedOwner = await contract_ERC721.owner();

            expect(receivedName).to.be.equals(name);
            expect(receivedSymbol).to.be.equals(symbol);
            expect(receivedPrice).to.be.equals(price);
            expect(receivedOwner).to.be.equals(signer.address);
        });
    });

    describe("ERC-20 Constructor tests", () => {
        it("Try send zero address", async () => {
            const contractFactory = await ethers.getContractFactory(contractPath_ERC20, signer);
            await expect(contractFactory.deploy(zeroAddress)).to.be.revertedWith("Invalid address");
        });

        it("Initialization test", async () => {
            const receivedName = await contract_ERC20.name();
            const receivedSymbol = await contract_ERC20.symbol();
            const receivedDecimals = await contract_ERC20.decimals();
            const receivedtTotalSupply = await contract_ERC20.totalSupply();
            const receivedtNftContract = await contract_ERC20.nftContract();
            
            expect(receivedName).to.be.equals("ERC20_M2");
            expect(receivedSymbol).to.be.equals("M2");
            expect(receivedDecimals).to.be.equals(0);
            expect(receivedtTotalSupply).to.be.equals(0);
            expect(receivedtNftContract).to.be.equals(contract_ERC721.address);
        });
    });

    describe("ERC-721 Floor NFT functionalities tests", () => {
        describe("Mint by ethers tests", () => {
            it("Try send zero square meters test", async () => {
                await expect(contract_ERC721["mint(uint256)"](0)).to.be.revertedWith("Invalid square meters");
            });

            it("Try send insufficient amount test", async () => {
                const amount = ethers.utils.parseEther("1");
                await expect(contract_ERC721["mint(uint256)"](1, { value: amount })).to.be.revertedWith("Insufficient amount");
            });

            it("Mint 1 NFT of 1 m2 test", async () => {
                const m2 = 1;
                const tokenID = (await contract_ERC721.totalSupply()).add(1);
                const nftPriceBefore = await contract_ERC721.m2Price();
                const priceDecrement = nftPriceBefore.mul(5).div(100); // * 5 / 100

                const totalSupplyBefore = await contract_ERC721.totalSupply();
                const ownerBalanceOfBefore = await contract_ERC721.balanceOf(signer.address);
                const ownerOfBefore = await contract_ERC721.ownerOf(tokenID);
                const floorBefore = await contract_ERC721.floor(tokenID);
                const contractBalanceBefore = await provider.getBalance(contract_ERC721.address);
                
                const tx = await contract_ERC721["mint(uint256)"](m2, { value: nftPriceBefore });
                const tx_result = await provider.waitForTransaction(tx.hash, confirmations_number);
                if(tx_result.confirmations < 0 || tx_result === undefined) {
                    throw new Error("Transaction failed");
                }

                const totalSupplyAfter = await contract_ERC721.totalSupply();
                const ownerBalanceOfAfter = await contract_ERC721.balanceOf(signer.address);
                const ownerOfAfter = await contract_ERC721.ownerOf(tokenID);
                const floorAfter = await contract_ERC721.floor(tokenID);
                const contractBalanceAfter = await provider.getBalance(contract_ERC721.address);
                const nftPriceAfter = await contract_ERC721.m2Price();

                // Check results                
                expect(totalSupplyAfter).to.be.equals(totalSupplyBefore.add(1));
                expect(ownerBalanceOfAfter).to.be.equals(ownerBalanceOfBefore.add(1));
                expect(ownerOfBefore).to.be.equals(zeroAddress);
                expect(ownerOfAfter).to.be.equals(signer.address);
                expect(floorAfter).to.be.equals(floorBefore + m2);
                expect(contractBalanceAfter).to.be.equals(contractBalanceBefore.add(nftPriceBefore));
                expect(nftPriceAfter).to.be.equals(nftPriceBefore.sub(priceDecrement));
            });

            it("Mint 1 NFT of 10 m2 test", async () => {
                const m2 = 10;
                const tokenID = (await contract_ERC721.totalSupply()).add(1);
                const nftPriceBefore = await contract_ERC721.m2Price();
                const totalPrice = nftPriceBefore.mul(m2);
                const priceDecrement = nftPriceBefore.mul(5).div(100); // * 5 / 100

                const totalSupplyBefore = await contract_ERC721.totalSupply();
                const ownerBalanceOfBefore = await contract_ERC721.balanceOf(signer.address);
                const ownerOfBefore = await contract_ERC721.ownerOf(tokenID);
                const floorBefore = await contract_ERC721.floor(tokenID);
                const contractBalanceBefore = await provider.getBalance(contract_ERC721.address);
                
                const tx = await contract_ERC721["mint(uint256)"](m2, { value: totalPrice });
                const tx_result = await provider.waitForTransaction(tx.hash, confirmations_number);
                if(tx_result.confirmations < 0 || tx_result === undefined) {
                    throw new Error("Transaction failed");
                }

                const totalSupplyAfter = await contract_ERC721.totalSupply();
                const ownerBalanceOfAfter = await contract_ERC721.balanceOf(signer.address);
                const ownerOfAfter = await contract_ERC721.ownerOf(tokenID);
                const floorAfter = await contract_ERC721.floor(tokenID);
                const contractBalanceAfter = await provider.getBalance(contract_ERC721.address);
                const nftPriceAfter = await contract_ERC721.m2Price();

                // Check results                
                expect(totalSupplyAfter).to.be.equals(totalSupplyBefore.add(1));
                expect(ownerBalanceOfAfter).to.be.equals(ownerBalanceOfBefore.add(1));
                expect(ownerOfBefore).to.be.equals(zeroAddress);
                expect(ownerOfAfter).to.be.equals(signer.address);
                expect(floorAfter).to.be.equals(floorBefore + m2);
                expect(contractBalanceAfter).to.be.equals(contractBalanceBefore.add(totalPrice));
                expect(nftPriceAfter).to.be.equals(nftPriceBefore.sub(priceDecrement));
            });
        });

        describe("Mint by ERC-20 tests", () => {
            it("Try to mint with zero amount test", async () => {
                await expect(contract_ERC721["mint(address,uint256)"](signer.address, 0)).to.be.revertedWith("Invalid square meters");
            });

            it("Try to mint with zero address test", async () => {
                await expect(contract_ERC721["mint(address,uint256)"](zeroAddress, 10)).to.be.revertedWith("Invalid address");
            });

            it("Try to mint with address different from ERC-20 M2 contract test", async () => {
                await expect(contract_ERC721["mint(address,uint256)"](signer.address, 10)).to.be.revertedWith("Not authorized");
            });
        });

        describe("safeTransferFrom tests", () => {
            it("Try to transfer with same from and to address test", async () => {
                const tokenID = await contract_ERC721.totalSupply();
                await expect(contract_ERC721.safeTransferFrom(signer.address, signer.address, tokenID)).to.be.revertedWith("The _from and _to addresses must diverge");
            });
            
            it("Try to transfer with zero address test", async () => {
                const tokenID = await contract_ERC721.totalSupply();
                await expect(contract_ERC721.safeTransferFrom(signer.address, zeroAddress, tokenID)).to.be.revertedWith("Invalid '_to' address");
            });

            it("Try to transfer with invalid tokenID test", async () => {
                const tokenID = await contract_ERC721.totalSupply();
                await expect(contract_ERC721.safeTransferFrom(signer.address, account2.address, tokenID.add(10))).to.be.revertedWith("Invalid tokenId");
            });

            it("Try to transfer with not the owner account in from parametter test", async () => {
                const tokenID = await contract_ERC721.totalSupply();
                await expect(contract_ERC721.safeTransferFrom(account1.address, account2.address, tokenID)).to.be.revertedWith("Not the owner");
            });

            it("Try to transfer from an account different that the owner test", async () => {
                const tokenID = await contract_ERC721.totalSupply();
                const newInstance = await contract_ERC721.connect(account1);
                await expect(newInstance.safeTransferFrom(signer.address, account2.address, tokenID)).to.be.revertedWith("Not authorized");
            });

            it("Successful transfer operation test", async () => {
                const tokenID = await contract_ERC721.totalSupply();

                const signerBalanceBefore = await contract_ERC721.balanceOf(signer.address);
                const account1BalanceBefore = await contract_ERC721.balanceOf(account1.address);
                const tokenIDOwnerBefore = await contract_ERC721.ownerOf(tokenID);

                const tx = await contract_ERC721.safeTransferFrom(signer.address, account1.address, tokenID);
                const tx_result = await provider.waitForTransaction(tx.hash, confirmations_number);
                if(tx_result.confirmations < 0 || tx_result === undefined) {
                    throw new Error("Transaction failed");
                }

                const signerBalanceAfter = await contract_ERC721.balanceOf(signer.address);
                const account1BalanceAfter = await contract_ERC721.balanceOf(account1.address);
                const tokenIDOwnerAfter = await contract_ERC721.ownerOf(tokenID);
                const allowanceAfter = await contract_ERC721.allowance(tokenID);

                expect(signerBalanceAfter).to.be.equals(signerBalanceBefore.sub(1));
                expect(account1BalanceAfter).to.be.equals(account1BalanceBefore.add(1));
                expect(tokenIDOwnerBefore).to.be.equals(signer.address);
                expect(tokenIDOwnerAfter).to.be.equals(account1.address);
                expect(allowanceAfter).to.be.equals(zeroAddress);
            });
        });

        describe("approve tests", () => {
            it("Try to approve with invalid tokenID test", async () => {
                const tokenID = (await contract_ERC721.totalSupply()).add(1);
                await expect(contract_ERC721.approve(account2.address, tokenID)).to.be.revertedWith("Invalid tokenId");
            });

            it("Try to approve with an account not the owner test", async () => {
                const tokenID = await contract_ERC721.totalSupply();
                await expect(contract_ERC721.approve(account2.address, tokenID)).to.be.revertedWith("Not authorized");
            });

            it("Successfull approve an address test", async () => {
                const tokenID = (await contract_ERC721.totalSupply()).sub(1);

                const signerBalanceBefore = await contract_ERC721.balanceOf(signer.address);
                const account2BalanceBefore = await contract_ERC721.balanceOf(account2.address);
                const tokenIDOwnerBefore = await contract_ERC721.ownerOf(tokenID);
                const allowanceBefore = await contract_ERC721.allowance(tokenID);

                const tx = await contract_ERC721.approve(account2.address, tokenID);
                const tx_result = await provider.waitForTransaction(tx.hash, confirmations_number);
                if(tx_result.confirmations < 0 || tx_result === undefined) {
                    throw new Error("Transaction failed");
                }

                const signerBalanceAfter = await contract_ERC721.balanceOf(signer.address);
                const account2BalanceAfter = await contract_ERC721.balanceOf(account2.address);
                const tokenIDOwnerAfter = await contract_ERC721.ownerOf(tokenID);
                const allowanceAfter = await contract_ERC721.allowance(tokenID);

                expect(signerBalanceAfter).to.be.equals(signerBalanceBefore);
                expect(account2BalanceAfter).to.be.equals(account2BalanceBefore);
                expect(tokenIDOwnerBefore).to.be.equals(signer.address);
                expect(tokenIDOwnerAfter).to.be.equals(signer.address);
                expect(allowanceBefore).to.be.equals(zeroAddress);
                expect(allowanceAfter).to.be.equals(account2.address);
            });
        });

        describe("setM2ContractAddress tests", () => {
            it("Try to setM2ContractAddress with zero address test", async () => {
                await expect(contract_ERC721.setM2ContractAddress(zeroAddress)).to.be.revertedWith("Invalid address");
            });

            it("Try to setM2ContractAddress with not owner account test", async () => {
                const newInstance = await contract_ERC721.connect(account1); 
                await expect(newInstance.setM2ContractAddress(contract_ERC20.address)).to.be.revertedWith("Not authorized");
            });

            it("Try to setM2ContractAddress to a EOA test", async () => {
                await expect(contract_ERC721.setM2ContractAddress(account1.address)).to.be.revertedWith("EOA not allowed");
            });

            it("Successfully setM2ContractAddress by the protocol owner test", async () => {
                const m2ContractBefore = await contract_ERC721.m2Contract();
                
                const tx = await contract_ERC721.setM2ContractAddress(contract_ERC20.address);
                const tx_result = await provider.waitForTransaction(tx.hash, confirmations_number);
                if(tx_result.confirmations < 0 || tx_result === undefined) {
                    throw new Error("Transaction failed");
                }

                const m2ContractAfter = await contract_ERC721.m2Contract();

                expect(m2ContractBefore).to.be.equals(zeroAddress);
                expect(m2ContractAfter).to.be.equals(contract_ERC20.address);
            });

            
            it("Try to call twice to setM2ContractAddress test", async () => {
                await expect(contract_ERC721.setM2ContractAddress(contract_ERC721.address)).to.be.revertedWith("M2 contract already set");
            });
        });

        describe("splitFloor tests", () => {
            it("Try to splitFloor with an invalid tokenID test", async () => {
                const tokenID = (await contract_ERC721.totalSupply()).add(100);
                const m2 = await contract_ERC721.floor(tokenID);
                const m2Price = (await contract_ERC721.m2Price()).mul(30).div(100);
                const amount = m2.mul(m2Price);
                await expect(contract_ERC721.splitFloor(tokenID, { value: amount })).to.be.revertedWith("Invalid tokenId");
            });

            it("Try to splitFloor with an account not the owner test", async () => {
                const tokenID = await contract_ERC721.totalSupply();
                await expect(contract_ERC721.splitFloor(tokenID)).to.be.revertedWith("Not authorized");
            });

            it("Try to splitFloor with insufficient amount test", async () => {
                const tokenID = (await contract_ERC721.totalSupply()).sub(1);
                const m2Price = (await contract_ERC721.m2Price()).mul(30).div(100);
                const m2 = await contract_ERC721.floor(tokenID);
                const amount = m2.div(2).mul(m2Price);  // Ethers for just the half of the square meters
                
                await expect(contract_ERC721.splitFloor(tokenID, { value: amount })).to.be.revertedWith("Insufficient amount");
            });

            it("Successfully splitFloor by the protocol owner test", async () => {
                const tokenID = (await contract_ERC721.totalSupply()).sub(1);
                const m2 = await contract_ERC721.floor(tokenID);
                const m2Price = await contract_ERC721.m2Price();
                const operationCost = m2Price.mul(30).div(100);
                const totalAmountToPay = m2.mul(operationCost);

                const totalSupply_ERC721_Before = await contract_ERC721.totalSupply();
                const ownerBalance_ERC721_Before = await contract_ERC721.balanceOf(signer.address);
                const totalSupply_ERC20_Before = await contract_ERC20.totalSupply();
                const ownerBalance_ERC20_Before = await contract_ERC20.balanceOf(signer.address);

                const tokenOwner_Before = await contract_ERC721.ownerOf(tokenID);
                const tokenM2_Before = await contract_ERC721.floor(tokenID);
                const M2Price_Before = await contract_ERC721.m2Price();

                const signerEtherBalance_Before = await provider.getBalance(signer.address);
                const contractEtherBalance_Before = await provider.getBalance(contract_ERC721.address);

                const tx = await contract_ERC721.splitFloor(tokenID, { value: totalAmountToPay });
                const tx_result = await provider.waitForTransaction(tx.hash, confirmations_number);
                if(tx_result.confirmations < 0 || tx_result === undefined) {
                    throw new Error("Transaction failed");
                }

                const totalSupply_ERC721_After = await contract_ERC721.totalSupply();
                const ownerBalance_ERC721_After = await contract_ERC721.balanceOf(signer.address);
                const totalSupply_ERC20_After = await contract_ERC20.totalSupply();
                const ownerBalance_ERC20_After = await contract_ERC20.balanceOf(signer.address);

                const tokenOwner_After = await contract_ERC721.ownerOf(tokenID);
                const tokenM2_After = await contract_ERC721.floor(tokenID);
                const M2Price_After = await contract_ERC721.m2Price();

                const signerEtherBalance_After = await provider.getBalance(signer.address);
                const contractEtherBalance_After = await provider.getBalance(contract_ERC721.address);

                expect(totalSupply_ERC721_After).to.be.equals(totalSupply_ERC721_Before);
                expect(ownerBalance_ERC721_After).to.be.equals(ownerBalance_ERC721_Before.sub(1));
                expect(totalSupply_ERC20_After).to.be.equals(totalSupply_ERC20_Before.add(m2));
                expect(ownerBalance_ERC20_After).to.be.equals(ownerBalance_ERC20_Before.add(m2));
                expect(tokenOwner_Before).to.be.equals(signer.address);
                expect(tokenOwner_After).to.be.equals(zeroAddress);
                expect(tokenM2_Before).to.be.equals(m2);
                expect(tokenM2_After).to.be.equals(0);
                expect(M2Price_Before).to.be.equals(m2Price);
                expect(M2Price_After).to.be.equals(M2Price_Before.add(m2Price.mul(m2).mul(5).div(100)));
                expect(parseInt(signerEtherBalance_After)).to.be.lessThanOrEqual(parseInt(signerEtherBalance_Before.sub(totalAmountToPay)));
                expect(contractEtherBalance_After).to.be.equals(contractEtherBalance_Before.add(totalAmountToPay));
            });

            it("Try to transfer with tokenID splited test", async () => {
                const tokenID = (await contract_ERC721.totalSupply()).sub(1);
                await expect(contract_ERC721.safeTransferFrom(signer.address, account2.address, tokenID)).to.be.revertedWith("Invalid tokenId");
            });
        });

        describe("withdraw tests", () => {
            it("Try to withdraw with an invalid account test", async () => {
                const newInstance = await contract_ERC721.connect(account1); 
                await expect(newInstance.withdraw()).to.be.revertedWith("Not authorized");
            });

            it("Successfully withdraw by the protocol owner test", async () => {
                const signerBalanceBefore = await contract_ERC721.balanceOf(signer.address);
                const signerEtherBalanceBefore = await provider.getBalance(signer.address);
                const contractEtherBalanceBefore = await provider.getBalance(contract_ERC721.address);

                const tx = await contract_ERC721.withdraw();
                const tx_result = await provider.waitForTransaction(tx.hash, confirmations_number);
                if(tx_result.confirmations < 0 || tx_result === undefined) {
                    throw new Error("Transaction failed");
                }

                const signerBalanceAfter = await contract_ERC721.balanceOf(signer.address);
                const signerEtherBalanceAfter = await provider.getBalance(signer.address);
                const contractEtherBalanceAfter = await provider.getBalance(contract_ERC721.address);

                expect(signerBalanceAfter).to.be.equals(signerBalanceBefore);
                expect(parseInt(signerEtherBalanceAfter)).to.be.lessThan(parseInt(signerEtherBalanceBefore.add(contractEtherBalanceBefore)));
                expect(contractEtherBalanceAfter).to.be.equals(0);
            });

            it("Try to withdraw with zero balance in contract test", async () => {
                await expect(contract_ERC721.withdraw()).to.be.revertedWith("Zero balance");
            });
        });

        describe("operations with authoriced account tests", () => {
            it("Successful transfer operation from approved account test", async () => {
                const tokenID = await contract_ERC721.totalSupply();    // TokenID 2's owner is account1

                // Information at start
                const account1BalanceBefore = await contract_ERC721.balanceOf(account1.address);    // 1
                const account2BalanceBefore = await contract_ERC721.balanceOf(account2.address);    // 0
                const account3BalanceBefore = await contract_ERC721.balanceOf(account3.address);    // 0
                const tokenIDOwnerBefore = await contract_ERC721.ownerOf(tokenID);                  // Account1
                const allowanceAtStar = await contract_ERC721.allowance(tokenID);                   // Zero address
                const totalSupplyBefore = await contract_ERC721.totalSupply();                      // 2

                // Approv operation
                let newInstance = await contract_ERC721.connect(account1); 
                let tx = await newInstance.approve(account2.address, tokenID);
                let tx_result = await provider.waitForTransaction(tx.hash, confirmations_number);
                if(tx_result.confirmations < 0 || tx_result === undefined) {
                    throw new Error("Transaction failed");
                }

                // Information after approve
                const allowanceBefore = await contract_ERC721.allowance(tokenID);                   // Account2 address

                // Transfer operation from approved account
                newInstance = await contract_ERC721.connect(account2); 
                tx = await newInstance.safeTransferFrom(account1.address, account3.address, tokenID);
                tx_result = await provider.waitForTransaction(tx.hash, confirmations_number);
                if(tx_result.confirmations < 0 || tx_result === undefined) {
                    throw new Error("Transaction failed");
                }

                const account1BalanceAfter = await contract_ERC721.balanceOf(account1.address);     // 0
                const account2BalanceAfter = await contract_ERC721.balanceOf(account2.address);     // 0
                const account3BalanceAfter = await contract_ERC721.balanceOf(account3.address);     // 1
                const tokenIDOwnerAfter = await contract_ERC721.ownerOf(tokenID);                   // Account3
                const allowanceAfter = await contract_ERC721.allowance(tokenID);                    // Zero address
                const totalSupplyAfter = await contract_ERC721.totalSupply();                       // 2

                // Expectd at start
                expect(account1BalanceBefore).to.be.equals(1);
                expect(account2BalanceBefore).to.be.equals(0);
                expect(account3BalanceBefore).to.be.equals(0);
                expect(tokenIDOwnerBefore).to.be.equals(account1.address);
                expect(allowanceAtStar).to.be.equals(zeroAddress);
                expect(totalSupplyBefore).to.be.equals(2);

                // Expected after approved before transfer
                expect(allowanceBefore).to.be.equals(account2.address);
        
                // Expected after        
                expect(account1BalanceAfter).to.be.equals(account1BalanceBefore.sub(1));
                expect(account2BalanceAfter).to.be.equals(account2BalanceBefore);
                expect(account3BalanceAfter).to.be.equals(account3BalanceBefore.add(1));
                expect(tokenIDOwnerAfter).to.be.equals(account3.address);
                expect(allowanceAfter).to.be.equals(zeroAddress);
                expect(totalSupplyAfter).to.be.equals(totalSupplyBefore);                
            });

            it("Successful approve operation from approved account test", async () => {
                const tokenID = await contract_ERC721.totalSupply();    // TokenID 2's owner is account3

                // Information at start
                const account3BalanceBefore = await contract_ERC721.balanceOf(account3.address);    // 1
                const account4BalanceBefore = await contract_ERC721.balanceOf(account4.address);    // 0
                const account1BalanceBefore = await contract_ERC721.balanceOf(account1.address);    // 0
                const tokenIDOwnerBefore = await contract_ERC721.ownerOf(tokenID);                  // Account3
                const allowanceAtStar = await contract_ERC721.allowance(tokenID);                   // Zero address
                const totalSupplyBefore = await contract_ERC721.totalSupply();                      // 2

                // Approv operation
                let newInstance = await contract_ERC721.connect(account3); 
                let tx = await newInstance.approve(account4.address, tokenID);
                let tx_result = await provider.waitForTransaction(tx.hash, confirmations_number);
                if(tx_result.confirmations < 0 || tx_result === undefined) {
                    throw new Error("Transaction failed");
                }

                // Information after approve
                const allowanceBefore = await contract_ERC721.allowance(tokenID);                   // Account4 address

                // Transfer operation from approved account
                newInstance = await contract_ERC721.connect(account4); 
                tx = await newInstance.safeTransferFrom(account3.address, account1.address, tokenID);
                tx_result = await provider.waitForTransaction(tx.hash, confirmations_number);
                if(tx_result.confirmations < 0 || tx_result === undefined) {
                    throw new Error("Transaction failed");
                }

                const account3BalanceAfter = await contract_ERC721.balanceOf(account3.address);     // 0
                const account4BalanceAfter = await contract_ERC721.balanceOf(account4.address);     // 0
                const account1BalanceAfter = await contract_ERC721.balanceOf(account1.address);     // 1
                const tokenIDOwnerAfter = await contract_ERC721.ownerOf(tokenID);                   // Account1
                const allowanceAfter = await contract_ERC721.allowance(tokenID);                    // Zero address
                const totalSupplyAfter = await contract_ERC721.totalSupply();                       // 2

                // Expectd at start
                expect(account3BalanceBefore).to.be.equals(1);
                expect(account4BalanceBefore).to.be.equals(0);
                expect(account1BalanceBefore).to.be.equals(0);
                expect(tokenIDOwnerBefore).to.be.equals(account3.address);
                expect(allowanceAtStar).to.be.equals(zeroAddress);
                expect(totalSupplyBefore).to.be.equals(2);

                // Expected after approved before transfer
                expect(allowanceBefore).to.be.equals(account4.address);
        
                // Expected after        
                expect(account3BalanceAfter).to.be.equals(account3BalanceBefore.sub(1));
                expect(account4BalanceAfter).to.be.equals(account4BalanceBefore);
                expect(account1BalanceAfter).to.be.equals(account1BalanceBefore.add(1));
                expect(tokenIDOwnerAfter).to.be.equals(account1.address);
                expect(allowanceAfter).to.be.equals(zeroAddress);
                expect(totalSupplyAfter).to.be.equals(totalSupplyBefore);                
            });

            it("Successful splitFloor operation from approved account test", async () => {
                const tokenID = await contract_ERC721.totalSupply();    // TokenID 2's owner is account1
                const m2 = await contract_ERC721.floor(tokenID);        // 10 m2
                const m2Price = await contract_ERC721.m2Price();
                const operationCost = m2Price.mul(30).div(100);
                const totalAmountToPay = m2.mul(operationCost);

                // Information at start
                const account1_ERC721_BalanceBefore = await contract_ERC721.balanceOf(account1.address);    // 1
                const account1_ERC20_BalanceBefore = await contract_ERC20.balanceOf(account1.address);      // 0
                const account2_ERC721_BalanceBefore = await contract_ERC721.balanceOf(account2.address);    // 0
                const account2_ERC20_BalanceBefore = await contract_ERC20.balanceOf(account2.address);      // 0
                const tokenIDOwnerBefore = await contract_ERC721.ownerOf(tokenID);                          // Account1
                const allowanceAtStar = await contract_ERC721.allowance(tokenID);                           // Zero address
                const totalSupply_ERC721_Before = await contract_ERC721.totalSupply();                      // 2
                const totalSupply_ERC20_Before = await contract_ERC20.totalSupply();                        // 1

                const tokenM2_Before = await contract_ERC721.floor(tokenID);                                // 10
                const M2Price_Before = await contract_ERC721.m2Price();

                const account2EtherBalance_Before = await provider.getBalance(account2.address);
                const contractEtherBalance_Before = await provider.getBalance(contract_ERC721.address);
                
                // Approv operation
                let newInstance = await contract_ERC721.connect(account1); 
                let tx = await newInstance.approve(account2.address, tokenID);
                let tx_result = await provider.waitForTransaction(tx.hash, confirmations_number);
                if(tx_result.confirmations < 0 || tx_result === undefined) {
                    throw new Error("Transaction failed");
                }

                // Information after approve
                const allowanceBefore = await contract_ERC721.allowance(tokenID);                   // Account2 address

                // Transfer operation from approved account
                newInstance = await contract_ERC721.connect(account2); 
                tx = await newInstance.splitFloor(tokenID, { value: totalAmountToPay });
                tx_result = await provider.waitForTransaction(tx.hash, confirmations_number);
                if(tx_result.confirmations < 0 || tx_result === undefined) {
                    throw new Error("Transaction failed");
                }

                const account1_ERC721_BalanceAfter = await contract_ERC721.balanceOf(account1.address);    // 0
                const account1_ERC20_BalanceAfter = await contract_ERC20.balanceOf(account1.address);      // 10
                const account2_ERC721_BalanceAfter = await contract_ERC721.balanceOf(account2.address);    // 0
                const account2_ERC20_BalanceAfter = await contract_ERC20.balanceOf(account2.address);      // 0
                const tokenIDOwnerAfter = await contract_ERC721.ownerOf(tokenID);                          // zero address
                const allowanceAfter = await contract_ERC721.allowance(tokenID);                           // Zero address
                const totalSupply_ERC721_After = await contract_ERC721.totalSupply();                      // 2
                const totalSupply_ERC20_After = await contract_ERC20.totalSupply();                        // 11 = 1 + 10

                const tokenM2_After = await contract_ERC721.floor(tokenID);                                // 0
                const M2Price_After = await contract_ERC721.m2Price();

                const account2EtherBalance_After = await provider.getBalance(account2.address);
                const contractEtherBalance_After = await provider.getBalance(contract_ERC721.address);

                // Expectd at start
                expect(account1_ERC721_BalanceBefore).to.be.equals(1);
                expect(account1_ERC20_BalanceBefore).to.be.equals(0);

                expect(account2_ERC721_BalanceBefore).to.be.equals(0);
                expect(account2_ERC20_BalanceBefore).to.be.equals(0);

                expect(tokenIDOwnerBefore).to.be.equals(account1.address);
                expect(allowanceAtStar).to.be.equals(zeroAddress);

                expect(totalSupply_ERC721_Before).to.be.equals(2);
                expect(totalSupply_ERC20_Before).to.be.equals(1);

                expect(tokenM2_Before).to.be.equals(m2);
                expect(M2Price_Before).to.be.equals(m2Price);

                // Expected after approved before transfer
                expect(allowanceBefore).to.be.equals(account2.address);
        
                // Expected after        
                expect(account1_ERC721_BalanceAfter).to.be.equals(account1_ERC721_BalanceBefore.sub(1));
                expect(account1_ERC20_BalanceAfter).to.be.equals(account1_ERC20_BalanceBefore.add(m2));

                expect(account2_ERC721_BalanceAfter).to.be.equals(account2_ERC721_BalanceBefore);
                expect(account2_ERC20_BalanceAfter).to.be.equals(account2_ERC20_BalanceBefore);

                expect(tokenIDOwnerAfter).to.be.equals(zeroAddress);
                expect(allowanceAfter).to.be.equals(zeroAddress);

                expect(totalSupply_ERC721_After).to.be.equals(totalSupply_ERC721_Before);
                expect(totalSupply_ERC20_After).to.be.equals(totalSupply_ERC20_Before.add(m2));

                expect(tokenM2_After).to.be.equals(0);
                expect(M2Price_After).to.be.equals(M2Price_Before.add(m2Price.mul(m2).mul(5).div(100)));
                expect(parseInt(account2EtherBalance_After)).to.be.lessThanOrEqual(parseInt(account2EtherBalance_Before.sub(totalAmountToPay)));
                expect(contractEtherBalance_After).to.be.equals(contractEtherBalance_Before.add(totalAmountToPay));
            });
        });
    });

    // Balances
    // Signer 1
    // Account1 10
    describe("ERC-20 M2 Token functionalities tests", () => {
        describe("Trasfer tests", () => {
            it("Try transfer zero square meters test", async () => {
                await expect(contract_ERC20.transfer(account1.address, 0)).to.be.revertedWith("Invalid _m2");
            });

            it("Try transfer to zero address test", async () => {
                await expect(contract_ERC20.transfer(zeroAddress, 1)).to.be.revertedWith("Invalid '_to' address");
            });

            it("Try auto trasnfer test", async () => {
                await expect(contract_ERC20.transfer(signer.address, 1)).to.be.revertedWith("Invalid recipient, same as remittent");
            });

            it("Try trasnfer with insufficient balance test", async () => {
                const amount = (await contract_ERC20.balanceOf(signer.address)).add(1);
                await expect(contract_ERC20.transfer(account1.address, amount)).to.be.revertedWith("Insufficient balance");
            });

            it("Successful trasnfer from account1 to account2 test", async () => {
                const account1Balance_Before = await contract_ERC20.balanceOf(account1.address);
                const account2Balance_Before = await contract_ERC20.balanceOf(account2.address);
                const totalSupply_Before = await contract_ERC20.totalSupply();
                
                const amountTotransfer = account1Balance_Before.div(2);
                const newInstance = await contract_ERC20.connect(account1);
                
                const tx = await newInstance.transfer(account2.address, amountTotransfer);
                tx_result = await provider.waitForTransaction(tx.hash, confirmations_number);
                if(tx_result.confirmations < 0 || tx_result === undefined) {
                    throw new Error("Transaction failed");
                }

                const account1Balance_After = await contract_ERC20.balanceOf(account1.address);
                const account2Balance_After = await contract_ERC20.balanceOf(account2.address);
                const totalSupply_After = await contract_ERC20.totalSupply();

                expect(account1Balance_After).to.be.equals(account1Balance_Before.sub(amountTotransfer));
                expect(account2Balance_After).to.be.equals(account2Balance_Before.add(amountTotransfer));
                expect(totalSupply_After).to.be.equals(totalSupply_Before);
            });
        });

        describe("mint tests", () => {
            it("Try mint zero square meters test", async () => {
                await expect(contract_ERC20.mint(account1.address, 0)).to.be.revertedWith("Invalid quantity");
            });

            it("Try mint to zero address test", async () => {
                await expect(contract_ERC20.mint(zeroAddress, 1)).to.be.revertedWith("Invalid _recipient address");
            });

            it("Try mint with unauthoriced account test", async () => {
                await expect(contract_ERC20.mint(account1.address, 1)).to.be.revertedWith("Not authorized");
            });

            it("Successful mint from NFT Floor contract test", async () => {
                let m2 = 50;
                const nftPrice = await contract_ERC721.m2Price();
                const totalPrice = nftPrice.mul(m2);
                
                let tx = await contract_ERC721["mint(uint256)"](m2, { value: totalPrice });
                let tx_result = await provider.waitForTransaction(tx.hash, confirmations_number);
                if(tx_result.confirmations < 0 || tx_result === undefined) {
                    throw new Error("Transaction failed");
                }

                const tokenID = await contract_ERC721.totalSupply();
                m2 = await contract_ERC721.floor(tokenID);
                const m2Price = await contract_ERC721.m2Price();
                const operationCost = m2Price.mul(30).div(100);
                const totalAmountToPay = m2.mul(operationCost);

                const totalSupply_Before = await contract_ERC20.totalSupply();
                const signerBalance_Before = await contract_ERC20.balanceOf(signer.address);

                tx = await contract_ERC721.splitFloor(tokenID, { value: totalAmountToPay });
                tx_result = await provider.waitForTransaction(tx.hash, confirmations_number);
                if(tx_result.confirmations < 0 || tx_result === undefined) {
                    throw new Error("Transaction failed");
                }

                const totalSupply_After = await contract_ERC20.totalSupply();
                const signerBalance_After = await contract_ERC20.balanceOf(signer.address);

                expect(totalSupply_After).to.be.equals(totalSupply_Before.add(m2));
                expect(signerBalance_After).to.be.equals(signerBalance_Before.add(m2));
            });
        });

        describe("assemble tests", () => {
            it("Try assemble zero square meters test", async () => {
                await expect(contract_ERC20.assemble(0)).to.be.revertedWith("Invalid quantity");
            });

            it("Try assemble to zero address test", async () => {
                const amountTOAssemble = (await contract_ERC20.balanceOf(signer.address)).add(1);
                await expect(contract_ERC20.assemble(amountTOAssemble)).to.be.revertedWith("Insufficient balance");
            });

            it("Successful assemble test", async () => {
                const signerBalanceToAssembly = (await contract_ERC20.balanceOf(signer.address)).div(2);    // 25

                const totalSupply_ERC20_Before = await contract_ERC20.totalSupply();
                const signerBalance_ERC20_Before = await contract_ERC20.balanceOf(signer.address);

                const totalSupply_ERC721_Before = await contract_ERC721.totalSupply();
                const signerBalance_ERC721_Before = await contract_ERC721.balanceOf(signer.address);
                
                const tx = await contract_ERC20.assemble(signerBalanceToAssembly);
                const tx_result = await provider.waitForTransaction(tx.hash, confirmations_number);
                if(tx_result.confirmations < 0 || tx_result === undefined) {
                    throw new Error("Transaction failed");
                }

                const totalSupply_ERC20_After = await contract_ERC20.totalSupply();
                const signerBalance_ERC20_After = await contract_ERC20.balanceOf(signer.address);

                const totalSupply_ERC721_After = await contract_ERC721.totalSupply();
                const signerBalance_ERC721_After = await contract_ERC721.balanceOf(signer.address);
                const m2 = await contract_ERC721.floor(totalSupply_ERC721_After);
                const tokenIDOwner = await contract_ERC721.ownerOf(totalSupply_ERC721_After);

                expect(totalSupply_ERC20_After).to.be.equals(totalSupply_ERC20_Before.sub(signerBalanceToAssembly));
                expect(signerBalance_ERC20_After).to.be.equals(signerBalance_ERC20_Before.sub(signerBalanceToAssembly));

                expect(totalSupply_ERC721_After).to.be.equals(totalSupply_ERC721_Before.add(1));
                expect(signerBalance_ERC721_After).to.be.equals(signerBalance_ERC721_Before.add(1));
                expect(m2).to.be.equals(signerBalanceToAssembly);
                expect(tokenIDOwner).to.be.equals(signer.address);
            });
        });
    });
});
