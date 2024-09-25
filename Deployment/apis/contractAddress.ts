import factory from "../deployments/crossTest/Factory.json";
import { Address } from "@/interfaces";

export const formatAddr = (x: string | (Address | undefined)) : Address => {
    if(!x || x === "") return `0x${'0'.repeat(40)}`;
    return `0x${x.substring(2, 42)}`;
};
export const getFactoryAddress = () => formatAddr(factory.address);
