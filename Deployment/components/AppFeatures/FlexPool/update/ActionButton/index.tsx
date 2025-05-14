import React from "react";
import { ButtonObj, VoidFunc } from "@/interfaces";
import { Button } from "@/components/ui/button";

export const ActionButton = (props: {disabled: boolean, buttonContent: string, toggleDrawer: (arg: number) => void}) => {
    const { disabled, buttonContent, toggleDrawer} = props;
    return(
        <React.Fragment>
            <Button
                variant={'outline'}
                disabled={disabled}
                onClick={() => toggleDrawer(1)}
                className=" bg-green1/90 text-orange-200 capitalize w-full max-w-sm"
            >
                { buttonContent }
            </Button>
        </React.Fragment>
    );
}
