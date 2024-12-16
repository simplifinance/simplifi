import React from "react";
import Stack from "@mui/material/Stack";
import { Input } from "../../Input";
import type { InputSelector } from '@/interfaces';
import { ReviewInput } from "../ReviewInput";
import Grid from "@mui/material/Grid";

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