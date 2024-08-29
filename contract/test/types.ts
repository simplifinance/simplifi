import type { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { ContractTransactionResponse, ethers } from "ethers";
import { Hex, Address as ContractAddress } from "viem";
import type { AssetClass, Attorney, Factory, Reserve, SimpliToken, SmartStrategyAdmin, TestUSDT, TokenDistributor, Trustee } from "../typechain-types";

export type BigNumber = ethers.BigNumberish
export type AddressReturn = Promise<Address>;
export type Signer = HardhatEthersSigner;
export type Addresses = Array<Address>;
export type Null = Promise<void>;
export type NullNoPromise = void;
export type Address = ContractAddress;
export type PromiHex = Promise<Hex>;
export type PromiAddress = Promise<Address>;
export type PromiBigNumber = Promise<BigNumber>;
export type PromiObject = Promise<Object>;
export type BigIntArray = Array<bigint>;
export type PromiString = Promise<Array<string>>;
export type ContractResponse = Promise<import("ethers").ContractTransactionResponse>;
export type StrBigHex = string | BigNumber | Hex | bigint;
export type Signers = Promise<Signer[]>;
export interface SignersObj {
  deployer: Signer; 
  alc1: Signer; 
  alc2: Signer; 
  alc3: Signer; 
  routeTo: Signer; 
  feeTo: Signer; 
  signer1:Signer; 
  signer2:Signer; 
  signer3:Signer; 
  devAddr:Signer;
};

export type SignersArr = Signer[];

export interface CreateRouterParam {
  quorum: number;
  durationInHours : number; 
  colCoverageRatio: number;
  amount: Hex;
  asset: Address;
  participants: Addresses;
  contract: FactoryReturnType;
  creator: Signer;
}

export interface FunctionParam {
  poolId: number; 
  from: Signer;
  factory: FactoryReturnType;
  account?: Address;
}

export interface Liquidation {
  position : number;
  target: Address;
  expectedRepaymentTime: number;
  debt: BigNumber;
  colBalInToken: BigNumber;
}

export type Protected = [bigint, Address];
export type Balances = [bigint, Protected];

// export type PromiProtected = Promise<Protected>;

export interface InitTrxnParam {
  initTokenReceiver: TokenDistributorReturnType;
  tokenAddr: Address;
  recipient: Address;
  deployer: Signer;
  from: Signer;
  amount: bigint;
  trxnType: number;
  callback: () => void;
}

export interface BatchParam {
  token:  SimpliTokenReturnType;
  alc1: Signer;
  tos: Addresses;
  amounts: Array<Hex>;
}

export interface ReduceAllowanceParam {
  token:  SimpliTokenReturnType; 
  alc1: Signer; 
  alc2: Address;
  value: Hex;
}

export interface UnlockTokenParam {
  token: SimpliTokenReturnType; 
  alc1: Signer; 
  value: Hex;
}

export interface LockTokenParam {
  token:  SimpliTokenReturnType;
  alc1: Signer; 
  alc3: Address;
  value: Hex;
}

export interface GetAllowanceParam {
  token:  SimpliTokenReturnType;
  alc1: Address; 
  alc2: Address;
}

export interface ApproveParam {
  token: SimpliTokenReturnType; 
  alc1: Signer; 
  alc2: Address; 
  value: Hex;
}

export interface TrxFrmParam {
  token: SimpliTokenReturnType; 
  alc2: Signer; 
  alc1: Address;
  alc3: Address;
  value: Hex;
}

export interface SignTx {
  initTokenReceiver: TokenDistributorReturnType;
  signers: Array<Signer>; 
  reqId: number;
}

export interface PublicBandParam {
  factory: FactoryReturnType;
  signer: Signer;
  quorum : number;
  durationInHours: number;
  colCoverageRatio: number;
  amount: Hex;
  asset: Address;
}

export interface PrivateBandParam {
  factory: FactoryReturnType;
  signer: Signer;
  durationInHours: number;
  colCoverageRatio: number;
  amount: Hex;
  asset: Address;
  participants: Addresses;
}

export interface BandParam {
  poolId: number;
  factory: FactoryReturnType;
  signer: Signer;
}

export interface SetVariableParam {
  factory: FactoryReturnType;
  signer: Signer;
  feeTo: Address;
  token: Address;
  trustee: Address;
  assetAdmin: Address;
  makerRate: number;
  creationFee: Hex;
}

export interface FundAccountParam {
  initTokenReceiver: TokenDistributorReturnType;
  token: SimpliTokenReturnType;
  testUSD: TestUSDTReturnType;
  tokenAddr: Address;
  recipient: Address;
  deployer: Signer;
  signer1: Signer;
  signer2: Signer;
  signer3: Signer;
}

export interface CreateStrategyParam {
  strategyAdmin: SmartStrategyAdminReturnType;
  signers: SignersArr;
  callback: () => void;
}

export interface FundStrategyParam {
  tUSD: TestUSDTReturnType | SimpliTokenReturnType;
  recipients: Addresses;
  froms: SignersArr;
  amount: Hex;
  operation: string;
}

export interface JoinABandParam {
  factory: FactoryReturnType;
  signers: SignersArr;
  poolId: number;
}

export interface GetPaidParam {
  factory: FactoryReturnType;
  signers: SignersArr;
  poolId: number;
  runPayback: boolean;
  token: SimpliTokenReturnType;
  tcUSD: TestUSDTReturnType;
  signerAddrs: Addresses;
  strategies: Addresses;
  trusteeAddr: Address;
}

export interface GetPaidResultParam {
  tokenB4: BigIntArray;
  tokenAfter: BigIntArray;
  usdB4: BigIntArray;
  usdAfter: BigIntArray;
}

export type FactoryReturnType = Factory & {
  deploymentTransaction(): ContractTransactionResponse;
};

export type TokenReturnType = SimpliToken & {
  deploymentTransaction(): ContractTransactionResponse;
};

export type AssetClassReturnType = AssetClass & {
  deploymentTransaction(): ContractTransactionResponse;
};

export type TestUSDTReturnType = TestUSDT & {
  deploymentTransaction(): ContractTransactionResponse;
};

export type SmartStrategyAdminReturnType = SmartStrategyAdmin & {
  deploymentTransaction(): ContractTransactionResponse;
};

export type SimpliTokenReturnType = SimpliToken & {
  deploymentTransaction(): ContractTransactionResponse;
};

export type TokenDistributorReturnType = TokenDistributor & {
  deploymentTransaction(): ContractTransactionResponse;
};

export type TrusteeReturnType = Trustee & {
  deploymentTransaction(): ContractTransactionResponse;
};

export type AttorneyReturnType = Attorney & {
  deploymentTransaction(): ContractTransactionResponse;
};

export type ReserveReturnType = Reserve & {
  deploymentTransaction(): ContractTransactionResponse;
};

