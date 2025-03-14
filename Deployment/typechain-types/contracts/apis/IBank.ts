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

export declare namespace IBank {
  export type ViewDataStruct = {
    totalClients: BigNumberish;
    aggregateFee: BigNumberish;
  };

  export type ViewDataStructOutput = [
    totalClients: bigint,
    aggregateFee: bigint
  ] & { totalClients: bigint; aggregateFee: bigint };
}

export declare namespace C3 {
  export type ContributorStruct = {
    durOfChoice: BigNumberish;
    expInterest: BigNumberish;
    payDate: BigNumberish;
    turnTime: BigNumberish;
    loan: BigNumberish;
    colBals: BigNumberish;
    id: AddressLike;
    sentQuota: boolean;
  };

  export type ContributorStructOutput = [
    durOfChoice: bigint,
    expInterest: bigint,
    payDate: bigint,
    turnTime: bigint,
    loan: bigint,
    colBals: bigint,
    id: string,
    sentQuota: boolean
  ] & {
    durOfChoice: bigint;
    expInterest: bigint;
    payDate: bigint;
    turnTime: bigint;
    loan: bigint;
    colBals: bigint;
    id: string;
    sentQuota: boolean;
  };
}

export interface IBankInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "addUp"
      | "borrow"
      | "cancel"
      | "depositCollateral"
      | "getData"
      | "payback"
      | "withdrawFee"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "addUp",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "borrow",
    values: [
      AddressLike,
      AddressLike,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "cancel",
    values: [AddressLike, AddressLike, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "depositCollateral",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "getData", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "payback",
    values: [
      AddressLike,
      AddressLike,
      BigNumberish,
      BigNumberish,
      boolean,
      C3.ContributorStruct[],
      boolean,
      AddressLike,
      BigNumberish
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "withdrawFee",
    values: [AddressLike, AddressLike]
  ): string;

  decodeFunctionResult(functionFragment: "addUp", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "borrow", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "cancel", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "depositCollateral",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getData", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "payback", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "withdrawFee",
    data: BytesLike
  ): Result;
}

export interface IBank extends BaseContract {
  connect(runner?: ContractRunner | null): IBank;
  waitForDeployment(): Promise<this>;

  interface: IBankInterface;

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

  addUp: TypedContractMethod<
    [user: AddressLike, rId: BigNumberish],
    [void],
    "nonpayable"
  >;

  borrow: TypedContractMethod<
    [
      user: AddressLike,
      asset: AddressLike,
      loan: BigNumberish,
      fee: BigNumberish,
      calculatedCol: BigNumberish,
      rId: BigNumberish
    ],
    [bigint],
    "payable"
  >;

  cancel: TypedContractMethod<
    [
      user: AddressLike,
      asset: AddressLike,
      erc20Balances: BigNumberish,
      rId: BigNumberish
    ],
    [void],
    "nonpayable"
  >;

  depositCollateral: TypedContractMethod<
    [rId: BigNumberish],
    [boolean],
    "payable"
  >;

  getData: TypedContractMethod<[], [IBank.ViewDataStructOutput], "view">;

  payback: TypedContractMethod<
    [
      user: AddressLike,
      asset: AddressLike,
      debt: BigNumberish,
      attestedInitialBal: BigNumberish,
      allGH: boolean,
      cData: C3.ContributorStruct[],
      isSwapped: boolean,
      defaulted: AddressLike,
      rId: BigNumberish
    ],
    [void],
    "payable"
  >;

  withdrawFee: TypedContractMethod<
    [recipient: AddressLike, asset: AddressLike],
    [void],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "addUp"
  ): TypedContractMethod<
    [user: AddressLike, rId: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "borrow"
  ): TypedContractMethod<
    [
      user: AddressLike,
      asset: AddressLike,
      loan: BigNumberish,
      fee: BigNumberish,
      calculatedCol: BigNumberish,
      rId: BigNumberish
    ],
    [bigint],
    "payable"
  >;
  getFunction(
    nameOrSignature: "cancel"
  ): TypedContractMethod<
    [
      user: AddressLike,
      asset: AddressLike,
      erc20Balances: BigNumberish,
      rId: BigNumberish
    ],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "depositCollateral"
  ): TypedContractMethod<[rId: BigNumberish], [boolean], "payable">;
  getFunction(
    nameOrSignature: "getData"
  ): TypedContractMethod<[], [IBank.ViewDataStructOutput], "view">;
  getFunction(
    nameOrSignature: "payback"
  ): TypedContractMethod<
    [
      user: AddressLike,
      asset: AddressLike,
      debt: BigNumberish,
      attestedInitialBal: BigNumberish,
      allGH: boolean,
      cData: C3.ContributorStruct[],
      isSwapped: boolean,
      defaulted: AddressLike,
      rId: BigNumberish
    ],
    [void],
    "payable"
  >;
  getFunction(
    nameOrSignature: "withdrawFee"
  ): TypedContractMethod<
    [recipient: AddressLike, asset: AddressLike],
    [void],
    "nonpayable"
  >;

  filters: {};
}
