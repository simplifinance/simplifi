import { 
  TEN_THOUSAND_TOKEN,
  bn,
  ZERO,
  proposeTransaction,
  TrxnType,
  Status_Dist,
  signTransaction,
  QUORUM,
  executeTransaction,
  DURATION_IN_HOURS,
} from "./utilities";

import { deployContracts } from "./deployments";
import { loadFixture, time } from "@nomicfoundation/hardhat-toolbox/network-helpers";
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

    it("Create a new ERC20 transfer transaction and execute", async function () {
      const { distributor, signers: {signer1, alc1Addr, signer1Addr, }, } = await loadFixture(deployContractsFixcture);
      const transferAmt = TEN_THOUSAND_TOKEN;
      const { recipient, amount, executors, txType, status, delay, id} = await proposeTransaction({signer: signer1, recipient: alc1Addr as Address, amount: transferAmt, contract: distributor, delayInHrs: 0, trxType: TrxnType.ERC20});
      const quorum = await distributor.quorum();
      expect(quorum).to.be.eq(BigInt(QUORUM - 1));
      expect(id).to.be.eq(2n); // This because we'd created a request immediately after deployment. See deploymemts.ts
      expect(delay).to.be.eq(ZERO);
      expect(amount).to.be.eq(transferAmt);
      expect(executors.length).to.be.eq(1n);
      expect(executors[0]).to.be.eq(signer1Addr);
      expect(status).to.be.eq(Status_Dist.INITIATED);
      expect(txType).to.be.eq(TrxnType.ERC20);
      expect(recipient).to.be.eq(alc1Addr);
    });
    
    it("Create a native transfer transaction", async function () {
      const { distributor, distributorAddr, signers: {deployer, signer1, alc2, alc1Addr, signer3, alc2Addr}, collateralToken, } = await loadFixture(deployContractsFixcture);
      const transferAmt = 10000000000000000000n;
      await alc2.sendTransaction({from: alc2Addr, to: distributorAddr, value: transferAmt});
      const { txType, id } = await proposeTransaction({signer: signer1, recipient: alc1Addr as Address, amount: transferAmt, contract: distributor, delayInHrs: 0, trxType: TrxnType.NATIVE});
      expect(txType).to.be.eq(TrxnType.NATIVE);

      const balOfAlcB4Exec = await alc2.provider?.getBalance(alc2Addr);
      const balOfDistB4Exec = await alc2.provider?.getBalance(distributorAddr);
      // console.log("balOfAlcB4Exec", balOfAlcB4Exec);
      // console.log("balOfDistB4Exec", balOfDistB4Exec);
      await signTransaction({signer: deployer, requestId: id, contract: distributor});
      const exec = await executeTransaction({signer: signer3, contract: distributor, reqId: id});
      const balOfDistAfterExec = await alc2.provider?.getBalance(distributorAddr);
      const balOfAlcAfterExec = await alc2.provider?.getBalance(alc1Addr);
      expect(bn(balOfAlcAfterExec).gt(bn(balOfAlcB4Exec))).to.be.true;
      expect(bn(balOfAlcAfterExec).gt(bn(balOfAlcB4Exec))).to.be.true;
      expect(bn(balOfDistAfterExec).lt(bn(balOfDistB4Exec))).to.be.true;
      expect(exec.status).to.be.eq(Status_Dist.EXECUTED);
    });

    it("Create a request to add new signer", async function () {
      const { distributor, signers: { signer1, deployer, signer3, alc1Addr,} } = await loadFixture(deployContractsFixcture);
      const transferAmt = TEN_THOUSAND_TOKEN;
      const { txType,id } = await proposeTransaction({signer: signer1, recipient: alc1Addr as Address, amount: transferAmt, contract: distributor, delayInHrs: 0, trxType: TrxnType.ADDSIGNER});
      expect(txType).to.be.eq(TrxnType.ADDSIGNER);

      const initSignersB4 = await distributor.getExecutors();
      const isSignerB4 = await distributor.signers(alc1Addr);
      await signTransaction({signer: deployer, requestId: id, contract: distributor});
      const exec = await executeTransaction({signer: signer3, contract: distributor, reqId: id});
      const initSignersAfter = await distributor.getExecutors();
      const isSignerAfter = await distributor.signers(alc1Addr);
      expect(bn(initSignersAfter.length).gt(bn(initSignersB4.length))).to.be.true;
      expect(isSignerB4).to.be.false;
      expect(isSignerAfter).to.be.true;
      expect(exec.status).to.be.eq(Status_Dist.EXECUTED);
    });

    it("Remove a signer", async function () {
      const { distributor, signers: { signer1, deployer, signer2, alc1Addr, extraAddr, signer2Addr, signer3Addr, signer1Addr, deployerAddr, signer3} } = await loadFixture(deployContractsFixcture);
      const transferAmt = TEN_THOUSAND_TOKEN;
      const { txType, id, executors: exec1 } = await proposeTransaction({signer: signer1, recipient: signer2Addr as Address, amount: transferAmt, contract: distributor, delayInHrs: 0, trxType: TrxnType.ADDSIGNER});
      expect(txType).to.be.eq(TrxnType.ADDSIGNER);
      await signTransaction({signer: deployer, requestId: id, contract: distributor});
      const {executors} = await executeTransaction({signer: signer3, contract: distributor, reqId: id});
      expect(executors.includes(signer2Addr));
      expect(executors.includes(signer3Addr));
      expect(executors.includes(deployerAddr));
      expect(executors.includes(signer1Addr));
      expect(executors.includes(extraAddr));
      expect(bn(executors.length).gt(bn(exec1.length)));

      // Propose remove signer
      const newProp = await proposeTransaction({signer: signer2, recipient: signer3Addr as Address, amount: transferAmt, contract: distributor, delayInHrs: 0, trxType: TrxnType.REMOVESIGNER});
      await signTransaction({signer: deployer, requestId: newProp.id, contract: distributor});
      const isSignerB4 = await distributor.signers(signer3Addr);
      const exec = await executeTransaction({signer: signer1, contract: distributor, reqId: newProp.id});
      const isSignerAfter = await distributor.signers(alc1Addr);
      
      expect(exec.executors.length).to.be.eq(executors.length);
      expect(isSignerB4).to.be.true;
      expect(isSignerAfter).to.be.false;
      expect(exec.status).to.be.eq(Status_Dist.EXECUTED);
    });

    it("Create a set quorum request", async function () {
      const { distributor, signers: { signer1, signer3, alc1Addr, deployer} } = await loadFixture(deployContractsFixcture);
      const newQuorum = 3n;  
      // Propose a new transaction to set quorum
      const { txType, id } = await proposeTransaction({signer: signer1, recipient: alc1Addr as Address, amount: newQuorum, contract: distributor, delayInHrs: 0, trxType: TrxnType.SETQUORUM});
      expect(txType).to.be.eq(TrxnType.SETQUORUM);
      await signTransaction({signer: deployer, requestId: id, contract: distributor});
      await executeTransaction({signer: signer3, contract: distributor, reqId: id});
      const quorum = await distributor.quorum();
      expect(txType).to.be.eq(TrxnType.SETQUORUM);
      expect(quorum).to.be.eq(newQuorum);
    });

    it("Create a set quorum request if quorum exceeds valid executors ", async function () {
      const { distributor, signers: { signer1, signer3, alc1Addr, deployer}, signers_distributor } = await loadFixture(deployContractsFixcture);
      const newQuorum = signers_distributor.length + 1;

      if(newQuorum > signers_distributor.length) {
        // Firstly, add new signer to increase the valid executors list
        const { txType, id } = await proposeTransaction({signer: signer1, recipient: alc1Addr as Address, amount: 0n, contract: distributor, delayInHrs: 0, trxType: TrxnType.ADDSIGNER});
        await signTransaction({signer: deployer, requestId: id, contract: distributor});
        await executeTransaction({signer: signer3, contract: distributor, reqId: id});
        expect(txType).to.be.eq(TrxnType.ADDSIGNER);
      }
      
      // Propose a new transaction to set quorum
      const prop = await proposeTransaction({signer: signer1, recipient: alc1Addr as Address, amount: BigInt(newQuorum), contract: distributor, delayInHrs: 0, trxType: TrxnType.SETQUORUM});
      expect(prop.txType).to.be.eq(TrxnType.SETQUORUM);
      await signTransaction({signer: deployer, requestId: prop.id, contract: distributor});
      await executeTransaction({signer: signer3, contract: distributor, reqId: prop.id});
      const quorum = await distributor.quorum();
      expect(quorum).to.be.eq(newQuorum);
    });

    it("Sign transaction", async function () {
      const { distributor, signers: { signer1, alc1Addr, deployer} } = await loadFixture(deployContractsFixcture);
      const transferAmt = TEN_THOUSAND_TOKEN;
      const quorum = await distributor.quorum();
      const { id } = await proposeTransaction({signer: signer1, recipient: alc1Addr as Address, amount: transferAmt, contract: distributor, delayInHrs: 0, trxType: TrxnType.SETQUORUM});
      const { executors, status } = await signTransaction({signer: deployer, requestId: id, contract: distributor});
      expect(status).to.be.eq(Status_Dist.PENDING);
      expect(executors.length).to.be.eq(quorum);
    });

    it("Execute ERC20 transfer request", async function () {
      const { distributor, collateralToken, distributorAddr, signers: { signer1, alc1Addr, signer3, deployer} } = await loadFixture(deployContractsFixcture);
      const quorum = await distributor.quorum();
      const balB4Execute = await collateralToken.balanceOf(distributorAddr);
      const balOfAcc1B4Execute = await collateralToken.balanceOf(alc1Addr);
      const { id } = await proposeTransaction({signer: signer1, recipient: alc1Addr as Address, amount: TEN_THOUSAND_TOKEN, contract: distributor, delayInHrs: 0, trxType: TrxnType.ERC20});
      await signTransaction({signer: deployer, requestId: id, contract: distributor});
      const {
        executors,
        status
      } = await executeTransaction({signer: signer3, contract: distributor, reqId: id});
      const balAfterExecute = await collateralToken.balanceOf(distributorAddr);
      const balOfAlc1AfterExecute = await collateralToken.balanceOf(alc1Addr);
      expect(status).to.be.eq(Status_Dist.EXECUTED);
      expect(executors.length).to.be.eq(quorum);
      expect(bn(balAfterExecute).lt(bn(balB4Execute))).to.be.true;
      expect(bn(balOfAlc1AfterExecute).gt(bn(balOfAcc1B4Execute))).to.be.true;
      expect(balOfAlc1AfterExecute).to.be.eq(TEN_THOUSAND_TOKEN);
    });
  });

  describe("Reverting tests", function () {
    it("Revert if quorum exceed valid executors", async function () {
      const { distributor, signers: { signer1, deployer, alc1Addr, signer3}, signers_distributor } = await loadFixture(deployContractsFixcture);
      const newQuorum = BigInt(signers_distributor.length + 1);
      const { txType, id } = await proposeTransaction({signer: signer1, recipient: alc1Addr as Address, amount: newQuorum, contract: distributor, delayInHrs: 0, trxType: TrxnType.SETQUORUM});
      await signTransaction({signer: deployer, requestId: id, contract: distributor});
      await expect( 
        distributor.connect(signer3).executeTransaction(id)
      ).to.be.revertedWith("await signTransaction({signer: deployer, requestId: id, contract: distributor});");
      // ).to.be.revertedWith("Quorum exceed valid executors"); // swap this if the test failed

      expect(txType).to.be.eq(TrxnType.SETQUORUM);
    });

    it("Non-Signers should not propose transaction", async function () {
      const { distributor, signers: { alc1, deployer} } = await loadFixture(deployContractsFixcture);
      const transferAmt = TEN_THOUSAND_TOKEN;
      await expect(
        distributor.connect(alc1).proposeTransaction(deployer, transferAmt, 0, TrxnType.ERC20)
      ).to.be.revertedWith("Not a signer");
    });

    it("Non-Signers should not sign transaction", async function () {
      const { distributor, signers: { signer1, alc1, alc1Addr, } } = await loadFixture(deployContractsFixcture);
      const transferAmt = TEN_THOUSAND_TOKEN;
      const { id } = await proposeTransaction({signer: signer1, recipient: alc1Addr as Address, amount: TEN_THOUSAND_TOKEN, contract: distributor, delayInHrs: 0, trxType: TrxnType.ERC20});
      await expect(
        distributor.connect(alc1).signTransaction(id)
      ).to.be.revertedWith("Not a signer");
    });


    it("Non-Signers should not execute transaction", async function () {
      const { distributor, signers: { signer1, alc1, alc1Addr, deployer} } = await loadFixture(deployContractsFixcture);
      // const transferAmt = TEN_THOUSAND_TOKEN;
      const { id } = await proposeTransaction({signer: signer1, recipient: alc1Addr as Address, amount: TEN_THOUSAND_TOKEN, contract: distributor, delayInHrs: 0, trxType: TrxnType.ERC20});
      await signTransaction({signer: deployer, requestId: id, contract: distributor});
      await expect(
        distributor.connect(alc1).executeTransaction(id)
      ).to.be.revertedWith("Not a signer");
    });
    
    it("Signing transaction should fail if expired", async function () {
      const { distributor, signers: { signer1, alc1Addr, deployer} } = await loadFixture(deployContractsFixcture);
      // const transferAmt = TEN_THOUSAND_TOKEN;
      const prop = await proposeTransaction({signer: signer1, recipient: alc1Addr as Address, amount: TEN_THOUSAND_TOKEN, contract: distributor, delayInHrs: 0, trxType: TrxnType.ERC20});
      const expirationTime = BigInt((await time.latest()) + (((60 * 60) * DURATION_IN_HOURS) * 15));
      await time.increaseTo(expirationTime);
      const sign = await signTransaction({signer: deployer, requestId: prop.id, contract: distributor});
      expect(prop.status).to.be.eq(Status_Dist.INITIATED);
      expect(sign.status).to.be.eq(Status_Dist.EXPIRED);
    });

    it("Request should expire if not executed within appropriate time", async function () {
      const { distributor, signers: { signer1, alc1Addr, signer3, deployer} } = await loadFixture(deployContractsFixcture);
      const { id } = await proposeTransaction({signer: signer1, recipient: alc1Addr as Address, amount: TEN_THOUSAND_TOKEN, contract: distributor, delayInHrs: 0, trxType: TrxnType.ERC20});
      const sign = await signTransaction({signer: deployer, requestId: id, contract: distributor});
      const expirationTime = BigInt((await time.latest()) + (((60 * 60) * DURATION_IN_HOURS) * 15));
      await time.increaseTo(expirationTime);
      const exec = await executeTransaction({contract: distributor, reqId: id, signer: signer3});
      expect(sign.status).to.be.eq(Status_Dist.PENDING);
      expect(exec.status).to.be.eq(Status_Dist.EXPIRED);
    });
  });
});


