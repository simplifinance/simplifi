import * as React from 'react';
import { Address, InputCategoryProp } from '@/interfaces';
import SelectComponent from '@/components/AppFeatures/WelcomeTabs/SelectComponent';
import { Label } from '@/components/ui/label';
// import useAppStorage from '@/components/contexts/StateContextProvider/useAppStorage';

export default function CollateralAsset({handleChange} : InputCategoryProp) {    
    // const { supportedAssets } = useAppStorage();
    const callback = (arg: Address | string) => {
        // console.log("Arg:", arg);
        handleChange(arg.toString(), 'CollateralAsset');
    };
    return (
        <div className='space-y-3'>
            <Label className='font-bold text-green1/80 dark:text-orange-200'>Collateral asset</Label>
            <SelectComponent 
                callback={callback}
                data='supported'
                label='Collateral asset'
                placeholder='Options'
            />
        </div>
    );
}

