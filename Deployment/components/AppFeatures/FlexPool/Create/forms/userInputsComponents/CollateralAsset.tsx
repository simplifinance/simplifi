import * as React from 'react';
import { Address, InputCategoryProp } from '@/interfaces';
import { useAccount, useReadContract } from 'wagmi';
import getReadFunctions from '../../../update/DrawerWrapper/readContractConfig';
import SelectComponent from '@/components/AppFeatures/Dashboard/WelcomeTabs/SelectComponent';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export default function CollateralAsset({handleChange} : InputCategoryProp) {    
    const { chainId } = useAccount();
    const { getSupportedAssetConfig } = getReadFunctions({chainId});
    const { data, isLoading, isError } = useReadContract({...getSupportedAssetConfig()});
    const callback = (arg: Address) => {
        // console.log("Collateral asset", arg)
        handleChange(arg.toString(), 'CollateralAsset');
    };
    // console.log("Data", data)
    return (
        <div>
            { (isLoading || isError && !data) && <Label className='text-green1/90 dark:text-white1 font-black'>Collateral asset</Label>}
            { isLoading && !data && <Button  variant={'outline'} className='w-full p-4 bg-white1 text-green1/90 border border-r-8 border-b-8 border-green1/90 dark:border-none cursor-not-allowed'>{"Loading asset ..."}</Button>}
            { isError && !data && <Button variant={'outline'} className='w-full p-4 bg-white1 text-green1/90 border border-r-8 border-b-8 border-green1/90 dark:border-none'>{'No connection found'}</Button>}
            { data && <SelectComponent 
                            callback={callback}
                            data={data}
                            label=''
                            placeholder='Select collateral asset'
                        />
            }
        </div>
    );
}

