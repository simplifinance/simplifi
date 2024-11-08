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
import Grid from "@mui/material/Grid";

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
        <Stack className="space-y-4 mt-4">
            <Box className="flex justify-between items-center text-yellow-100 text-opacity-80">
                <div className="">
                    <button onClick={handleBack} className="border border-green1 rounded-lg p-2 w-full flex justify-between items-center gap-2 text-yellow-200 cursor-pointer hover:shadow-lg hover:shadow-orangec text-opacity-80">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" strokeWidth={2.5} stroke="currentColor" className="size-4 ">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                        </svg>
                        <h3>Back</h3>
                    </button>
                </div>
                <div className="w-full text-center text-xl font-semibold">
                    <h3>New Permissioned Pool</h3>
                </div>
            </Box>
            <Grid container xs={'auto'}>
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
                        <Grid key={id} xs={12} md={i < 4? 6 : 12}>
                            <Stack className="p-4 space-y-2">
                                <h3 className="text-yellow-100 text-opacity-80">{id}</h3>
                                <Input 
                                    id={id}
                                    onChange={onChange}
                                    type={type}
                                    placeholder={placeholder}
                                    overrideBg="bg-stone-300"
                                />
                            </Stack>
                        </Grid>
                    ))
                }

            </Grid>
            <Stack className="place-items-center">
                <button onClick={toggleModal} className="text-orangec border border-orangec bg-yellow-100 font-extrabold w-[30%] p-4 rounded-lg hover:bg-orangec hover:text-yellow-200">Submit</button>
            </Stack>
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