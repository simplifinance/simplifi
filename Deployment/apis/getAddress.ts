import testToken from "../../contract/deployments/crossTest/TestAsset.json";
import { Address } from "@/interfaces";
import { formatAddr } from "./contractAddress";

export const getTokenAddress = () : Address => {
  return formatAddr(testToken.address);
} 
