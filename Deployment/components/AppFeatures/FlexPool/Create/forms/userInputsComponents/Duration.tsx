import * as React from 'react';
import { InputCategoryProp } from '@/interfaces';
import { Input } from '../../Input';

export default function Duration({selected, handleChange} : InputCategoryProp) {    
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        handleChange(e.target.value, 'Duration');
    } 
    return (
        <Input 
            id="Duration"
            onChange={onChange}
            required
            type='number'
            toolTipTitle="The period to which a borrower can retain the fund"
            inputValue={selected}
            label='How long should the fund be used? (hrs - Max 720hrs)'
            placeholder="Duration (In hrs)"
        />
    );
}
