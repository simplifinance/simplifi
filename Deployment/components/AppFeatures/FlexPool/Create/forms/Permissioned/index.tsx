import React from "react";
import Stack from "@mui/material/Stack";
// import { Input } from "../../Input";
import type { Address, InputSelector } from '@/interfaces';
import { ReviewInput } from "../ReviewInput";
import { formatAddr, toBN } from "@/utilities";
import { useAccount } from "wagmi";
import { zeroAddress } from "viem";
import useAppStorage from "@/components/contexts/StateContextProvider/useAppStorage";
import { CustomButton } from "@/components/utilities/CustomButton";
import UnitLiquidity from "../userInputsComponents/UnitLiquidity";
import CollateralAsset from "../userInputsComponents/CollateralAsset";
import CollateralMultiplier from "../userInputsComponents/CollateralMultiplier";
import Duration from "../userInputsComponents/Duration";
import Participants from "../userInputsComponents/Participants";
import { useMediaQuery } from "@mui/material";
import { Button } from "@/components/ui/button";

export const Permissioned = () => {
    const [openDrawer, setDrawerState] = React.useState<number>(0);
    const [duration, setDuration] = React.useState<string>('1');
    const [ccr, setCollateralCoverage] = React.useState<string>('100');
    const [collateralAsset, setCollateralAsset] = React.useState<string>('NA');
    const [unitLiquidity, setUnitLiquidity] = React.useState<string>('1');
    const [participants, setParticipant] = React.useState<Address[]>([]);

    // const isLargeScreen = useMediaQuery('(min-width:768px)');
    const { setmessage } = useAppStorage();
    const account = formatAddr(useAccount().address);
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
                setDuration(inputProp);
                break;
            case 'CCR':
                setCollateralCoverage(inputProp);
                break;
            case 'CollateralAsset':
                setCollateralAsset(inputProp);
                break;
            case 'UnitLiquidity':
                setUnitLiquidity(inputProp);
                break;
        
            default:
                break;
        }
    }

    return(
        <div className="space-y-8 mt-6">
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
                                element: (<CollateralMultiplier selected={ccr} handleChange={onChange}/>),
                            },
                            {
                                id: "CollateralAsset",
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
                    className="bg-green1/90 text-orange-300 w-full p-6 hover:text-white1"
                    onClick={() => setDrawerState(1)}
                >
                    Submit
                </Button>
            </div>
            <ReviewInput
                toggleDrawer={toggleDrawer}
                popUpDrawer={openDrawer}
                type={'address'}
                formType={'Permissioned'}
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
                        affix: `${duration === '0' || duration === '1'? 'hr' : 'hrs'}`,
                    },
                    {
                        title: 'Collateral Asset',
                        value: collateralAsset,
                        affix: ''
                    },
                    {
                        title: 'Collateral Index',
                        value: toBN(ccr).div(100).toString(),
                        affix: ''
                    },
                ]}
            />
        </div>
    );
}