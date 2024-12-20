import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Chevron } from '@/components/Collapsible';
import { flexSpread } from '@/constants';
import Collapse from '@mui/material/Collapse';
import Tooltip from '@mui/material/Tooltip';
import { InputCategoryProp } from '@/interfaces';

const liquidities = () => {
    return [...Array(5000).keys()];
}

export default function UnitLiquidity({inputProp: unitLiquidity, handleChange} : InputCategoryProp) {    
    return (
        <div className='p-4 relative'>
            <button
                onClick={() => handleChange({value: unitLiquidity.value, open: !unitLiquidity.open}, 'UnitLiquidity')}
                className={`relative w-full ${flexSpread} rounded-lg p-3 bg-green1 text-orange-200`}
            >
                 <span className='absolute -top-6 left-0 text-orange-300'>
                    <Tooltip title="Liquidity amount per provider" >
                        <h1>{"Unit Liquidity (In USD)"}</h1>
                    </Tooltip>
                </span>
                { unitLiquidity.value }
                <Chevron open={unitLiquidity.open} />
            </button>
            <Collapse in={unitLiquidity.open} timeout="auto" unmountOnExit className={'bg-green1 absolute top-[54px] left-[16px] z-50  flex justify-center items-center'} style={{width: 'calc(100% - 32px)'}}>
                <div className='w-full place-items-center p-4 max-h-[250px] overflow-auto '>
                    {
                        liquidities().map((value) => (
                            value > 0 && <button 
                                onClick={() => handleChange({value: value.toString(), open: false}, 'UnitLiquidity')}
                                key={value}
                                value={value}
                                className='bg-green1 p-2 size- rounded-full text-[10px] hover:bg-gray1'
                            >
                                {value}
                            </button>
                        ))
                    }
                </div>
            </Collapse>
        </div>
    );
}

