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

export declare namespace Counters {
  export type CounterStruct = { _value: BigNumberish };

  export type CounterStructOutput = [_value: bigint] & { _value: bigint };
}

export declare namespace Common {
  export type UintsStruct = {
    quorum: BigNumberish;
    selector: BigNumberish;
    colCoverage: BigNumberish;
    duration: BigNumberish;
    intRate: BigNumberish;
  };

  export type UintsStructOutput = [
    quorum: bigint,
    selector: bigint,
    colCoverage: bigint,
    duration: bigint,
    intRate: bigint
  ] & {
    quorum: bigint;
    selector: bigint;
    colCoverage: bigint;
    duration: bigint;
    intRate: bigint;
  };

  export type Uint256sStruct = {
    fullInterest: BigNumberish;
    intPerSec: BigNumberish;
    unit: BigNumberish;
    currentPool: BigNumberish;
    epochId: BigNumberish;
  };

  export type Uint256sStructOutput = [
    fullInterest: bigint,
    intPerSec: bigint,
    unit: bigint,
    currentPool: bigint,
    epochId: bigint
  ] & {
    fullInterest: bigint;
    intPerSec: bigint;
    unit: bigint;
    currentPool: bigint;
    epochId: bigint;
  };

  export type AddressesStruct = {
    asset: AddressLike;
    lastPaid: AddressLike;
    strategy: AddressLike;
    admin: AddressLike;
  };

  export type AddressesStructOutput = [
    asset: string,
    lastPaid: string,
    strategy: string,
    admin: string
  ] & { asset: string; lastPaid: string; strategy: string; admin: string };

  export type ContributorStruct = {
    durOfChoice: BigNumberish;
    expInterest: BigNumberish;
    payDate: BigNumberish;
    turnTime: BigNumberish;
    loan: BigNumberish;
    colBals: BigNumberish;
    id: AddressLike;
  };

  export type ContributorStructOutput = [
    durOfChoice: bigint,
    expInterest: bigint,
    payDate: bigint,
    turnTime: bigint,
    loan: bigint,
    colBals: bigint,
    id: string
  ] & {
    durOfChoice: bigint;
    expInterest: bigint;
    payDate: bigint;
    turnTime: bigint;
    loan: bigint;
    colBals: bigint;
    id: string;
  };

  export type RankStruct = { admin: boolean; member: boolean };

  export type RankStructOutput = [admin: boolean, member: boolean] & {
    admin: boolean;
    member: boolean;
  };

  export type ContributorDataStruct = {
    cData: Common.ContributorStruct;
    rank: Common.RankStruct;
    slot: BigNumberish;
  };

  export type ContributorDataStructOutput = [
    cData: Common.ContributorStructOutput,
    rank: Common.RankStructOutput,
    slot: bigint
  ] & {
    cData: Common.ContributorStructOutput;
    rank: Common.RankStructOutput;
    slot: bigint;
  };

  export type PoolStruct = {
    userCount: Counters.CounterStruct;
    uints: Common.UintsStruct;
    uint256s: Common.Uint256sStruct;
    addrs: Common.AddressesStruct;
    allGh: BigNumberish;
    isPermissionless: boolean;
    cData: Common.ContributorDataStruct[];
    stage: BigNumberish;
  };

  export type PoolStructOutput = [
    userCount: Counters.CounterStructOutput,
    uints: Common.UintsStructOutput,
    uint256s: Common.Uint256sStructOutput,
    addrs: Common.AddressesStructOutput,
    allGh: bigint,
    isPermissionless: boolean,
    cData: Common.ContributorDataStructOutput[],
    stage: bigint
  ] & {
    userCount: Counters.CounterStructOutput;
    uints: Common.UintsStructOutput;
    uint256s: Common.Uint256sStructOutput;
    addrs: Common.AddressesStructOutput;
    allGh: bigint;
    isPermissionless: boolean;
    cData: Common.ContributorDataStructOutput[];
    stage: bigint;
  };

