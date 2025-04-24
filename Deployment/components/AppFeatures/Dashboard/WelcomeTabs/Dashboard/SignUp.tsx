import { Button } from "@/components/ui/button";
import React from "react";
import { useAccount, useConfig } from "wagmi";
import { formatAddr, } from "@/utilities";
import { zeroAddress } from "viem";
import { HandleTransactionParam } from "@/interfaces";
import { Confirmation } from "@/components/AppFeatures/FlexPool/update/ActionButton/Confirmation";
import { flexSpread } from "@/constants";

export default function SignUp() {
    const [ openDrawer, setDrawer ] = React.useState<number>(0);
    const { address } = useAccount();

    const toggleDrawer = (arg: number) => setDrawer(arg);
    const transactionArgs : HandleTransactionParam = {
        commonParam: {account: formatAddr(address), config: useConfig(), contractAddress: zeroAddress, unit: 0n,},
        txnType: 'SignUp',
    }

    return(
         <div className="bg-green1 p-4 rounded-[16px] text-white1/80 space-y-4">
            <h3 className="text-lg font-semibold text-orange-200">Earn points</h3>
            <p>Create and interact with Flexpools, perform social tasks, and refer your friends to earn SIMPL points which can be converted to SIMPL Tokens, which can also be used as collateral in Flexpools</p>
            <Button onClick={() => toggleDrawer(1)} className={`border border-white1/50`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                </svg>
                Get Started
            </Button>
            <Confirmation 
                openDrawer={openDrawer}
                toggleDrawer={toggleDrawer}
                transactionArgs={transactionArgs}
                displayMessage={'Signing up for rewards'}
            />
        </div>
    )
}
