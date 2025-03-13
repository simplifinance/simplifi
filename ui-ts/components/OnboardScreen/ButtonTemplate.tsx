import { flexEven, } from "@/constants";
import { CustomButton } from "../CustomButton";
import useAppStorage from "../StateContextProvider/useAppStorage";
import { VoidFunc } from "@/interfaces";
import React from "react";

interface ButtonTemplateProps {
    buttonAContent: React.ReactNode;
    buttonBContent: React.ReactNode;
    overrideClassName?: string;
    padContainer?: string;
    buttonAFunc?: VoidFunc;
    buttonBFunc?: VoidFunc;
    disableButtonA: boolean;
    disableButtonB: boolean;
}

export default function ButtonTemplate (
    {
        buttonAContent, 
        padContainer, 
        buttonBContent, 
        overrideClassName,
        disableButtonA,
        disableButtonB,
        buttonAFunc, 
        buttonBFunc
    } : ButtonTemplateProps) {
    const { toggleDisplayOnboardUser, displayOnboardUser, exitOnboardScreen } = useAppStorage();

    return(
        <div className={`${flexEven} ${padContainer || 'p-1'} ${overrideClassName}`}>
            <CustomButton 
                disabled={disableButtonA}
                handleButtonClick={buttonAFunc || toggleDisplayOnboardUser} 
                overrideClassName={`${displayOnboardUser? 'bg-gray1' : 'bg-green1'} border border-green1 p-3 rounded-l-full ${!displayOnboardUser && 'hover:shadow-sm hover:shadow-orange-200 animate-none text-xs md:text-md uppercase'}`}
            >
                {buttonAContent}
            </CustomButton>

            <CustomButton 
                disabled={disableButtonB}
                handleButtonClick={buttonBFunc || exitOnboardScreen} 
                overrideClassName={`w-full ${!displayOnboardUser? 'bg-gray1' : 'bg-green1'} border border-green1 p-3 rounded-r-full ${!displayOnboardUser && 'hover:shadow-sm hover:shadow-orange-200 text-xs md:text-md uppercase'}`} 
            >
                {buttonBContent}
            </CustomButton>
        </div>
    );
} 