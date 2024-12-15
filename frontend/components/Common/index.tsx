import { VoidFunc } from "@/interfaces";
import React from "react";

// Not connected

export const CustomButton: 
    React.FC<CustomButtonProps> = (
        {
            flexType,
            children, 
            overrideClassName,
            handleButtonClick
        }
    ) => 
{
    return(
        <button 
            onClick={handleButtonClick}
            className={`${overrideClassName || `${flexType? flexType : ''}` } animate-pulse hover:animate-none`}
        >
            { children }
        </button>
    )
}

interface CustomButtonProps {
    children: React.ReactNode;
    flexType?: string;
    overrideClassName?: string;
    handleButtonClick: VoidFunc;
}