/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Interface, type ContractRunner } from "ethers";
import type { Common, CommonInterface } from "../../../contracts/apis/Common";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint24",
        name: "ccr",
        type: "uint24",
      },
    ],
    name: "CollateralCoverageCannotGoBelow_100",
    type: "error",
  },
] as const;

export class Common__factory {
  static readonly abi = _abi;
  static createInterface(): CommonInterface {
    return new Interface(_abi) as CommonInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): Common {
    return new Contract(address, _abi, runner) as unknown as Common;
  }
}
