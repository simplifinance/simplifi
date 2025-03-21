/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Interface, type ContractRunner } from "ethers";
import type {
  IDIAOracleV2,
  IDIAOracleV2Interface,
} from "../../../../contracts/abstracts/PriceOracle.sol/IDIAOracleV2";

const _abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    name: "getValue",
    outputs: [
      {
        internalType: "uint128",
        name: "",
        type: "uint128",
      },
      {
        internalType: "uint128",
        name: "",
        type: "uint128",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export class IDIAOracleV2__factory {
  static readonly abi = _abi;
  static createInterface(): IDIAOracleV2Interface {
    return new Interface(_abi) as IDIAOracleV2Interface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): IDIAOracleV2 {
    return new Contract(address, _abi, runner) as unknown as IDIAOracleV2;
  }
}
