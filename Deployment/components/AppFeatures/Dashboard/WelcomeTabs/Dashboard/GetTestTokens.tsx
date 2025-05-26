import React from "react";
import { useAccount } from "wagmi";
import ClaimTestTokens from "@/components/AppFeatures/FlexPool/update/transactions/ClaimTestTokens";

export default function GetTestTokens() {
    const [ openDrawer, setDrawer ] = React.useState<number>(0);
    const { isConnected } = useAccount();
    const toggleDrawer = (arg: number) => setDrawer(arg);

    return(
        <div className="bg-green1 p-4 rounded-[16px] text-white1/80 space-y-4">
            <h3 className="text-lg font-semibold text-orange-200">Get test tokens</h3>
            <p>Access our customized faucet to get test testT tokens to perform actions on testnet</p>
            {/* <Button onClick={() => setDrawer(1)} disabled={!isConnected} className="border border-white1/50">Get tokens</Button> */}
            <ClaimTestTokens 
                openDrawer={openDrawer}
                toggleDrawer={toggleDrawer}
                disabled={!isConnected}
            /> 
        </div>
    )
}
