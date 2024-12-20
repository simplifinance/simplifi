import * as React from 'react';
import { Chevron } from '@/components/Collapsible';
import { flexSpread } from '@/constants';
import Collapse from '@mui/material/Collapse';
import Tooltip from '@mui/material/Tooltip';
import { InputCategoryProp } from '@/interfaces';

const rates = () => {
    return [...Array(100).keys()];
}

export default function Interest({inputProp: interest, handleChange} : InputCategoryProp) {    
    return (
        <div className='p-4 relative'>
            <button
                onClick={() => handleChange({value: interest.value, open: !interest.open}, 'Interest')}
                className={`relative w-full ${flexSpread} rounded-lg p-3 bg-green1 text-orange-200`}
            >
                 <span className='absolute -top-6 left-0 text-orange-300'>
                    <Tooltip title="Rate of interest to charge on loan for the specified duration" >
                        <h1>Interest</h1>
                    </Tooltip>
                </span>
                { interest.value }
                <Chevron open={interest.open} />
            </button>
            <Collapse in={interest.open} timeout="auto" unmountOnExit className={'bg-green1 absolute top-[54px] left-[16px] z-50  flex justify-center items-center'} style={{width: 'calc(100% - 32px)'}}>
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
