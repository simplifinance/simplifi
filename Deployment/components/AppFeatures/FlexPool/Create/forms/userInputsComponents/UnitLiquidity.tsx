import * as React from 'react';
import { InputCategoryProp } from '@/interfaces';
import { Input } from '../../Input';
import { formatEther } from 'viem';
import { toBigInt } from '@/utilities';

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
            inputValue={formatEther(toBigInt(selected)) || '0'}
            label='Unit Liquidity'
            placeholder="Unit Liquidity"
        />
    ); 
}
