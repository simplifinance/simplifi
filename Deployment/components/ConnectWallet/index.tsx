import React from "react";
import '@rainbow-me/rainbowkit/styles.css';
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { VoidFunc } from "@/interfaces";
import { PopUp } from "../topComponents/finance/Create/forms/transactionStatus/PopUp";

export const ConnectWallet 
    : 
    React.FC<{modalOpen: boolean, handleModalClose: VoidFunc}> 
        = ({modalOpen, handleModalClose}) => 
{

    return (
        // <Container maxWidth="xs" className="space-y-4">
        //         <Stack className="p-4 lg:p-8 rounded-lg space-y-12 text-lg bg-green1 text-white1 border shadow-lg shadow-yellow-100"></Stack>
        <PopUp { ...{modalOpen, handleModalClose } } > 
            <Container maxWidth="xs" className="space-y-2 mt-32">
                {/* <Stack  className="place-items-center h-[200px] p-4 md:p-8 my-10 space-y-6 text-lg "> */}
                <div className="p-8 rounded-lg space-y-12 text-lg bg-white1 shadow-lg shadow-white1/30">
                    <h3 className="md:text-xl text-orangec/90 font-black">Connect A Web3 Wallet</h3>
                    <button className="border border-gray-600/30 rounded-lg md:bg-none w-full p-6 text-orangec/70 hover:bg-orangec hover:text-white1 font-bold underlineFromLeft">
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