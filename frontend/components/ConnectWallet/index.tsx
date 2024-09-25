import React from "react";
import '@rainbow-me/rainbowkit/styles.css';
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { PopUp } from "../transactionStatus/PopUp";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { VoidFunc } from "@/interfaces";

export const ConnectWallet 
    : 
    React.FC<{modalOpen: boolean, handleModalClose: VoidFunc}> 
        = ({modalOpen, handleModalClose}) => 
{

    return (
        <PopUp { ...{modalOpen, handleModalClose } } > 
            <Container maxWidth="xs" className="space-y-2">
                <Stack  className="place-items-center h-[200px] p-4 md:p-8 my-10 space-y-6 text-lg ">
                    <h3 className="text-xl text-orangec font-black">{"Have Web3 Wallet?"}</h3>

                    <button className="w-[75%] bg-yellow-100 border border-orangec p-6 rounded-lg hover:shadow-md hover:bg-orangec hover:text-yellow-100 font-bold">
                        <ConnectButton 
                            accountStatus={{
                                smallScreen: 'avatar',
                                largeScreen: 'full',
                            }}
                            label="Connect"
                            
                        />
                    </button>
                </Stack>
            </Container>
        </PopUp>
    );
}