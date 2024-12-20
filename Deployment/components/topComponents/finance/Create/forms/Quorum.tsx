import * as React from 'react';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Chevron } from '@/components/Collapsible';
import { flexSpread } from '@/constants';
import Collapse from '@mui/material/Collapse';
import { InputCategoryProp } from '@/interfaces';

const quorums = () => {
    return [...Array(256).keys()];
}

export default function Quorum({inputProp: quorum, handleChange} : InputCategoryProp) {    
    return (
        <div className='p-4 relative'>
            <button
                onClick={() => handleChange({value: quorum.value, open: !quorum.open}, 'Quorum')}
                className={`relative w-full ${flexSpread} rounded-lg p-3 bg-green1 text-orange-200`}
            >
                <span className='absolute -top-6 left-0 text-orange-300'>
                    <Tooltip title="How many participants do you expect?" >
                        <h1>Quorum</h1>
                    </Tooltip>
                </span>
                { quorum.value }
                <Chevron open={quorum.open} />
            </button>
            <Collapse in={quorum.open} timeout="auto" unmountOnExit className={'bg-green1 absolute top-[54px] left-[16px] z-50  flex justify-center items-center'} style={{width: 'calc(100% - 32px)'}}>
                <div className='w-full place-items-center p-4 max-h-[300px] overflow-auto '>
                    {
                        quorums().map((value) => (
                            value >= 2 && <button 
                                onClick={() => handleChange({value: value.toString(), open: false}, 'Quorum')}
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
