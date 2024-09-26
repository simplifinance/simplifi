import { Address } from "@/interfaces";
import factory from "../../contract/deployments/crossTest/Factory.json";

export const formatAddr = (x: string | (Address | undefined)) : Address => {
    if(!x || x === "") return `0x${'0'.repeat(40)}`;
    return `0x${x.substring(2, 42)}`;
};

export const getFactoryAddress = () => {
    return formatAddr(factory.address);
}
