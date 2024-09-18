/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
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

export interface AssetClassInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "getSupportedAssets"
      | "isSupportedAsset"
      | "listed"
      | "ownershipManager"
      | "setOwnershipManager"
      | "supportAsset"
      | "unsupportAsset"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "getSupportedAssets",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "isSupportedAsset",
    values: [AddressLike]
  ): string;
  encodeFunctionData(functionFragment: "listed", values: [AddressLike]): string;
  encodeFunctionData(
    functionFragment: "ownershipManager",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setOwnershipManager",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "supportAsset",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "unsupportAsset",
    values: [AddressLike]
  ): string;

  decodeFunctionResult(
    functionFragment: "getSupportedAssets",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isSupportedAsset",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "listed", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "ownershipManager",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setOwnershipManager",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "supportAsset",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "unsupportAsset",
    data: BytesLike
  ): Result;
}

export interface AssetClass extends BaseContract {
  connect(runner?: ContractRunner | null): AssetClass;
  waitForDeployment(): Promise<this>;

  interface: AssetClassInterface;

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

  getSupportedAssets: TypedContractMethod<[], [string[]], "view">;

  isSupportedAsset: TypedContractMethod<
    [_asset: AddressLike],
    [boolean],
    "view"
  >;

  listed: TypedContractMethod<[arg0: AddressLike], [boolean], "view">;

  ownershipManager: TypedContractMethod<[], [string], "view">;

  setOwnershipManager: TypedContractMethod<
    [newManager: AddressLike],
    [boolean],
    "nonpayable"
  >;

  supportAsset: TypedContractMethod<
    [_asset: AddressLike],
    [void],
    "nonpayable"
  >;

  unsupportAsset: TypedContractMethod<
    [newAsset: AddressLike],
    [void],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "getSupportedAssets"
  ): TypedContractMethod<[], [string[]], "view">;
  getFunction(
    nameOrSignature: "isSupportedAsset"
  ): TypedContractMethod<[_asset: AddressLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "listed"
  ): TypedContractMethod<[arg0: AddressLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "ownershipManager"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "setOwnershipManager"
  ): TypedContractMethod<[newManager: AddressLike], [boolean], "nonpayable">;
  getFunction(
    nameOrSignature: "supportAsset"
  ): TypedContractMethod<[_asset: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "unsupportAsset"
  ): TypedContractMethod<[newAsset: AddressLike], [void], "nonpayable">;

  filters: {};
}