import React from "react";
import Container from "@mui/material/Container";
import { PopUp } from "../transactionStatus/PopUp";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import AddressWrapper from "@/components/AddressFormatter/AddressWrapper";
import { InputSelector } from "@/interfaces";
import { Chevron } from "@/components/Collapsible";

interface ReviewInputProps {
    values: {title: string, value: string}[];
    type: InputSelector;
    participants?: string[];
    modalOpen: boolean;
    handleModalClose: () => void;
}

export const ReviewInput = (props: ReviewInputProps) => {
    const [open, setOpen] = React.useState<boolean>(false);
    const { modalOpen, values, participants, type, handleModalClose } = props;

    console.log("Props", props);
    const handleTransact = async() => {

    }

    React.useEffect(() => {
        if(!values) handleModalClose();
    },[values]);

    return(
        <PopUp { ...{modalOpen, handleModalClose } } > 
            <Container maxWidth="sm" className="space-y-4">
                <Stack sx={{bgcolor: 'background.paper'}} className="p-4 md:p-8 my-10 rounded-xl border-2 space-y-6 text-lg ">
                    <Box className="w-full">
                        <button className="w-[20%] float-end text-white bg-orange-400 p-2 rounded-lg" onClick={handleModalClose}>Close</button>
                    </Box> 
                    <Stack className="space-y-4">
                        {
                            values.map((item) => {
                                return (
                                    (item.title === "Participants" && type === 'address') ? (
                                        <div key={item.title} >
                                            <div className="flex justify-between items-center">
                                                <h3 >{ item.title }</h3>
                                                <button className="w-fullfloat-right" onClick={() => setOpen(!open)}><Chevron open={open} hideChevron={false} /></button>
                                            </div>
                                            <Collapse in={open} timeout="auto" unmountOnExit className="">
                                                <div className="p-2 rounded-lg bg-gray-100">
                                                    {
                                                        participants?.map((address, i) => (
                                                            <div key={address} className="flex justify-between items-center" >
                                                                <h3 >{ i + 1 }</h3>
                                                                <AddressWrapper 
                                                                    account={address}
                                                                    display
                                                                    size={4}
                                                                />
                                                            </div>
                                                        ))                                                        
                                                    }
                                                </div>
                                            </Collapse>
                                        </div>
                                    ) : (
                                        <div key={item.title} className="flex justify-between items-center">
                                            <h3 >{ item.title }</h3>
                                            <h3 >{ item.value }</h3>
                                        </div>
                                    )
                                )
                            })
                        }
                        <button 
                            className="bg-orange-400 p-4 rounded-lg text-white"
                            onClick={handleTransact}
                        >
                            Transact
                        </button>
                    </Stack> 
                </Stack>
            </Container>
        </PopUp>
    );
}


// 0x12345678910abcdefghi00000000000000000000