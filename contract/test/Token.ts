// import { expect } from "chai";
// import { ethers } from "hardhat";
// import { testUtils } from "./Index";
// import { loadCustomTokenFixtures } from "./testToken";
// import { Balances } from "./types";
// // import {
// //   time,
// //   loadFixture,
// // } from "@nomicfoundation/hardhat-toolbox/network-helpers";
// // import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
// // import { expect } from "chai";

// const { bn, add, FEE, wrap, reduce, AMOUNT, getSigners, buildstring, convertToHex, convertFromHex, compareEqualNumber, compareEqualString, deployTokenUpgradeableV2 } = testUtils;

// describe("Token", function () {
//   console.log("It run");
//   describe("Deployment: Token : Should set token parameters correctly", async function () {
//     const expectedName = "Simplifinance Token";
//     const symbol = "SFT";
//     const decimals = 18;


//     const { deployer, alc1, alc2, alc3, routeTo } = await getSigners();
//     const { tokenV1, reserve, reward, attorney } = await loadCustomTokenFixtures(deployer, routeTo.address);


//     // it("Should confirm token totalSupply", async function () {
//     //   const { tokenV1 } = await loadCustomTokenFixtures(deployer, routeTo.address);
//     //   compareEqualNumber(convertFromHex(await tokenV1.totalSupply()), bn(totalSupply));
//     // });

//     // it("Should set liquidity reserve correctly.", async () => {
//     //   const { tokenV1 } = await loadCustomTokenFixtures(deployer, routeTo.address);
//     //   compareEqualNumber(convertFromHex(await tokenV1.reserved()), reduce(maxSupply, totalSupply));
//     // });

   

//     it("Should upgrade token contract successfully.", async () => {
//       const { tokenV1, lockToken, transfer } = await loadCustomTokenFixtures(deployer, routeTo.address);
//       const upgraded = await deployTokenUpgradeableV2(deployer, tokenV1.address);
//       const amount = convertToHex(buildstring(1, 0, 20)); // 100 token
//       await transfer(alc1.address, deployer, amount);
//       await lockToken(alc1, routeTo.address, amount);
//       const totalLocked = await upgraded.totalTokenLocked();
//       compareEqualNumber(convertFromHex(totalLocked), convertToHex(amount));
//     });

//     // it("Should revert if contract is paused.", async () => {
//     //   const { token, signers,  } = await loadCustomTokenFixtures(deployer, routeTo.address);
//     //   const unlockedAmt = ethers.BigNumber.from(buildstring(1, 0, 18));
//     //   await token.connect(signers[0]).pause(token.address);
//     //   await expect(token.connect(signers[2]).unlockSpecific(unlockedAmt)).to.be.revertedWith(
//     //     "Paused"
//     //   );
//     // });
//   });
// });

// // const { ethers, upgrades } = require("hardhat");

// // async function main() {
// //   // Deploying
// //   const Box = await ethers.getContractFactory("Box");
// //   const instance = await upgrades.deployProxy(Box, [42]);
// //   await instance.waitForDeployment();

// //   // Upgrading
// //   const BoxV2 = await ethers.getContractFactory("BoxV2");
// //   const upgraded = await upgrades.upgradeProxy(await instance.getAddress(), BoxV2);
// // }

// // main();

// // it('works before and after upgrading', async function () {
// //   const instance = await upgrades.deployProxy(Box, [42]);
// //   assert.strictEqual(await instance.retrieve(), 42);

// //   await upgrades.upgradeProxy(instance, BoxV2);
// //   assert.strictEqual(await instance.retrieve(), 42);
// // });
