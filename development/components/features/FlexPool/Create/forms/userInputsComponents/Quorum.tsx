import * as React from 'react';
import Tooltip from '@mui/material/Tooltip';
import { Chevron } from '@/components/Collapsible';
import { flexSpread } from '@/constants';
import Collapse from '@mui/material/Collapse';
import { InputCategoryProp } from '@/interfaces';

const quorums = () => {
    return [...Array(256).keys()];
}

export default function Quorum({inputProp: quorum, handleChange,} : InputCategoryProp) {    
    return (
        <div className='relative'>
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
            <Collapse in={quorum.open} timeout="auto" unmountOnExit className={'bg-green1 absolute top-[44px] left-0 z-50 flex justify-center items-center rounded-b-[12px]'} style={{width: '100%'}}>
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
