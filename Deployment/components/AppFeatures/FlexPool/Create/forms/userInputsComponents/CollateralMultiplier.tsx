import * as React from 'react';
import { InputCategoryProp } from '@/interfaces';
import { Input } from '../../Input';

export default function CollateralMultiplier({selected, handleChange} : InputCategoryProp) {    
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        handleChange(e.target.value, 'CCR');
    } 

    return (
        <Input 
            id="Collateral"
            onChange={onChange}
            required
            toolTipTitle='Collateral multiplier index e.g 120, 150, 200. If set to 100, 100% of pooled fund will be required as collateral'
            type='number'
            inputValue={selected}
            label='Collateral coverage'
            placeholder="Collateral index"
        />
    );
}
