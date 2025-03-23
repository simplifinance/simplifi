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
} from "../../common";

export declare namespace Common {
  export type LIntStruct = {
    quorum: BigNumberish;
    selector: BigNumberish;
    colCoverage: BigNumberish;
    duration: BigNumberish;
    intRate: BigNumberish;
    cSlot: BigNumberish;
    allGh: BigNumberish;
    userCount: BigNumberish;
  };

  export type LIntStructOutput = [
    quorum: bigint,
    selector: bigint,
    colCoverage: bigint,
    duration: bigint,
    intRate: bigint,
    cSlot: bigint,
    allGh: bigint,
    userCount: bigint
  ] & {
    quorum: bigint;
    selector: bigint;
    colCoverage: bigint;
    duration: bigint;
    intRate: bigint;
    cSlot: bigint;
    allGh: bigint;
    userCount: bigint;
  };

  export type BigIntStruct = {
    unit: BigNumberish;
    currentPool: BigNumberish;
    recordId: BigNumberish;
  };

  export type BigIntStructOutput = [
    unit: bigint,
    currentPool: bigint,
    recordId: bigint
  ] & { unit: bigint; currentPool: bigint; recordId: bigint };

  export type AddressesStruct = {
    asset: AddressLike;
    lastPaid: AddressLike;
    bank: AddressLike;
    admin: AddressLike;
  };

  export type AddressesStructOutput = [
    asset: string,
    lastPaid: string,
    bank: string,
    admin: string
  ] & { asset: string; lastPaid: string; bank: string; admin: string };

  export type InterestStruct = {
    fullInterest: BigNumberish;
    intPerSec: BigNumberish;
    intPerChoiceOfDur: BigNumberish;
  };

  export type InterestStructOutput = [
    fullInterest: bigint,
    intPerSec: bigint,
    intPerChoiceOfDur: bigint
  ] & { fullInterest: bigint; intPerSec: bigint; intPerChoiceOfDur: bigint };

  export type PoolStruct = {
    lInt: Common.LIntStruct;
    bigInt: Common.BigIntStruct;
    addrs: Common.AddressesStruct;
    router: BigNumberish;
    stage: BigNumberish;
    interest: Common.InterestStruct;
  };

  export type PoolStructOutput = [
    lInt: Common.LIntStructOutput,
    bigInt: Common.BigIntStructOutput,
    addrs: Common.AddressesStructOutput,
    router: bigint,
    stage: bigint,
    interest: Common.InterestStructOutput
  ] & {
    lInt: Common.LIntStructOutput;
    bigInt: Common.BigIntStructOutput;
    addrs: Common.AddressesStructOutput;
    router: bigint;
    stage: bigint;
    interest: Common.InterestStructOutput;
  };

  export type ContributorStruct = {
    durOfChoice: BigNumberish;
    paybackTime: BigNumberish;
    turnStartTime: BigNumberish;
    getFinanceTime: BigNumberish;
    loan: BigNumberish;
    colBals: BigNumberish;
    id: AddressLike;
    sentQuota: boolean;
    interestPaid: BigNumberish;
  };

