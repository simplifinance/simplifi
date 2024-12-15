import React from "react";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { Input } from "../../Input";
import type { InputSelector } from '@/interfaces';
import { ReviewInput } from "../ReviewInput";
import Grid from "@mui/material/Grid";
import { flexSpread } from "@/constants";

export const Permissionless = () => {
    const [modalOpen, setModalPopUp] = React.useState<boolean>(false);
    const [quorum, setQuorum] = React.useState<string>('0');
    const [duration, setDuration] = React.useState<string>('0');
    const [ccr, setCollateralCoverage] = React.useState<string>('0');
    const [interest, setInterest] = React.useState<string>('0');
    const [unitLiquidity, setUnitLiquidity] = React.useState<string>('0');

    const toggleModal = () => setModalPopUp(!modalOpen);
    
    const onChange = (e: React.ChangeEvent<HTMLInputElement>, tag: InputSelector) => {
        e.preventDefault();
        const value = e.currentTarget.value === ''? '0' : e.currentTarget.value;
        switch (tag) {
            case 'Quorum':
                setQuorum(value);
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
            {/* <div className={`${flexSpread} px-4`}>
                <button onClick={() => handleBack({poolType: 'Permissionless', displayForm: false})} className={`w-[fit-content] ${flexSpread} gap-2 bg-green1 p-2 rounded-full text-xs uppercase text-orange-200 hover:text-orange-400 focus:shadow-md focus:shadow-orange-200`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" strokeWidth={1.5} stroke="currentColor" className="size-2 ">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                    </svg>
                    <h3>Back</h3>
                </button>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-orange-300">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
            </div> */}

            <Grid container xs={'auto'}>
                {
                    (
                        [
                            {
                                id: 'Quorum',
                                type: 'number',
                                placeholder: 'How many participants do you expect',
                                onChange: (e:React.ChangeEvent<HTMLInputElement>) => onChange(e, 'Quorum'),
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
                    ).map(({ id, type, placeholder, onChange }, i) => (
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
                <button onClick={toggleModal} className="w-full bg-orange-200 p-4 text-green1 rounded-full uppercase font-semibold hover:bg-orangec hover:text-white1">Submit</button>
            </Stack>
            <ReviewInput 
                {
                    ...{
                        handleModalClose: toggleModal,
                        modalOpen,
                        type: 'UnitLiquidity',
                        values: [
                            {
                                title: 'Quorum',
                                value: quorum
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
                                value: interest,
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