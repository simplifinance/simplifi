import React from "react";
import '@rainbow-me/rainbowkit/styles.css';
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { VoidFunc } from "@/interfaces";
import { PopUp } from "../topComponents/finance/Create/forms/transactionStatus/PopUp";
import { commonStyle } from "@/utilities";
import { CustomButton } from "../Common";

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