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

export interface ISupportedAssetInterface extends Interface {
  getFunction(
    nameOrSignature: "getDefaultSupportedCollateralAsset" | "isSupportedAsset"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "getDefaultSupportedCollateralAsset",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "isSupportedAsset",
    values: [AddressLike]
  ): string;

  decodeFunctionResult(
    functionFragment: "getDefaultSupportedCollateralAsset",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isSupportedAsset",
    data: BytesLike
  ): Result;
}

export interface ISupportedAsset extends BaseContract {
  connect(runner?: ContractRunner | null): ISupportedAsset;
  waitForDeployment(): Promise<this>;

  interface: ISupportedAssetInterface;

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

  getDefaultSupportedCollateralAsset: TypedContractMethod<[], [string], "view">;

  isSupportedAsset: TypedContractMethod<
    [_asset: AddressLike],
    [boolean],
    "view"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "getDefaultSupportedCollateralAsset"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "isSupportedAsset"
  ): TypedContractMethod<[_asset: AddressLike], [boolean], "view">;

  filters: {};
}
