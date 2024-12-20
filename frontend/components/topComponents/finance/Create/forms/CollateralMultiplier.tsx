import * as React from 'react';
import Tooltip from '@mui/material/Tooltip';
import { Chevron } from '@/components/Collapsible';
import { flexSpread } from '@/constants';
import Collapse from '@mui/material/Collapse';
import { InputCategoryProp } from '@/interfaces';

const collaterals = () => {
    return [...Array(301).keys()];
}

export default function CollateralMultiplier({inputProp: collateral, handleChange} : InputCategoryProp) {    
    return (
        <div className='p-4 relative'>
            <button
                onClick={() => handleChange({value: collateral.value, open: !collateral.open}, 'CCR')}
                className={`relative w-full ${flexSpread} rounded-lg p-3 bg-green1 text-orange-200`}
            >
                <span className='absolute -top-6 left-0 text-orange-300'>
                    <Tooltip title="% of collateral (based on loan amount) required to get finance. " >
                        <h1>Collateral Multiplier</h1>
                    </Tooltip>
                </span>
                { collateral.value }
                <Chevron open={collateral.open} />
            </button>
            <Collapse in={collateral.open} timeout="auto" unmountOnExit className={'bg-green1 absolute top-[54px] left-[16px] z-50  flex justify-center items-center'} style={{width: 'calc(100% - 32px)'}}>
                <div className='w-full place-items-center p-4 max-h-[200px] overflow-auto '>
                    {
                        collaterals().map((value) => (
                            value >= 100 && <button 
                                onClick={() => handleChange({value: value.toString(), open: false}, 'CCR')}
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

export type CollacteralProp = {
    value: number;
    open: boolean;
}
