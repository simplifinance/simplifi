import React from "react";
import { Button } from "@/components/ui/button"
import { useAccount, useConnect } from "wagmi";
import { useNavigate } from "react-router-dom";
import { flexSpread, ROUTE_ENUM } from "@/constants";

export default function Dashboard() {
    const { isConnected, connector } = useAccount();
    const { connectAsync } = useConnect();
    const navigate = useNavigate();

    // Connect wallet to access the app
    const handleConnectButton = async() => {
        !isConnected? navigate(ROUTE_ENUM.CREATE) : connector? await connectAsync({connector}) : alert("No wallet detected");
    }

    // Route user to create pool section
    const handleCreateFlexpool = async() => {
        isConnected && navigate(ROUTE_ENUM.CREATE);
    }

    // Route user to Flexpool
    const handleRouteToFlexpool = () => navigate(ROUTE_ENUM.FLEXPOOL);

    // Get test tokens
    const handleGetTestToken = () => {
        if(!isConnected) return null;
        // Mint test Tokens
    }

    return(
        <div className="space-y-4 max-h-[500px] overflow-auto">
            <div className="bg-green1 dark:bg-gray1/50 text-white1/80 p-4 rounded-[16px] space-y-4">
                <h3 className="text-lg font-semibold text-orange-200">Create a Flexpool</h3>
                <p>Create a customized Flexpool with liquidity to receive <span>SIMPL Points</span>, and possibly be eligible to receive airdrops from future partner projects</p>
                <Button onClick={handleCreateFlexpool} disabled={!isConnected} className={`${flexSpread} border border-white1/50`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Create
                </Button>
            </div>
            <div className="bg-green1 p-4 rounded-[16px] text-white1/80 space-y-4">
                <h3 className="text-lg font-semibold text-orange-200">Connect your Wallet</h3>
                <p>Get started exploring Simplifi on supported networks</p>
                <Button onClick={handleConnectButton} className={`${flexSpread} border border-white1/50`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3" />
                    </svg>
                    Connect
                </Button>
            </div>
            <div className="bg-green1 p-4 rounded-[16px] text-white1/80 space-y-4">
                <h3 className="text-lg font-semibold text-orange-200">Earn points</h3>
                <p>Create and interact with Flexpools, perform social tasks, and refer your friends to earn SIMPL points which can be converted to SIMPL Tokens, which can also be used as collateral in Flexpools</p>
                <Button onClick={handleRouteToFlexpool} className={`border border-white1/50`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                    </svg>
                    Get Started
                </Button>
            </div>
            <div className="bg-green1 p-4 rounded-[16px] text-white1/80 space-y-4">
                <h3 className="text-lg font-semibold text-orange-200">Get test tokens</h3>
                <p>Access our customized faucet to get test SIMPL, cUSD and xUSD to perform actions on testnet</p>
                <Button onClick={handleGetTestToken} disabled={!isConnected} className="border border-white1/50">Get test tokens</Button>
            </div>
        </div>
    )
}