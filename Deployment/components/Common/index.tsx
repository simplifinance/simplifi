import { VoidFunc } from "@/interfaces";
import React from "react";

// Not connected

export const CustomButton: 
    React.FC<CustomButtonProps> = (
        {
            flexType,
            buttonText, 
            overrideClassName,
            handleButtonClick
        }
    ) => 
{
    return(
        <button 
            onClick={handleButtonClick}
            className={`${overrideClassName || `${flexType? flexType : ''} w-full p-3 rounded-lg bg-yellow-100` }`}
        >

        </button>
    )
}

interface CustomButtonProps {
    buttonText: string;
    flexType?: string;
    overrideClassName?: string;
    handleButtonClick: VoidFunc;
}