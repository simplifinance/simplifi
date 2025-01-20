import React from "react";
import Stack from "@mui/material/Stack";
import { Input } from "../../Input";
import type { Address, InputProp, InputSelector } from '@/interfaces';
import { ReviewInput } from "../ReviewInput";
import { formatAddr, toBN } from "@/utilities";
import { useAccount } from "wagmi";
import { zeroAddress } from "viem";
import Grid from "@mui/material/Grid";
import useAppStorage from "@/components/StateContextProvider/useAppStorage";
import { CustomButton } from "@/components/CustomButton";
import Quorum from "../userInputsComponents/Quorum";
import UnitLiquidity from "../userInputsComponents/UnitLiquidity";
import Interest from "../userInputsComponents/Interest";
import CollateralMultiplier from "../userInputsComponents/CollateralMultiplier";
import Duration from "../userInputsComponents/Duration";
import Participants from "../userInputsComponents/Participants";
import { useMediaQuery } from "@mui/material";

export const Permissioned = () => {
    const [openDrawer, setDrawerState] = React.useState<number>(0);
    const [duration, setDuration] = React.useState<InputProp>({value: '1', open: false});
    const [ccr, setCollateralCoverage] = React.useState<InputProp>({value: '100', open: false});
    const [interest, setInterest] = React.useState<InputProp>({value: '1', open: false});
    const [unitLiquidity, setUnitLiquidity] = React.useState<InputProp>({value: '1', open: false});
    const [participants, setParticipant] = React.useState<Address[]>([]);

    const isLargeScreen = useMediaQuery('(min-width:768px)');
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
    const onChange = (inputProp: InputProp, tag: InputSelector) => {
        switch (tag) {
            case 'Duration':
                setDuration(inputProp);
                break;
            case 'CCR':
                setCollateralCoverage(inputProp);
                break;
            case 'Interest':
                setInterest(inputProp);
                break;
            case 'UnitLiquidity':
                setUnitLiquidity(inputProp);
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
                                id: 'Participants',
                                element: (<Participants handleDelete={handleDeleteParticipant} addToList={addressOnChange} participants={participants} />),
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
                    ).map(({ id, element }) => (
                        <Grid item key={id} xs={12} md={6} >
                            { element }
                        </Grid>
                    ))
                }

            </Grid>
            <Stack className="place-items-center">
                <CustomButton
                    overrideClassName="bg-orange-200 text-green1 font-bold py-4 rounded-[26px] "
                    disabled={false}
                    handleButtonClick={() => setDrawerState(1)}
                >
                    Submit
                </CustomButton>
            </Stack>
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
                        value: unitLiquidity.value,
                        affix: ' $',
                    },
                    {
                        title: 'Duration',
                        value: duration.value,
                        affix: `${duration.value === '0' || duration.value === '1'? 'hr' : 'hrs'}`,
                    },
                    {
                        title: 'Int. Rate',
                        value: toBN(interest.value).div(100).toString(),
                        affix: `%`
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