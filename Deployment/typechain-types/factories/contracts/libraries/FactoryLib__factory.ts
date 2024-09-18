/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../../common";
import type {
  FactoryLib,
  FactoryLibInterface,
} from "../../../contracts/libraries/FactoryLib";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "epochId",
        type: "uint256",
      },
      {
        components: [
          {
            components: [
              {
                internalType: "uint256",
                name: "quorum",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "selector",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "colCoverage",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "duration",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "intRate",
                type: "uint256",
              },
            ],
            internalType: "struct Common.Uints",
            name: "uints",
            type: "tuple",
          },
          {
            components: [
              {
                internalType: "uint256",
                name: "fullInterest",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "intPerSec",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "unit",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "currentPool",
                type: "uint256",
              },
            ],
            internalType: "struct Common.Uint256s",
            name: "uint256s",
            type: "tuple",
          },
          {
            components: [
              {
                internalType: "address",
                name: "asset",
                type: "address",
              },
              {
                internalType: "address",
                name: "lastPaid",
                type: "address",
              },
              {
                internalType: "address",
                name: "strategy",
                type: "address",
              },
              {
                internalType: "address",
                name: "admin",
                type: "address",
              },
            ],
            internalType: "struct Common.Addresses",
            name: "addrs",
            type: "tuple",
          },
          {
            internalType: "uint256",
            name: "allGh",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "isPermissionless",
            type: "bool",
          },
        ],
        indexed: false,
        internalType: "struct Common.Pool",
        name: "pool",
        type: "tuple",
      },
    ],
    name: "AllGh",
    type: "event",
  },
] as const;

const _bytecode =
  "0x60566050600b82828239805160001a6073146043577f4e487b7100000000000000000000000000000000000000000000000000000000600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600080fdfea264697066735822122022994dde85852d67b378ff4799c90c5eff11109b27d56bdaa60d53d4d3a9f7cd64736f6c63430008180033";

type FactoryLibConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: FactoryLibConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class FactoryLib__factory extends ContractFactory {
  constructor(...args: FactoryLibConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(overrides || {});
  }
  override deploy(overrides?: NonPayableOverrides & { from?: string }) {
    return super.deploy(overrides || {}) as Promise<
      FactoryLib & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): FactoryLib__factory {
    return super.connect(runner) as FactoryLib__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): FactoryLibInterface {
    return new Interface(_abi) as FactoryLibInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): FactoryLib {
    return new Contract(address, _abi, runner) as unknown as FactoryLib;
  }
}