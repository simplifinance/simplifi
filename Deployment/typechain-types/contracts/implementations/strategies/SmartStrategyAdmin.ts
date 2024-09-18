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

export interface SmartStrategyAdminInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "activateStrategy"
      | "approvals"
      | "assetClass"
      | "createStrategy"
      | "deactivateStrategy"
      | "dormantStrategies"
      | "factory"
      | "feeTo"
      | "getStrategy"
      | "handpickStrategy"
      | "owner"
      | "rekeyStrategy"
      | "renounceOwnership"
      | "setAssetAdmin"
      | "setFactory"
      | "setFeeTo"
      | "setStrategyCreationFee"
      | "setToken"
      | "setdeployedInstance"
      | "smartStrategyInstance"
      | "token"
      | "totalStrategies"
      | "transferOwnership"
      | "upgraded"
      | "withdraw"
  ): FunctionFragment;

  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;

  encodeFunctionData(
    functionFragment: "activateStrategy",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "approvals",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "assetClass",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "createStrategy",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "deactivateStrategy",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "dormantStrategies",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "factory", values?: undefined): string;
  encodeFunctionData(functionFragment: "feeTo", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "getStrategy",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "handpickStrategy",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "rekeyStrategy",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setAssetAdmin",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setFactory",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setFeeTo",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setStrategyCreationFee",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setToken",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setdeployedInstance",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "smartStrategyInstance",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "token", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "totalStrategies",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "upgraded",
    values: [AddressLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "withdraw",
    values: [BigNumberish, AddressLike]
  ): string;

  decodeFunctionResult(
    functionFragment: "activateStrategy",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "approvals", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "assetClass", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "createStrategy",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "deactivateStrategy",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "dormantStrategies",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "factory", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "feeTo", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getStrategy",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "handpickStrategy",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "rekeyStrategy",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setAssetAdmin",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setFactory", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setFeeTo", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setStrategyCreationFee",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setToken", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setdeployedInstance",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "smartStrategyInstance",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "token", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "totalStrategies",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "upgraded", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "withdraw", data: BytesLike): Result;
}

export namespace OwnershipTransferredEvent {
  export type InputTuple = [previousOwner: AddressLike, newOwner: AddressLike];
  export type OutputTuple = [previousOwner: string, newOwner: string];
  export interface OutputObject {
    previousOwner: string;
    newOwner: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface SmartStrategyAdmin extends BaseContract {
  connect(runner?: ContractRunner | null): SmartStrategyAdmin;
  waitForDeployment(): Promise<this>;

  interface: SmartStrategyAdminInterface;

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

  activateStrategy: TypedContractMethod<
    [user: AddressLike],
    [boolean],
    "nonpayable"
  >;

  approvals: TypedContractMethod<[arg0: AddressLike], [boolean], "view">;

  assetClass: TypedContractMethod<[], [string], "view">;

  createStrategy: TypedContractMethod<
    [user: AddressLike],
    [string],
    "nonpayable"
  >;

  deactivateStrategy: TypedContractMethod<
    [user: AddressLike],
    [void],
    "nonpayable"
  >;

  dormantStrategies: TypedContractMethod<
    [arg0: BigNumberish],
    [string],
    "view"
  >;

  factory: TypedContractMethod<[], [string], "view">;

  feeTo: TypedContractMethod<[], [string], "view">;

  getStrategy: TypedContractMethod<[user: AddressLike], [string], "view">;

  handpickStrategy: TypedContractMethod<
    [index: BigNumberish],
    [boolean],
    "nonpayable"
  >;

  owner: TypedContractMethod<[], [string], "view">;

  rekeyStrategy: TypedContractMethod<
    [_asset: AddressLike],
    [boolean],
    "nonpayable"
  >;

  renounceOwnership: TypedContractMethod<[], [void], "nonpayable">;

  setAssetAdmin: TypedContractMethod<
    [newAssetAdmin: AddressLike],
    [void],
    "nonpayable"
  >;

  setFactory: TypedContractMethod<
    [newFactory: AddressLike],
    [void],
    "nonpayable"
  >;

  setFeeTo: TypedContractMethod<[newFeeTo: AddressLike], [void], "nonpayable">;

  setStrategyCreationFee: TypedContractMethod<
    [newFee: BigNumberish],
    [void],
    "nonpayable"
  >;

  setToken: TypedContractMethod<[newToken: AddressLike], [void], "nonpayable">;

  setdeployedInstance: TypedContractMethod<
    [newInstance: AddressLike],
    [void],
    "nonpayable"
  >;

  smartStrategyInstance: TypedContractMethod<[], [string], "view">;

  token: TypedContractMethod<[], [string], "view">;

  totalStrategies: TypedContractMethod<[], [bigint], "view">;

  transferOwnership: TypedContractMethod<
    [newOwner: AddressLike],
    [void],
    "nonpayable"
  >;

  upgraded: TypedContractMethod<
    [arg0: AddressLike, arg1: AddressLike],
    [boolean],
    "view"
  >;

  withdraw: TypedContractMethod<
    [amount: BigNumberish, asset: AddressLike],
    [void],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "activateStrategy"
  ): TypedContractMethod<[user: AddressLike], [boolean], "nonpayable">;
  getFunction(
    nameOrSignature: "approvals"
  ): TypedContractMethod<[arg0: AddressLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "assetClass"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "createStrategy"
  ): TypedContractMethod<[user: AddressLike], [string], "nonpayable">;
  getFunction(
    nameOrSignature: "deactivateStrategy"
  ): TypedContractMethod<[user: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "dormantStrategies"
  ): TypedContractMethod<[arg0: BigNumberish], [string], "view">;
  getFunction(
    nameOrSignature: "factory"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "feeTo"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "getStrategy"
  ): TypedContractMethod<[user: AddressLike], [string], "view">;
  getFunction(
    nameOrSignature: "handpickStrategy"
  ): TypedContractMethod<[index: BigNumberish], [boolean], "nonpayable">;
  getFunction(
    nameOrSignature: "owner"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "rekeyStrategy"
  ): TypedContractMethod<[_asset: AddressLike], [boolean], "nonpayable">;
  getFunction(
    nameOrSignature: "renounceOwnership"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "setAssetAdmin"
  ): TypedContractMethod<[newAssetAdmin: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "setFactory"
  ): TypedContractMethod<[newFactory: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "setFeeTo"
  ): TypedContractMethod<[newFeeTo: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "setStrategyCreationFee"
  ): TypedContractMethod<[newFee: BigNumberish], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "setToken"
  ): TypedContractMethod<[newToken: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "setdeployedInstance"
  ): TypedContractMethod<[newInstance: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "smartStrategyInstance"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "token"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "totalStrategies"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "transferOwnership"
  ): TypedContractMethod<[newOwner: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "upgraded"
  ): TypedContractMethod<
    [arg0: AddressLike, arg1: AddressLike],
    [boolean],
    "view"
  >;
  getFunction(
    nameOrSignature: "withdraw"
  ): TypedContractMethod<
    [amount: BigNumberish, asset: AddressLike],
    [void],
    "nonpayable"
  >;

  getEvent(
    key: "OwnershipTransferred"
  ): TypedContractEvent<
    OwnershipTransferredEvent.InputTuple,
    OwnershipTransferredEvent.OutputTuple,
    OwnershipTransferredEvent.OutputObject
  >;

  filters: {
    "OwnershipTransferred(address,address)": TypedContractEvent<
      OwnershipTransferredEvent.InputTuple,
      OwnershipTransferredEvent.OutputTuple,
      OwnershipTransferredEvent.OutputObject
    >;
    OwnershipTransferred: TypedContractEvent<
      OwnershipTransferredEvent.InputTuple,
      OwnershipTransferredEvent.OutputTuple,
      OwnershipTransferredEvent.OutputObject
    >;
  };
}