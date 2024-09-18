import testToken from "../../deployments/crossTest/TestAsset.json";
import { Address } from "@/interfaces";
import { formatAddr } from "@/utilities";

export const getTokenAddress = () : Address => {
  return formatAddr(testToken.address);
} 
