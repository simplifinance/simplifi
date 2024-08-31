import { FEE } from "../Utils";
import { Hex } from "viem";
import { deployContracts } from "../Deployments";
import { Address, Null, Signer, InitTrxnParam, SignTx, BatchParam, ApproveParam, GetAllowanceParam, ReduceAllowanceParam, UnlockTokenParam, LockTokenParam, TrxFrmParam, Addresses, BigIntArray, SimpliTokenReturnType, AttorneyReturnType, TestUSDTReturnType } from "../types";
import { Contract, ContractTransactionResponse } from "ethers";
import { IERC20 } from "../../typechain-types/contracts/apis";
import { ethers } from "hardhat";

export async function loadDeploymentFixtures() {
  return { 
    ...(await deployContracts(ethers.getSigners)),
  };
}

/**
 * @dev Sign transaction
 * @param tokenReceiver : Initial token receiver contract
 * @param signers : Signers
 * @param reqId : Request Id
 * @return void
 */
export const signAndExecuteTransaction = async(x: SignTx) : Null => {
  for (let i = 0; i < x.signers.length; i++) {
    await x.initTokenReceiver.connect(x.signers[i]).signTransaction(x.reqId);
  }
  await x.initTokenReceiver.connect(x.signers[0]).executeTransaction(x.reqId);
}

export const initiateTransaction = async(x: InitTrxnParam) : Null => {
  await x.initTokenReceiver.connect(x.deployer).setToken(x.tokenAddr);
  await x.initTokenReceiver.connect(x.from).initiateTransaction(x.recipient, x.amount, 0, x.trxnType)
  .then((result: any) => {
    if(result) x.callback();
  });
}
 
/**
 * @dev Return the balance of an account
 * @param token : Token contract
 * @param account : Account address
 * @returns Promise<string>
 */
export const balanceOf = async(token: SimpliTokenReturnType | TestUSDTReturnType, account: Address) : Promise<bigint> => {
  const result : bigint = await token.balanceOf(account);
  return result;
};

/**
 * @dev Transfer token of an amount to an account
 * @param token : Token contract
 * @param to : Recipient
 * @param from : Sender
 * @param amount : Value to send
 * @returns Promise<void>
 */
export const transfer = async(token: SimpliTokenReturnType | TestUSDTReturnType, to: Address, from: Signer, amount: bigint) : Null => {
  await token.connect(from).transfer(to, amount);
}

/**
 * @dev Transfer token of an amount to an account
 * @param token : Token contract
 * @param tos : Recipients
 * @param from : Sender
 * @param amounts : Array of values
 * @returns Promise<void>
 */
export const transferMultiple = async(token: SimpliTokenReturnType, tos: Addresses, from: Signer, amounts: BigIntArray) : Null => {
  await token.connect(from).batchTransfer(amounts, tos);
};

/**
 * @dev Transfer token of an amount to an account being an allowance 
 * previously given.
 * @param x: Parameters of type TrxFrmParam
 * @returns Promise<void>
 */
export const transferFrom = async(x: TrxFrmParam) : Null => {
  await x.token.connect(x.alc2).transferFrom(x.alc1, x.alc3, x.value);
};

/**
 * @dev Get the balances of accounts `a` and `b`.
 * @param a : EOA
 * @param b : EOA
 * @return Object<string>
 */
export const balances = async(token: SimpliTokenReturnType | TestUSDTReturnType, accounts: Addresses) : Promise<BigIntArray> => {
  let alcBalances : BigIntArray = [];
  for (let i = 0; i < accounts.length; i++) {
    const bal = await token.balanceOf(accounts[i]);
    alcBalances.push(bal);
  }
  // console.log("AlcBalances", alcBalances)
  return alcBalances;
};

/**
 * @dev Lock token
 * @param x: Parameters of type LockTokenParam
 */
export const lockToken = async(x: LockTokenParam) : Null => {
  await x.token.connect(x.alc1).lockToken(x.alc3, x.value);
};

/**
 * @dev Unlock token
 * @param x: Parameters of type UnlockTokenParam
 * @returns Promise<void>
 */
export const unlockToken = async(x: UnlockTokenParam) : Null => {
  await x.token.connect(x.alc1).unlockToken(x.value);
};

/**
 * Decrease allowance of 'x.alc2' by 'x.amount'
 * @param x: Parameters of type ReduceAllowanceParam
 * @returns Promise<void>
 */
export const decreaseAllowance = async(x: ReduceAllowanceParam) : Null => {
  await x.token.connect(x.alc1).decreaseAllowance(x.alc2, x.value);
};

/**
 * @dev Get the allowance of account x.alc2
 * @param x: Parameters of type GetAllowanceParam
 * @returns Promise<bigInt>
 */
export const getAllowance = async(x: GetAllowanceParam) : Promise<bigint> => {
  return await x.token.allowance(x.alc1, x.alc2);
};

/**
 * @dev Approve  account "to"
 * @param x: Parameters of type ApproveParam
 * @returns Promise<ContractTransactionResponse>
 */
export const approve = async(x: ApproveParam) : Promise<ContractTransactionResponse> => {
  return await x.token.connect(x.alc1).approve(x.alc2, x.value);
};

/**
 * @dev Get locked token information
 * @param token : Token Contract
 * @param account : Any address
 * @returns A structured data i.e struct in Solidity
 */
export const getInfo = async(token: SimpliTokenReturnType, account: Address) : Promise<IERC20.ProtectedStructOutput> => {
  return await token.getLockedInfo(account);
};

/**
 * @dev Send multiple transfer in one call
 * @param BatchParam: Parameters of type BatchParam
 */
export const batchTransfer = async(x: BatchParam) : Null => {
  await x.token.connect(x.alc1).batchTransfer(x.amounts, x.tos);
};

/**
 * @dev Return the locked balance information of 'account'
 * @param token : Token contract
 * @param account : Target account
 * @returns Promise<Balance>
 */
export const accountBalances = async(token: SimpliTokenReturnType, account: Address) : Promise<IERC20.BalancesStructOutput> => {
  return await token.accountBalances(account); 
};

export const panicUnlock = async (attorney: AttorneyReturnType, signer: Signer, accountToRetrieve: Address) : Promise<bigint> => {
  await attorney.connect(signer).panicUnlock(accountToRetrieve, { value: FEE});
  return FEE;
}
