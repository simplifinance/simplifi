import React from "react";
import '@rainbow-me/rainbowkit/styles.css';
import { ConnectButton } from "@rainbow-me/rainbowkit";

export const ConnectWallet : React.FC = () => 
{

    return (
        <ConnectButton 
            accountStatus={{
                smallScreen: 'avatar',
                largeScreen: 'full',
            }}
            label="Connect Wallet"
            
        />
    );
}