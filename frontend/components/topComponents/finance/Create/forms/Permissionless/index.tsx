import React from "react";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { Input } from "../../Input";
import type { InputSelector } from '@/interfaces';
import { ReviewInput } from "../ReviewInput";

export const Permissionless = (props: {handleBack: () => void}) => {
    const [modalOpen, setModalPopUp] = React.useState<boolean>(false);
    const [quorum, setQuorum] = React.useState<string>('0');
    const [duration, setDuration] = React.useState<string>('0');
    const [ccr, setCollateralCoverage] = React.useState<string>('0');
    const [interest, setInterest] = React.useState<string>('0');
    const [unitLiquidity, setUnitLiquidity] = React.useState<string>('0');

    const { handleBack } = props;
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
        <Stack className="space-y-4">
            <Box className="flex justify-between items-center text-yellow-100 text-opacity-80">
                <div className="">
                    <button onClick={handleBack} className="p-2 w-full flex justify-between items-center gap-4 text-yellow-100 cursor-pointer hover:text-orangec text-opacity-80">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" strokeWidth={2.5} stroke="currentColor" className="size-4 ">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                        </svg>
                        <h3>Back</h3>
                    </button>
                </div>
                <div className="w-full text-center text-xl font-semibold">
                    <h3>Create Permissionless Pool</h3>
                </div>
            </Box>

            <Stack className="space-y-3">
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
                        <Stack key={id}>
                            <h3 className="text-yellow-100 text-opacity-80">{id}</h3>
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

            </Stack>
            <Stack className="place-items-center">
                <button onClick={toggleModal} className="text-orangec border border-orangec bg-yellow-100 font-extrabold w-[30%] p-4 rounded-lg hover:bg-orangec hover:text-yellow-200">Submit</button>
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