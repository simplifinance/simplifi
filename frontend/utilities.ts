import { BigNumberish, ethers } from "ethers";
import type { Address } from "@/interfaces";
import assert from "assert";

export const BigNumber = ethers.BigNumber;
export type UtilsOPeration = "div" | "add" | "sub" | "mul";
export const formatValue = (value: string | undefined): string => {
  if(value === "undefined" || value === undefined) {
    return '0';
  } 
  return ethers.utils.formatEther(value);
}

export const performBigIntOperation = (args: {op1: bigint[], op1OperationType: UtilsOPeration, op2?: bigint, op2OperationType?: UtilsOPeration}) : ethers.BigNumber => {
  const { op1, op1OperationType, op2, op2OperationType} = args;
  let result = ethers.BigNumber.from(0);
  switch (op1OperationType) {
    case "add":
      op1.forEach((item) => result = result.add(toBN(item)));
      break;
    case "sub":
      assert.equal(op1.length, 2, "utilities: Op1 length cannot exceed 2");
      const op1BN = toBN(op1[0]);
      assert(op1BN.gt(op1[1]), "utilities Sub: B > A");
      result = op1BN.sub(op1[1]);
      break;
    case "div":
      assert.equal(op1.length, 2, "utilities: Op1 length cannot exceed 2");
      const div1BN = toBN(op1[0]);
      assert(div1BN.gte(op1[1]), "utilities Div: B > A");
      result = div1BN.div(op1[1]);
      break;
    case "mul":
      assert.equal(op1.length, 2, "utilities Mul: Op1 length cannot exceed 2");
      result = toBN(op1[0]).mul(op1[1]);
      break;
  
    default:
      break;
  }
  if(op2) {
    switch (op2OperationType) {
      case "add":
        result = result.add(op2);
        break;
      case "sub":
        assert(result.gt(op2), "utilities Sub Op2: Result < Op2");
        result = result.sub(op2);
        break;
      case "mul":
          result = result.mul(op2);
          break;
      case "div":
        assert(result.gt(op2), "utilities Div Op2: Result < Op2");
        result = result.div(op2);
        break;
      default:
        break;
    }
  }
  return result;
}

export const str = (arg: string | undefined) => String(arg);
export const num = (arg: number | undefined) => Number(arg);

export const powr = (x: number | string, power: number, decimals: number): ethers.BigNumber => {
  return BigNumber.from(x).mul(BigNumber.from(BigNumber.from(10).pow(decimals))).mul(BigNumber.from(power));
} 

export const formatAddr = (x: string | (Address | undefined)) : Address => {
  if(!x || x === "") return `0x${'0'.repeat(40)}`;
  return `0x${x.substring(2, 42)}`;
};

export const errorBubble = (message?: string) => {
  throw new Error(message || "Chain Not Detected");
}

export const toBigInt = (x: string | number | ethers.BigNumber | bigint | undefined) : bigint => {
  if(!x) return 0n;
  return BigNumber.from(x).toBigInt();
} 

export const toBN = (x: bigint | string | number | BigNumberish) => {
  return BigNumber.from(x);
}

export function getTimeFromEpoch(onchainUnixTime: bigint | BigNumberish) {
  var newDate = new Date(toBN(onchainUnixTime).toNumber());
  return `${newDate.toLocaleDateString("en-GB")} ${newDate.toLocaleTimeString("en-US")}`;
}
