import React from "react";
import Stack from "@mui/material/Stack";
import type { InputSelector } from '@/interfaces';
import { ReviewInput } from "../ReviewInput";
import Grid from "@mui/material/Grid";
import { CustomButton } from "@/components/utilities/CustomButton";
import Quorum from "../userInputsComponents/Quorum";
import Duration from "../userInputsComponents/Duration";
import CollateralAsset from "../userInputsComponents/CollateralAsset";
import CollateralMultiplier from "../userInputsComponents/CollateralMultiplier";
import UnitLiquidity from "../userInputsComponents/UnitLiquidity";
import { toBN } from "@/utilities";
import { Button } from "@/components/ui/button";

export const Permissionless = () => {
    const [popUpDrawer, setDrawerState] = React.useState<number>(0);
    const [quorum, setQuorum] = React.useState<string>('2');
    const [duration, setDuration] = React.useState<string>('1');
    const [ccr, setCollateralCoverage] = React.useState<string>('120');
    const [collateralAsset, setCollateralAsset] = React.useState<string>('NA');
    const [unitLiquidity, setUnitLiquidity] = React.useState<string>('1');

    const toggleDrawer = (arg: number) => setDrawerState(arg);
    
    const onChange = (value: string, tag: InputSelector) => {
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
            case 'CollateralAsset':
                setCollateralAsset(value);
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
                                element: (<Quorum selected={quorum} handleChange={onChange}/>),
                            },
                            {
                                id: "Unit Liquidity",
                                element: (<UnitLiquidity selected={unitLiquidity} handleChange={onChange}/>),
                            },
                            {
                                id:"Duration",
                                element: (<Duration selected={duration} handleChange={onChange}/>),
                            },
                            {
                                id: "Collateral multiplier (Ex. 1.5, 1.0, etc)",
                                element: (<CollateralMultiplier selected={ccr} handleChange={onChange}/>),
                            },
                            {
                                id: "Collateral asset",
                                element: (<CollateralAsset selected={collateralAsset} handleChange={onChange}/>),
                            },
                        ] as const
                    ).map(({ id, element }, i) => (
                        <Grid item key={id} xs={12} md={6}>
                           { element }
                        </Grid>
                    ))
                }
            </Grid>
            <div>
                <Button
                    className="w-full bg-green1/90 border border-white1/30 text-white1 hover:bg-white1 hover:text-green1/90 p-6"
                    onClick={() => toggleDrawer(1)}
                >
                    Submit
                </Button>
            </div>
            <ReviewInput 
                toggleDrawer={toggleDrawer}
                popUpDrawer={popUpDrawer}
                type={'UnitLiquidity'}
                formType={'Permissionless'}
                values={[
                    {
                        title: 'Quorum',
                        value: quorum,
                        affix: ''
                    },
                    {
                        title: 'Unit Liquidity',
                        value: unitLiquidity,
                        affix: ' $'
                    },
                    {
                        title: 'Duration',
                        value: duration,
                        affix: `${duration === '0' || duration === '1'? ' hr' : ' hrs'}`,
                    },
                    {
                        title: 'Collateral Asset',
                        value: collateralAsset,
                        affix: '',
                    },
                    {
                        title: 'Collateral Index',
                        value: toBN(ccr).div(100).toString(),
                        affix: ''
                    },
                ]}
            />
        </Stack>
    );
}
