import React from "react";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
// import Typography from "@mui/material/Typography";
import { Input } from "../../Input";
import Typography from "@mui/material/Typography";

export type InputSelector = 'Quorum' | 'Duration' | 'CCR' | 'Interest' | 'UnitLiquidity';

export const Permissionless = (props: {handleBack: () => void}) => {
    const [quorum, setQuorum] = React.useState<string>('');
    const [duration, setDuration] = React.useState<string>('');
    const [ccr, setCollateralCoverage] = React.useState<string>('');
    const [interest, setInterest] = React.useState<string>('');
    const [unitLiquidity, setUnitLiquidity] = React.useState<string>('');

    const { handleBack } = props;
    const onInvalid = (e: React.FormEvent<HTMLInputElement>) => {
        alert(`Please correct the following feed: ${e.currentTarget.value}`)
    }

    const onChange = (e: React.ChangeEvent<HTMLInputElement>, tag: InputSelector) => {
        e.preventDefault();
        const value = e.currentTarget.value;
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
                    <h3>Add Permissionless Pool</h3>
                </div>
            </Box>

            <Box className="space-y-4">
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
                                onChange: (e:React.ChangeEvent<HTMLInputElement>) => onChange(e, 'Quorum'),
                            },
                        ] as const
                    ).map(({ id, type, placeholder, onChange }, i) => (
                        <Stack>
                            <Typography>{id}</Typography>
                            <Input 
                                key={i}
                                id={id}
                                onChange={onChange}
                                onInValid={onInvalid}
                                type={type}
                                placeholder={placeholder}
                            />
                        </Stack>
                    ))
                }

            </Box>
            <Box className="flex justify-center">
                <button className="bg-orange-400 w-[30%] p-4 rounded-lg text-white ">Submit</button>
            </Box>
        </Stack>
    );
}