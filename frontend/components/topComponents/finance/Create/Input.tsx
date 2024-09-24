import React from "react";

interface InputProps {
    type: 'number' | 'text';
    placeholder?: string;
    id: string;
    onChange: (arg: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Input = (props: InputProps) => {
    const { type, placeholder, id, onChange } = props;

    return(
        <input 
            type={type}
            placeholder={placeholder}
            required={true}
            id={id}
            onChange={onChange}
            className="w-full p-3 text-sm bg-white1 opacity-70 rounded-lg"
        />
    )
}