import { flexEven, } from "@/constants";
import { CustomButton } from "../../utilities/CustomButton";
import useAppStorage from "../../contexts/StateContextProvider/useAppStorage";
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

    // ${displayOnboardUser? 'bg-orangec dark:bg-gray1' : 'bg-orangec'}
    return(
        <div className={`${flexEven} ${padContainer || 'p-1'} ${overrideClassName}`}>
            <CustomButton 
                disabled={disableButtonA}
                handleButtonClick={buttonAFunc || toggleDisplayOnboardUser} 
                overrideClassName={`border border-green1 p-3 rounded-l-xl text-xs md:text-md uppercase bg-orangec hover:bg-orangec/70 text-green1 dark:text-white1`}
            >
                {buttonAContent}
            </CustomButton>

            <CustomButton 
                disabled={disableButtonB}
                handleButtonClick={buttonBFunc || exitOnboardScreen} 
                overrideClassName={`bg-white1 dark:bg-[#2e3231] text-green1 border border-green1 p-3 rounded-r-full text-xs md:text-md uppercase dark:text-white1`} 
            >
                {buttonBContent}
            </CustomButton>
        </div>
    );
} 