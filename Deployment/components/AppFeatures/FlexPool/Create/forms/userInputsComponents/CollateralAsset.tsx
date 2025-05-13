import * as React from 'react';
import { Address, InputCategoryProp } from '@/interfaces';
import SelectComponent from '@/components/AppFeatures/Dashboard/WelcomeTabs/SelectComponent';
import { Label } from '@/components/ui/label';
// import useAppStorage from '@/components/contexts/StateContextProvider/useAppStorage';

export default function CollateralAsset({handleChange} : InputCategoryProp) {    
    // const { supportedAssets } = useAppStorage();
    const callback = (arg: Address | string) => {
        console.log("Arg:", arg);
        handleChange(arg.toString(), 'CollateralAsset');
    };
    return (
        <div>
            <Label className='font-black text-green1/90 dark:text-orange-200 pb-2'>Collateral asset</Label>
            <SelectComponent 
                callback={callback}
                data='supported'
                label='Collateral asset'
                placeholder='Pick your collateral asset'
            />
        </div>
    );
}

