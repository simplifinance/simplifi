/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from "../../../common";

export declare namespace Common {
  export type LowStruct = {
    maxQuorum: BigNumberish;
    selector: BigNumberish;
    colCoverage: BigNumberish;
    duration: BigNumberish;
    allGh: BigNumberish;
    userCount: BigNumberish;
  };

  export type LowStructOutput = [
    maxQuorum: bigint,
    selector: bigint,
    colCoverage: bigint,
    duration: bigint,
    allGh: bigint,
    userCount: bigint
  ] & {
    maxQuorum: bigint;
    selector: bigint;
    colCoverage: bigint;
    duration: bigint;
    allGh: bigint;
    userCount: bigint;
  };

  export type BigStruct = {
    unit: BigNumberish;
    currentPool: BigNumberish;
    recordId: BigNumberish;
    unitId: BigNumberish;
  };

  export type BigStructOutput = [
    unit: bigint,
    currentPool: bigint,
    recordId: bigint,
    unitId: bigint
  ] & { unit: bigint; currentPool: bigint; recordId: bigint; unitId: bigint };

  export type AddressesStruct = {
    colAsset: AddressLike;
    lastPaid: AddressLike;
    safe: AddressLike;
    admin: AddressLike;
  };

  export type AddressesStructOutput = [
    colAsset: string,
    lastPaid: string,
    safe: string,
    admin: string
  ] & { colAsset: string; lastPaid: string; safe: string; admin: string };

  export type PoolStruct = {
    low: Common.LowStruct;
    big: Common.BigStruct;
    addrs: Common.AddressesStruct;
    router: BigNumberish;
    stage: BigNumberish;
    status: BigNumberish;
  };

  export type PoolStructOutput = [
    low: Common.LowStructOutput,
    big: Common.BigStructOutput,
    addrs: Common.AddressesStructOutput,
    router: bigint,
    stage: bigint,
    status: bigint
  ] & {
    low: Common.LowStructOutput;
    big: Common.BigStructOutput;
    addrs: Common.AddressesStructOutput;
    router: bigint;
    stage: bigint;
    status: bigint;
  };

  export type InterestStruct = {
    fullInterest: BigNumberish;
    intPerSec: BigNumberish;
  };

  export type InterestStructOutput = [
    fullInterest: bigint,
    intPerSec: bigint
  ] & { fullInterest: bigint; intPerSec: bigint };

  export type ProviderStruct = {
    slot: BigNumberish;
    amount: BigNumberish;
    rate: BigNumberish;
    earnStartDate: BigNumberish;
    account: AddressLike;
    accruals: Common.InterestStruct;
  };

  export type ProviderStructOutput = [
    slot: bigint,
    amount: bigint,
    rate: bigint,
    earnStartDate: bigint,
    account: string,
    accruals: Common.InterestStructOutput
  ] & {
    slot: bigint;
    amount: bigint;
    rate: bigint;
    earnStartDate: bigint;
    account: string;
    accruals: Common.InterestStructOutput;
  };

  export type ContributorStruct = {
    paybackTime: BigNumberish;
    turnStartTime: BigNumberish;
    getFinanceTime: BigNumberish;
    loan: BigNumberish;
    colBals: BigNumberish;
    id: AddressLike;
    sentQuota: boolean;
  };

  export type ContributorStructOutput = [
    paybackTime: bigint,
    turnStartTime: bigint,
    getFinanceTime: bigint,
    loan: bigint,
    colBals: bigint,
    id: string,
    sentQuota: boolean
  ] & {
    paybackTime: bigint;
    turnStartTime: bigint;
    getFinanceTime: bigint;
    loan: bigint;
    colBals: bigint;
    id: string;
    sentQuota: boolean;
  };

  export type SlotStruct = {
    value: BigNumberish;
    isMember: boolean;
    isAdmin: boolean;
  };

  export type SlotStructOutput = [
    value: bigint,
    isMember: boolean,
    isAdmin: boolean
  ] & { value: bigint; isMember: boolean; isAdmin: boolean };

  export type AnalyticsStruct = {
    tvlCollateral: BigNumberish;
    tvlBase: BigNumberish;
    totalPermissioned: BigNumberish;
    totalPermissionless: BigNumberish;
  };

  export type AnalyticsStructOutput = [
    tvlCollateral: bigint,
    tvlBase: bigint,
    totalPermissioned: bigint,
    totalPermissionless: bigint
  ] & {
    tvlCollateral: bigint;
    tvlBase: bigint;
    totalPermissioned: bigint;
    totalPermissionless: bigint;
  };

