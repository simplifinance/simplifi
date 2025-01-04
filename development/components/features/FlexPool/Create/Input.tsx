import React from "react";

interface InputProps {
    type: 'number' | 'text';
    placeholder?: string;
    id: string;
    overrideBg: string;
    onChange: (arg: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Input = (props: InputProps) => {
    const { type, placeholder, id, overrideBg, onChange } = props;

    return(
        <input 
            type={type}
            placeholder={placeholder}
            required
            id={id}
            onChange={onChange}
            className={`w-full p-4 text-xs text-orange-200 rounded-[12px] focus:placeholder:absolute placeholder:top-0 placeholder:text-white1/40 bg-green1  ${overrideBg}`}
        />
    )
}