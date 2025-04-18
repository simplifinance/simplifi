import React from "react";
import { 
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectSeparator,
    SelectValue
 } from "@/components/ui/select";
import { Address } from "@/interfaces";
import { SupportedAssetManager } from "@/typechain-types/SupportedAssetManager"
import { formatAddr } from "@/utilities";

const phases = [
    {
        phase: 'beta',
        active: true 
    },
    {
        phase: 'alpha',
        active: false
    },
] as const;

export default function SelectComponent({data, label, placeholder, callback} : SelectProps) {
    return(
        <Select>
            <SelectTrigger className="w-full bg-white1 border dark:border-green1/90 p-2">
                <SelectValue placeholder={placeholder || "Select phase"} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    { label && <SelectLabel>{label || 'Phases'}</SelectLabel>}
                    {
                        data?
                            data.map(({name, symbol, id}) => (
                                <SelectItem onClick={() => callback?.(formatAddr(id.toString()))} key={name} value={`${name} - ${symbol}`} >{`${name} - ${symbol}`}</SelectItem>
                            )) : 
                            phases.map(({phase, active}) => (
                                <SelectItem key={phase} value={phase} disabled={!active} >{phase}</SelectItem>
                            ))
                    }
                    <SelectSeparator />
                </SelectGroup>
            </SelectContent>
            
        </Select>
    );
}

interface SelectProps {
    data?: Readonly<SupportedAssetManager.SupportedAssetStruct[]>;
    callback?: (arg: Address) => void;
    placeholder?: string;
    label?: string;
}