  export type CreatePoolReturnValueStruct = {
    pool: Common.PoolStruct;
    cData: Common.ContributorDataStruct;
  };

  export type CreatePoolReturnValueStructOutput = [
    pool: Common.PoolStructOutput,
    cData: Common.ContributorDataStructOutput
  ] & {
    pool: Common.PoolStructOutput;
    cData: Common.ContributorDataStructOutput;
  };

  export type CommonEventDataStruct = { pool: Common.PoolStruct };

  export type CommonEventDataStructOutput = [pool: Common.PoolStructOutput] & {
    pool: Common.PoolStructOutput;
  };

  export type BalancesStruct = { xfi: BigNumberish; erc20: BigNumberish };

  export type BalancesStructOutput = [xfi: bigint, erc20: bigint] & {
    xfi: bigint;
    erc20: bigint;
  };
}

export interface IFactoryInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "createPermissionedPool"
      | "createPermissionlessPool"
      | "enquireLiquidation"
      | "epoches"
      | "getBalances"
      | "getCurrentDebt"
      | "getFinance"
      | "getPoolData"
      | "getProfile"
      | "joinAPool"
      | "liquidate"
      | "payback"
      | "removeLiquidityPool"
      | "withdrawCollateral"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic:
      | "BandCreated"
      | "Cancellation"
      | "GetFinanced"
      | "Liquidated"
      | "NewMemberAdded"
      | "Payback"
      | "Rekeyed"
      | "RoundUp"
  ): EventFragment;

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
    functionFragment: "enquireLiquidation",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "epoches", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "getBalances",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getCurrentDebt",
    values: [BigNumberish, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getFinance",
    values: [BigNumberish, BigNumberish]
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
    functionFragment: "joinAPool",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "liquidate",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "payback",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "removeLiquidityPool",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "withdrawCollateral",
    values: [BigNumberish]
  ): string;

  decodeFunctionResult(
    functionFragment: "createPermissionedPool",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "createPermissionlessPool",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "enquireLiquidation",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "epoches", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getBalances",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getCurrentDebt",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getFinance", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getPoolData",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getProfile", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "joinAPool", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "liquidate", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "payback", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "removeLiquidityPool",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "withdrawCollateral",
    data: BytesLike
  ): Result;
}

