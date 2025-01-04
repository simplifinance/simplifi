import React from "react";
import { getTokenAddress } from "@/apis/utils/getTokenAddress";
import AddressWrapper from "@/components/AddressFormatter/AddressWrapper";
import { getTestTokenBalance } from "@/apis/update/testToken/getBalance";
import useAppStorage from "@/components/StateContextProvider/useAppStorage";
import { useAccount, useConfig, useReadContracts } from "wagmi";
import { formatAddr, toBN } from "@/utilities";
import { formatEther, zeroAddress } from "viem";
import { flexSpread, flexStart } from "@/constants";
import Collapse from '@mui/material/Collapse';
import { Chevron } from "@/components/Collapsible";
import Stack from '@mui/material/Stack';
import { readBalanceConfig, readSymbolConfig } from "../update/DrawerWrapper/readContractConfig";

export default function USDBalances() {
    const [open, setOpen] = React.useState<boolean>(false);

    const { address, isConnected,} = useAccount();
    const account = formatAddr(address);
    const { data, isPending } = useReadContracts({
        contracts: [
            { ...readBalanceConfig({account, isConnected}) },
            { ...readSymbolConfig({isConnected})}
        ],
        allowFailure: true,
    });

    const balances = data?.[0].result;
    const symbol = data?.[1].result;

    return(
        <React.Fragment>
            <div className={`hidden lg:flex justify-between items-center gap-2 bg-green1 text-orange-200 p-3 rounded-xl font-black text-sm absolute right-[10%]`}>
                <h1>{`${toBN(formatEther(balances || 0n)).decimalPlaces(1)} ${symbol || ''}`}</h1>
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
                    <div>{`${toBN(formatEther(balances || 0n)).decimalPlaces(1)} ${symbol || ''}`}</div>
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