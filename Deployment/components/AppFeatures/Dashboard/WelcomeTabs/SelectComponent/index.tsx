import React from "react";
import { Address, phases } from "@/interfaces";
import { SupportedAssetManager } from "@/typechain-types/contracts/standalone/SupportedAssetManager"
import { formatAddr } from "@/utilities";
import { Button } from "@/components/ui/button";
import { Chevron } from "@/components/utilities/Icons";
import { flexSpread } from "@/constants";
import { AddressLike } from "ethers";

export default function SelectComponent({data, placeholder,  callback} : SelectProps) {
    const [selected, setSelected] = React.useState<string>('');
    const [selectedPhase, setPhase] = React.useState<string>('beta');
    const [showDropDown, setShowDropdown] = React.useState<boolean>(false);
    const toggleShow = () => setShowDropdown(!showDropDown);
    const handleSelectItem = (arg: string, id: AddressLike) => {
        setSelected(arg);
        callback?.(formatAddr(id.toString()));
        toggleShow();
    }

    const handleSelectPhase = (arg: string) => {
        setPhase(arg);
        callback?.(arg);
        toggleShow();
    }
    
    return(
        <div className="relative z-50 w-full max-w-sm md:max-w-full border border-green1/30 rounded-lg ">
            <Button variant={'outline'} onClick={toggleShow} className={`w-full max-w-sm ${flexSpread} gap-2 bg-white1 ${data? 'dark:bg-gray1' : 'dark:bg-green1/90'}  border border-green1/30 dark:border-white1/30 text-green1/50 dark:text-orange-200 focus:ring-0 `}>
                <h3>{(selected && selected !== '')? selected : (data? placeholder || "Select phase" : selectedPhase)}</h3>
                <Chevron open={showDropDown} />
            </Button>
            <div hidden={!showDropDown} className="absolute top-[95%] w-full bg-white1 space-y-2 p-">
                {/* { label && <h3 className="text-xs font-semibold text-opacity-50">{label || 'Phases'}</h3>} */}
                {
                    data?
                        data.map(({name, symbol, id}) => (
                            <Button disabled={selected === symbol} variant={'ghost'} className="w-full flex rounded-none bg-white1 hover:bg-white1 justify-start items-center text-green1/70 border-b border-b-green1/30" onClick={() => handleSelectItem(symbol, id)} key={name} value={`${name} - ${symbol}`} >{`${name} - ${symbol}`}</Button>
                        )) : 
                        phases.map(({phase}) => (
                            <Button disabled={selectedPhase === phase} onClick={() => handleSelectPhase(phase)} variant={'ghost'} key={phase} value={phase} className="w-full flex rounded-none bg-white1 hover:bg-white1 justify-start items-center text-green1/70 border-b border-b-green1/30" >{phase}</Button>
                        ))
                }
            </div>
            
        </div>
    );
}

interface SelectProps {
    data?: Readonly<SupportedAssetManager.SupportedAssetStruct[]>;
    callback?: (arg: Address | string) => void;
    placeholder?: string;
    label?: string;
}
