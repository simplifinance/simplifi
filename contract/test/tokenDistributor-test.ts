import { deployContracts } from "./Deployments"
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import type { Addresses, Balances } from "./types";
import { ethers } from "hardhat";
import { expect } from "chai";
import { signAndExecuteTransaction, balanceOf, balances, initiateTransaction, accountBalances,} from "./Index";
  import { 
    compareEqualString,
    reduce,
    bn,
    QUORUM,
    FEE,
    toHex,
    buildstring,
    sumToString,
    VALUE_TO_SEND,
    formatAddr
  } from "./Utils";
import { toBigInt } from "ethers";

describe("RouterUpgradeable", function () {
  async function deployContractsFixcture() {
    // const [deployer, feeTo, alc3, signer1, signer2, signer3] = await ethers.getSigners();

    // const attorney = await deployAttorneyUpgradeable(feeTo.address, FEE);
    // const attorneyAddr = await attorney.getAddress();
  
    // const reserve = await deployReserveUpgradeable();
    // const reserveAddr = await reserve.getAddress();
  
    // const initTokenReceiver = await deployInitialTokenReceiver(
    //   Array.from([
    //     signer1.address, 
    //     signer2.address, 
    //     signer3.address
    //   ]),
    //   QUORUM
    // );
    // const initTokenReceiverAddr = await initTokenReceiver.getAddress();
  
    // const tokenV1 = await deployTokenUpgradeable(Array.from([attorneyAddr, reserveAddr, initTokenReceiverAddr]));
    // const tokenAddr = await tokenV1.getAddress();
  
    // const assetAdmin = await deployAssetAdmin(tUSDAddr);
    // const assetAdminAddr = await assetAdmin.getAddress();
  
    // const strategy = await deployImplementationInstance();
    // const strategyAdmin = await deployAccountStrategyAdmin(tokenAddr: formatAddr(tokenAddr), assetAdminAddr, strategy);
    // const strategyAdminAddr = await strategyAdmin.getAddress();
  
    // const router = await deployRouterUpgradeable(tokenAddr: formatAddr(tokenAddr), assetAdminAddr, strategyAdminAddr, libAddr, trusteeAddr);
  
    // const routerAddr = await router.getAddress();
    // const permissionlessRouterAddr = await permissionlessRouter.getAddress();
    // await trustee.setAddresses(routerAddr, strategyAdminAddr, feeTo.address);
    
    
    return { ...await deployContracts(ethers.getSigners) };
  }
  
  describe("Token distributor (Multisig account)...", function () {
    it("it should initiate and execute request to transfer token", async () => {
      const { 
        token,
        tokenAddr,
        signers,
        initTokenReceiver, 
        initTokenReceiverAddr } = await loadFixture(deployContractsFixcture);
      
      const { signer1, signer2, signer3, deployer, alc3 } = signers;
      let reqId = 0;
      const amount = toHex(buildstring('1', '0', 22));
      const initBal_distributor = await balanceOf(token, formatAddr(initTokenReceiverAddr));
      const initBal_receiver = await balanceOf(token, formatAddr(alc3.address));
      
      // Initiate transaction to transfer from signer1
      await initiateTransaction({
        initTokenReceiver,
        tokenAddr: formatAddr(tokenAddr),
        recipient: formatAddr(alc3.address),
        deployer,
        from: signer1,
        amount,
        trxnType: 0,
        callback: () => {
          reqId ++;
        }
      });

      await signAndExecuteTransaction({reqId, signers: Array.from([signer2, signer3]), initTokenReceiver});
      const alcInfo_sender = await accountBalances(token, formatAddr(initTokenReceiverAddr));
      const alcInfo_receiver = await token.accountBalances(formatAddr(alc3.address));
      compareEqualString(bn(alcInfo_sender[0]).toString(), reduce(initBal_distributor, amount).toString());
      compareEqualString(bn(alcInfo_receiver[0]).toString(), sumToString(initBal_receiver, amount));
    });

    it("it should initiate and execute to transfer network asset", async () => {
      const { 
        token,
        tokenAddr,
        signers,
        initTokenReceiver, 
        initTokenReceiverAddr } = await loadFixture(deployContractsFixcture);
      
      const { signer1, signer2, signer3, deployer, alc3 } = signers;
      let reqId = 0;
      // const amountSentToDistributor = toHex(buildstring('2', '0', 18));
      const amount = toHex(buildstring('1', '0', 18));
      await initTokenReceiver.deposit({value: VALUE_TO_SEND});
      const initBal_distributor = await ethers.provider.getBalance(formatAddr(initTokenReceiverAddr));
      expect(initBal_distributor).to.be.equal(VALUE_TO_SEND);
      
      const initBal_receiver = await ethers.provider.getBalance(formatAddr(alc3.address));
      
      // Initiate transaction to transfer from signer1
      await initiateTransaction({
        initTokenReceiver,
        tokenAddr: formatAddr(tokenAddr),
        recipient: formatAddr(alc3.address),
        deployer,
        from: signer1,
        amount,
        trxnType: 1,
        callback: () => {
          reqId ++;
        }
      });

      await signAndExecuteTransaction({reqId, signers: Array.from([signer2, signer3]), initTokenReceiver});
      const balSenderAfter = await ethers.provider.getBalance(formatAddr(initTokenReceiverAddr));
      const balReceiverAfter = await ethers.provider.getBalance(formatAddr(alc3.address));
      compareEqualString(bn(balSenderAfter).toString(), reduce(initBal_distributor, amount).toString());
      compareEqualString(bn(balReceiverAfter).toString(), sumToString(initBal_receiver, amount));
    });
    
    it("Should add new signer successfully", async () => {
      const { 
        token,
        tokenAddr,
        signers,
        initTokenReceiver, 
        initTokenReceiverAddr } = await loadFixture(deployContractsFixcture);
      
      const { signer1, signer2, signer3, deployer, alc3 } = signers;
      
      let reqId = 0;
      // const amountSentToDistributor = toHex(buildstring('2', '0', 18));
      const amount = toHex(buildstring('1', '0', 18));
      await initTokenReceiver.deposit({value: VALUE_TO_SEND});
      const initBal_distributor = await ethers.provider.getBalance(formatAddr(initTokenReceiverAddr));
      expect(initBal_distributor).to.be.equal(VALUE_TO_SEND);

      const initBal_receiver = await ethers.provider.getBalance(formatAddr(alc3.address));
      
      // Initiate transaction to transfer from signer1
      await initiateTransaction({
        initTokenReceiver,
        tokenAddr: formatAddr(tokenAddr),
        recipient: formatAddr(alc3.address),
        deployer,
        from: signer1,
        amount,
        trxnType: 2,
        callback: () => {
          reqId ++;
        }
      });

      await signAndExecuteTransaction({reqId, signers: Array.from([signer2, signer3]), initTokenReceiver});
      const executors = await initTokenReceiver.getExecutors();
      // console.log(executors);
      expect(executors.length).to.be.equal(4);
      expect(executors[3]).to.be.equal(formatAddr(alc3.address));

      // We can now test to be sure that the new signer can successfully initiate sign transaction
      await initiateTransaction({
        initTokenReceiver,
        tokenAddr: formatAddr(tokenAddr),
        recipient: formatAddr(alc3.address),
        deployer,
        from: alc3,
        amount,
        trxnType: 1,
        callback: () => {
          reqId ++;
        }
      });

      await signAndExecuteTransaction({reqId, signers: Array.from([signer2, signer3]), initTokenReceiver});
      const balSenderAfter = await ethers.provider.getBalance(formatAddr(initTokenReceiverAddr));
      const balReceiverAfter = await ethers.provider.getBalance(formatAddr(alc3.address));
      compareEqualString(bn(balSenderAfter).toString(), reduce(initBal_distributor, amount).toString());
      expect(balReceiverAfter).to.be.gt(initBal_receiver);
    });

    it("Should remove a signer successfully", async () => {
      const { 
        token,
        tokenAddr,
        signers,
        initTokenReceiver, 
        initTokenReceiverAddr } = await loadFixture(deployContractsFixcture);
      
      const { signer1, signer2, signer3, deployer, alc3 } = signers;
      let reqId = 0;
      // const amountSentToDistributor = toHex(buildstring('2', '0', 18));
      const amount = toHex(buildstring('1', '0', 18));
      await initTokenReceiver.deposit({value: VALUE_TO_SEND});
      const initBal_distributor = await ethers.provider.getBalance(formatAddr(initTokenReceiverAddr));
      expect(initBal_distributor).to.be.equal(VALUE_TO_SEND);

      // First, we add alc3
      await initiateTransaction({
        initTokenReceiver,
        tokenAddr: formatAddr(tokenAddr),
        recipient: formatAddr(alc3.address),
        deployer,
        from: signer1,
        amount,
        trxnType: 2,
        callback: () => {
          reqId ++;
        }
      });

      await signAndExecuteTransaction({reqId, signers: Array.from([signer2, signer3]), initTokenReceiver});
      const executors = await initTokenReceiver.getExecutors();
      expect(executors.length).to.be.equal(4);
      expect(executors[3]).to.be.equal(formatAddr(alc3.address));

      // Now, we remove alc3. Signer2 makes the proposal.
      await initiateTransaction({
        initTokenReceiver,
        tokenAddr: formatAddr(tokenAddr),
        recipient: formatAddr(alc3.address),
        deployer,
        from: signer2,
        amount,
        trxnType: 3,
        callback: () => {
          reqId ++;
        }
      });

      await signAndExecuteTransaction({reqId, signers: Array.from([signer1, signer3]), initTokenReceiver});

      // We can now test to be sure that the new alc3 cannot make sign any transaction
      await initTokenReceiver.connect(deployer).setToken(tokenAddr);
      await expect(initTokenReceiver.connect(alc3).initiateTransaction(alc3.address, amount, 0, 1))
      .to.revertedWith("Not a signer");
    });

    it("Should change quorum successfully", async () => {
      const { 
        token,
        tokenAddr,
        signers,
        initTokenReceiver, 
        initTokenReceiverAddr } = await loadFixture(deployContractsFixcture);
      
      const { signer1, signer2, signer3, deployer, alc3 } = signers;
      let reqId = 0;
      // const amountSentToDistributor = toHex(buildstring('2', '0', 18));
      const amount = toHex(buildstring('1', '0', 18));
      await initTokenReceiver.deposit({value: VALUE_TO_SEND});
      const initBal_distributor = await ethers.provider.getBalance(formatAddr(initTokenReceiverAddr));
      expect(initBal_distributor).to.be.equal(VALUE_TO_SEND);
      const initBal_receiver = await ethers.provider.getBalance(formatAddr(alc3.address));
      const newQuorum = 2;

      // First, we add alc3
      await initiateTransaction({
        initTokenReceiver,
        tokenAddr: formatAddr(tokenAddr),
        recipient: formatAddr(buildstring('0x', '0', 40)),
        deployer,
        from: signer3,
        amount: toBigInt(newQuorum),
        trxnType: 4,
        callback: () => {
          reqId ++;
        }
      });

      await signAndExecuteTransaction({reqId, signers: Array.from([signer1, signer2]), initTokenReceiver});
      const quorum : bigint = await initTokenReceiver.quorum();
      expect(quorum).to.be.equal(2);

      // Let's check that that 2 signers can execute transactions.
      await initiateTransaction({
        initTokenReceiver,
        tokenAddr: formatAddr(tokenAddr),
        recipient: formatAddr(alc3.address),
        deployer,
        from: signer2,
        amount,
        trxnType: 1,
        callback: () => {
          reqId ++;
        }
      });
      await signAndExecuteTransaction({reqId, signers: Array.from([signer3]), initTokenReceiver});

      const balSenderAfter = await ethers.provider.getBalance(formatAddr(initTokenReceiverAddr));
      const balReceiverAfter = await ethers.provider.getBalance(formatAddr(alc3.address));
      compareEqualString(bn(balSenderAfter).toString(), reduce(initBal_distributor, amount).toString());
      expect(balReceiverAfter).to.be.gt(initBal_receiver);
    });                                 
  });                                           
});
