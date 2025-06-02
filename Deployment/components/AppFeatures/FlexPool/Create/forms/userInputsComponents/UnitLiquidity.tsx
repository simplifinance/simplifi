import * as React from 'react';
import { InputCategoryProp } from '@/interfaces';
import { Input } from '../../Input';

export default function UnitLiquidity({selected, handleChange,} : InputCategoryProp) {    
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        handleChange(e.target.value, 'UnitLiquidity');
    } 
    return (
        <Input 
            id="UnitLiquidity"
            onChange={onChange}
            required
            toolTipTitle="Liquidity amount per contributor (In base asset e.g cUSD)"
            type='number'
            inputValue={selected}
            label='Amount'
            placeholder="Enter contribution amount"
        />
    ); 
}
