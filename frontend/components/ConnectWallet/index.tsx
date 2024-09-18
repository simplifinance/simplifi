import React from "react";
import '@rainbow-me/rainbowkit/styles.css';
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { PopUp } from "../transactionStatus/PopUp";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { VoidFunc } from "@/interfaces";

// import { flexSpread } from "@/constants";

export const ConnectWallet 
    : 
    React.FC<{modalOpen: boolean, handleModalClose: VoidFunc}> 
        = ({modalOpen, handleModalClose}) => 
{

    return (
        <PopUp { ...{modalOpen, handleModalClose } } > 
            <Container maxWidth="sm" className="space-y-2">
                <Stack sx={{bgcolor: 'background.paper'}} className="place-items-center p-4 md:p-8 my-10 rounded-xl border-2 space-y-6 text-lg ">
                    <Box className={`w-full flex justify-between items-center`}>
                        <h3 className="text-xl text-orange-400 font-black">{"Have Web3 Wallet?"}</h3>
                        <button className="w-[15%]  text-white bg-orange-400 p-2 rounded-lg" onClick={handleModalClose}>Close</button>
                    </Box> 
                    <button className="w-[75%] bg-yellow-200 p-6 rounded-3xl hover:shadow-md hover:shadow-black">
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