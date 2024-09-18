import { Profile, VoidFunc } from "@/interfaces";
import { Box, Container, Stack, } from "@mui/material";
import { PopUp } from "./Create/forms/transactionStatus/PopUp";
import { flexSpread } from "@/constants";
import { useAccount } from "wagmi";
import { getTimeFromEpoch, toBigInt, toBN } from "@/utilities";
import { formatEther, parseEther } from "viem";

interface DisplayProfileProps {
    profile: Profile;
    epochId: number;
    toggleProfileModal: VoidFunc;
    profileModalOpen: boolean;
}

export const DisplayProfile = (props: DisplayProfileProps) => {
    const { address } = useAccount();

    const {
        profile: {
            cData: {
                colBals,
                durOfChoice,
                expInterest,
                id,
                loan,
                payDate,
                turnTime,
            },
            rank:{
                admin: isAdmin, 
                member
            },
            slot
        },
        epochId,
        toggleProfileModal,
        profileModalOpen
    } = props;

    const formattedDurOfChoice = toBN(durOfChoice.toString()).div(toBN(3600)).toNumber()

    const removeLiquidityPool = async() => {

    }

    return (
        <PopUp { ...{modalOpen: profileModalOpen, handleModalClose: toggleProfileModal } } > 
            <Container maxWidth="sm" className="space-y-2">
                <Stack sx={{bgcolor: 'background.paper'}} className="p-4 md:p-8 my-10 rounded-xl border-2 space-y-6 text-lg ">
                    <Box className={`w-full ${flexSpread}`}>
                        <h3>{`Profile at Epoch Id ${epochId}`}</h3>
                        <button className="w-[20%] float-end text-white bg-orangec p-2 rounded-lg" onClick={toggleProfileModal}>Close</button>
                    </Box> 
                    {
                        (address?.toLowerCase() === id.toString().toLowerCase())?
                            <Stack className="space-y-4">
                                <Box className={`${flexSpread}`}>
                                    <h3>Your Time To Borrow</h3>
                                    <h3>{ getTimeFromEpoch(turnTime)}</h3>
                                </Box>
                                <Box className={`${flexSpread}`}>
                                    <h3>Loan</h3>
                                    <h3>{formatEther(toBigInt(toBN(loan.toString()).toString()))}</h3>
                                </Box>
                                <Box className={`${flexSpread}`}>
                                    <h3>Collateral Reserve</h3>
                                    <h3>{formatEther(toBigInt(toBN(colBals.toString()).toString()))}</h3>
                                </Box>
                                <Box className={`${flexSpread}`}>
                                    <h3>Duration Of Choice</h3>
                                    <h3>{`${formattedDurOfChoice} hrs`}</h3>
                                </Box>
                                <Box className={`${flexSpread}`}>
                                    <h3>Interest You Will Pay</h3>
                                    <h3>{`${formatEther(toBigInt(toBN(expInterest.toString()).toString()))} USDT`}</h3>
                                </Box>
                                <Box className={`${flexSpread}`}>
                                    <h3>Pay Date</h3>
                                    <h3>{getTimeFromEpoch(payDate)}</h3>
                                </Box>
                                <Box>
                                    {
                                        isAdmin && 
                                            <button 
                                                className="w-full text-orangec border border-orangec p-4 rounded-lg"
                                                onClick={removeLiquidityPool}
                                            >
                                                RemoveLP
                                            </button>
                                    }
                                </Box>
                            </Stack> 
                                :
                                    <Box className="text-gray-500 text-center text-lg">
                                        <h3>{"Oop! Not a Provider in this epoch"}</h3>
                                    </Box>
                    }

                </Stack>
            </Container>
        </PopUp>
    );

}