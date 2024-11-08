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

export interface TrusteeInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "claimContribution"
      | "claimable"
      | "feeTo"
      | "getAccumulatedFee"
      | "owner"
      | "registerBeneficiaries"
      | "renounceOwnership"
      | "router"
      | "setAddresses"
      | "strategyAdmin"
      | "transferOut"
      | "transferOwnership"
      | "withdrawFee"
  ): FunctionFragment;

  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;

  encodeFunctionData(
    functionFragment: "claimContribution",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "claimable",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "feeTo", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "getAccumulatedFee",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "registerBeneficiaries",
    values: [AddressLike[], BigNumberish, BigNumberish, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "router", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "setAddresses",
    values: [AddressLike, AddressLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "strategyAdmin",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transferOut",
    values: [AddressLike, AddressLike, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "withdrawFee",
    values: [AddressLike, AddressLike]
  ): string;

  decodeFunctionResult(
    functionFragment: "claimContribution",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "claimable", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "feeTo", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getAccumulatedFee",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "registerBeneficiaries",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "router", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setAddresses",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "strategyAdmin",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOut",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "withdrawFee",
    data: BytesLike
  ): Result;
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

export interface Trustee extends BaseContract {
  connect(runner?: ContractRunner | null): Trustee;
  waitForDeployment(): Promise<this>;

  interface: TrusteeInterface;

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

  claimContribution: TypedContractMethod<
    [poolId: BigNumberish],
    [boolean],
    "payable"
  >;

  claimable: TypedContractMethod<[poolId: BigNumberish], [bigint], "view">;

  feeTo: TypedContractMethod<[], [string], "view">;

  getAccumulatedFee: TypedContractMethod<[], [bigint], "view">;

  owner: TypedContractMethod<[], [string], "view">;

  registerBeneficiaries: TypedContractMethod<
    [
      strategies: AddressLike[],
      amount: BigNumberish,
      poolId: BigNumberish,
      asset: AddressLike
    ],
    [boolean],
    "nonpayable"
  >;

  renounceOwnership: TypedContractMethod<[], [void], "nonpayable">;

  router: TypedContractMethod<[], [string], "view">;

  setAddresses: TypedContractMethod<
    [_router: AddressLike, _strategyAdmin: AddressLike, _feeTo: AddressLike],
    [void],
    "nonpayable"
  >;

  strategyAdmin: TypedContractMethod<[], [string], "view">;

  transferOut: TypedContractMethod<
    [
      asset: AddressLike,
      strategy: AddressLike,
      amount: BigNumberish,
      fee: BigNumberish
    ],
    [boolean],
    "nonpayable"
  >;

  transferOwnership: TypedContractMethod<
    [newOwner: AddressLike],
    [void],
    "nonpayable"
  >;

  withdrawFee: TypedContractMethod<
    [asset: AddressLike, to: AddressLike],
    [void],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "claimContribution"
  ): TypedContractMethod<[poolId: BigNumberish], [boolean], "payable">;
  getFunction(
    nameOrSignature: "claimable"
  ): TypedContractMethod<[poolId: BigNumberish], [bigint], "view">;
  getFunction(
    nameOrSignature: "feeTo"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "getAccumulatedFee"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "owner"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "registerBeneficiaries"
  ): TypedContractMethod<
    [
      strategies: AddressLike[],
      amount: BigNumberish,
      poolId: BigNumberish,
      asset: AddressLike
    ],
    [boolean],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "renounceOwnership"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "router"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "setAddresses"
  ): TypedContractMethod<
    [_router: AddressLike, _strategyAdmin: AddressLike, _feeTo: AddressLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "strategyAdmin"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "transferOut"
  ): TypedContractMethod<
    [
      asset: AddressLike,
      strategy: AddressLike,
      amount: BigNumberish,
      fee: BigNumberish
    ],
    [boolean],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "transferOwnership"
  ): TypedContractMethod<[newOwner: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "withdrawFee"
  ): TypedContractMethod<
    [asset: AddressLike, to: AddressLike],
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
