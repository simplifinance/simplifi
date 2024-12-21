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

const durations = () => {
    return [...Array(721).keys()];
}

export default function Duration({inputProp: duration, handleChange} : InputCategoryProp) {    
    return (
        <div className='relative'>
            <button
                onClick={() => handleChange({value: duration.value, open: !duration.open}, 'Duration')}
                className={`relative w-full ${flexSpread} rounded-lg p-3 bg-green1 text-orange-200`}
            >
                 <span className='absolute -top-6 left-0 text-orange-300'>
                    <Tooltip title="How long will a borrower hold the borrowed fund?" >
                        <h1>{'Duration (In hrs)'}</h1>
                    </Tooltip>
                </span>
                { duration.value }
                <Chevron open={duration.open} />
            </button>
            <Collapse in={duration.open} timeout="auto" unmountOnExit className={'bg-green1 absolute top-[44px] left-0 z-50  flex justify-center items-center'} style={{width: '100%'}}>
                <div className='w-full place-items-center p-4 max-h-[250px] overflow-auto '>
                    {
                        durations().map((value) => (
                            value > 0 && <button 
                                onClick={() => handleChange({value: value.toString(), open: false}, 'Duration')}
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
            {/* <div hidden={!open} className='absolute right-0 bg-green1 w-full mx-4'>
            </div> */}
        </div>
    );
}

export type DurationProp = {
    value: number;
    open: boolean;
}
