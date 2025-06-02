import React from "react";
import { type Address, phases } from "@/interfaces";
import { formatAddr } from "@/utilities";
import { Button } from "@/components/ui/button";
import { Chevron } from "@/components/utilities/Icons";
import { flexSpread, getSupportedCollateralAsset, } from "@/constants";
import { useAccount } from "wagmi";
import useAppStorage from "@/components/contexts/StateContextProvider/useAppStorage";
import AddressWrapper from "@/components/utilities/AddressFormatter/AddressWrapper";

export default function SelectComponent({data, placeholder, callback} : SelectProps) {
    const [selectedAsset, setSelectedAsset] = React.useState<string>('');
    const [selectedPhase, setPhase] = React.useState<string>('beta');
    const [showDropDown, setShowDropdown] = React.useState<boolean>(false);
    const toggleShow = () => setShowDropdown(!showDropDown);
    const { chainId } = useAccount();
    const { symbol } = useAppStorage();

    const supportedAssets = getSupportedCollateralAsset(chainId || 44787, symbol);

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
                    <Button disabled={selectedPhase === phase} onClick={() => handleSelectPhase(phase)} variant={'ghost'} key={phase} value={phase} className="rounded-none w-full max-w-sm flex justify-start" >{phase}</Button>
                ))
                break;
            case 'supported':
                nodes = supportedAssets.map(({symbol, address, disabled}) => (
                    <Button disabled={selectedAsset === symbol || disabled} variant={'ghost'} className={`${flexSpread} w-full rounded-none`} key={symbol} value={symbol} onClick={() => handleSelectItem(symbol, address)}>
                        {symbol}
                        <AddressWrapper account={address} size={4} display copyIconSize="4" />
                    </Button>
                    
                ))

            default:
                break;
        }
        return nodes
    }
    
    return(
        <div className="relative z-50 w-3/4">
            <Button variant={'outline'} onClick={toggleShow} className={`md:w-3/4  ${flexSpread} gap-2 bg-white1 ${data !== 'phases'? 'dark:bg-gray1' : 'dark:bg-green1/90'}  border border-green1/30 dark:border-white1/30 text-green1/50 dark:text-orange-200 focus:ring-0 `}>
                <h3>{selectedAsset !== ''? selectedAsset : (data !== 'phases' ? placeholder || "Select phase" : selectedPhase)}</h3>
                <Chevron open={showDropDown} />
            </Button>
            <div hidden={!showDropDown} className="absolute top-11 rounded-lg bg-white md:w-3/4 dark:bg-green1 dark:border p-2 space-y-2  overflow-auto">
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
