import React from "react";
import { getContractData } from "@/apis/utils/getContractData";
import AddressWrapper from "@/components/AddressFormatter/AddressWrapper";
import { useAccount, useReadContracts } from "wagmi";
import { formatEther, } from "viem";
import { flexSpread, } from "@/constants";
import Collapse from '@mui/material/Collapse';
import { Chevron } from "@/components/Collapsible";
import Stack from '@mui/material/Stack';
import getReadFunctions from "../update/DrawerWrapper/readContractConfig";
import { formatAddr, toBN } from "@/utilities";

export default function USDBalances() {
    const [open, setOpen] = React.useState<boolean>(false);

    const { address, chainId } = useAccount();
    const account = formatAddr(address);
    const { token } = getContractData(chainId || 4157);
    const { readBalanceConfig, readSymbolConfig } = getReadFunctions({chainId})
    const { data, } = useReadContracts({
        contracts: [
            { ...readBalanceConfig({account}) },
            { ...readSymbolConfig()}
        ],
        allowFailure: true,
        query: {refetchInterval: 5000}
    });

    const balances = data?.[0].result;
    const symbol = data?.[1].result;

    return(
        <React.Fragment>
            <div className={`hidden lg:flex justify-between items-center gap-2 bg-green1 text-orange-200 p-3 rounded-xl font-black text-sm absolute right-[10%]`}>
                <h1>{`${toBN(formatEther(balances || 0n)).decimalPlaces(1)} ${symbol || ''}`}</h1>
                <AddressWrapper 
                    account={token}
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
                                account={token}
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