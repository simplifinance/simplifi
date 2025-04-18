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

export interface AttorneyInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "fee"
      | "panicUnlock"
      | "pause"
      | "paused"
      | "roleManager"
      | "setFee"
      | "setRoleManager"
      | "setToken"
      | "token"
      | "unpause"
  ): FunctionFragment;

  getEvent(nameOrSignatureOrTopic: "Paused" | "Unpaused"): EventFragment;

  encodeFunctionData(functionFragment: "fee", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "panicUnlock",
    values: [AddressLike]
  ): string;
  encodeFunctionData(functionFragment: "pause", values?: undefined): string;
  encodeFunctionData(functionFragment: "paused", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "roleManager",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setFee",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setRoleManager",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setToken",
    values: [AddressLike]
  ): string;
  encodeFunctionData(functionFragment: "token", values?: undefined): string;
  encodeFunctionData(functionFragment: "unpause", values?: undefined): string;

  decodeFunctionResult(functionFragment: "fee", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "panicUnlock",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "pause", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "paused", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "roleManager",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setFee", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setRoleManager",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setToken", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "token", data: BytesLike): Result;
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

export interface Attorney extends BaseContract {
  connect(runner?: ContractRunner | null): Attorney;
  waitForDeployment(): Promise<this>;

  interface: AttorneyInterface;

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

  fee: TypedContractMethod<[], [bigint], "view">;

  panicUnlock: TypedContractMethod<
    [lostAccount: AddressLike],
    [void],
    "payable"
  >;

  pause: TypedContractMethod<[], [void], "nonpayable">;

  paused: TypedContractMethod<[], [boolean], "view">;

  roleManager: TypedContractMethod<[], [string], "view">;

  setFee: TypedContractMethod<[newFee: BigNumberish], [void], "nonpayable">;

  setRoleManager: TypedContractMethod<
    [newManager: AddressLike],
    [boolean],
    "nonpayable"
  >;

  setToken: TypedContractMethod<[_token: AddressLike], [void], "nonpayable">;

  token: TypedContractMethod<[], [string], "view">;

  unpause: TypedContractMethod<[], [void], "nonpayable">;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "fee"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "panicUnlock"
  ): TypedContractMethod<[lostAccount: AddressLike], [void], "payable">;
  getFunction(
    nameOrSignature: "pause"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "paused"
  ): TypedContractMethod<[], [boolean], "view">;
  getFunction(
    nameOrSignature: "roleManager"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "setFee"
  ): TypedContractMethod<[newFee: BigNumberish], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "setRoleManager"
  ): TypedContractMethod<[newManager: AddressLike], [boolean], "nonpayable">;
  getFunction(
    nameOrSignature: "setToken"
  ): TypedContractMethod<[_token: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "token"
  ): TypedContractMethod<[], [string], "view">;
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
