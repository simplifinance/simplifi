import * as React from 'react';
// import { Chevron } from '@/components/utilities/Icons';
// import { flexSpread } from '@/constants';
// import Collapse from '@mui/material/Collapse';
// import Tooltip from '@mui/material/Tooltip';
// import { Button } from '@/components/ui/button';
// import { Label } from '@/components/ui/label';
// import { VoidFunc } from '@/interfaces';
import { Input } from '../../Input';

export default function UserParamTemplate({id, type, onChange, placeholder, label, selected} : UserParamTemplateProps) {    
    return (
        <div className='grid w-full max-w-sm items-center gap-1.5 relative text-green1/90 dark:text-white1 p-1'>
            <Input 
                id={id}
                onChange={onChange}
                required
                type={type}
                inputValue={selected}
                label={label}
                placeholder={placeholder}
            />
            {/* {label && <Label className='text-sm font-black'>{label}</Label>}
            <Button
                onClick={handleButtonChange}
                className={`relative w-full ${flexSpread} rounded-lg bg-white1/70 dark:bg-green1/90 border border-r-8 border-b-8 border-green1/70 hover:bg-green1/10`}
                style={{padding: '22px'}}
            >
                <Tooltip title={toolTip} >
                    <span className='text-green1/90 dark:text-white1'>{ selected }</span>
                </Tooltip>
                <Chevron open={open} />
            </Button>
            <Collapse in={open} timeout="auto" unmountOnExit className={'absolute -top-[44px] left-0 z-50  flex justify-center items-center'} style={{width: '100%'}}>
                <div className='w-full bg-white1 border border-green1/90 dark:bg-green1 place-items-center p-4 max-h-[fit-content] overflow-auto '>
                    { collapseChildren && collapseChildren }
                </div>
            </Collapse> */}
        </div>
    );
}

export interface UserParamTemplateProps {
    id: string;
    label: string;
    type: 'text' | 'number';
    placeholder: string;
    selected: string;
    onChange: (arg: React.ChangeEvent<HTMLInputElement>) => void;
}