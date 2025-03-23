import type { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { ContractTransactionResponse, ethers } from "ethers";
import { Hex, Address as ContractAddress } from "viem";
import type { 
  TestBaseAsset, 
  Simplifi, 
  OwnerShip, 
  SimpliToken, 
  Bank, 
  Attorney, 
  Escape, 
  Reserve, 
  TokenDistributor,
  Analytics,
  IERC20
} from "../../typechain-types";
// import type { Common } from "../typechain-types/contracts/apis/Common";

export type BigNumber = ethers.BigNumberish
export type AddressReturn = Promise<Address>;
export type Signer = HardhatEthersSigner;
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
  asset: TestBaseAsset;
  factory: FactoryContract;
  signer: Signer;
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
  asset: TestBaseAsset;
  contributors: Addresses;
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

export interface BaseAsset {
  contractAddress: IERC20;
  isSupported: boolean;
  assetId: bigint;
}

export interface ViewFactoryData {
  analytics: Analytics;
  currentEpoches: bigint;
  recordEpoches: bigint;
  makerRate:bigint;
  totalSafe:bigint;
  baseAssets: Readonly<BaseAsset[]>;
}

export interface FundAccountParam {
  asset: TestBaseAsset;
  testAssetAddr?: Address;
  recipients: Address[];
  sender: Signer;
  amount: bigint;
}

export interface JoinABandParam {
  testAsset: TestBaseAsset;
  factory: FactoryContract;
  factoryAddr: Address;
  signers: SignersArr;
  deployer: Signer;
  unit: bigint;
  contribution: bigint;
}

export interface LiquidateParam extends BandParam {
  debt?: bigint;
  asset: TestBaseAsset;
  deployer: Signer;
  // unit: bigint;
}

export interface GetFinanceParam extends BandParam {
  colQuote: bigint;
}

export interface PaybackParam extends LiquidateParam {
  asset: TestBaseAsset;
}

export interface GetPaidParam {
  factory: FactoryContract;
  signers: SignersArr;
  unit: bigint;
  runPayback: boolean;
  tcUSD: TestBaseAsset;
  signerAddrs: Addresses;
  strategies: Addresses;
  trusteeAddr: Address;
}

export type FactoryContract = Simplifi & {
  deploymentTransaction(): ContractTransactionResponse;
};

export type AssetBaseContract = TestBaseAsset & {
  deploymentTransaction(): ContractTransactionResponse;
};

export type CollateralBaseContract = SimpliToken & {
  deploymentTransaction(): ContractTransactionResponse;
};

export type ReserveContract = Reserve & {
  deploymentTransaction(): ContractTransactionResponse;
};

export type SafeContract = Bank & {
  deploymentTransaction(): ContractTransactionResponse;
};

export type OwnershipContract = OwnerShip & {
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

