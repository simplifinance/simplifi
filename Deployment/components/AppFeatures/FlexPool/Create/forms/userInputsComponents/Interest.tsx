import * as React from 'react';
import { InputCategoryProp } from '@/interfaces';
import { Input } from '../../Input';

export default function Interest({selected, handleChange} : InputCategoryProp) {    
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        handleChange(e.target.value, 'Interest');
    } 
    return (
        <Input 
            id="Interest"
            onChange={onChange}
            required
            toolTipTitle="Provider's interest rate"
            type='number'
            inputValue={selected}
            label='Interest'
            placeholder="Interest rate"
        />
    );
}