export namespace BandCreatedEvent {
  export type InputTuple = [arg0: Common.CreatePoolReturnValueStruct];
  export type OutputTuple = [arg0: Common.CreatePoolReturnValueStructOutput];
  export interface OutputObject {
    arg0: Common.CreatePoolReturnValueStructOutput;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
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
  export type InputTuple = [arg0: Common.CommonEventDataStruct];
  export type OutputTuple = [arg0: Common.CommonEventDataStructOutput];
  export interface OutputObject {
    arg0: Common.CommonEventDataStructOutput;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace LiquidatedEvent {
  export type InputTuple = [arg0: Common.CommonEventDataStruct];
  export type OutputTuple = [arg0: Common.CommonEventDataStructOutput];
  export interface OutputObject {
    arg0: Common.CommonEventDataStructOutput;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace NewMemberAddedEvent {
  export type InputTuple = [arg0: Common.CommonEventDataStruct];
  export type OutputTuple = [arg0: Common.CommonEventDataStructOutput];
  export interface OutputObject {
    arg0: Common.CommonEventDataStructOutput;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace PaybackEvent {
  export type InputTuple = [arg0: Common.CommonEventDataStruct];
  export type OutputTuple = [arg0: Common.CommonEventDataStructOutput];
  export interface OutputObject {
    arg0: Common.CommonEventDataStructOutput;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace RekeyedEvent {
  export type InputTuple = [arg0: AddressLike, arg1: AddressLike];
  export type OutputTuple = [arg0: string, arg1: string];
  export interface OutputObject {
    arg0: string;
    arg1: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace RoundUpEvent {
  export type InputTuple = [arg0: BigNumberish, arg1: Common.PoolStruct];
  export type OutputTuple = [arg0: bigint, arg1: Common.PoolStructOutput];
  export interface OutputObject {
    arg0: bigint;
    arg1: Common.PoolStructOutput;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface IFactory extends BaseContract {
  connect(runner?: ContractRunner | null): IFactory;
  waitForDeployment(): Promise<this>;

  interface: IFactoryInterface;

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

  createPermissionedPool: TypedContractMethod<
    [
      intRate: BigNumberish,
      durationInHours: BigNumberish,
      colCoverage: BigNumberish,
      unitLiquidity: BigNumberish,
      liquidAsset: AddressLike,
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
      liquidAsset: AddressLike
    ],
    [boolean],
    "nonpayable"
  >;

  enquireLiquidation: TypedContractMethod<
    [epochId: BigNumberish],
    [
      [Common.ContributorDataStructOutput, boolean, bigint] & {
        _liq: Common.ContributorDataStructOutput;
        defaulted: boolean;
        currentDebt: bigint;
      }
    ],
    "view"
  >;

  epoches: TypedContractMethod<[], [bigint], "view">;

  getBalances: TypedContractMethod<
    [epochId: BigNumberish],
    [Common.BalancesStructOutput],
    "view"
  >;

  getCurrentDebt: TypedContractMethod<
    [epochId: BigNumberish, target: AddressLike],
    [bigint],
    "view"
  >;

  getFinance: TypedContractMethod<
    [epochId: BigNumberish, daysOfUseInHr: BigNumberish],
    [boolean],
    "payable"
  >;

  getPoolData: TypedContractMethod<
    [epochId: BigNumberish],
    [Common.PoolStructOutput],
    "view"
  >;

  getProfile: TypedContractMethod<
    [epochId: BigNumberish, user: AddressLike],
    [Common.ContributorDataStructOutput],
    "view"
  >;

  joinAPool: TypedContractMethod<
    [epochId: BigNumberish],
    [boolean],
    "nonpayable"
  >;

  liquidate: TypedContractMethod<
    [epochId: BigNumberish],
    [boolean],
    "nonpayable"
  >;

  payback: TypedContractMethod<
    [epochId: BigNumberish],
    [boolean],
    "nonpayable"
  >;

  removeLiquidityPool: TypedContractMethod<
    [epochId: BigNumberish],
    [boolean],
    "nonpayable"
  >;

  withdrawCollateral: TypedContractMethod<
    [epochId: BigNumberish],
    [boolean],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "createPermissionedPool"
  ): TypedContractMethod<
    [
      intRate: BigNumberish,
      durationInHours: BigNumberish,
      colCoverage: BigNumberish,
      unitLiquidity: BigNumberish,
      liquidAsset: AddressLike,
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
      liquidAsset: AddressLike
    ],
    [boolean],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "enquireLiquidation"
  ): TypedContractMethod<
    [epochId: BigNumberish],
    [
      [Common.ContributorDataStructOutput, boolean, bigint] & {
        _liq: Common.ContributorDataStructOutput;
        defaulted: boolean;
        currentDebt: bigint;
      }
    ],
    "view"
  >;
  getFunction(
    nameOrSignature: "epoches"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "getBalances"
  ): TypedContractMethod<
    [epochId: BigNumberish],
    [Common.BalancesStructOutput],
    "view"
  >;
  getFunction(
    nameOrSignature: "getCurrentDebt"
  ): TypedContractMethod<
    [epochId: BigNumberish, target: AddressLike],
    [bigint],
    "view"
  >;
  getFunction(
    nameOrSignature: "getFinance"
  ): TypedContractMethod<
    [epochId: BigNumberish, daysOfUseInHr: BigNumberish],
    [boolean],
    "payable"
  >;
  getFunction(
    nameOrSignature: "getPoolData"
  ): TypedContractMethod<
    [epochId: BigNumberish],
    [Common.PoolStructOutput],
    "view"
  >;
  getFunction(
    nameOrSignature: "getProfile"
  ): TypedContractMethod<
    [epochId: BigNumberish, user: AddressLike],
    [Common.ContributorDataStructOutput],
    "view"
  >;
  getFunction(
    nameOrSignature: "joinAPool"
  ): TypedContractMethod<[epochId: BigNumberish], [boolean], "nonpayable">;
  getFunction(
    nameOrSignature: "liquidate"
  ): TypedContractMethod<[epochId: BigNumberish], [boolean], "nonpayable">;
  getFunction(
    nameOrSignature: "payback"
  ): TypedContractMethod<[epochId: BigNumberish], [boolean], "nonpayable">;
  getFunction(
    nameOrSignature: "removeLiquidityPool"
  ): TypedContractMethod<[epochId: BigNumberish], [boolean], "nonpayable">;
  getFunction(
    nameOrSignature: "withdrawCollateral"
  ): TypedContractMethod<[epochId: BigNumberish], [boolean], "nonpayable">;

  getEvent(
    key: "BandCreated"
  ): TypedContractEvent<
    BandCreatedEvent.InputTuple,
    BandCreatedEvent.OutputTuple,
    BandCreatedEvent.OutputObject
  >;
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
    key: "NewMemberAdded"
  ): TypedContractEvent<
    NewMemberAddedEvent.InputTuple,
    NewMemberAddedEvent.OutputTuple,
    NewMemberAddedEvent.OutputObject
  >;
  getEvent(
    key: "Payback"
  ): TypedContractEvent<
    PaybackEvent.InputTuple,
    PaybackEvent.OutputTuple,
    PaybackEvent.OutputObject
  >;
  getEvent(
    key: "Rekeyed"
  ): TypedContractEvent<
    RekeyedEvent.InputTuple,
    RekeyedEvent.OutputTuple,
    RekeyedEvent.OutputObject
  >;
  getEvent(
    key: "RoundUp"
  ): TypedContractEvent<
    RoundUpEvent.InputTuple,
    RoundUpEvent.OutputTuple,
    RoundUpEvent.OutputObject
  >;

  filters: {
    "BandCreated(tuple)": TypedContractEvent<
      BandCreatedEvent.InputTuple,
      BandCreatedEvent.OutputTuple,
      BandCreatedEvent.OutputObject
    >;
    BandCreated: TypedContractEvent<
      BandCreatedEvent.InputTuple,
      BandCreatedEvent.OutputTuple,
      BandCreatedEvent.OutputObject
    >;

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

    "NewMemberAdded(tuple)": TypedContractEvent<
      NewMemberAddedEvent.InputTuple,
      NewMemberAddedEvent.OutputTuple,
      NewMemberAddedEvent.OutputObject
    >;
    NewMemberAdded: TypedContractEvent<
      NewMemberAddedEvent.InputTuple,
      NewMemberAddedEvent.OutputTuple,
      NewMemberAddedEvent.OutputObject
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

    "Rekeyed(address,address)": TypedContractEvent<
      RekeyedEvent.InputTuple,
      RekeyedEvent.OutputTuple,
      RekeyedEvent.OutputObject
    >;
    Rekeyed: TypedContractEvent<
      RekeyedEvent.InputTuple,
      RekeyedEvent.OutputTuple,
      RekeyedEvent.OutputObject
    >;

    "RoundUp(uint256,tuple)": TypedContractEvent<
      RoundUpEvent.InputTuple,
      RoundUpEvent.OutputTuple,
      RoundUpEvent.OutputObject
    >;
    RoundUp: TypedContractEvent<
      RoundUpEvent.InputTuple,
      RoundUpEvent.OutputTuple,
      RoundUpEvent.OutputObject
    >;
  };
}
