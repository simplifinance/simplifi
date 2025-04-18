/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  FunctionFragment,
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
} from "../../common";

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
}

export interface CommonInterface extends Interface {
  getEvent(
    nameOrSignatureOrTopic:
      | "Cancellation"
      | "GetFinanced"
      | "Liquidated"
      | "NewContributorAdded"
      | "Payback"
      | "PoolCreated"
      | "PoolEdited"
  ): EventFragment;
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

export interface Common extends BaseContract {
  connect(runner?: ContractRunner | null): Common;
  waitForDeployment(): Promise<this>;

  interface: CommonInterface;

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

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

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
  };
}
