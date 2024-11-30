import React from "react";
import '@rainbow-me/rainbowkit/styles.css';
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { VoidFunc } from "@/interfaces";
import { PopUp } from "../topComponents/finance/Create/forms/transactionStatus/PopUp";
import { commonStyle } from "@/utilities";

export const ConnectWallet 
    : 
    React.FC<{modalOpen: boolean, handleModalClose: VoidFunc}> 
        = ({modalOpen, handleModalClose}) => 
{

    return (
        // <Container maxWidth="xs" className="space-y-4">
        //         <Stack className="p-4 lg:p-8 rounded-lg space-y-12 text-lg bg-green1 text-white1 border shadow-lg shadow-yellow-100"></Stack>
        <PopUp { ...{modalOpen, handleModalClose } } > 
            <Container maxWidth="xs" className="space-y-2" sx={commonStyle()}>
                <div className="p-8 rounded-lg space-y-12 text-lg bg-white1 shadow-lg shadow-white1/30">
                    <h3 className="md:text-xl text-orangec/90 font-black">Connect Web3 Wallet</h3>
                    <button className="border border-gray-500/30 bg-orangec/90 text-white1 rounded-lg w-full p-6 font-bold underlineFromLeft">
                        <ConnectButton 
                            accountStatus={{
                                smallScreen: 'avatar',
                                largeScreen: 'full',
                            }}
                            label="Connect Wallet"
                            
                        />
                    </button>
                </div>
            </Container>
        </PopUp>
    );
}