  export type ContributorStructOutput = [
    durOfChoice: bigint,
    paybackTime: bigint,
    turnStartTime: bigint,
    getFinanceTime: bigint,
    loan: bigint,
    colBals: bigint,
    id: string,
    sentQuota: boolean,
    interestPaid: bigint
  ] & {
    durOfChoice: bigint;
    paybackTime: bigint;
    turnStartTime: bigint;
    getFinanceTime: bigint;
    loan: bigint;
    colBals: bigint;
    id: string;
    sentQuota: boolean;
    interestPaid: bigint;
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

  export type PointStruct = {
    contributor: BigNumberish;
    creator: BigNumberish;
  };

  export type PointStructOutput = [contributor: bigint, creator: bigint] & {
    contributor: bigint;
    creator: bigint;
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

export declare namespace IFactory {
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

  export type ContractDataStruct = {
    feeTo: AddressLike;
    assetAdmin: AddressLike;
    makerRate: BigNumberish;
    bankFactory: AddressLike;
    safeFactory: AddressLike;
    collateralToken: AddressLike;
  };

  export type ContractDataStructOutput = [
    feeTo: string,
    assetAdmin: string,
    makerRate: bigint,
    bankFactory: string,
    safeFactory: string,
    collateralToken: string
  ] & {
    feeTo: string;
    assetAdmin: string;
    makerRate: bigint;
    bankFactory: string;
    safeFactory: string;
    collateralToken: string;
  };

  export type ViewFactoryDataStruct = {
    analytics: IFactory.AnalyticsStruct;
    contractData: IFactory.ContractDataStruct;
    currentEpoches: BigNumberish;
    recordEpoches: BigNumberish;
  };

  export type ViewFactoryDataStructOutput = [
    analytics: IFactory.AnalyticsStructOutput,
    contractData: IFactory.ContractDataStructOutput,
    currentEpoches: bigint,
    recordEpoches: bigint
  ] & {
    analytics: IFactory.AnalyticsStructOutput;
    contractData: IFactory.ContractDataStructOutput;
    currentEpoches: bigint;
    recordEpoches: bigint;
  };
}

export interface FactoryInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "analytics"
      | "createPermissionedPool"
      | "createPermissionlessPool"
      | "diaOracleAddress"
      | "enquireLiquidation"
      | "getCollaterlQuote"
      | "getCurrentDebt"
      | "getEpoches"
      | "getFactoryData"
      | "getFinance"
      | "getPoint"
      | "getPoolData"
      | "getProfile"
      | "getRecord"
      | "getRecordEpoches"
      | "getRouter"
      | "getSlot"
      | "joinAPool"
      | "liquidate"
      | "ownershipManager"
      | "pause"
      | "paused"
      | "payback"
      | "performSetUp"
      | "removeLiquidityPool"
      | "routers"
      | "setContractData"
      | "setOracleAddress"
      | "setOwnershipManager"
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
      | "Unpaused"
  ): EventFragment;

  encodeFunctionData(functionFragment: "analytics", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "createPermissionedPool",
    values: [
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      AddressLike,
      AddressLike[]
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "createPermissionlessPool",
    values: [
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      AddressLike
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "diaOracleAddress",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "enquireLiquidation",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getCollaterlQuote",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getCurrentDebt",
    values: [BigNumberish, AddressLike]
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
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getPoint",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getPoolData",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getProfile",
    values: [BigNumberish, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getRecord",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getRecordEpoches",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getRouter",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getSlot",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "joinAPool",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "liquidate",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "ownershipManager",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "pause", values?: undefined): string;
  encodeFunctionData(functionFragment: "paused", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "payback",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "performSetUp",
    values: [BigNumberish, AddressLike, AddressLike, AddressLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "removeLiquidityPool",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "routers",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setContractData",
    values: [AddressLike, AddressLike, BigNumberish, AddressLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setOracleAddress",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setOwnershipManager",
    values: [AddressLike]
  ): string;
  encodeFunctionData(functionFragment: "unpause", values?: undefined): string;

  decodeFunctionResult(functionFragment: "analytics", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "createPermissionedPool",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "createPermissionlessPool",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "diaOracleAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "enquireLiquidation",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getCollaterlQuote",
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
  decodeFunctionResult(functionFragment: "getPoint", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getPoolData",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getProfile", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getRecord", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getRecordEpoches",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getRouter", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getSlot", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "joinAPool", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "liquidate", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "ownershipManager",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "pause", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "paused", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "payback", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "performSetUp",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "removeLiquidityPool",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "routers", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setContractData",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setOracleAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setOwnershipManager",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "unpause", data: BytesLike): Result;
}

export namespace CancellationEvent {
  export type InputTuple = [epochId: BigNumberish];
  export type OutputTuple = [epochId: bigint];
  export interface OutputObject {
    epochId: bigint;
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

export interface Factory extends BaseContract {
  connect(runner?: ContractRunner | null): Factory;
  waitForDeployment(): Promise<this>;

  interface: FactoryInterface;

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

  createPermissionedPool: TypedContractMethod<
    [
      intRate: BigNumberish,
      durationInHours: BigNumberish,
      colCoverage: BigNumberish,
      unitLiquidity: BigNumberish,
      asset: AddressLike,
      contributors: AddressLike[]
    ],
    [boolean],
    "nonpayable"
  >;

  createPermissionlessPool: TypedContractMethod<
    [
      intRate: BigNumberish,
      quorum: BigNumberish,
      durationInHours: BigNumberish,
      colCoverage: BigNumberish,
      unitLiquidity: BigNumberish,
      asset: AddressLike
    ],
    [boolean],
    "nonpayable"
  >;

  diaOracleAddress: TypedContractMethod<[], [string], "view">;

  enquireLiquidation: TypedContractMethod<
    [unit: BigNumberish],
    [
      [
        Common.ContributorStructOutput,
        boolean,
        bigint,
        Common.SlotStructOutput,
        string
      ]
    ],
    "view"
  >;

  getCollaterlQuote: TypedContractMethod<
    [unit: BigNumberish],
    [[bigint, bigint] & { collateral: bigint; colCoverage: bigint }],
    "view"
  >;

  getCurrentDebt: TypedContractMethod<
    [unit: BigNumberish, target: AddressLike],
    [bigint],
    "view"
  >;

  getEpoches: TypedContractMethod<[], [bigint], "view">;

  getFactoryData: TypedContractMethod<
    [],
    [IFactory.ViewFactoryDataStructOutput],
    "view"
  >;

  getFinance: TypedContractMethod<
    [unit: BigNumberish, daysOfUseInHr: BigNumberish],
    [boolean],
    "nonpayable"
  >;

  getPoint: TypedContractMethod<
    [user: AddressLike],
    [Common.PointStructOutput],
    "view"
  >;

  getPoolData: TypedContractMethod<
    [unitId: BigNumberish],
    [Common.ReadDataReturnValueStructOutput],
    "view"
  >;

  getProfile: TypedContractMethod<
    [unit: BigNumberish, user: AddressLike],
    [Common.ContributorStructOutput],
    "view"
  >;

  getRecord: TypedContractMethod<
    [rId: BigNumberish],
    [Common.ReadDataReturnValueStructOutput],
    "view"
  >;

  getRecordEpoches: TypedContractMethod<[], [bigint], "view">;

  getRouter: TypedContractMethod<[unit: BigNumberish], [string], "view">;

  getSlot: TypedContractMethod<
    [user: AddressLike, unit: BigNumberish],
    [Common.SlotStructOutput],
    "view"
  >;

  joinAPool: TypedContractMethod<[unit: BigNumberish], [boolean], "nonpayable">;

  liquidate: TypedContractMethod<[unit: BigNumberish], [boolean], "nonpayable">;

  ownershipManager: TypedContractMethod<[], [string], "view">;

  pause: TypedContractMethod<[], [void], "nonpayable">;

  paused: TypedContractMethod<[], [boolean], "view">;

  payback: TypedContractMethod<[unit: BigNumberish], [boolean], "nonpayable">;

  performSetUp: TypedContractMethod<
    [
      serviceRate: BigNumberish,
      feeTo: AddressLike,
      assetClass: AddressLike,
      strategyManager: AddressLike,
      colToken: AddressLike
    ],
    [void],
    "nonpayable"
  >;

  removeLiquidityPool: TypedContractMethod<
    [unit: BigNumberish],
    [boolean],
    "nonpayable"
  >;

  routers: TypedContractMethod<[arg0: BigNumberish], [bigint], "view">;

  setContractData: TypedContractMethod<
    [
      assetAdmin: AddressLike,
      feeTo: AddressLike,
      makerRate: BigNumberish,
      safeFactory: AddressLike,
      colToken: AddressLike
    ],
    [boolean],
    "nonpayable"
  >;

  setOracleAddress: TypedContractMethod<
    [newOracleAddr: AddressLike],
    [void],
    "nonpayable"
  >;

  setOwnershipManager: TypedContractMethod<
    [newManager: AddressLike],
    [boolean],
    "nonpayable"
  >;

  unpause: TypedContractMethod<[], [void], "nonpayable">;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

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
    nameOrSignature: "createPermissionedPool"
  ): TypedContractMethod<
    [
      intRate: BigNumberish,
      durationInHours: BigNumberish,
      colCoverage: BigNumberish,
      unitLiquidity: BigNumberish,
      asset: AddressLike,
      contributors: AddressLike[]
    ],
    [boolean],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "createPermissionlessPool"
  ): TypedContractMethod<
    [
      intRate: BigNumberish,
      quorum: BigNumberish,
      durationInHours: BigNumberish,
      colCoverage: BigNumberish,
      unitLiquidity: BigNumberish,
      asset: AddressLike
    ],
    [boolean],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "diaOracleAddress"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "enquireLiquidation"
  ): TypedContractMethod<
    [unit: BigNumberish],
    [
      [
        Common.ContributorStructOutput,
        boolean,
        bigint,
        Common.SlotStructOutput,
        string
      ]
    ],
    "view"
  >;
  getFunction(
    nameOrSignature: "getCollaterlQuote"
  ): TypedContractMethod<
    [unit: BigNumberish],
    [[bigint, bigint] & { collateral: bigint; colCoverage: bigint }],
    "view"
  >;
  getFunction(
    nameOrSignature: "getCurrentDebt"
  ): TypedContractMethod<
    [unit: BigNumberish, target: AddressLike],
    [bigint],
    "view"
  >;
  getFunction(
    nameOrSignature: "getEpoches"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "getFactoryData"
  ): TypedContractMethod<[], [IFactory.ViewFactoryDataStructOutput], "view">;
  getFunction(
    nameOrSignature: "getFinance"
  ): TypedContractMethod<
    [unit: BigNumberish, daysOfUseInHr: BigNumberish],
    [boolean],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "getPoint"
  ): TypedContractMethod<
    [user: AddressLike],
    [Common.PointStructOutput],
    "view"
  >;
  getFunction(
    nameOrSignature: "getPoolData"
  ): TypedContractMethod<
    [unitId: BigNumberish],
    [Common.ReadDataReturnValueStructOutput],
    "view"
  >;
  getFunction(
    nameOrSignature: "getProfile"
  ): TypedContractMethod<
    [unit: BigNumberish, user: AddressLike],
    [Common.ContributorStructOutput],
    "view"
  >;
  getFunction(
    nameOrSignature: "getRecord"
  ): TypedContractMethod<
    [rId: BigNumberish],
    [Common.ReadDataReturnValueStructOutput],
    "view"
  >;
  getFunction(
    nameOrSignature: "getRecordEpoches"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "getRouter"
  ): TypedContractMethod<[unit: BigNumberish], [string], "view">;
  getFunction(
    nameOrSignature: "getSlot"
  ): TypedContractMethod<
    [user: AddressLike, unit: BigNumberish],
    [Common.SlotStructOutput],
    "view"
  >;
  getFunction(
    nameOrSignature: "joinAPool"
  ): TypedContractMethod<[unit: BigNumberish], [boolean], "nonpayable">;
  getFunction(
    nameOrSignature: "liquidate"
  ): TypedContractMethod<[unit: BigNumberish], [boolean], "nonpayable">;
  getFunction(
    nameOrSignature: "ownershipManager"
  ): TypedContractMethod<[], [string], "view">;
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
    nameOrSignature: "performSetUp"
  ): TypedContractMethod<
    [
      serviceRate: BigNumberish,
      feeTo: AddressLike,
      assetClass: AddressLike,
      strategyManager: AddressLike,
      colToken: AddressLike
    ],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "removeLiquidityPool"
  ): TypedContractMethod<[unit: BigNumberish], [boolean], "nonpayable">;
  getFunction(
    nameOrSignature: "routers"
  ): TypedContractMethod<[arg0: BigNumberish], [bigint], "view">;
  getFunction(
    nameOrSignature: "setContractData"
  ): TypedContractMethod<
    [
      assetAdmin: AddressLike,
      feeTo: AddressLike,
      makerRate: BigNumberish,
      safeFactory: AddressLike,
      colToken: AddressLike
    ],
    [boolean],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "setOracleAddress"
  ): TypedContractMethod<[newOracleAddr: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "setOwnershipManager"
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
