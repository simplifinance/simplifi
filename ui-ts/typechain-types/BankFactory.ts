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

export interface BankFactoryInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "createBank"
      | "feeTo"
      | "getBank"
      | "ownershipManager"
      | "setFeeTp"
      | "setOwnershipManager"
      | "totalBanks"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "createBank",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "feeTo", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "getBank",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "ownershipManager",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setFeeTp",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setOwnershipManager",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "totalBanks",
    values?: undefined
  ): string;

  decodeFunctionResult(functionFragment: "createBank", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "feeTo", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getBank", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "ownershipManager",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setFeeTp", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setOwnershipManager",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "totalBanks", data: BytesLike): Result;
}

export interface BankFactory extends BaseContract {
  connect(runner?: ContractRunner | null): BankFactory;
  waitForDeployment(): Promise<this>;

  interface: BankFactoryInterface;

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

  createBank: TypedContractMethod<[unit: BigNumberish], [string], "nonpayable">;

  feeTo: TypedContractMethod<[], [string], "view">;

  getBank: TypedContractMethod<[unit: BigNumberish], [string], "view">;

  ownershipManager: TypedContractMethod<[], [string], "view">;

  setFeeTp: TypedContractMethod<[newFeeTo: AddressLike], [void], "nonpayable">;

  setOwnershipManager: TypedContractMethod<
    [newManager: AddressLike],
    [boolean],
    "nonpayable"
  >;

  totalBanks: TypedContractMethod<[], [bigint], "view">;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "createBank"
  ): TypedContractMethod<[unit: BigNumberish], [string], "nonpayable">;
  getFunction(
    nameOrSignature: "feeTo"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "getBank"
  ): TypedContractMethod<[unit: BigNumberish], [string], "view">;
  getFunction(
    nameOrSignature: "ownershipManager"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "setFeeTp"
  ): TypedContractMethod<[newFeeTo: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "setOwnershipManager"
  ): TypedContractMethod<[newManager: AddressLike], [boolean], "nonpayable">;
  getFunction(
    nameOrSignature: "totalBanks"
  ): TypedContractMethod<[], [bigint], "view">;

  filters: {};
}
