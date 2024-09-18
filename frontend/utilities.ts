import { type BigNumberish, ethers } from "ethers";
import type { Address } from "@/interfaces";
import BigNumber from 'bignumber.js';

export type UtilsOPeration = "div" | "add" | "sub" | "mul";
export const formatValue = (value: string | undefined): string => {
  if(value === "undefined" || value === undefined) {
    return '0';
  } 
  return ethers.formatEther(value);
}

export const str = (arg: string | undefined) => String(arg);
export const num = (arg: number | undefined) => Number(arg);

export const formatAddr = (x: string | (Address | undefined)) : Address => {
  if(!x || x === "") return `0x${'0'.repeat(40)}`;
  return `0x${x.substring(2, 42)}`;
};

export const toBigInt = (x: string | number | ethers.BigNumberish | bigint | undefined) : bigint => {
  if(!x) return 0n;
  return ethers.toBigInt(x);
} 

export const toBN = (x: string | number ) => {
  return new BigNumber(x);
}

export function getTimeFromEpoch(onchainUnixTime: bigint | BigNumberish) {
  var newDate = new Date(toBN(onchainUnixTime.toString()).toNumber());
  return `${newDate.toLocaleDateString("en-GB")} ${newDate.toLocaleTimeString("en-US")}`;
}
