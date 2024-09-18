import React from "react";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { Input } from "../../Input";
import Typography from "@mui/material/Typography";
import type { Address, InputSelector } from '@/interfaces';
import { ReviewInput } from "../ReviewInput";
import { formatAddr } from "@/utilities";
import { useAccount } from "wagmi";
import Notification from "@/components/Notification";
import { zeroAddress } from "viem";

export const Permissioned = (props: {handleBack: () => void}) => {
    const [modalOpen, setModalPopUp] = React.useState<boolean>(false);
    const [participants, setParticipant] = React.useState<Address[]>([]);
    const [duration, setDuration] = React.useState<string>('0');
    const [ccr, setCollateralCoverage] = React.useState<string>('0');
    const [interest, setInterest] = React.useState<string>('0');
    const [unitLiquidity, setUnitLiquidity] = React.useState<string>('0');
    const [message, setMessage] = React.useState<string>('');

    const account = formatAddr(useAccount().address);
    const { handleBack } = props;
    const toggleModal = () => setModalPopUp(!modalOpen);

    /**
     * If user is creating a permissioned pool, we ensure the user's address is 
     * the first on the list. This is necessary to avoid the contract from reverting.
     * @param e : Input event value
     * @param tag : Type of operation to perform on the incoming input value
     */
    const onChange = (e: React.ChangeEvent<HTMLInputElement>, tag: InputSelector) => {
        e.preventDefault();
        const value = e.currentTarget.value === ''? '0' : e.currentTarget.value;
        switch (tag) {
            case 'address':
                let copy = participants;
                const formattedValue = formatAddr(value);
                if(copy.length === 0) {
                    copy.push(account);
                }
                if(account !== zeroAddress) {
                    if(value.length === 42) {
                        if(!copy.includes(formattedValue)){
                            copy.push(formattedValue);
                            setParticipant(copy);
                            setMessage(`${formattedValue} was added`);
                        }
                    }
                }

                break;
            case 'Duration':
                setDuration(value);
                break;
            case 'CCR':
                setCollateralCoverage(value);
                break;
            case 'Interest':
                setInterest(value);
                break;
            case 'UnitLiquidity':
                setUnitLiquidity(value);
                break;
        
            default:
                break;
        }
    }

    return(
        <Stack className="space-y-6">
            <Box className="flex justify-between items-center text-black text-opacity-60">
                <div className="">
                    <button onClick={handleBack} className="p-2 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                        </svg>
                    </button>
                </div>
                <div className="w-full text-center text-xl font-semibold">
                    <h3>Add Permissioned Pool</h3>
                </div>
            </Box>

            <Box className="space-y-4">
                {
                    (
                        [
                            {
                                id: 'Participants',
                                type: 'text',
                                placeholder: 'Enter participants addresses',
                                onChange: (e:React.ChangeEvent<HTMLInputElement>) => onChange(e, 'address'),
                            },
                            {
                                id: "Unit Liquidity",
                                type: 'number',
                                placeholder: 'Liquidity contribution per head',
                                onChange: (e:React.ChangeEvent<HTMLInputElement>) => onChange(e, 'UnitLiquidity'),
                            },
                            {
                                id:"Duration (In hours)",
                                type: 'number',
                                placeholder: 'Hours of use per borrower',
                                onChange: (e:React.ChangeEvent<HTMLInputElement>) => onChange(e, 'Duration'),
                            },
                            {
                                id: "Int. Rate percent (Min 0.01%)",
                                type: 'number',
                                placeholder: 'Interest to charge to for the duration ',
                                onChange: (e:React.ChangeEvent<HTMLInputElement>) => onChange(e, 'Interest'),
                            },
                            {
                                id: "Collateral multiplier (Ex. 1.5, 1.0, etc)",
                                type: 'number',
                                placeholder: 'The % of collateral that should be required',
                                onChange: (e:React.ChangeEvent<HTMLInputElement>) => onChange(e, 'CCR'),
                            },
                        ] as const
                    ).map(({ id, type, placeholder,  onChange }, i) => (
                        <Stack key={id}>
                            <Typography variant="body2">{id}</Typography>
                            <Input 
                                key={i}
                                id={id}
                                onChange={onChange}
                                type={type}
                                placeholder={placeholder}
                            />
                        </Stack>
                    ))
                }

            </Box>
            <Box className="flex justify-center">
                <button onClick={toggleModal} className="bg-orange-400 w-[30%] p-4 rounded-lg text-white ">Submit</button>
            </Box>
            <ReviewInput 
                {
                    ...{
                        handleModalClose: toggleModal,
                        modalOpen,
                        type: 'address',
                        participants: participants,
                        values: [
                            {
                                title: 'Participants',
                                value: ''
                            },
                            {
                                title: 'Unit Liquidity',
                                value: unitLiquidity
                            },
                            {
                                title: 'Duration',
                                value: duration,
                            },
                            {
                                title: 'Int. Rate',
                                value: interest
                            },
                            {
                                title: 'Collateral Coverage',
                                value: ccr,
                            },
                        ]
                    }
                }
            />
            <Notification message={message} />
        </Stack>
    );
}