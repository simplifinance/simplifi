import * as React from 'react';
import { Chevron } from '@/components/Collapsible';
import { flexSpread } from '@/constants';
import Collapse from '@mui/material/Collapse';
import Tooltip from '@mui/material/Tooltip';
import { InputCategoryProp } from '@/interfaces';
import { toBN } from '@/utilities';

const rates = () => {
    return [...Array(1000).keys()];
}

export default function Interest({inputProp: interest, handleChange} : InputCategoryProp) {    
    return (
        <div className='relative'>
            <button
                onClick={() => handleChange({value: interest.value, open: !interest.open}, 'Interest')}
                className={`relative w-full ${flexSpread} rounded-lg p-3 bg-green1 text-orange-200`}
            >
                 <span className='absolute -top-6 left-0 text-orange-300'>
                    <Tooltip title="Rate of interest to charge on loan for the specified duration" >
                        <h1>Interest</h1>
                    </Tooltip>
                </span>
                { interest.value === '0'? 'Zero rate' : `${toBN(interest.value).div(100).toString()}%`}
                <Chevron open={interest.open} />
            </button>
            <Collapse in={interest.open} timeout="auto" unmountOnExit className={'bg-green1 absolute top-[44px] left-0 z-50  flex justify-center items-center'} style={{width: '100%'}}>
                <div className='w-full place-items-center p-4 max-h-[250px] overflow-auto '>
                    {
                        rates().map((value) => (
                            <button 
                                onClick={() => handleChange({value: value.toString(), open: false}, 'Interest')}
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

export type InterestProp = {
    value: number;
    open: boolean;
}
