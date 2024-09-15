import React from "react";

interface InputProps {
    type: 'number' | 'text';
    placeholder?: string
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
            className="w-full border-2 p-2 opacity-70 text-sm bg-gray-100 rounded-lg "
        />
    )
}