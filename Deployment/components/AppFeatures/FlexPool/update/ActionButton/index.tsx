import React from "react";
import { ActionsButtonProps } from "@/interfaces";
import { Confirmation } from "./Confirmation";
import { Button } from "@/components/ui/button";

export const ActionButton = (props: ActionsButtonProps) => {
    const { buttonObj, confirmationDrawerOn, transactionArgs, back, setDrawerState, } = props;
    const openDrawer = () => setDrawerState(1);
    const handleClick = () => openDrawer();
    
    return(
        <React.Fragment>
            <Button
                variant={'outline'}
                disabled={buttonObj.disable}
                onClick={handleClick}
                className=" bg-green1/90 text-orange-200"
            >
                { buttonObj.value }
            </Button>
            <Confirmation
                openDrawer={confirmationDrawerOn}
                toggleDrawer={(arg: number) => setDrawerState(arg)}
                transactionArgs={transactionArgs}
                back={back}           
            />
        </React.Fragment>
    );
}
