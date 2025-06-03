import React from "react";
import type { Address, FunctionName, HandleTransactionParam, InputSelector } from '@/interfaces';
import { ReviewInput } from "../ReviewInput";
import { formatAddr, toBN } from "@/utilities";
import { useAccount, useConfig } from "wagmi";
import { parseUnits, zeroAddress } from "viem";
import useAppStorage from "@/components/contexts/StateContextProvider/useAppStorage";
import UnitLiquidity from "../userInputsComponents/UnitLiquidity";
import CollateralAsset from "../userInputsComponents/CollateralAsset";
import CollateralMultiplier from "../userInputsComponents/CollateralMultiplier";
import Duration from "../userInputsComponents/Duration";
import Participants from "../userInputsComponents/Participants";
import { Button } from "@/components/ui/button";
import CreatePool from "../../../update/transactions/CreatePool";

export const Permissioned = () => {
    const [openDrawer, setDrawerState] = React.useState<number>(0);
    const [duration, setDuration] = React.useState<number>(1);
    const [colCoverage, setCollateralCoverage] = React.useState<string>('110');
    const [collateralAsset, setCollateralAsset] = React.useState<Address>(zeroAddress);
    const [unitLiquidity, setUnitLiquidity] = React.useState<string>('1');
    const [participants, setParticipant] = React.useState<Address[]>([]);

    // const isLargeScreen = useMediaQuery('(min-width:768px)');
    const { setmessage } = useAppStorage();
    const { address, isConnected } = useAccount();
    const account = formatAddr(address);
    const config = useConfig();
    const toggleDrawer = (arg:number) => setDrawerState(arg);

    const handleDeleteParticipant = (arg: number) => {
        if(participants.length > 0) {
            const found = participants.filter((_, i) => i === arg).at(0);
            if(found && found !== account) {
                const restAddr = participants.filter((_, i) => i !== arg);
                setParticipant(restAddr);
            }
        }
    }

    const addressOnChange = (arg: string) => {
        let copy = participants;
        const formattedValue = formatAddr(arg);
        // This is to ensure the first provider on the list is the current operator/user.
        if(copy.length === 0) {
            copy.push(account);
        }
        if(account !== zeroAddress) {
            if(arg.length === 42) {
                if(!copy.includes(formattedValue)){
                    copy.push(formattedValue);
                    setParticipant(copy);
                    setmessage(`${formattedValue} was added`,);
                }
            }
        }
    }

    /**
     * If user is creating a permissioned pool, we ensure the user's address is 
     * the first on the list. This is necessary to avoid the contract from reverting.
     * @param e : Input event value
     * @param tag : Type of operation to perform on the incoming input value
     */
    const onChange = (inputProp: string, tag: InputSelector) => {
        switch (tag) {
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

    const args = React.useMemo(() => {
        const isPermissionless = false;
        const args = [participants, parseUnits(unitLiquidity, 18), participants.length, duration, toBN(colCoverage).toNumber(), isPermissionless, collateralAsset];
        return args;
    }, [unitLiquidity, participants, colCoverage, collateralAsset, duration]);

    return(
        <div className="space-y-6 md:mt-2 bg-white2 dark:bg-transparent p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {
                    (
                        [
                            {
                                id: 'Participants',
                                element: (<Participants handleDelete={handleDeleteParticipant} addToList={addressOnChange} participants={participants} />),
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
                        <div key={id}>
                            { element }
                        </div>
                    ))
                }

            </div>
            <div>
                <Button
                    variant={'outline'}
                    className="text-green1/90 dark:text-orange-200 p-6 hover:bg-green1/70"
                    onClick={() => {
                        setmessage('');
                        setDrawerState(1)
                    }}
                >
                    Submit
                </Button>
            </div>
            <CreatePool 
                disabled={!isConnected}
                openDrawer={openDrawer}
                toggleDrawer={toggleDrawer}
                args={args} 
                unit={parseUnits(unitLiquidity, 18)}
                optionalDisplay={
                    <ReviewInput
                        type={'address'}
                        participants={participants}
                        values={[
                            {
                                title: 'Participants',
                                value: '',
                                affix: ''
                            },
                            {
                                title: 'Unit Liquidity',
                                value: unitLiquidity,
                                affix: ' $',
                            },
                            {
                                title: 'Duration',
                                value: duration,
                                affix: `${duration < 2? 'hr' : 'hrs'}`,
                            },
                            {
                                title: 'Collateral Asset',
                                value: collateralAsset,
                                affix: ''
                            },
                            {
                                title: 'Collateral Index',
                                value: toBN(colCoverage).div(100).toString(),
                                affix: ''
                            },
                        ]}
                    />
                }
            />
        </div>
    );
}
