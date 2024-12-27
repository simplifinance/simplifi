import * as React from 'react';
import { Chevron } from '@/components/Collapsible';
import { flexSpread } from '@/constants';
import Collapse from '@mui/material/Collapse';
import Tooltip from '@mui/material/Tooltip';
import { InputCategoryProp } from '@/interfaces';

const liquidities = () => {
    return [...Array(500).keys()];
}

export default function UnitLiquidity({inputProp: unitLiquidity, handleChange,} : InputCategoryProp) {    
    return (
        <div className='relative'>
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
            <Collapse in={unitLiquidity.open} timeout="auto" unmountOnExit className={'bg-green1 absolute top-[44px] left-0 z-50 rounded-b-[12px] flex justify-center items-center'} style={{width: '100%'}}>
                <div className='w-full place-items-center p-4 max-h-[250px] overflow-auto '>
                    {
                        liquidities().map((value) => (
                            value > 0 && value % 2 === 0 && <button 
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

