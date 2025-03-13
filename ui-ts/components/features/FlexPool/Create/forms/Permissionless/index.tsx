import React from "react";
import Stack from "@mui/material/Stack";
// import { Input } from "../../Input";
import type { InputProp, InputSelector } from '@/interfaces';
import { ReviewInput } from "../ReviewInput";
import Grid from "@mui/material/Grid";
import { CustomButton } from "@/components/CustomButton";
import useAppStorage from "@/components/StateContextProvider/useAppStorage";
import Quorum from "../userInputsComponents/Quorum";
import Duration from "../userInputsComponents/Duration";
import Interest from "../userInputsComponents/Interest";
import CollateralMultiplier from "../userInputsComponents/CollateralMultiplier";
import UnitLiquidity from "../userInputsComponents/UnitLiquidity";
import { useMediaQuery } from "@mui/material";
import { toBN } from "@/utilities";

export const Permissionless = () => {
    const [popUpDrawer, setDrawerState] = React.useState<number>(0);
    const [quorum, setQuorum] = React.useState<InputProp>({value: '2', open: false});
    const [duration, setDuration] = React.useState<InputProp>({value: '1', open: false});
    const [ccr, setCollateralCoverage] = React.useState<InputProp>({value: '100', open: false});
    const [interest, setInterest] = React.useState<InputProp>({value: '1', open: false});
    const [unitLiquidity, setUnitLiquidity] = React.useState<InputProp>({value: '1', open: false});

    const toggleDrawer = (arg: number) => setDrawerState(arg);
    const isLargeScreen = useMediaQuery('(min-width:768px)');
    
    const onChange = (value: InputProp, tag: InputSelector) => {
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
        <Stack className="space-y-4 mt-8">
            <Grid container xs={'auto'} spacing={4}>
                {
                    (
                        [
                            {
                                id: 'Quorum',
                                element: (<Quorum isLargeScreen={isLargeScreen} inputProp={quorum} handleChange={onChange}/>),
                            },
                            {
                                id: "Unit Liquidity",
                                element: (<UnitLiquidity isLargeScreen={isLargeScreen} inputProp={unitLiquidity} handleChange={onChange}/>),
                            },
                            {
                                id:"Duration",
                                element: (<Duration isLargeScreen={isLargeScreen} inputProp={duration} handleChange={onChange}/>),
                            },
                            {
                                id: "Interest",
                                element: (<Interest isLargeScreen={isLargeScreen} inputProp={interest} handleChange={onChange}/>),
                            },
                            {
                                id: "Collateral multiplier (Ex. 1.5, 1.0, etc)",
                                element: (<CollateralMultiplier isLargeScreen={isLargeScreen} inputProp={ccr} handleChange={onChange}/>),
                            },
                        ] as const
                    ).map(({ id, element }, i) => (
                        <Grid item key={id} xs={12} md={6}>
                           { element }
                        </Grid>
                    ))
                }
            </Grid>
            <Stack className="place-items-center">
                <CustomButton
                    overrideClassName="bg-orange-200 text-green1 font-bold py-4 rounded-[26px] "
                    disabled={false}
                    handleButtonClick={() => toggleDrawer(1)}
                >
                    Submit
                </CustomButton>
            </Stack>
            <ReviewInput 
                toggleDrawer={toggleDrawer}
                popUpDrawer={popUpDrawer}
                type={'UnitLiquidity'}
                formType={'Permissionless'}
                values={[
                    {
                        title: 'Quorum',
                        value: quorum.value,
                        affix: ''
                    },
                    {
                        title: 'Unit Liquidity',
                        value: unitLiquidity.value,
                        affix: ' $'
                    },
                    {
                        title: 'Duration',
                        value: duration.value,
                        affix: `${duration.value === '0' || duration.value === '1'? ' hr' : ' hrs'}`,
                    },
                    {
                        title: 'Rate',
                        value: toBN(interest.value).div(100).toString(),
                        affix: `%`,
                    },
                    {
                        title: 'Collateral Index',
                        value: toBN(ccr.value).div(100).toString(),
                        affix: ''
                    },
                ]}
            />
        </Stack>
    );
}
