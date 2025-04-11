// import { 
//   compareEqualString, 
//   bigintToStr, 
//   sumToString, 
//   reduce, 
//   TEN_THOUSAND_TOKEN,
//   ONE_HUNDRED_TOKEN,
//   formatAddr,
//   bn,
//   ZERO,
//   FEE,
// } from "./utilities";

// import { deployContracts } from "./deployments";
// import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
// import { ethers } from "hardhat";
// import { expect } from "chai";

// describe("Collateral Token: Using Simplifi Token as the collateral asset", function () {
//   async function deployContractsFixcture() {
//     const TOKEN_NAME = 'Simplfinance Token';
//     const SYMBOL = 'TSFT';
//     const TOTAL_SUPPLY = BigInt('1000000000') * BigInt(10 ** 18);
//     const DECIMALS = 18;
//     return { 
//         ...await deployContracts(ethers.getSigners),
//         TOKEN_NAME,
//         SYMBOL,
//         TOTAL_SUPPLY,
//         DECIMALS
//     };
//   }

//   describe("Testing Token Metadata", function () {
//     it("Set asset name correctly", async function () {
//       const { collateralAsset, TOKEN_NAME} = await loadFixture(deployContractsFixcture);
//       compareEqualString(await collateralAsset.name(), TOKEN_NAME);
//     });
    
//     it("Should set symbol correctly", async function () {
//       const { collateralAsset, SYMBOL } = await loadFixture(deployContractsFixcture);
//       compareEqualString(await collateralAsset.symbol(), SYMBOL);
//     });

//     it("Should set maxSupply correctly", async function () {
//       const { collateralAsset, TOTAL_SUPPLY} = await loadFixture(deployContractsFixcture);
//       let tSupply : bigint = await collateralAsset.totalSupply();
//       compareEqualString(bigintToStr(tSupply), TOTAL_SUPPLY.toString());
//     });

//     it("Should set collateralAsset decimals correctly", async function () {
//       const { collateralAsset, DECIMALS } = await loadFixture(deployContractsFixcture);
//       expect(await collateralAsset.decimals()).to.equal(DECIMALS);
//     });
//   });

//   describe("Testing Token Logic", function () {
//     it("Confirm total amount minted to distributor is correct.", async () => {
//       const { signers: { deployerAddr }, collateralAsset, INITIAL_MINT, distributorAddr} = await loadFixture(deployContractsFixcture);
//       const bals = await collateralAsset.accountBalances(distributorAddr); 
//       const totalSupply = await collateralAsset.totalSupply()
//       const deployerBal = await collateralAsset.balanceOf(deployerAddr);
//       const balOfDistributor = await collateralAsset.balanceOf(distributorAddr);
//       const totalBalOfDistributor = bals.locked.value + bals.spendable;
//       expect(bn(totalBalOfDistributor).gt(bn(bals.spendable))).to.be.true;
//       expect(balOfDistributor).to.be.equal(bals.spendable);
//       expect(deployerBal).to.be.equal(INITIAL_MINT)
//       expect(bals.spendable).to.be.equal(totalSupply - (INITIAL_MINT + bals.locked.value));
//       expect(bals.locked.value).to.be.equal(totalSupply - (bals.spendable + INITIAL_MINT));
//     });

//     /**
//      * We have to first set up a signer from the Token Distributor contract,
//      * perform a few steps such as initiate a transaction in order to effect
//      * a transfer.
//      */
//     it("Should successfully transfer asset", async () => {
//       const { 
//         collateralAsset,
//         signers: { alc1Addr, deployerAddr, deployer },
//       } = await loadFixture(deployContractsFixcture);

//       const initBal_sender = await collateralAsset.balanceOf(formatAddr(deployerAddr));
//       console.log("initBal_sender", initBal_sender);
//       const initBal_receiver = await collateralAsset.balanceOf(formatAddr(alc1Addr));
//       await collateralAsset.connect(deployer).transfer(formatAddr(alc1Addr), TEN_THOUSAND_TOKEN);
//       const balOfSender = await collateralAsset.balanceOf(formatAddr(deployerAddr));
//       const balOfRec = await collateralAsset.balanceOf(formatAddr(alc1Addr));
//       expect(reduce(balOfSender, 0).toString()).to.be.equal(reduce(initBal_sender, TEN_THOUSAND_TOKEN).toString());
//       expect(sumToString(balOfRec, 0).toString()).to.be.equal(sumToString(initBal_receiver, TEN_THOUSAND_TOKEN));
//     });

//     it("Should increase allowance", async () => {
//       const { collateralAsset, signers: { alc1Addr, deployer, deployerAddr, }, } = await loadFixture(deployContractsFixcture);

//       await collateralAsset.connect(deployer).approve(alc1Addr, ONE_HUNDRED_TOKEN);
//       expect(await collateralAsset.allowance(deployerAddr, alc1Addr)).to.be.equal(ONE_HUNDRED_TOKEN);
//     });