  export type ViewFactoryDataStruct = {
    analytics: Common.AnalyticsStruct;
    makerRate: BigNumberish;
    currentEpoches: BigNumberish;
    recordEpoches: BigNumberish;
  };

  export type ViewFactoryDataStructOutput = [
    analytics: Common.AnalyticsStructOutput,
    makerRate: bigint,
    currentEpoches: bigint,
    recordEpoches: bigint
  ] & {
    analytics: Common.AnalyticsStructOutput;
    makerRate: bigint;
    currentEpoches: bigint;
    recordEpoches: bigint;
  };

  export type ReadDataReturnValueStruct = {
    pool: Common.PoolStruct;
    cData: Common.ContributorStruct[];
  };

  export type ReadDataReturnValueStructOutput = [
    pool: Common.PoolStructOutput,
    cData: Common.ContributorStructOutput[]
  ] & {
    pool: Common.PoolStructOutput;
    cData: Common.ContributorStructOutput[];
  };
}

export interface FlexpoolFactoryInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "activateReward"
      | "analytics"
      | "assetManager"
      | "awardPoint"
      | "baseAsset"
      | "closePool"
      | "contribute"
      | "contributeThroughProvider"
      | "createPool"
      | "deactivateReward"
      | "diaOracleAddress"
      | "editPool"
      | "enquireLiquidation"
      | "feeTo"
      | "getCollateralQuote"
      | "getContributorProviders"
      | "getCurrentDebt"
      | "getEpoches"
      | "getFactoryData"
      | "getFinance"
      | "getPastEpoches"
      | "getPoolData"
      | "getPoolRecord"
      | "getProfile"
      | "getSlot"
      | "isPoolAvailable"
      | "liquidate"
      | "makerRate"
      | "pause"
      | "paused"
      | "payback"
      | "pointFactory"
      | "roleManager"
      | "safeFactory"
      | "setFeeOrMakerRate"
      | "setPair"
      | "setRoleManager"
      | "unpause"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic:
      | "Cancellation"
      | "GetFinanced"
      | "Liquidated"
      | "NewContributorAdded"
      | "Paused"
      | "Payback"
      | "PoolCreated"
      | "PoolEdited"
      | "Unpaused"
  ): EventFragment;

  encodeFunctionData(
    functionFragment: "activateReward",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "analytics", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "assetManager",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "awardPoint",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "baseAsset", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "closePool",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "contribute",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "contributeThroughProvider",
    values: [Common.ProviderStruct[], AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "createPool",
    values: [
      AddressLike[],
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      boolean,
      AddressLike
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "deactivateReward",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "diaOracleAddress",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "editPool",
    values: [BigNumberish, BigNumberish, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "enquireLiquidation",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "feeTo", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "getCollateralQuote",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getContributorProviders",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getCurrentDebt",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getEpoches",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getFactoryData",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getFinance",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getPastEpoches",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getPoolData",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getPoolRecord",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getProfile",
    values: [BigNumberish, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getSlot",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "isPoolAvailable",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "liquidate",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "makerRate", values?: undefined): string;
  encodeFunctionData(functionFragment: "pause", values?: undefined): string;
  encodeFunctionData(functionFragment: "paused", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "payback",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "pointFactory",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "roleManager",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "safeFactory",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setFeeOrMakerRate",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setPair",
    values: [AddressLike, string]
  ): string;
  encodeFunctionData(
    functionFragment: "setRoleManager",
    values: [AddressLike]
  ): string;
  encodeFunctionData(functionFragment: "unpause", values?: undefined): string;

  decodeFunctionResult(
    functionFragment: "activateReward",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "analytics", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "assetManager",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "awardPoint", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "baseAsset", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "closePool", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "contribute", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "contributeThroughProvider",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "createPool", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "deactivateReward",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "diaOracleAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "editPool", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "enquireLiquidation",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "feeTo", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getCollateralQuote",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getContributorProviders",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getCurrentDebt",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getEpoches", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getFactoryData",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getFinance", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getPastEpoches",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getPoolData",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getPoolRecord",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getProfile", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getSlot", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "isPoolAvailable",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "liquidate", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "makerRate", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "pause", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "paused", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "payback", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "pointFactory",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "roleManager",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "safeFactory",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setFeeOrMakerRate",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setPair", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setRoleManager",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "unpause", data: BytesLike): Result;
}

export namespace CancellationEvent {
  export type InputTuple = [unit: BigNumberish];
  export type OutputTuple = [unit: bigint];
  export interface OutputObject {
    unit: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace GetFinancedEvent {
  export type InputTuple = [arg0: Common.PoolStruct];
  export type OutputTuple = [arg0: Common.PoolStructOutput];
  export interface OutputObject {
    arg0: Common.PoolStructOutput;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace LiquidatedEvent {
  export type InputTuple = [arg0: Common.PoolStruct];
  export type OutputTuple = [arg0: Common.PoolStructOutput];
  export interface OutputObject {
    arg0: Common.PoolStructOutput;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace NewContributorAddedEvent {
  export type InputTuple = [arg0: Common.PoolStruct];
  export type OutputTuple = [arg0: Common.PoolStructOutput];
  export interface OutputObject {
    arg0: Common.PoolStructOutput;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace PausedEvent {
  export type InputTuple = [account: AddressLike];
  export type OutputTuple = [account: string];
  export interface OutputObject {
    account: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace PaybackEvent {
  export type InputTuple = [arg0: Common.PoolStruct];
  export type OutputTuple = [arg0: Common.PoolStructOutput];
  export interface OutputObject {
    arg0: Common.PoolStructOutput;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace PoolCreatedEvent {
  export type InputTuple = [arg0: Common.PoolStruct];
  export type OutputTuple = [arg0: Common.PoolStructOutput];
  export interface OutputObject {
    arg0: Common.PoolStructOutput;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace PoolEditedEvent {
  export type InputTuple = [arg0: Common.PoolStruct];
  export type OutputTuple = [arg0: Common.PoolStructOutput];
  export interface OutputObject {
    arg0: Common.PoolStructOutput;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace UnpausedEvent {
  export type InputTuple = [account: AddressLike];
  export type OutputTuple = [account: string];
  export interface OutputObject {
    account: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface FlexpoolFactory extends BaseContract {
  connect(runner?: ContractRunner | null): FlexpoolFactory;
  waitForDeployment(): Promise<this>;

  interface: FlexpoolFactoryInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  activateReward: TypedContractMethod<[], [boolean], "nonpayable">;

  analytics: TypedContractMethod<
    [],
    [
      [bigint, bigint, bigint, bigint] & {
        tvlCollateral: bigint;
        tvlBase: bigint;
        totalPermissioned: bigint;
        totalPermissionless: bigint;
      }
    ],
    "view"
  >;

  assetManager: TypedContractMethod<[], [string], "view">;

  awardPoint: TypedContractMethod<[], [boolean], "view">;

  baseAsset: TypedContractMethod<[], [string], "view">;

  closePool: TypedContractMethod<[unit: BigNumberish], [boolean], "nonpayable">;

  contribute: TypedContractMethod<
    [unit: BigNumberish],
    [boolean],
    "nonpayable"
  >;

  contributeThroughProvider: TypedContractMethod<
    [
      providers: Common.ProviderStruct[],
      borrower: AddressLike,
      unit: BigNumberish
    ],
    [boolean],
    "nonpayable"
  >;

  createPool: TypedContractMethod<
    [
      users: AddressLike[],
      unit: BigNumberish,
      maxQuorum: BigNumberish,
      durationInHours: BigNumberish,
      colCoverage: BigNumberish,
      isPermissionless: boolean,
      colAsset: AddressLike
    ],
    [boolean],
    "nonpayable"
  >;

  deactivateReward: TypedContractMethod<[], [boolean], "nonpayable">;

  diaOracleAddress: TypedContractMethod<[], [string], "view">;

  editPool: TypedContractMethod<
    [
      unit: BigNumberish,
      maxQuorum: BigNumberish,
      durationInHours: BigNumberish,
      colCoverage: BigNumberish
    ],
    [boolean],
    "nonpayable"
  >;

  enquireLiquidation: TypedContractMethod<
    [unit: BigNumberish],
    [
      [Common.ContributorStructOutput, boolean, Common.SlotStructOutput] & {
        profile: Common.ContributorStructOutput;
        defaulter: boolean;
        slot: Common.SlotStructOutput;
      }
    ],
    "view"
  >;

  feeTo: TypedContractMethod<[], [string], "view">;

  getCollateralQuote: TypedContractMethod<
    [unit: BigNumberish],
    [[bigint, bigint] & { collateral: bigint; colCoverage: bigint }],
    "view"
  >;

  getContributorProviders: TypedContractMethod<
    [target: AddressLike, recordId: BigNumberish],
    [Common.ProviderStructOutput[]],
    "view"
  >;

  getCurrentDebt: TypedContractMethod<[unit: BigNumberish], [bigint], "view">;

  getEpoches: TypedContractMethod<[], [bigint], "view">;

  getFactoryData: TypedContractMethod<
    [],
    [Common.ViewFactoryDataStructOutput],
    "view"
  >;

  getFinance: TypedContractMethod<
    [unit: BigNumberish],
    [boolean],
    "nonpayable"
  >;

  getPastEpoches: TypedContractMethod<[], [bigint], "view">;

  getPoolData: TypedContractMethod<
    [unit: BigNumberish],
    [Common.ReadDataReturnValueStructOutput],
    "view"
  >;

  getPoolRecord: TypedContractMethod<
    [recordId: BigNumberish],
    [Common.ReadDataReturnValueStructOutput],
    "view"
  >;

  getProfile: TypedContractMethod<
    [unit: BigNumberish, target: AddressLike],
    [Common.ContributorStructOutput],
    "view"
  >;

  getSlot: TypedContractMethod<
    [target: AddressLike, unit: BigNumberish],
    [Common.SlotStructOutput],
    "view"
  >;

  isPoolAvailable: TypedContractMethod<[unit: BigNumberish], [boolean], "view">;

  liquidate: TypedContractMethod<[unit: BigNumberish], [boolean], "nonpayable">;

  makerRate: TypedContractMethod<[], [bigint], "view">;

  pause: TypedContractMethod<[], [void], "nonpayable">;

  paused: TypedContractMethod<[], [boolean], "view">;

  payback: TypedContractMethod<[unit: BigNumberish], [boolean], "nonpayable">;

  pointFactory: TypedContractMethod<[], [string], "view">;

  roleManager: TypedContractMethod<[], [string], "view">;

  safeFactory: TypedContractMethod<[], [string], "view">;

  setFeeOrMakerRate: TypedContractMethod<
    [_feeTo: AddressLike, _makerRate: BigNumberish],
    [boolean],
    "nonpayable"
  >;

  setPair: TypedContractMethod<
    [collateralAsset: AddressLike, pair: string],
    [boolean],
    "nonpayable"
  >;

  setRoleManager: TypedContractMethod<
    [newManager: AddressLike],
    [boolean],
    "nonpayable"
  >;

  unpause: TypedContractMethod<[], [void], "nonpayable">;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "activateReward"
  ): TypedContractMethod<[], [boolean], "nonpayable">;
  getFunction(
    nameOrSignature: "analytics"
  ): TypedContractMethod<
    [],
    [
      [bigint, bigint, bigint, bigint] & {
        tvlCollateral: bigint;
        tvlBase: bigint;
        totalPermissioned: bigint;
        totalPermissionless: bigint;
      }
    ],
    "view"
  >;
  getFunction(
    nameOrSignature: "assetManager"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "awardPoint"
  ): TypedContractMethod<[], [boolean], "view">;
  getFunction(
    nameOrSignature: "baseAsset"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "closePool"
  ): TypedContractMethod<[unit: BigNumberish], [boolean], "nonpayable">;
  getFunction(
    nameOrSignature: "contribute"
  ): TypedContractMethod<[unit: BigNumberish], [boolean], "nonpayable">;
  getFunction(
    nameOrSignature: "contributeThroughProvider"
  ): TypedContractMethod<
    [
      providers: Common.ProviderStruct[],
      borrower: AddressLike,
      unit: BigNumberish
    ],
    [boolean],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "createPool"
  ): TypedContractMethod<
    [
      users: AddressLike[],
      unit: BigNumberish,
      maxQuorum: BigNumberish,
      durationInHours: BigNumberish,
      colCoverage: BigNumberish,
      isPermissionless: boolean,
      colAsset: AddressLike
    ],
    [boolean],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "deactivateReward"
  ): TypedContractMethod<[], [boolean], "nonpayable">;
  getFunction(
    nameOrSignature: "diaOracleAddress"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "editPool"
  ): TypedContractMethod<
    [
      unit: BigNumberish,
      maxQuorum: BigNumberish,
      durationInHours: BigNumberish,
      colCoverage: BigNumberish
    ],
    [boolean],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "enquireLiquidation"
  ): TypedContractMethod<
    [unit: BigNumberish],
    [
      [Common.ContributorStructOutput, boolean, Common.SlotStructOutput] & {
        profile: Common.ContributorStructOutput;
        defaulter: boolean;
        slot: Common.SlotStructOutput;
      }
    ],
    "view"
  >;
  getFunction(
    nameOrSignature: "feeTo"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "getCollateralQuote"
  ): TypedContractMethod<
    [unit: BigNumberish],
    [[bigint, bigint] & { collateral: bigint; colCoverage: bigint }],
    "view"
  >;
  getFunction(
    nameOrSignature: "getContributorProviders"
  ): TypedContractMethod<
    [target: AddressLike, recordId: BigNumberish],
    [Common.ProviderStructOutput[]],
    "view"
  >;
  getFunction(
    nameOrSignature: "getCurrentDebt"
  ): TypedContractMethod<[unit: BigNumberish], [bigint], "view">;
  getFunction(
    nameOrSignature: "getEpoches"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "getFactoryData"
  ): TypedContractMethod<[], [Common.ViewFactoryDataStructOutput], "view">;
  getFunction(
    nameOrSignature: "getFinance"
  ): TypedContractMethod<[unit: BigNumberish], [boolean], "nonpayable">;
  getFunction(
    nameOrSignature: "getPastEpoches"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "getPoolData"
  ): TypedContractMethod<
    [unit: BigNumberish],
    [Common.ReadDataReturnValueStructOutput],
    "view"
  >;
  getFunction(
    nameOrSignature: "getPoolRecord"
  ): TypedContractMethod<
    [recordId: BigNumberish],
    [Common.ReadDataReturnValueStructOutput],
    "view"
  >;
  getFunction(
    nameOrSignature: "getProfile"
  ): TypedContractMethod<
    [unit: BigNumberish, target: AddressLike],
    [Common.ContributorStructOutput],
    "view"
  >;
  getFunction(
    nameOrSignature: "getSlot"
  ): TypedContractMethod<
    [target: AddressLike, unit: BigNumberish],
    [Common.SlotStructOutput],
    "view"
  >;
  getFunction(
    nameOrSignature: "isPoolAvailable"
  ): TypedContractMethod<[unit: BigNumberish], [boolean], "view">;
  getFunction(
    nameOrSignature: "liquidate"
  ): TypedContractMethod<[unit: BigNumberish], [boolean], "nonpayable">;
  getFunction(
    nameOrSignature: "makerRate"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "pause"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "paused"
  ): TypedContractMethod<[], [boolean], "view">;
  getFunction(
    nameOrSignature: "payback"
  ): TypedContractMethod<[unit: BigNumberish], [boolean], "nonpayable">;
  getFunction(
    nameOrSignature: "pointFactory"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "roleManager"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "safeFactory"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "setFeeOrMakerRate"
  ): TypedContractMethod<
    [_feeTo: AddressLike, _makerRate: BigNumberish],
    [boolean],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "setPair"
  ): TypedContractMethod<
    [collateralAsset: AddressLike, pair: string],
    [boolean],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "setRoleManager"
  ): TypedContractMethod<[newManager: AddressLike], [boolean], "nonpayable">;
  getFunction(
    nameOrSignature: "unpause"
  ): TypedContractMethod<[], [void], "nonpayable">;

  getEvent(
    key: "Cancellation"
  ): TypedContractEvent<
    CancellationEvent.InputTuple,
    CancellationEvent.OutputTuple,
    CancellationEvent.OutputObject
  >;
  getEvent(
    key: "GetFinanced"
  ): TypedContractEvent<
    GetFinancedEvent.InputTuple,
    GetFinancedEvent.OutputTuple,
    GetFinancedEvent.OutputObject
  >;
  getEvent(
    key: "Liquidated"
  ): TypedContractEvent<
    LiquidatedEvent.InputTuple,
    LiquidatedEvent.OutputTuple,
    LiquidatedEvent.OutputObject
  >;
  getEvent(
    key: "NewContributorAdded"
  ): TypedContractEvent<
    NewContributorAddedEvent.InputTuple,
    NewContributorAddedEvent.OutputTuple,
    NewContributorAddedEvent.OutputObject
  >;
  getEvent(
    key: "Paused"
  ): TypedContractEvent<
    PausedEvent.InputTuple,
    PausedEvent.OutputTuple,
    PausedEvent.OutputObject
  >;
  getEvent(
    key: "Payback"
  ): TypedContractEvent<
    PaybackEvent.InputTuple,
    PaybackEvent.OutputTuple,
    PaybackEvent.OutputObject
  >;
  getEvent(
    key: "PoolCreated"
  ): TypedContractEvent<
    PoolCreatedEvent.InputTuple,
    PoolCreatedEvent.OutputTuple,
    PoolCreatedEvent.OutputObject
  >;
  getEvent(
    key: "PoolEdited"
  ): TypedContractEvent<
    PoolEditedEvent.InputTuple,
    PoolEditedEvent.OutputTuple,
    PoolEditedEvent.OutputObject
  >;
  getEvent(
    key: "Unpaused"
  ): TypedContractEvent<
    UnpausedEvent.InputTuple,
    UnpausedEvent.OutputTuple,
    UnpausedEvent.OutputObject
  >;

  filters: {
    "Cancellation(uint256)": TypedContractEvent<
      CancellationEvent.InputTuple,
      CancellationEvent.OutputTuple,
      CancellationEvent.OutputObject
    >;
    Cancellation: TypedContractEvent<
      CancellationEvent.InputTuple,
      CancellationEvent.OutputTuple,
      CancellationEvent.OutputObject
    >;

    "GetFinanced(tuple)": TypedContractEvent<
      GetFinancedEvent.InputTuple,
      GetFinancedEvent.OutputTuple,
      GetFinancedEvent.OutputObject
    >;
    GetFinanced: TypedContractEvent<
      GetFinancedEvent.InputTuple,
      GetFinancedEvent.OutputTuple,
      GetFinancedEvent.OutputObject
    >;

    "Liquidated(tuple)": TypedContractEvent<
      LiquidatedEvent.InputTuple,
      LiquidatedEvent.OutputTuple,
      LiquidatedEvent.OutputObject
    >;
    Liquidated: TypedContractEvent<
      LiquidatedEvent.InputTuple,
      LiquidatedEvent.OutputTuple,
      LiquidatedEvent.OutputObject
    >;

    "NewContributorAdded(tuple)": TypedContractEvent<
      NewContributorAddedEvent.InputTuple,
      NewContributorAddedEvent.OutputTuple,
      NewContributorAddedEvent.OutputObject
    >;
    NewContributorAdded: TypedContractEvent<
      NewContributorAddedEvent.InputTuple,
      NewContributorAddedEvent.OutputTuple,
      NewContributorAddedEvent.OutputObject
    >;

    "Paused(address)": TypedContractEvent<
      PausedEvent.InputTuple,
      PausedEvent.OutputTuple,
      PausedEvent.OutputObject
    >;
    Paused: TypedContractEvent<
      PausedEvent.InputTuple,
      PausedEvent.OutputTuple,
      PausedEvent.OutputObject
    >;

    "Payback(tuple)": TypedContractEvent<
      PaybackEvent.InputTuple,
      PaybackEvent.OutputTuple,
      PaybackEvent.OutputObject
    >;
    Payback: TypedContractEvent<
      PaybackEvent.InputTuple,
      PaybackEvent.OutputTuple,
      PaybackEvent.OutputObject
    >;

    "PoolCreated(tuple)": TypedContractEvent<
      PoolCreatedEvent.InputTuple,
      PoolCreatedEvent.OutputTuple,
      PoolCreatedEvent.OutputObject
    >;
    PoolCreated: TypedContractEvent<
      PoolCreatedEvent.InputTuple,
      PoolCreatedEvent.OutputTuple,
      PoolCreatedEvent.OutputObject
    >;

    "PoolEdited(tuple)": TypedContractEvent<
      PoolEditedEvent.InputTuple,
      PoolEditedEvent.OutputTuple,
      PoolEditedEvent.OutputObject
    >;
    PoolEdited: TypedContractEvent<
      PoolEditedEvent.InputTuple,
      PoolEditedEvent.OutputTuple,
      PoolEditedEvent.OutputObject
    >;

    "Unpaused(address)": TypedContractEvent<
      UnpausedEvent.InputTuple,
      UnpausedEvent.OutputTuple,
      UnpausedEvent.OutputObject
    >;
    Unpaused: TypedContractEvent<
      UnpausedEvent.InputTuple,
      UnpausedEvent.OutputTuple,
      UnpausedEvent.OutputObject
    >;
  };
}
