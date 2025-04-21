import React from "react";
import { Input as InputComponent } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@mui/material";
import { flexSpread } from "@/constants";

interface InputProps {
    type: 'number' | 'text';
    placeholder?: string;
    id: string;
    toolTipTitle?: string;
    label?: string;
    required: boolean;
    inputValue?: string;
    overrideClassName?: string;
    onChange: (arg: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Input = (props: InputProps) => {
    const { type, placeholder, inputValue, toolTipTitle, label, id, overrideClassName, onChange } = props;

    return(
        <div className="flex w-full max-w-sm items-center space-x-2">
            <div className="grid w-full max-w-sm items-center gap-1.5">
                { label && <Tooltip title={toolTipTitle}><Label className="text-green1/90 dark:text-white1 font-black">{label}</Label></Tooltip>}
                <div className={`${flexSpread} gap-2`}>
                    <InputComponent 
                        type={type}
                        placeholder={placeholder}
                        required
                        id={id}
                        onChange={onChange}
                        className={`bg-white1 text-green1/90 border border-r-8 border-b-8 border-green1/90 dark:border-none focus:ring-1 ${overrideClassName}`}
                    />
                    { inputValue && <Button variant={'outline'} className="bg-white1 text-green1/90 border border-r-8 border-b-8 border-green1/90 dark:border-none cursor-not-allowed">{inputValue}</Button>}
                </div>
            </div>
        </div>
    )
}