import React from "react";

interface InputProps {
    type: 'number' | 'text';
    placeholder?: string
    id: string;
    onChange: (arg: React.ChangeEvent<HTMLInputElement>) => void;
    onInValid: (ret: React.FormEvent<HTMLInputElement>) => void
}

export const Input = (props: InputProps) => {
    const { type, placeholder, id, onInValid, onChange } = props;

    return(
        <input 
            type={type}
            placeholder={placeholder}
            required
            id={id}
            onInvalid={(v) => onInValid}
            onChange={onChange}
            className="w-full border p-2 rounded-lg "
        />
    )
}