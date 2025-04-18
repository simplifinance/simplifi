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

export interface IRoleBaseInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "getRoleBearer"
      | "hasRole"
      | "removeRole"
      | "renounceRole"
      | "setRole"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "getRoleBearer",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "hasRole",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "removeRole",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "renounceRole",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setRole",
    values: [AddressLike[]]
  ): string;

  decodeFunctionResult(
    functionFragment: "getRoleBearer",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "hasRole", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "removeRole", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renounceRole",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setRole", data: BytesLike): Result;
}

export interface IRoleBase extends BaseContract {
  connect(runner?: ContractRunner | null): IRoleBase;
  waitForDeployment(): Promise<this>;

  interface: IRoleBaseInterface;

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

  getRoleBearer: TypedContractMethod<[ownerId: BigNumberish], [string], "view">;

  hasRole: TypedContractMethod<[target: AddressLike], [boolean], "view">;

  removeRole: TypedContractMethod<
    [target: AddressLike],
    [boolean],
    "nonpayable"
  >;

  renounceRole: TypedContractMethod<[], [boolean], "nonpayable">;

  setRole: TypedContractMethod<
    [newRoleTos: AddressLike[]],
    [boolean],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "getRoleBearer"
  ): TypedContractMethod<[ownerId: BigNumberish], [string], "view">;
  getFunction(
    nameOrSignature: "hasRole"
  ): TypedContractMethod<[target: AddressLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "removeRole"
  ): TypedContractMethod<[target: AddressLike], [boolean], "nonpayable">;
  getFunction(
    nameOrSignature: "renounceRole"
  ): TypedContractMethod<[], [boolean], "nonpayable">;
  getFunction(
    nameOrSignature: "setRole"
  ): TypedContractMethod<[newRoleTos: AddressLike[]], [boolean], "nonpayable">;

  filters: {};
}