//     it("Lock token ", async () => {
//       const { collateralAsset,signers: { signer1Addr, deployer, deployerAddr,}, } = await loadFixture(deployContractsFixcture);
//       //   Note: After deployment, an amount of INITIAL_MINT = 200000 was minted to the deployer account.
//       const initBalOfSender = await collateralAsset.balanceOf(deployerAddr);
//       const balsB4Locked = await collateralAsset.accountBalances(deployerAddr);
//       const lockedAmt = 10000n;
//       await collateralAsset.connect(deployer).lockToken(signer1Addr, lockedAmt);
//       const balsAfterLocked = await collateralAsset.accountBalances(deployerAddr);
//       const balOfSenderAfterLocked = await collateralAsset.balanceOf(deployerAddr);
//       expect(balOfSenderAfterLocked).to.be.equal(initBalOfSender - lockedAmt);
//       expect(balsB4Locked.locked.value).to.be.eq(ZERO);
//       expect(balsAfterLocked.locked.value).to.be.eq(lockedAmt);
//       expect(balsB4Locked.spendable).to.be.eq(initBalOfSender);
//       expect(balsAfterLocked.locked.escapeTo).to.be.eq(signer1Addr);
//     });

//     it("Unlock token", async () => {
//       const { collateralAsset,signers: { signer1: escapeToAddr, deployerAddr, deployer}, } = await loadFixture(deployContractsFixcture);
//       const lockedAmt = 10000n;
//       const unlockedAmt = 5000n;
//       await collateralAsset.connect(deployer).lockToken(escapeToAddr, lockedAmt);
//       const balsAfterLocked = await collateralAsset.accountBalances(deployerAddr);
//       const balOfSenderAfterLocked = await collateralAsset.balanceOf(deployerAddr);
//       const balOfEscapeToB4UnLocked = await collateralAsset.balanceOf(escapeToAddr);
//       await collateralAsset.connect(deployer).unlockToken(unlockedAmt);
//       const balsAfterUnLocked = await collateralAsset.accountBalances(deployerAddr);
//       const balOfSenderAfterUnLocked = await collateralAsset.balanceOf(deployerAddr);
//       const balOfEscapeToAfterUnLocked = await collateralAsset.balanceOf(escapeToAddr);
//       expect(balsAfterUnLocked.locked.value).to.be.eq(balsAfterLocked.locked.value - unlockedAmt);
//       expect(balOfSenderAfterUnLocked).to.be.eq(balOfSenderAfterLocked);
//       expect(balOfEscapeToAfterUnLocked).to.be.eq(unlockedAmt);
//       expect(bn(balOfEscapeToAfterUnLocked).gt(bn(balOfEscapeToB4UnLocked))).to.be.true;
//     });

//     it("Panic unlock via the Attorney assuming the user lost access to their private keys", async () => {
//       const { collateralAsset, attorney, signers: { signer1: escapeToAddr, deployer, deployerAddr,}, } = await loadFixture(deployContractsFixcture);
//       const lockedAmt = 100000000000000000000000n;
//       await collateralAsset.connect(deployer).lockToken(escapeToAddr, lockedAmt);
//       const balsOfEscapeB4UnLocked = await collateralAsset.accountBalances(escapeToAddr);
//       const balOfEscapeB4Unlocked = await collateralAsset.balanceOf(escapeToAddr);
//       const balOfDeployer = await collateralAsset.accountBalances(deployerAddr);
//       await attorney.connect(deployer).panicUnlock(deployerAddr, {value: FEE});
//       const balOfDeployerAfterUnlocked = await collateralAsset.accountBalances(deployerAddr);
//       const balsOfEscapeAfterUnLocked = await collateralAsset.accountBalances(escapeToAddr);
//       expect(balsOfEscapeB4UnLocked.locked.value).to.be.eq(ZERO);
//       expect(balsOfEscapeB4UnLocked.spendable).to.be.eq(ZERO);
//       expect(balsOfEscapeAfterUnLocked.locked.value).to.be.eq(ZERO);
//       expect(balsOfEscapeAfterUnLocked.spendable).to.be.eq(balOfDeployer.spendable + balOfDeployer.locked.value);
//       expect(balOfEscapeB4Unlocked).to.be.eq(balsOfEscapeB4UnLocked.spendable);
//       expect(balOfDeployerAfterUnlocked.spendable).to.be.eq(ZERO);
//       expect(balOfDeployerAfterUnlocked.locked.value).to.be.eq(ZERO);
//     });

//     it("Should revert if value is less than expected fee", async () => {
//       const { collateralAsset, attorney, signers: { signer1: escapeToAddr, deployer, deployerAddr,}, } = await loadFixture(deployContractsFixcture);
//       const lockedAmt = 10000n;
//       const fee = 1000000000000000n
//       await collateralAsset.connect(deployer).lockToken(escapeToAddr, lockedAmt);
//       await expect(attorney.connect(deployer).panicUnlock(deployerAddr, {value: fee}))
//       .to.be.revertedWith("Insufficient value for fee");
//     });

//     it("Should revert if caller does not have any locked amount", async () => {
//       const { collateralAsset, attorney, signers: { deployer, deployerAddr}, } = await loadFixture(deployContractsFixcture);
//       const fee = 1000000000000000n
//       await expect(attorney.connect(deployer).panicUnlock(deployerAddr, {value: fee}))
//       .to.be.revertedWith("No lock detected");
//     });
//   });
// });


