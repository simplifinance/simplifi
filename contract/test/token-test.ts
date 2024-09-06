import { 
  compareEqualString, 
  TOTALSUPPLY, 
  bigintToStr, 
  sumToString, 
  DECIMALS, 
  reduce, 
  SYMBOL, 
  NAME, 
  TEN_THOUSAND_TOKEN,
  ONE_HUNDRED_TOKEN,
  formatAddr
} from "./utilities";

import { deployContracts } from "./deployments";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { ethers } from "hardhat";
import { expect } from "chai";

describe("TestAsset: ERC20 asset as contribution base", function () {
  async function deployContractsFixcture() {
    return { ...await deployContracts(ethers.getSigners) };
  }

  describe("Deployment", function () {
    it("Should set tAsset name correctly", async function () {
      const { tAsset } = await loadFixture(deployContractsFixcture);
      compareEqualString(await tAsset.name(), NAME);
    });
    
    it("Should set tAsset symbol correctly", async function () {
      const { tAsset } = await loadFixture(deployContractsFixcture);
      compareEqualString(await tAsset.symbol(), SYMBOL);
    });

    it("Should set maxSupply correctly", async function () {
      const { tAsset } = await loadFixture(deployContractsFixcture);
      let tSupply : bigint = await tAsset.totalSupply();
      compareEqualString(bigintToStr(tSupply), TOTALSUPPLY);
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
    it("Should successfully transfer tAsset", async () => {
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
      const { 
        testAssetAddr,
        tAsset,
        signers: { alc1, alc2, signer1, signer2, signer3, deployer, },
         } = await loadFixture(deployContractsFixcture);

      await tAsset.connect(deployer).approve(alc1.address, ONE_HUNDRED_TOKEN);
      expect(await tAsset.allowance(deployer.address, alc1.address)).to.be.equal(ONE_HUNDRED_TOKEN);
    });
  });
});


