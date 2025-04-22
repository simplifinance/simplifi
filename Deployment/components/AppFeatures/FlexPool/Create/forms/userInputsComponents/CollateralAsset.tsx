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
        handleChange(arg.toString(), 'CollateralAsset');
    };
    return (
        <div>
            { (isLoading || isError && !data) && <Label className='font-black text-green1/90 dark:text-orange-200 pb-2'>Collateral asset</Label>}
            { isLoading && !data && <Button  variant={'outline'} className='w-full bg-white1 dark:bg-gray1 border border-green1/30 dark:border-white1/30 dark:text-orange-200 focus:ring-0 cursor-not-allowed'>{"Loading asset ..."}</Button>}
            { isError && !data && <Button variant={'outline'} className='w-full bg-white1 dark:bg-gray1 border border-green1/30 dark:border-white1/30 dark:text-orange-200 focus:ring-0 cursor-not-allowed'>{'No connection found'}</Button>}
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

