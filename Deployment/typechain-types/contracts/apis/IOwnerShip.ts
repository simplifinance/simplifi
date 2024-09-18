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
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedListener,
  TypedContractMethod,
} from "../../common";

export interface IOwnerShipInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "getOwner"
      | "isOwner"
      | "removeOwner"
      | "renounceOwnerShip"
      | "setPermission"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "getOwner",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "isOwner",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "removeOwner",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnerShip",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setPermission",
    values: [AddressLike[]]
  ): string;

  decodeFunctionResult(functionFragment: "getOwner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "isOwner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "removeOwner",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnerShip",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setPermission",
    data: BytesLike
  ): Result;
}

export interface IOwnerShip extends BaseContract {
  connect(runner?: ContractRunner | null): IOwnerShip;
  waitForDeployment(): Promise<this>;

  interface: IOwnerShipInterface;

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

  getOwner: TypedContractMethod<[ownerId: BigNumberish], [string], "view">;

  isOwner: TypedContractMethod<[target: AddressLike], [boolean], "view">;

  removeOwner: TypedContractMethod<
    [target: AddressLike],
    [boolean],
    "nonpayable"
  >;

  renounceOwnerShip: TypedContractMethod<[], [boolean], "nonpayable">;

  setPermission: TypedContractMethod<
    [newOwners: AddressLike[]],
    [boolean],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "getOwner"
  ): TypedContractMethod<[ownerId: BigNumberish], [string], "view">;
  getFunction(
    nameOrSignature: "isOwner"
  ): TypedContractMethod<[target: AddressLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "removeOwner"
  ): TypedContractMethod<[target: AddressLike], [boolean], "nonpayable">;
  getFunction(
    nameOrSignature: "renounceOwnerShip"
  ): TypedContractMethod<[], [boolean], "nonpayable">;
  getFunction(
    nameOrSignature: "setPermission"
  ): TypedContractMethod<[newOwners: AddressLike[]], [boolean], "nonpayable">;

  filters: {};
}