import { Button } from "@/components/ui/button";
import React from "react";
import { useAccount, useConfig } from "wagmi";
import { formatAddr, } from "@/utilities";
import { zeroAddress } from "viem";
import { HandleTransactionParam } from "@/interfaces";
import { Confirmation } from "@/components/AppFeatures/FlexPool/update/ActionButton/Confirmation";

export default function GetTestTokens() {
    const [ openDrawer, setDrawer ] = React.useState<number>(0);
    const { isConnected, address } = useAccount();

    const toggleDrawer = (arg: number) => setDrawer(arg);
    const transactionArgs : HandleTransactionParam = {
        commonParam: {account: formatAddr(address), config: useConfig(), contractAddress: zeroAddress, unit: 0n,},
        txnType: 'Get Tokens',
    }

    return(
        <div className="bg-green1 p-4 rounded-[16px] text-white1/80 space-y-4">
            <h3 className="text-lg font-semibold text-orange-200">Get test tokens</h3>
            <p>Access our customized faucet to get test testT tokens to perform actions on testnet</p>
            <Button onClick={() => setDrawer(1)} disabled={!isConnected} className="border border-white1/50">Get tokens</Button>
            <Confirmation 
                openDrawer={openDrawer}
                toggleDrawer={toggleDrawer}
                transactionArgs={transactionArgs}
                displayMessage={'Requesting test tokens'}
            />
        </div>
    )
}
