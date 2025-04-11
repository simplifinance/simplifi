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

export interface PoolInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "activateReward"
      | "assetManager"
      | "awardPoint"
      | "baseAsset"
      | "deactivateReward"
      | "diaOracleAddress"
      | "enquireLiquidation"
      | "getCollateralQuote"
      | "getCurrentDebt"
      | "getEpoches"
      | "getPastEpoches"
      | "getPoolData"
      | "getPoolRecord"
      | "getProfile"
      | "getSlot"
      | "isPoolAvailable"
      | "pause"
      | "paused"
      | "pointFactory"
      | "roleManager"
      | "safeFactory"
      | "setPair"
      | "setRoleManager"
      | "unpause"
  ): FunctionFragment;

  getEvent(nameOrSignatureOrTopic: "Paused" | "Unpaused"): EventFragment;

  encodeFunctionData(
    functionFragment: "activateReward",
    values?: undefined
  ): string;
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
    functionFragment: "deactivateReward",
    values?: undefined
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
    functionFragment: "getCollateralQuote",
    values: [BigNumberish]
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
  encodeFunctionData(functionFragment: "pause", values?: undefined): string;
  encodeFunctionData(functionFragment: "paused", values?: undefined): string;
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
  decodeFunctionResult(
    functionFragment: "assetManager",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "awardPoint", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "baseAsset", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "deactivateReward",
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
    functionFragment: "getCollateralQuote",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getCurrentDebt",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getEpoches", data: BytesLike): Result;
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
  decodeFunctionResult(functionFragment: "pause", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "paused", data: BytesLike): Result;
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
  decodeFunctionResult(functionFragment: "setPair", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setRoleManager",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "unpause", data: BytesLike): Result;
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

export interface Pool extends BaseContract {
  connect(runner?: ContractRunner | null): Pool;
  waitForDeployment(): Promise<this>;

  interface: PoolInterface;

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

  assetManager: TypedContractMethod<[], [string], "view">;

  awardPoint: TypedContractMethod<[], [boolean], "view">;

  baseAsset: TypedContractMethod<[], [string], "view">;

  deactivateReward: TypedContractMethod<[], [boolean], "nonpayable">;

  diaOracleAddress: TypedContractMethod<[], [string], "view">;

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

  getCollateralQuote: TypedContractMethod<
    [unit: BigNumberish],
    [[bigint, bigint] & { collateral: bigint; colCoverage: bigint }],
    "view"
  >;

  getCurrentDebt: TypedContractMethod<[unit: BigNumberish], [bigint], "view">;

  getEpoches: TypedContractMethod<[], [bigint], "view">;

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

  pause: TypedContractMethod<[], [void], "nonpayable">;

  paused: TypedContractMethod<[], [boolean], "view">;

  pointFactory: TypedContractMethod<[], [string], "view">;

  roleManager: TypedContractMethod<[], [string], "view">;

  safeFactory: TypedContractMethod<[], [string], "view">;

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
    nameOrSignature: "assetManager"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "awardPoint"
  ): TypedContractMethod<[], [boolean], "view">;
  getFunction(
    nameOrSignature: "baseAsset"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "deactivateReward"
  ): TypedContractMethod<[], [boolean], "nonpayable">;
  getFunction(
    nameOrSignature: "diaOracleAddress"
  ): TypedContractMethod<[], [string], "view">;
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
    nameOrSignature: "getCollateralQuote"
  ): TypedContractMethod<
    [unit: BigNumberish],
    [[bigint, bigint] & { collateral: bigint; colCoverage: bigint }],
    "view"
  >;
  getFunction(
    nameOrSignature: "getCurrentDebt"
  ): TypedContractMethod<[unit: BigNumberish], [bigint], "view">;
  getFunction(
    nameOrSignature: "getEpoches"
  ): TypedContractMethod<[], [bigint], "view">;
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
    nameOrSignature: "pause"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "paused"
  ): TypedContractMethod<[], [boolean], "view">;
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
    key: "Paused"
  ): TypedContractEvent<
    PausedEvent.InputTuple,
    PausedEvent.OutputTuple,
    PausedEvent.OutputObject
  >;
  getEvent(
    key: "Unpaused"
  ): TypedContractEvent<
    UnpausedEvent.InputTuple,
    UnpausedEvent.OutputTuple,
    UnpausedEvent.OutputObject
  >;

  filters: {
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
