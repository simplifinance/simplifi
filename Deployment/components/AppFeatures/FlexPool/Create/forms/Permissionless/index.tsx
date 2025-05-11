import React from "react";
import Stack from "@mui/material/Stack";
import type { Address, FunctionName, HandleTransactionParam, InputSelector } from '@/interfaces';
import { ReviewInput } from "../ReviewInput";
import Quorum from "../userInputsComponents/Quorum";
import Duration from "../userInputsComponents/Duration";
import CollateralAsset from "../userInputsComponents/CollateralAsset";
import CollateralMultiplier from "../userInputsComponents/CollateralMultiplier";
import UnitLiquidity from "../userInputsComponents/UnitLiquidity";
import { formatAddr, toBN } from "@/utilities";
import { Button } from "@/components/ui/button";
import { parseUnits, zeroAddress } from "viem";
import { useAccount, useConfig } from "wagmi";
import { Confirmation } from "../../../update/ActionButton/Confirmation";

export const Permissionless = () => {
    const [openDrawer, setDrawerState] = React.useState<number>(0);
    const [quorum, setQuorum] = React.useState<number>(2);
    const [duration, setDuration] = React.useState<number>(1);
    const [colCoverage, setCollateralCoverage] = React.useState<string>('110');
    const [collateralAsset, setCollateralAsset] = React.useState<Address>(zeroAddress);
    const [unitLiquidity, setUnitLiquidity] = React.useState<string>('1');

    const account = formatAddr(useAccount().address);
    const config = useConfig();
    const toggleDrawer = (arg: number) => setDrawerState(arg);
    
    const onChange = (inputProp: string, tag: InputSelector) => {
        switch (tag) {
            case 'Quorum':
                setQuorum(toBN(inputProp).toNumber());
                break;
            case 'Duration':
                setDuration(toBN(inputProp).toNumber());
                break;
            case 'CCR':
                setCollateralCoverage(inputProp);
                break;
            case 'CollateralAsset':
                setCollateralAsset(formatAddr(inputProp));
                break;
            case 'UnitLiquidity':
                setUnitLiquidity(inputProp);
                break;
        
            default:
                break;
        }
    }

    const { functionName, args, transactionArgs } = React.useMemo(() => {
        const functionName : FunctionName = 'createPool';
        const isPermissionless = true;
        const args = [[account], parseUnits(unitLiquidity, 18), quorum, duration, toBN(colCoverage).toNumber(), isPermissionless, collateralAsset];
        const transactionArgs : HandleTransactionParam = {
            // commonParam: {account, config, unit: BigInt(toBN(unitLiquidity).times('1e18').toString()), contractAddress: collateralAsset},
            commonParam: {account, config, unit: parseUnits(unitLiquidity, 18)},
            router: 'Permissionless',
        };
        return { functionName, args, transactionArgs };
    }, [account, unitLiquidity, quorum, colCoverage, collateralAsset]);


    return(
        <Stack className="space-y-8 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
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
                                element: (<CollateralMultiplier selected={colCoverage} handleChange={onChange}/>),
                            },
                            {
                                id: "Collateral asset",
                                element: (<CollateralAsset selected={collateralAsset} handleChange={onChange}/>),
                            },
                        ] as const
                    ).map(({ id, element }) => (
                        <div key={id} >
                           { element }
                        </div>
                    ))
                }
            </div>
            <div>
                <Button
                    variant={'outline'}
                    className="w-full bg-white2/80 dark:bg-green1/90 border border-green1/30 dark:border-white1/30 text-green1/90 dark:text-orange-200 p-6 hover:bg-green1/70"
                    onClick={() => toggleDrawer(1)}
                >
                    Submit
                </Button>
            </div>
            <Confirmation 
                functionName={functionName}
                args={args}
                openDrawer={openDrawer}
                toggleDrawer={toggleDrawer}
                transactionArgs={transactionArgs}
                displayMessage="Request to launch a public liquidity pool"
                optionalDisplay={
                    <ReviewInput 
                        type={'UnitLiquidity'}
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
                                affix: `${duration < 2? ' hr' : ' hrs'}`,
                            },
                            {
                                title: 'Collateral Asset',
                                value: collateralAsset,
                                affix: '',
                            },
                            // {
                            //     title: 'Base Asset',
                            //     value: baseAssetHolding,
                            //     affix: ''
                            // },
                            {
                                title: 'Collateral Index',
                                value: toBN(colCoverage).div(100).toString(),
                                affix: ''
                            },
                        ]}
                    />
                }
            />
        </Stack>
    );
}
