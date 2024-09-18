import { Address } from "@/interfaces";
import factory from "../../deployments/crossTest/Factory.json";
import { formatAddr } from "@/utilities";

export const getFactoryAddress = () : Address => {
  return formatAddr(formatAddr(factory.address));
} 
