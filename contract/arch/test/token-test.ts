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
    it("Should set tAsset name correctly", async function () {
      const { assetBase } = await loadFixture(deployContractsFixcture);
      compareEqualString(await assetBase.name(), NAME);
    });
    
    it("Should set assetBase symbol correctly", async function () {
      const { assetBase } = await loadFixture(deployContractsFixcture);
      compareEqualString(await assetBase.symbol(), SYMBOL);
    });

    it("Should set maxSupply correctly", async function () {
      const { assetBase } = await loadFixture(deployContractsFixcture);
      let tSupply : bigint = await assetBase.totalSupply();
      compareEqualString(bigintToStr(tSupply), '100000000000000000000000');
    });

    it("Should set assetBase decimals correctly", async function () {
      const { assetBase } = await loadFixture(deployContractsFixcture);
      expect(await assetBase.decimals()).to.equal(DECIMALS);
    });
  });

  describe("Testing Token Logic", function () {
    it("Should confirm total amount minted to initial recipient.", async () => {
      const { assetBase, signers: { deployer }} = await loadFixture(deployContractsFixcture);
      expect(await assetBase.balanceOf(formatAddr(deployer.address))).to.be.equal(await assetBase.totalSupply())
    });

    /**
     * We have to first set up a signer from the Token Distributor contract,
     * perform a few steps such as initiate a transaction in order to effect
     * a transfer.
     */
    it("Should successfully transfer asset", async () => {
      const { 
        assetBase,
        signers: { alc1, deployer },
        } = await loadFixture(deployContractsFixcture);

      const initBal_sender = await assetBase.balanceOf(formatAddr(deployer.address));
      const initBal_receiver = await assetBase.balanceOf(formatAddr(alc1.address));
      await assetBase.connect(deployer).transfer(formatAddr(alc1.address), TEN_THOUSAND_TOKEN);
      const balOfSender = await assetBase.balanceOf(formatAddr(deployer.address));
      const balOfRec = await assetBase.balanceOf(formatAddr(alc1.address));
      expect(reduce(balOfSender, 0).toString()).to.be.equal(reduce(initBal_sender, TEN_THOUSAND_TOKEN).toString());
      expect(sumToString(balOfRec, 0).toString()).to.be.equal(sumToString(initBal_receiver, TEN_THOUSAND_TOKEN));
    });

    it("Should increase allowance of account", async () => {
      const { assetBase, signers: { alc1, deployer, }, } = await loadFixture(deployContractsFixcture);

      await assetBase.connect(deployer).approve(alc1.address, ONE_HUNDRED_TOKEN);
      expect(await assetBase.allowance(deployer.address, alc1.address)).to.be.equal(ONE_HUNDRED_TOKEN);
    });

    it("Should signUp for testnet", async () => {
      const { 
        assetBase,
        signers: { signer1 },
         } = await loadFixture(deployContractsFixcture);
      
      await assetBase.connect(signer1).joinTestnet();
      const data = await assetBase.indexes(signer1.address);
      expect(data.isSignedUp).to.be.true;
      expect(data.isApproved).to.be.false;
    });

    it("Should approve user for testnet participation", async () => {
      const { 
        assetBase,
        signers: { signer1, deployer},
         } = await loadFixture(deployContractsFixcture);
      
      await assetBase.connect(signer1).joinTestnet();
      await assetBase.connect(deployer).approveTester([signer1.address]);
      const data = await assetBase.indexes(signer1.address);
      // console.log("Data", data);
      expect(data.isSignedUp).to.be.true;
      expect(data.isApproved).to.be.true;
    });

    it("Should claim test tokens after approval", async () => {
      const { 
        assetBase,
        assetBaseAddr,
        collateralToken,
        signers: { signer1, deployer},
         } = await loadFixture(deployContractsFixcture);
      
      await collateralToken.connect(deployer).transfer(assetBaseAddr, '100000000000000000000000');
      await assetBase.connect(signer1).joinTestnet();
      await assetBase.connect(deployer).approveTester([signer1.address]);
      const assetBaseBalB4 = await assetBase.balanceOf(signer1.address);
      const collateralTokenBalB4 = await collateralToken.balanceOf(signer1.address);
      await assetBase.connect(signer1).claimTestTokens();
      const assetBaseBalAfter = await assetBase.balanceOf(signer1.address);
      const collateralTokenBalAfter = await collateralToken.balanceOf(signer1.address);
      expect(collateralTokenBalAfter).to.be.gt(collateralTokenBalB4);
      expect(assetBaseBalAfter).to.be.gt(assetBaseBalB4);
    });

    it("Should not be able to claim tokens if not signup", async () => {
      const { 
        assetBase,
        collateralToken,
        assetBaseAddr,
        signers: { signer1, deployer},
         } = await loadFixture(deployContractsFixcture);
      
      await collateralToken.connect(deployer).transfer(assetBaseAddr, '100000000000000000000000');
      await expect(assetBase.connect(signer1).claimTestTokens()).to.be.revertedWith('Not approved');
    });
    
    it("Should not be able to claim tokens if signup but not approved", async () => {
      const { 
        assetBase,
        collateralToken,
        assetBaseAddr,
        signers: { signer1, deployer},
         } = await loadFixture(deployContractsFixcture);
      
      await collateralToken.connect(deployer).transfer(assetBaseAddr, '100000000000000000000000');
      await assetBase.connect(signer1).joinTestnet();
      await expect(assetBase.connect(signer1).claimTestTokens()).to.be.revertedWith('Not approved');
    });
  });
});


