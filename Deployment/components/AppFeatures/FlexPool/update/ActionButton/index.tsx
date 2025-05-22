import React from "react";
import { Button } from "@/components/ui/button";

export const ActionButton = (props: ActionButtonProps) => {
    const { disabled, buttonContent, widthType, toggleDrawer, optionalButtonContent} = props;
    return(
        <React.Fragment>
            <Button
                variant={'outline'}
                disabled={disabled}
                onClick={() => toggleDrawer(1)}
                className={`flex justify-between items-center bg-green1/90 text-orange-200 capitalize ${widthType} max-w-sm`}
            >
                { optionalButtonContent && optionalButtonContent }
                { buttonContent }
            </Button>
        </React.Fragment>
    );
}

type ActionButtonProps = {
    disabled: boolean;
    buttonContent: string;
    toggleDrawer: (arg: number) => void;
    optionalButtonContent?: React.ReactNode;
    widthType: 'w-full' | 'fit-content'
}