import { 
  compareEqualString, 
  TOTAL_LOCKED, 
  TOTALSUPPLY, 
  buildstring, 
  bigintToStr, 
  sumToString, 
  DECIMALS, 
  reduce, 
  SYMBOL, 
  toHex, 
  NAME, 
  bn, 
  TEN_THOUSAND_TOKEN,
  ONE_THOUSAND_TOKEN,
  ONE_HUNDRED_TOKEN,
  formatAddr, 
  convertStringsToAddresses,
} from "./utilities";

import { deployContracts } from "./deployments";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { ethers } from "hardhat";
import { expect } from "chai";
import { 
  signAndExecuteTransaction,
  initiateTransaction,
  decreaseAllowance,
  accountBalances,
  batchTransfer,
  transferFrom,
  getAllowance,
  panicUnlock,
  unlockToken,
  lockToken,
  balanceOf,
  balances,
  approve, } from "./tokenUtils";


describe("Simplifinance Token", function () {
  async function deployContractsFixcture() {
    return { ...await deployContracts(ethers.getSigners) };
  }

  describe("Deployment", function () {
    it("Should set token name correctly", async function () {
      const { token } = await loadFixture(deployContractsFixcture);
      compareEqualString(await token.name(), NAME);
    });
    
    it("Should set token symbol correctly", async function () {
      const { token } = await loadFixture(deployContractsFixcture);
      compareEqualString(await token.symbol(), SYMBOL);
    });

    it("Should set maxSupply correctly", async function () {
      const { token } = await loadFixture(deployContractsFixcture);
      let tSupply : bigint = await token.totalSupply();
      compareEqualString(bigintToStr(tSupply), TOTALSUPPLY);
    });

    it("Should set token decimals correctly", async function () {
      const { token } = await loadFixture(deployContractsFixcture);
      expect(await token.decimals()).to.equal(DECIMALS);
    });
  });

  describe("Testing Token Logic", function () {
    it("Should confirm total amount minted to initial recipient.", async () => {
      const { token, initTokenReceiverAddr } = await loadFixture(deployContractsFixcture);
      
      compareEqualString(bn(await balanceOf(token, formatAddr(initTokenReceiverAddr))).toString(), reduce(TOTALSUPPLY, TOTAL_LOCKED).toString());
    });

    /**
     * We have to first set up a signer from the Token Distributor contract,
     * perform a few steps such as initiate a transaction in order to effect
     * a transfer.
     */
    it("Should successfully transfer token", async () => {
      const { 
        token,
        tokenAddr,
        signers,
        initTokenReceiver, 
        initTokenReceiverAddr } = await loadFixture(deployContractsFixcture);
      
      const { alc1, signer1, signer2, signer3, deployer } = signers;

      let reqId = 0;
      const initBal_sender = await balanceOf(token, formatAddr(initTokenReceiverAddr));
      const initBal_receiver = await balanceOf(token, formatAddr(alc1.address));
      await initiateTransaction({
        initTokenReceiver,
        tokenAddr: formatAddr(tokenAddr),
        recipient: formatAddr(alc1.address),
        deployer,
        from: signer1,
        amount: TEN_THOUSAND_TOKEN,
        trxnType: 0,
        callback: () => {
          reqId ++;
        }
      });

      await signAndExecuteTransaction({reqId, signers: Array.from([signer2, signer3]), initTokenReceiver});
      const alcInfo_sender = await accountBalances(token, formatAddr(initTokenReceiverAddr));
      const alcInfo_receiver = await token.accountBalances(formatAddr(alc1.address));
      compareEqualString(bn(alcInfo_sender[0]).toString(), reduce(initBal_sender, TEN_THOUSAND_TOKEN).toString());
      compareEqualString(bn(alcInfo_receiver[0]).toString(), sumToString(initBal_receiver, TEN_THOUSAND_TOKEN));
    });

    it("Should dynamically transfer token to accounts using batchTransfer", async () => {
      const { 
        tokenAddr,
        token,
        signers,
        initTokenReceiver, } = await loadFixture(deployContractsFixcture);
        
      const { alc1, alc2, alc3, signer1, signer2, signer3, deployer, } = signers;
      let reqId = 0;
      await initiateTransaction({
        initTokenReceiver,
        tokenAddr: formatAddr(tokenAddr),
        recipient: formatAddr(alc1.address),
        deployer,
        from: signer1,
        amount: TEN_THOUSAND_TOKEN,
        trxnType: 0,
        callback: () => {
          reqId ++;
        }
      });
      await signAndExecuteTransaction({reqId, signers: [signer2, signer3], initTokenReceiver});

      const initBal_recs = await balances(token, convertStringsToAddresses([alc2.address, alc3.address]));
      const initBal_Alc1 = await balanceOf(token, formatAddr(alc1.address));
      var tos = convertStringsToAddresses([alc2.address, alc3.address]);
      var amounts = convertStringsToAddresses([toHex(ONE_THOUSAND_TOKEN), toHex(ONE_THOUSAND_TOKEN)]);
      await batchTransfer({token, alc1, tos, amounts});
      const curBal_recs = await balances(token, convertStringsToAddresses([alc2.address, alc3.address]));

      compareEqualString(bn(await balanceOf(token, formatAddr(alc1.address))).toString(), reduce(initBal_Alc1, sumToString(ONE_THOUSAND_TOKEN, ONE_THOUSAND_TOKEN)).toString());
      compareEqualString(bn(curBal_recs[0]).toString(), sumToString(bn(initBal_recs[0]).toString(), bn(ONE_THOUSAND_TOKEN).toString()));
      compareEqualString(bn(curBal_recs[1]).toString(), sumToString(bn(initBal_recs[1]).toString(), bn(ONE_THOUSAND_TOKEN).toString()));
    });

    it("Should increase allowance of account", async () => {
      const { 
        tokenAddr,
        token,
        signers,
        initTokenReceiver, } = await loadFixture(deployContractsFixcture);
        
      const { alc1, alc2, signer1, signer2, signer3, deployer, } = signers;
      let reqId = 0;
      await initiateTransaction({
        initTokenReceiver,
        tokenAddr: formatAddr(tokenAddr),
        recipient: formatAddr(alc1.address),
        deployer,
        from: signer1,
        amount: TEN_THOUSAND_TOKEN,
        trxnType: 0,
        callback: () => {
          reqId ++;
        }
      });
      await signAndExecuteTransaction({reqId, signers: Array.from([signer2, signer3]), initTokenReceiver});
      await approve({token, alc1, alc2: formatAddr(alc2.address), value: ONE_HUNDRED_TOKEN});

      compareEqualString(
        bn(
          await getAllowance({
            alc1: formatAddr(alc1.address), 
            alc2: formatAddr(alc2.address), 
            token
          })).toString(), 
          bn(ONE_HUNDRED_TOKEN).toString()
        );
    });

    it("Should reduce the allowance of a when b calls the decreaseAllowance", async () => {
      const { 
        tokenAddr,
        token,
        signers,
        initTokenReceiver, } = await loadFixture(deployContractsFixcture);
        
      const { alc1, alc2, signer1, signer2, signer3, deployer, } = signers;
      let reqId = 0;
      await initiateTransaction({
        initTokenReceiver,
        tokenAddr: formatAddr(tokenAddr),
        recipient: formatAddr(alc1.address),
        deployer,
        from: signer1,
        amount: TEN_THOUSAND_TOKEN,
        trxnType: 0,
        callback: () => {
          reqId ++;
        }
      });
      await signAndExecuteTransaction({reqId, signers: Array.from([signer2, signer3]), initTokenReceiver});
      await approve({token, alc1, alc2: formatAddr(alc2.address), value: ONE_THOUSAND_TOKEN});
      await decreaseAllowance({token,  alc1,  alc2: formatAddr(alc2.address), value: ONE_HUNDRED_TOKEN});
      compareEqualString(
        bn(
          await getAllowance({
            alc1: formatAddr(alc1.address), 
            alc2: formatAddr(alc2.address), 
            token
          })).toString(), 
          reduce(ONE_THOUSAND_TOKEN, ONE_HUNDRED_TOKEN).toString()
        );
    });

    it("Should increase the balance of account transferFrom is invoked", async () => {
      const { 
        tokenAddr,
        token,
        signers,
        initTokenReceiver, } = await loadFixture(deployContractsFixcture);
        
      const { alc1, alc2, alc3, signer1, signer2, signer3, deployer, } = signers;
      let reqId = 0;
      await initiateTransaction({
        initTokenReceiver,
        tokenAddr: formatAddr(tokenAddr),
        recipient: formatAddr(alc1.address),
        deployer,
        from: signer1,
        amount: TEN_THOUSAND_TOKEN,
        trxnType: 0,
        callback: () => {
          reqId ++;
        }
      });
      await signAndExecuteTransaction({reqId, signers: Array.from([signer2, signer3]), initTokenReceiver});
      await approve({token, alc1, alc2: formatAddr(alc2.address), value: ONE_THOUSAND_TOKEN});
      const init_bal = await balances(token, convertStringsToAddresses([alc1.address, alc3.address]));
      await transferFrom({token, alc2, alc1: formatAddr(alc1.address), alc3: formatAddr(alc3.address), value:ONE_THOUSAND_TOKEN});
      const current_bal = await balances(token, convertStringsToAddresses([alc1.address, alc3.address]));
      compareEqualString(bn(current_bal[0]).toString(), reduce(init_bal[0], ONE_THOUSAND_TOKEN).toString());
      compareEqualString(bn(current_bal[1]).toString(), sumToString(init_bal[1], ONE_THOUSAND_TOKEN));
    });

    it("Should lock token successfully", async () => {
      const { 
        tokenAddr,
        token,
        signers,
        initTokenReceiver, } = await loadFixture(deployContractsFixcture);
        
      const { alc1, alc3, signer1, signer2, signer3, deployer, } = signers;
      let reqId = 0;
      await initiateTransaction({
        initTokenReceiver,
        tokenAddr: formatAddr(tokenAddr),
        recipient: formatAddr(alc1.address),
        deployer,
        from: signer1,
        amount: TEN_THOUSAND_TOKEN,
        trxnType: 0,
        callback: () => {
          reqId ++;
        }
      });
      await signAndExecuteTransaction({reqId, signers: Array.from([signer2, signer3]), initTokenReceiver});
      const initBal = await balanceOf(token, formatAddr(alc1.address));
      await lockToken({token, alc1, alc3: formatAddr(alc3.address), value: ONE_HUNDRED_TOKEN});
      const alcBals = await accountBalances(token, formatAddr(alc1.address));
      compareEqualString(bn(alcBals[0]).toString(), reduce(initBal, ONE_HUNDRED_TOKEN).toString()); // spendable balance should be equal
      compareEqualString(alcBals[1][1], alc3.address); // Esape address should be thesame as alc3.address
    });

    it("Should unlock specific amount.", async () => {
      const { 
        tokenAddr,
        token,
        signers,
        initTokenReceiver, } = await loadFixture(deployContractsFixcture);
        
      const { alc1, alc3, signer1, signer2, signer3, deployer, } = signers;
      let reqId = 0;
      await initiateTransaction({
        initTokenReceiver,
        tokenAddr: formatAddr(tokenAddr),
        recipient: formatAddr(alc1.address),
        deployer,
        from: signer1,
        amount: TEN_THOUSAND_TOKEN,
        trxnType: 0,
        callback: () => {
          reqId ++;
        }
      });
      await signAndExecuteTransaction({reqId, signers: Array.from([signer2, signer3]), initTokenReceiver});
      const value = ONE_THOUSAND_TOKEN; // Increase allowance by 1000 token
      await lockToken({token, alc1, alc3: formatAddr(alc3.address), value});
      const valueToUnlock = ONE_HUNDRED_TOKEN; // Increase allowance by 1000 token
      const balsAlc1AfterLocked = await balanceOf(token, formatAddr(alc1.address));
      await unlockToken({token, alc1, value: valueToUnlock});
      const balsAlc1AfterUnlocked = await balanceOf(token, formatAddr(alc1.address));
      const balAlc3AfterUnLocked = await balanceOf(token, formatAddr(alc3.address));
      expect(balsAlc1AfterLocked).to.be.equal(balsAlc1AfterUnlocked);
      compareEqualString(toHex(bn(balAlc3AfterUnLocked).toString()), toHex(valueToUnlock));
    });

    it("Should successfully reClaim token assume alc1 has lost access to his account.", async () => {
      const { 
        tokenAddr,
        token,
        signers,
        attorney,
        initTokenReceiver, } = await loadFixture(deployContractsFixcture);
        
      const { alc1, feeTo, alc3, signer1, signer2, signer3, deployer, } = signers;
      let reqId = 0;
      await initiateTransaction({
        initTokenReceiver,
        tokenAddr: formatAddr(tokenAddr),
        recipient: formatAddr(alc1.address),
        deployer,
        from: signer1,
        amount: ONE_THOUSAND_TOKEN,
        trxnType: 0,
        callback: () => {
          reqId ++;
        }
      });
      await signAndExecuteTransaction({reqId, signers: Array.from([signer2, signer3]), initTokenReceiver});
      await lockToken({token, alc1, alc3: formatAddr(alc3.address), value: ONE_HUNDRED_TOKEN});
      await attorney.setToken(tokenAddr);
      const balAlc1B4Panic = await accountBalances(token, formatAddr(alc1.address));
      const eThBalOfDevB4Panic = await ethers.provider.getBalance(feeTo.address);
      compareEqualString(bn(balAlc1B4Panic[1][0]).toString(), bn(ONE_HUNDRED_TOKEN).toString()); // Check that the balance after token was locked is correct
      
      await panicUnlock(attorney, alc3, formatAddr(alc1.address));
      const balAlc1AfterPanic = await balanceOf(token, formatAddr(alc1.address));
      const eThBalOfDevAddrAfterPanic = await ethers.provider.getBalance(feeTo.address);
      const balOfAlc3AfterPanic = await balanceOf(token, formatAddr(alc3.address));
      compareEqualString(balAlc1AfterPanic.toString(),  '0');
      compareEqualString(bn(balOfAlc3AfterPanic).toString(), sumToString(balAlc1B4Panic[0], balAlc1B4Panic[1][0]));
      expect(eThBalOfDevAddrAfterPanic).to.gt(eThBalOfDevB4Panic);
    });
  });

    describe("Events", function () {
      it("Should emit an event on token Lock", async function () {
        const { 
          tokenAddr,
          token,
          signers,
          initTokenReceiver, } = await loadFixture(deployContractsFixcture);
          
        const { alc1, alc3, signer1, signer2, signer3, deployer, } = signers;
        let reqId = 0;
        await initiateTransaction({
          initTokenReceiver,
          tokenAddr: formatAddr(tokenAddr),
          recipient: formatAddr(alc1.address),
          deployer,
          from: signer1,
          amount: ONE_THOUSAND_TOKEN,
          trxnType: 0,
          callback: () => {
            reqId ++;
          }
        });
        await signAndExecuteTransaction({reqId, signers: Array.from([signer2, signer3]), initTokenReceiver});
        await expect(token.connect(alc1).lockToken(alc3.address, ONE_HUNDRED_TOKEN))
          .to.emit(token, "Locked")
          .withArgs(alc1.address, ONE_HUNDRED_TOKEN); // We accept any value as `when` arg
      });
    });

    describe("Change Ether balances", function () {
      it("Should change the Ether balances in both accounts", async () => {
        const { 
          tokenAddr,
          token,
          signers,
          attorney,
          initTokenReceiver, } = await loadFixture(deployContractsFixcture);
          
        const { alc1, feeTo, alc3, signer1, signer2, signer3, deployer, } = signers;
        let reqId = 0;
        await initiateTransaction({
          initTokenReceiver,
          tokenAddr: formatAddr(tokenAddr),
          recipient: formatAddr(alc1.address),
          deployer,
          from: signer1,
          amount: ONE_THOUSAND_TOKEN,
          trxnType: 0,
          callback: () => {
            reqId ++;
          }
        });
        await signAndExecuteTransaction({reqId, signers: Array.from([signer2, signer3]), initTokenReceiver});
        await lockToken({token, alc1, alc3: formatAddr(alc3.address), value: ONE_HUNDRED_TOKEN});
        await attorney.setToken(tokenAddr);
        const balAlc1B4Panic = await accountBalances(token, formatAddr(alc1.address));
        const eThBalOfFeeToB4Panic = await ethers.provider.getBalance(feeTo.address);
        compareEqualString(bn(balAlc1B4Panic[1][0]).toString(), bn(ONE_HUNDRED_TOKEN).toString()); // Check that the balance after token is ocked is correct
        
        await panicUnlock(attorney, alc3, formatAddr(alc1.address));
        const eThBalOfFeeToAfterPanic = await ethers.provider.getBalance(feeTo.address);
        expect(eThBalOfFeeToAfterPanic).to.gt(eThBalOfFeeToB4Panic);
      });
    });
});


