import React from "react";
import { type Address, phases } from "@/interfaces";
import { formatAddr } from "@/utilities";
import { Button } from "@/components/ui/button";
import { Chevron } from "@/components/utilities/Icons";
import { flexSpread, supportedCeloCollateralAsset, supportedConvertibleAssets } from "@/constants";

export default function SelectComponent({data, placeholder, callback} : SelectProps) {
    const [selectedAsset, setSelectedAsset] = React.useState<string>('');
    const [selectedPhase, setPhase] = React.useState<string>('beta');
    const [showDropDown, setShowDropdown] = React.useState<boolean>(false);
    const toggleShow = () => setShowDropdown(!showDropDown);
    const handleSelectItem = (arg: string, id: Address) => {
        setSelectedAsset(arg);
        callback?.(formatAddr(id.toString()));
        toggleShow();
    }

    const handleSelectPhase = (arg: string) => {
        setPhase(arg);
        callback?.(arg);
        toggleShow();
    }

    const renderData = () => {
        let nodes: React.ReactNode = null;
        switch (data) {
            case 'phases':
                nodes = phases.map(({phase}) => (
                    <Button disabled={selectedPhase === phase} onClick={() => handleSelectPhase(phase)} variant={'ghost'} key={phase} value={phase} className="w-full flex rounded-none bg-white1 hover:bg-white1 justify-start items-center text-green1/70 border-b border-b-green1/30" >{phase}</Button>
                ))
                break;
            case 'supported':
                nodes = supportedCeloCollateralAsset.map(({symbol, address}) => (
                    <Button disabled={selectedAsset === symbol} variant={'ghost'} className="w-full flex rounded-none bg-white1 hover:bg-white1 justify-start items-center text-green1/70 border-b border-b-green1/30" onClick={() => handleSelectItem(symbol, address)} key={symbol} value={symbol} >{symbol}</Button>
                ))

            case 'convertible':
                nodes = supportedConvertibleAssets.map(({symbol, address}) => (
                    <Button disabled={selectedAsset === symbol} variant={'ghost'} className="w-full flex rounded-none bg-white1 hover:bg-white1 justify-start items-center text-green1/70 border-b border-b-green1/30" onClick={() => handleSelectItem(symbol, formatAddr(address))} key={symbol} value={symbol} >{symbol}</Button>
                ))
        
            default:
                break;
        }
        return nodes
    }
    
    return(
        <div className="relative z-50 w-full max-w-sm md:max-w-full border border-green1/30 rounded-lg ">
            <Button variant={'outline'} onClick={toggleShow} className={`w-full max-w-sm ${flexSpread} gap-2 bg-white1 ${data !== 'phases'? 'dark:bg-gray1' : 'dark:bg-green1/90'}  border border-green1/30 dark:border-white1/30 text-green1/50 dark:text-orange-200 focus:ring-0 `}>
                <h3>{selectedAsset !== ''? selectedAsset : (data !== 'phases' ? placeholder || "Select phase" : selectedPhase)}</h3>
                <Chevron open={showDropDown} />
            </Button>
            <div hidden={!showDropDown} className="absolute top-[95%] w-full bg-white1 space-y-2 max-h-[150px] overflow-auto">
                { renderData() }
            </div>
            
        </div>
    );
}

type Data = 'supported' | 'phases' | 'convertible'
interface SelectProps {
    data: Data;
    callback?: (arg: Address | string) => void;
    placeholder?: string;
    label?: string;
}
