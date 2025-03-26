import { 
  compareEqualString, 
  bigintToStr, 
  sumToString, 
  reduce, 
  TEN_THOUSAND_TOKEN,
  ONE_HUNDRED_TOKEN,
  formatAddr,
  bn,
  ZERO,
  FEE,
  proposeTransaction,
  TrxnType,
  Status_Dist,
  signTransaction,
} from "./utilities";

import { deployContracts } from "./deployments";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { ethers } from "hardhat";
import { expect } from "chai";
import { Address } from "./types";

describe("Collateral Token: Using Simplifi Token as the collateral asset", function () {
  async function deployContractsFixcture() {
    return { 
        ...await deployContracts(ethers.getSigners),
    };
  }

  describe("Distributor test cases", function () {
    it("Confirm each address added as a signer is truly a signer", async function () {
      const { signers_distributor, distributor } = await loadFixture(deployContractsFixcture);
      
      // Test case for each signer
      signers_distributor.forEach(async(signer) => {
        const isSigner = await distributor.signers(signer);
        expect(isSigner).to.be.true;
      })
    });

    it("Create a new ERC20 transfer transaction", async function () {
      const { distributor, signers: {signer1, alc1} } = await loadFixture(deployContractsFixcture);
      const transferAmt = TEN_THOUSAND_TOKEN;
      const { reqId, request } = await proposeTransaction({signer: signer1, recipient: alc1.address as Address, amount: transferAmt, contract: distributor, delayInHrs: 0, trxType: TrxnType.ERC20});
      const quorum = await distributor.quorum();
      expect(quorum).to.be.eq();
      expect(reqId).to.be.eq(1n);
      expect(request.delay).to.be.eq(ZERO);
      expect(request.amount).to.be.eq(transferAmt);
      expect(request.executors.length).to.be.eq(1n);
      expect(request.executors[0]).to.be.eq(signer1.address);
      expect(request.status).to.be.eq(Status_Dist.INITIATED);
      expect(request.txType).to.be.eq(TrxnType.ERC20);
      expect(request.recipient).to.be.eq(alc1.address);
    });
    
    it("Create a native transfer transaction", async function () {
      const { collateralToken, signers_distributor, distributor, distributorAddr, signers: {deployer, signer1, devAddr, alc1} } = await loadFixture(deployContractsFixcture);
      const transferAmt = TEN_THOUSAND_TOKEN;
      const { request } = await proposeTransaction({signer: signer1, recipient: alc1.address as Address, amount: transferAmt, contract: distributor, delayInHrs: 0, trxType: TrxnType.NATIVE});
      expect(request.txType).to.be.eq(TrxnType.NATIVE);
    });

    it("Create a request to add new signer", async function () {
      const { distributor, signers: { signer1, alc1} } = await loadFixture(deployContractsFixcture);
      const transferAmt = TEN_THOUSAND_TOKEN;
      const { request } = await proposeTransaction({signer: signer1, recipient: alc1.address as Address, amount: transferAmt, contract: distributor, delayInHrs: 0, trxType: TrxnType.ADDSIGNER});
      expect(request.txType).to.be.eq(TrxnType.ADDSIGNER);
    });

    it("Create a request to add new signer", async function () {
      const { distributor, signers: { signer1, alc1} } = await loadFixture(deployContractsFixcture);
      const transferAmt = TEN_THOUSAND_TOKEN;
      const { request } = await proposeTransaction({signer: signer1, recipient: alc1.address as Address, amount: transferAmt, contract: distributor, delayInHrs: 0, trxType: TrxnType.REMOVESIGNER});
      expect(request.txType).to.be.eq(TrxnType.REMOVESIGNER);
    });

    it("Create a set quorum request", async function () {
      const { distributor, signers: { signer1, alc1} } = await loadFixture(deployContractsFixcture);
      const transferAmt = TEN_THOUSAND_TOKEN;
      const { request } = await proposeTransaction({signer: signer1, recipient: alc1.address as Address, amount: transferAmt, contract: distributor, delayInHrs: 0, trxType: TrxnType.SETQUORUM});
      expect(request.txType).to.be.eq(TrxnType.SETQUORUM);
    });

    it("Sign transaction", async function () {
      const { distributor, signers: { signer1, alc1, deployer} } = await loadFixture(deployContractsFixcture);
      const transferAmt = TEN_THOUSAND_TOKEN;
      const { reqId } = await proposeTransaction({signer: signer1, recipient: alc1.address as Address, amount: transferAmt, contract: distributor, delayInHrs: 0, trxType: TrxnType.SETQUORUM});
      const {
        executors,
        status
      } = await signTransaction({signer: deployer, requestId: reqId, contract: distributor});
      expect(status).to.be.eq(Status_Dist.PENDING);
    });
  });
});


