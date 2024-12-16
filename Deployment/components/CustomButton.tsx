import { VoidFunc } from "@/interfaces";
import React from "react";

export const CustomButton: 
    React.FC<CustomButtonProps> = (
        {
            overrideClassName,
            handleButtonClick,
            children
        }
    ) => 
{
    return(
        <button 
            onClick={handleButtonClick}
            className={`${overrideClassName || `w-full p-3 rounded-full bg-green1 text-yellow-200` }`}
        >
            { children }
        </button>
    )
}

interface CustomButtonProps {
    overrideClassName?: string;
    handleButtonClick: VoidFunc;
    children: React.ReactNode;
}