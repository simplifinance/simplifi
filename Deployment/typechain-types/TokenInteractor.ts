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
} from "../../../common";

export interface TokenInteractorInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "batchTransfer"
      | "lockToken"
      | "roleManager"
      | "setRoleManager"
      | "setToken"
      | "token"
      | "transferToken"
      | "unlockToken"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "batchTransfer",
    values: [AddressLike[], BigNumberish[]]
  ): string;
  encodeFunctionData(
    functionFragment: "lockToken",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "roleManager",
    values?: undefined
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
  encodeFunctionData(
    functionFragment: "transferToken",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "unlockToken",
    values: [BigNumberish]
  ): string;

  decodeFunctionResult(
    functionFragment: "batchTransfer",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "lockToken", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "roleManager",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setRoleManager",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setToken", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "token", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "transferToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "unlockToken",
    data: BytesLike
  ): Result;
}

export interface TokenInteractor extends BaseContract {
  connect(runner?: ContractRunner | null): TokenInteractor;
  waitForDeployment(): Promise<this>;

  interface: TokenInteractorInterface;

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

  batchTransfer: TypedContractMethod<
    [accounts: AddressLike[], amounts: BigNumberish[]],
    [void],
    "nonpayable"
  >;

  lockToken: TypedContractMethod<
    [_routeTo: AddressLike, amount: BigNumberish],
    [void],
    "nonpayable"
  >;

  roleManager: TypedContractMethod<[], [string], "view">;

  setRoleManager: TypedContractMethod<
    [newManager: AddressLike],
    [boolean],
    "nonpayable"
  >;

  setToken: TypedContractMethod<[newToken: AddressLike], [void], "nonpayable">;

  token: TypedContractMethod<[], [string], "view">;

  transferToken: TypedContractMethod<
    [account: AddressLike, amount: BigNumberish],
    [void],
    "nonpayable"
  >;

  unlockToken: TypedContractMethod<
    [amount: BigNumberish],
    [void],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "batchTransfer"
  ): TypedContractMethod<
    [accounts: AddressLike[], amounts: BigNumberish[]],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "lockToken"
  ): TypedContractMethod<
    [_routeTo: AddressLike, amount: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "roleManager"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "setRoleManager"
  ): TypedContractMethod<[newManager: AddressLike], [boolean], "nonpayable">;
  getFunction(
    nameOrSignature: "setToken"
  ): TypedContractMethod<[newToken: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "token"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "transferToken"
  ): TypedContractMethod<
    [account: AddressLike, amount: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "unlockToken"
  ): TypedContractMethod<[amount: BigNumberish], [void], "nonpayable">;

  filters: {};
}
