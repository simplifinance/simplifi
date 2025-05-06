import React from "react";
import { Button } from "@/components/ui/button"
import { useAccount } from "wagmi";
import { flexSpread, } from "@/constants";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import useAppStorage from "@/components/contexts/StateContextProvider/useAppStorage";
import SignUp from "./SignUp";
import GetTestTokens from "./GetTestTokens";

export default function Dashboard() {
    const { isConnected } = useAccount();
    const { setActivepath } = useAppStorage();
    const { connectModalOpen, openConnectModal } = useConnectModal();

    // Connect user or route to flexpool
    const handleConnectButton = () => {
        isConnected? setActivepath('CreateFlexpool') : openConnectModal?.();
    }

    // Route user to Flexpool
    const handleRouteToFlexpool = () => isConnected? setActivepath('Flexpool') : alert('Please connect wallet');

    return(
        <div className="space-y-4 md:overflow-auto">
            <SignUp />
            <div className="bg-green1 p-4 rounded-[16px] text-white1/80 space-y-4">
                <h3 className="text-lg font-semibold text-orange-200">Connect your Wallet</h3>
                <p>Get started exploring Simplifi on supported networks</p>
                <Button disabled={connectModalOpen || isConnected} onClick={handleConnectButton} className={`${flexSpread} onboardButton border border-white1/50`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3" />
                    </svg>
                    Connect
                </Button>
            </div>
             <div className="bg-green1 text-white1/80 p-4 rounded-lg space-y-4">
                <h3 className="text-lg font-semibold text-orange-200">Create a Flexpool</h3>
                <p>Create a customized Flexpool with liquidity to receive <span>SIMPL Points</span>, and possibly be eligible to receive airdrops from future partner projects</p>
                <Button onClick={handleRouteToFlexpool} disabled={!isConnected} className={`${flexSpread} border border-white1/50`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Create
                </Button>
            </div>
            <GetTestTokens />
        </div>
    )
}