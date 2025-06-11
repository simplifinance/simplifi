import React from "react";
import { Button } from "@/components/ui/button"
import { useAccount } from "wagmi";
import { flexSpread, } from "@/constants";
// import { useConnectModal } from "@rainbow-me/rainbowkit";
import useAppStorage from "@/components/contexts/StateContextProvider/useAppStorage";
import SignUp from "./SignUp";
// import GetTestTokens from "./GetTestTokens";

export default function Mainboard() {
    const { isConnected } = useAccount();
    const { setActivepath } = useAppStorage();
    // const { connectModalOpen, openConnectModal } = useConnectModal();

    // Connect user or route to flexpool
    // const handleConnectButton = () => {
    //     isConnected? setActivepath('CreateFlexpool') : openConnectModal?.();
    // }

    // Route user to Flexpool
    const handleRouteToFlexpool = () => isConnected? setActivepath('Flexpool') : alert('Please connect wallet');

    return(
        <div className="space-y-4 md:overflow-auto">
            <SignUp />
             <div className="bg-white dark:bg-green1/80 text-green1/80 dark:text-orange-200 p-4 rounded-lg space-y-2 text-sm">
                <h3 className="text-lg font-semibold dark:text-orange-300 ">Open a contribution group</h3>
                <p>Create a customized Flexpool with liquidity to receive <span>SIMPL Points</span>, and possibly be eligible to receive airdrops from future partner projects</p>
                <Button variant={'outline'} onClick={handleRouteToFlexpool} disabled={!isConnected} className={`${flexSpread} `}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={0.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Create
                </Button>
            </div>
            {/* <GetTestTokens /> */}
        </div>
    )
}