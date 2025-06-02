import * as React from 'react';
import { InputCategoryProp } from '@/interfaces';
import { Input } from '../../Input';

export default function Quorum({selected, handleChange,} : InputCategoryProp) {
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        handleChange(e.target.value, 'Quorum');
    } 
    return (
        <Input 
            id="Quorum"
            onChange={onChange}
            required
            toolTipTitle="Expected number of contributors"
            type='number'
            inputValue={selected} 
            label='Number of contributors'
            placeholder="Max participants"
        />
    ); 
}
