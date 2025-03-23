import { 
  compareEqualString, 
  bigintToStr, 
  sumToString, 
  DECIMALS, 
  reduce, 
  SYMBOL, 
  NAME, 
  TEN_THOUSAND_TOKEN,
  ONE_HUNDRED_TOKEN,
  formatAddr,
  bn,
} from "./utilities";

import { deployContracts } from "./deployments";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { ethers } from "hardhat";
import { expect } from "chai";

describe("TestAssetBase: ERC20 asset as contribution base", function () {
  async function deployContractsFixcture() {
    return { ...await deployContracts(ethers.getSigners) };
  }

  describe("Test token metadata", function () {
    it("Should set asset name correctly", async function () {
      const { tAsset } = await loadFixture(deployContractsFixcture);
      compareEqualString(await tAsset.name(), NAME);
    });
    
    it("Should set symbol correctly", async function () {
      const { tAsset } = await loadFixture(deployContractsFixcture);
      compareEqualString(await tAsset.symbol(), SYMBOL);
    });

    it("Should set maxSupply correctly", async function () {
      const { tAsset } = await loadFixture(deployContractsFixcture);
      let tSupply : bigint = await tAsset.totalSupply();
      compareEqualString(bigintToStr(tSupply), '100000000000000000000000');
    });

    it("Should set tAsset decimals correctly", async function () {
      const { tAsset } = await loadFixture(deployContractsFixcture);
      expect(await tAsset.decimals()).to.equal(DECIMALS);
    });
  });

  describe("Testing Token Logic", function () {
    it("Should confirm total amount minted to initial recipient.", async () => {
      const { tAsset, signers: { deployer }} = await loadFixture(deployContractsFixcture);
      expect(await tAsset.balanceOf(formatAddr(deployer.address))).to.be.equal(await tAsset.totalSupply())
    });

    /**
     * We have to first set up a signer from the Token Distributor contract,
     * perform a few steps such as initiate a transaction in order to effect
     * a transfer.
     */
    it("Should successfully transfer asset", async () => {
      const { 
        tAsset,
        signers: { alc1, deployer },
        } = await loadFixture(deployContractsFixcture);

      const initBal_sender = await tAsset.balanceOf(formatAddr(deployer.address));
      const initBal_receiver = await tAsset.balanceOf(formatAddr(alc1.address));
      await tAsset.connect(deployer).transfer(formatAddr(alc1.address), TEN_THOUSAND_TOKEN);
      const balOfSender = await tAsset.balanceOf(formatAddr(deployer.address));
      const balOfRec = await tAsset.balanceOf(formatAddr(alc1.address));
      expect(reduce(balOfSender, 0).toString()).to.be.equal(reduce(initBal_sender, TEN_THOUSAND_TOKEN).toString());
      expect(sumToString(balOfRec, 0).toString()).to.be.equal(sumToString(initBal_receiver, TEN_THOUSAND_TOKEN));
    });

    it("Should increase allowance of account", async () => {
      const { tAsset, signers: { alc1, deployer, }, } = await loadFixture(deployContractsFixcture);

      await tAsset.connect(deployer).approve(alc1.address, ONE_HUNDRED_TOKEN);
      expect(await tAsset.allowance(deployer.address, alc1.address)).to.be.equal(ONE_HUNDRED_TOKEN);
    });

    it("Should signUp for testnet", async () => {
      const { 
        tAsset,
        signers: { signer1 },
         } = await loadFixture(deployContractsFixcture);
      
      await tAsset.connect(signer1).joinTestnet();
      const data = await tAsset.indexes(signer1.address);
      expect(data.isSignedUp).to.be.true;
      expect(data.isApproved).to.be.false;
    });

    it("Should approve user for testnet participation", async () => {
      const { 
        tAsset,
        signers: { signer1, deployer},
         } = await loadFixture(deployContractsFixcture);
      
      await tAsset.connect(signer1).joinTestnet();
      await tAsset.connect(deployer).approveTester([signer1.address]);
      const data = await tAsset.indexes(signer1.address);
      // console.log("Data", data);
      expect(data.isSignedUp).to.be.true;
      expect(data.isApproved).to.be.true;
    });

    it("Should claim test tokens after approval", async () => {
      const { 
        tAsset,
        testAssetAddr,
        collateralToken,
        signers: { signer1, deployer},
         } = await loadFixture(deployContractsFixcture);
      
      await collateralToken.connect(deployer).transfer(testAssetAddr, '100000000000000000000000');
      await tAsset.connect(signer1).joinTestnet();
      await tAsset.connect(deployer).approveTester([signer1.address]);
      const tAssetBalB4 = await tAsset.balanceOf(signer1.address);
      const collateralTokenBalB4 = await collateralToken.balanceOf(signer1.address);
      await tAsset.connect(signer1).claimTestTokens();
      const tAssetBalAfter = await tAsset.balanceOf(signer1.address);
      const collateralTokenBalAfter = await collateralToken.balanceOf(signer1.address);
      expect(bn(collateralTokenBalAfter).gt(bn(collateralTokenBalB4))).to.be.true;
      expect(bn(tAssetBalAfter).gt(bn(tAssetBalB4))).to.be.true;
    });

    it("Should not be able to claim tokens if not signup", async () => {
      const { 
        tAsset,
        collateralToken,
        testAssetAddr,
        signers: { signer1, deployer},
         } = await loadFixture(deployContractsFixcture);
      
      await collateralToken.connect(deployer).transfer(testAssetAddr, '100000000000000000000000');
      await expect(tAsset.connect(signer1).claimTestTokens()).to.be.revertedWith('Not approved');
    });
    
    it("Should not be able to claim tokens if signup but not approved", async () => {
      const { 
        tAsset,
        collateralToken,
        testAssetAddr,
        signers: { signer1, deployer},
         } = await loadFixture(deployContractsFixcture);
      
      await collateralToken.connect(deployer).transfer(testAssetAddr, '100000000000000000000000');
      await tAsset.connect(signer1).joinTestnet();
      await expect(tAsset.connect(signer1).claimTestTokens()).to.be.revertedWith('Not approved');
    });
  });
});


