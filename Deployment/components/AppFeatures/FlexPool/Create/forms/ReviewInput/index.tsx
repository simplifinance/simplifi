import React from "react";
import Stack from "@mui/material/Stack";
import Collapse from "@mui/material/Collapse";
import AddressWrapper from "@/components/utilities/AddressFormatter/AddressWrapper";
import type { Address, InputSelector } from "@/interfaces";
import { Chevron } from "@/components/utilities/Icons";
import { Button } from "@/components/ui/button";
import { flexSpread, getSupportedCollateralAsset } from "@/constants";
import { useAccount } from "wagmi";
import useAppStorage from "@/components/contexts/StateContextProvider/useAppStorage";

export const ReviewInput = (props: ReviewInputProps) => {
    const [openCollapse, setCollapseState] = React.useState<boolean>(false);
    const { values, participants, type, } = props;
    const { chainId } = useAccount();
    const { symbol } = useAppStorage();

    const filterSymbol = (arg: string | number) => {
        const isAddress = typeof arg === 'string' && arg.length === 42;
        if(isAddress) {
            const filteredSymbol = getSupportedCollateralAsset(chainId || 44787, symbol).filter(({address}) => address === arg);
            if(filteredSymbol.length > 0) return filteredSymbol[0].symbol;
        }
        return '';
    }
    return(
        <div className="">
            <div className="bg-white1/50 dark:bg-green1/60 space-y-3 p-4 rounded-lg text-green1/90 dark:text-orange-200 font-semibold border">
                <h3>Your settings</h3>
                {
                    values.map((item) => {
                        return (
                            (item.title === "Participants" && type === 'address') ? (
                                <Stack key={item.title} >
                                    <Button variant={'outline'} onClick={() => setCollapseState(!openCollapse)} className={`${flexSpread} text-sm font-semibold`}>
                                        <h3>{ item.title }</h3>
                                        <Chevron open={openCollapse}/>
                                    </Button>
                                    <Collapse in={(openCollapse && participants && participants?.length > 0)} timeout="auto" unmountOnExit>
                                        <div className="p-4 rounded-b-lg border border-green1/80 space-y-2 border-b-4 bg-white1 dark:bg-gray1">
                                            {
                                                participants?.map((address, i) => (
                                                    <div key={address} className={`${flexSpread}`} >
                                                        <h3 >{ i + 1 }</h3>
                                                        <AddressWrapper 
                                                            account={address}
                                                            display
                                                            size={4}
                                                        />
                                                    </div>
                                                ))                                                        
                                            }
                                        </div>
                                    </Collapse>
                                </Stack>
                            ) : (
                                <div key={item.title} className="flex justify-between items-center px-4 text-sm ">
                                    <h3 >{ item.title }</h3>
                                    {
                                        (typeof item.value === 'string' && item.value.length === 42)? <h3>{filterSymbol(item.value)}</h3> : <h3 >{`${item.value}${item.affix}`}</h3>
                                    }
                                </div>
                            )
                        )
                    })
                }
            </div>
        </div>
    );
}

interface ReviewInputProps {
    values: {title: string, value: string | number, affix: string}[];
    type: InputSelector;
    participants?: Address[];
}
