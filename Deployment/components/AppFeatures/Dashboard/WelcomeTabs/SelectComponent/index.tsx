import React from "react";
// import { 
//     Select,
//     SelectContent,
//     SelectGroup,
//     SelectItem,
//     SelectLabel,
//     SelectTrigger,
//     SelectSeparator,
//     SelectValue
//  } from "@/components/ui/select";
import { Address } from "@/interfaces";
import { SupportedAssetManager } from "@/typechain-types/SupportedAssetManager"
import { formatAddr } from "@/utilities";
import { Button } from "@/components/ui/button";
import { Chevron } from "@/components/utilities/Icons";
import { flexSpread } from "@/constants";
import { AddressLike } from "ethers";

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

export default function SelectComponent({data, label, placeholder,  callback} : SelectProps) {
    const [selected, setSelected] = React.useState<string>('');
    const [showDropDown, setShowDropdown] = React.useState<boolean>(false);
    const toggleShow = () => setShowDropdown(!showDropDown);
    const handleSelectItem = (arg: string, id: AddressLike) => {
        setSelected(arg);
        callback?.(formatAddr(id.toString()));
        toggleShow();
    }
    
    return(
        <div className="relative z-50 w-full max-w-sm border border-green1/30 rounded-lg ">
            <Button variant={'outline'} onClick={toggleShow} className={`w-full ${flexSpread}  gap-4 bg-white1 dark:bg-gray1 border border-green1/30 dark:border-white1/30 text-green1/50 dark:text-orange-200 focus:ring-0 `}>
                <h3>{(selected && selected !== '')? selected : (placeholder || "Select phase")}</h3>
                <Chevron open={showDropDown} />
            </Button>
            <div hidden={!showDropDown} className="absolute top-[95%] w-full bg-white1 space-y-2 p-4">
                { label && <h3 className="text-xs font-semibold text-opacity-50">{label || 'Phases'}</h3>}
                {
                    data?
                        data.map(({name, symbol, id}) => (
                            <Button variant={'ghost'} className="w-full flex rounded-none justify-start text-green1/70 border-b border-b-green1/30" onClick={() => handleSelectItem(symbol, id)} key={name} value={`${name} - ${symbol}`} >{`${name} - ${symbol}`}</Button>
                        )) : 
                        phases.map(({phase, active}) => (
                            <Button key={phase} value={phase} disabled={!active} >{phase}</Button>
                        ))
                }
            </div>
            
        </div>
    );
}

interface SelectProps {
    data?: Readonly<SupportedAssetManager.SupportedAssetStruct[]>;
    callback?: (arg: Address) => void;
    placeholder?: string;
    label?: string;
}
