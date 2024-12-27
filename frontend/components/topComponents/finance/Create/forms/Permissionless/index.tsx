import React from "react";
import Stack from "@mui/material/Stack";
import { Input } from "../../Input";
import type { InputProp, InputSelector } from '@/interfaces';
import { ReviewInput } from "../ReviewInput";
import Grid from "@mui/material/Grid";
import { CustomButton } from "@/components/CustomButton";
import useAppStorage from "@/components/StateContextProvider/useAppStorage";
import Quorum from "../Quorum";
import Duration from "../Duration";
import Interest from "../Interest";
import CollateralMultiplier from "../CollateralMultiplier";
import UnitLiquidity from "../UnitLiquidity";
import { useMediaQuery } from "@mui/material";

export const Permissionless = () => {
    const [modalOpen, setModalPopUp] = React.useState<boolean>(false);
    const [quorum, setQuorum] = React.useState<InputProp>({value: '2', open: false});
    const [duration, setDuration] = React.useState<InputProp>({value: '1', open: false});
    const [ccr, setCollateralCoverage] = React.useState<InputProp>({value: '100', open: false});
    const [interest, setInterest] = React.useState<InputProp>({value: '1', open: false});
    const [unitLiquidity, setUnitLiquidity] = React.useState<InputProp>({value: '1', open: false});

    const toggleModal = () => setModalPopUp(!modalOpen);
    const { txnStatus } = useAppStorage();
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
                    handleButtonClick={toggleModal}
                >
                    Submit
                </CustomButton>
            </Stack>
            <ReviewInput 
                handleModalClose={toggleModal}
                modalOpen={modalOpen}
                type={'UnitLiquidity'}
                formType={'Permissionless'}
                values={[
                    {
                        title: 'Quorum',
                        value: quorum.value
                    },
                    {
                        title: 'Unit Liquidity',
                        value: unitLiquidity.value
                    },
                    {
                        title: 'Duration',
                        value: duration.value,
                    },
                    {
                        title: 'Int. Rate',
                        value: interest.value,
                    },
                    {
                        title: 'Collateral Coverage',
                        value: ccr.value,
                    },
                ]}
            />
        </Stack>
    );
}
