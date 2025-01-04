import React from "react";
import { getTokenAddress } from "@/apis/utils/getTokenAddress";
import AddressWrapper from "@/components/AddressFormatter/AddressWrapper";
import { getTestTokenBalance } from "@/apis/update/testToken/getBalance";
import useAppStorage from "@/components/StateContextProvider/useAppStorage";
import { useAccount, useConfig } from "wagmi";
import { formatAddr, toBN } from "@/utilities";
import { formatEther, zeroAddress } from "viem";
import { flexSpread, flexStart } from "@/constants";
import Collapse from '@mui/material/Collapse';
import { Chevron } from "@/components/Collapsible";
import Stack from '@mui/material/Stack';

export default function USDBalances() {
    const [token, setBalances] = React.useState<{name: string, balances: string}>({name: 'USD', balances: '0'});
    const [open, setOpen] = React.useState<boolean>(false);

    const { storage } = useAppStorage();
    const config = useConfig();
    const { address, isConnected, connector } = useAccount();
    const account = formatAddr(address);

    // React.useSyncExternalStore()

    React.useEffect(() => {
        const domController = new AbortController();
        const updateBalances = async() => {
            if(isConnected && connector && account !== zeroAddress){
                const {name, balances} = await getTestTokenBalance({
                    config,
                    account,
                    target: account
                });
                console.log("name:", name);
                console.log("balances:", balances);
                setBalances({name, balances: formatEther(balances)});
            }
        }
        updateBalances();
        return() => domController.abort();

    }, [storage]);

    return(
        <React.Fragment>
            <div className={`hidden lg:flex justify-between items-center gap-2 bg-green1 text-orange-200 p-3 rounded-xl font-black text-sm absolute right-[10%]`}>
                <div>{`${toBN(token.balances).decimalPlaces(1)} ${token.name}`}</div>
                <AddressWrapper 
                    account={getTokenAddress()}
                    display
                    size={4}
                    overrideClassName=""
                    copyIconSize="4"
                />
            </div>
            <div className='lg:hidden relative'>
                <button
                    onClick={() => setOpen(!open)}
                    className={`relative w-full ${flexSpread} gap-2 text-sm rounded-lg p-2 bg-green1 text-orange-200`}
                >
                    <div>{`${toBN(token.balances).decimalPlaces(1)} ${token.name}`}</div>
                    <Chevron open={open} />
                </button>
                <Collapse in={open} timeout="auto" unmountOnExit className={'absolute top-8 left-0 -translate-x-2 '} >
                    <Stack className='p-4 text-xs text-orangec'>
                        <div className={`${flexSpread} gap-2`}>
                            <h1>{'C/A'}</h1>
                            <AddressWrapper 
                                account={getTokenAddress()}
                                display
                                size={3}
                                overrideClassName="text-orange-300"
                                copyIconSize="4"
                            />
                        </div>
                    </Stack>
                </Collapse>
            </div>
        </React.Fragment>
    );
}