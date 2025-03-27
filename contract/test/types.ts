import type { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { ContractTransactionResponse, ethers } from "ethers";
import { Hex, Address as ContractAddress } from "viem";
import type { 
  AssetClass, 
  Factory, 
  OwnerShip, 
  BankFactory, 
  TestBaseAsset, 
  Bank, 
  Escape, 
  Attorney, 
  Reserve,
  TokenDistributor, 
  SimpliToken } from "../typechain-types";
import { Common } from "../typechain-types/contracts/apis/IFactory";

export type BigNumber = ethers.BigNumberish
export type AddressReturn = Promise<Address>;
export type Signer = ethers.Signer;
export type Addresses = Array<Address>;
export type Null = Promise<void>;
export type NullNoPromise = void;
export type Address = ContractAddress;
export type StrBigHex = string | BigNumber | Hex | bigint | number;
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
  amount: bigint;
  asset: Address;
  participants: Addresses;
  contract: FactoryContract;
  creator: Signer;
}

export interface FunctionParam {
  unit: bigint; 
  from: Signer;
  factory: FactoryContract;
  account?: Address;
}

export interface Liquidation {
  position : number;
  target: Address;
  expectedRepaymentTime: number;
  debt: BigNumber;
  colBalInToken: BigNumber;
}

export interface PermissionLessBandParam {
  intRate: number;
  quorum : number;
  colCoverage: number;
  deployer: Signer;
  durationInHours: number;
  unitLiquidity: bigint;
  asset: TestBaseAssetContract;
  factory: FactoryContract;
  signer: Signer;
  collateralToken: SimpliTokenContract;
}

export interface RemoveLiquidityParam {
  factory: FactoryContract;
  signer: Signer;
  unit: bigint;
}

export interface PermissionedBandParam {
  factory: FactoryContract;
  signer: Signer;
  deployer: Signer;
  intRate: number;
  durationInHours: number;
  colCoverage: number;
  unitLiquidity: bigint;
  asset: TestBaseAssetContract;
  contributors: Addresses;
  collateralToken: SimpliTokenContract;
}

export interface BandParam {
  unit: bigint;
  hrsOfUse_choice?: number;
  factory: FactoryContract;
  signers: Signer[];
}

export interface SetVariableParam {
  factory: FactoryContract;
  signer: Signer;
  feeTo: Address;
  assetMgr: Address;
  makerRate: number;
  creationFee: bigint;
}

export interface Balances {
  collateral: bigint;
  base: bigint;
}

export interface FactoryTxReturn {
  pool: Common.ReadDataReturnValueStructOutput;
  balances?: Balances;
  profile: Common.ContributorStructOutput;
  slot: Common.SlotStruct;
  // cData: Common.ContributorStructOutput[];
  
}

export interface FundAccountParam {
  asset: TestBaseAssetContract | SimpliTokenContract;
  testAssetAddr?: Address;
  recipients: Address[];
  sender: Signer;
  amount: bigint;
}

export interface JoinABandParam {
  testAsset: TestBaseAssetContract;
  factory: FactoryContract;
  factoryAddr: Address;
  signers: SignersArr;
  deployer: Signer;
  unit: bigint;
  contribution: bigint;
  collateral: SimpliTokenContract;
}

export interface LiquidateParam extends BandParam {
  debt?: bigint;
  asset: TestBaseAssetContract;
  deployer: Signer;
  collateral: SimpliTokenContract;
}

export interface GetFinanceParam extends BandParam {
  colQuote: bigint;
  asset: TestBaseAssetContract;
  collateral: SimpliTokenContract;
  deployer: Signer;
}

export interface PaybackParam extends LiquidateParam {
  asset: TestBaseAssetContract;
  collateral: SimpliTokenContract;
}

export interface GetPaidParam {
  factory: FactoryContract;
  signers: SignersArr;
  unit: bigint;
  runPayback: boolean;
  tcUSD: TestBaseAssetContract;
  signerAddrs: Addresses;
  strategies: Addresses;
  trusteeAddr: Address;
}

export type FactoryContract = Factory & {
  deploymentTransaction(): ContractTransactionResponse;
};

export type AssetManagerContract = AssetClass & {
  deploymentTransaction(): ContractTransactionResponse;
};

export type TestBaseAssetContract = TestBaseAsset & {
  deploymentTransaction(): ContractTransactionResponse;
};

export type BankFactoryContract = BankFactory & {
  deploymentTransaction(): ContractTransactionResponse;
};

export type BankContract = Bank & {
  deploymentTransaction(): ContractTransactionResponse;
};

export type EscapeContract = Escape & {
  deploymentTransaction(): ContractTransactionResponse;
};
export type AttorneyContract = Attorney & {
  deploymentTransaction(): ContractTransactionResponse;
};
export type TokenDistributorContract = TokenDistributor & {
  deploymentTransaction(): ContractTransactionResponse;
};
export type SimpliTokenContract = SimpliToken & {
  deploymentTransaction(): ContractTransactionResponse;
};
export type ReserveContract = Reserve & {
  deploymentTransaction(): ContractTransactionResponse;
};
export type OwnershipManagerContract = OwnerShip & {
  deploymentTransaction(): ContractTransactionResponse;
};