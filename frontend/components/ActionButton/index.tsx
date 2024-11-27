import { flexSpread } from "@/constants";
import { VoidFunc } from "@/interfaces";
import React from "react";
// import styles from "../../styles/hero.module.css"

export const ActionButton = (prop: ActionButtonArg) => {
    const {option1, option2, innerButtonText, outerButtonBg, innerButtonBg, innerButtonBorderColor, outerButtonBorderColor, handleClick, disableButton, outerButtonWidth, innerButtonWidth, innerButtonHeight, outerButtonHeight, flexType, innerButtonRest, outerButtonRest,} = prop;
    return (
        <button className={`${outerButtonBg || "bg-stone-400"} border ${outerButtonBorderColor || 'border-stone-600'} ${outerButtonWidth || 'w-full'} rounded-[50px] ${outerButtonHeight ||'h-12'}  ${outerButtonRest}`}>
            <button 
                onClick={handleClick} 
                disabled={disableButton}
                className={`${ flexType || flexSpread } ${innerButtonBg || 'bg-stone-200'} bg-opacity-80 border ${innerButtonBorderColor || 'border-stone-400'} ${innerButtonHeight ||'h-12'} ${innerButtonWidth || 'w-full'} text-sm rounded-[50px] font-black ${innerButtonText || 'text-stone-500'} cursor-pointer md:relative right-1 bottom-2 hover:right-0 active:shadow-lg active:shadow-stone-400 hover:bottom-0 duration-[300ms] ${innerButtonRest}`}
            >
                { option1 && option1 }
                { option2 && option2 }
            </button>
        </button>
    );
}

export const CustomButton = (props: {overrideStyle?: string, buttonText: string, handleClick: VoidFunc}) => {
    const { overrideStyle, buttonText, handleClick } = props;
    return(
        <button
            onClick={handleClick}
            className={
                [
                    "w-full h-[48px] m-0 mb-3 xss:mb-0 xss:w-[130px]",
                    "xss:h-[40px] lg:w-[80%] lg:h-[60px]",
                    "rounded-full bg-orange xss:mr-[9px] underlineFromLeft",
                    overrideStyle
                  ].join(" ")
            }
        >
            { buttonText }
        </button>
    );
}
  

interface ActionButtonArg {
    option1: React.ReactNode;
    option2?: React.ReactNode;
    flexType?: string;
    handleClick: any; 
    disableButton?: boolean;
    outerButtonBg?: string;
    innerButtonText?: string;
    innerButtonBg?: string;
    innerButtonWidth?: string;
    outerButtonWidth?: string;
    innerButtonHeight?: string;
    outerButtonHeight?: string;
    innerButtonBorderColor?: string;
    outerButtonBorderColor?: string;
    innerButtonRest?:  string;
    outerButtonRest?: string;
}

