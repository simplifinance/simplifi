import { Address } from "@/interfaces";
import factory from "../../../contract/deployments/crossTest/Factory.json";
import { formatAddr } from "@/utilities";

export const getFactoryAddress = () : Address => {
  return formatAddr(formatAddr(factory.address));
} 
