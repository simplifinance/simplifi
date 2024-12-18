import React from "react";
import Stack from "@mui/material/Stack";
import { Input } from "../../Input";
import type { Address, InputSelector } from '@/interfaces';
import { ReviewInput } from "../ReviewInput";
import { formatAddr } from "@/utilities";
import { useAccount } from "wagmi";
import { zeroAddress } from "viem";
import Grid from "@mui/material/Grid";
import useAppStorage from "@/components/StateContextProvider/useAppStorage";
import { CustomButton } from "@/components/CustomButton";

export const Permissioned = () => {
    const [modalOpen, setModalPopUp] = React.useState<boolean>(false);
    const [participants, setParticipant] = React.useState<Address[]>([]);
    const [duration, setDuration] = React.useState<string>('0');
    const [ccr, setCollateralCoverage] = React.useState<string>('0');
    const [interest, setInterest] = React.useState<string>('0');
    const [unitLiquidity, setUnitLiquidity] = React.useState<string>('0');

    const { setMessage } = useAppStorage();
    const account = formatAddr(useAccount().address);
    const toggleModal = () => setModalPopUp(!modalOpen);
    const { txnStatus } = useAppStorage();

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
                                <h3 className="text-orange-200 text-opacity-80">{id}</h3>
                                <Input 
                                    id={id}
                                    onChange={onChange}
                                    type={type}
                                    placeholder={placeholder}
                                    overrideBg="bg-green1"
                                />
                            </Stack>
                        </Grid>
                    ))
                }

            </Grid>
            <Stack className="place-items-center p-4">
                <CustomButton
                    overrideClassName="bg-orange-200 text-green1 font-bold py-4 rounded-[26px] "
                    disabled={txnStatus.loading}
                    handleButtonClick={toggleModal}
                >
                    Submit
                </CustomButton>
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
        </Stack>
    );
}