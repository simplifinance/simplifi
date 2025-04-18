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
    const callback = (arg: Address) => handleChange(arg.toString(), 'CollateralAsset');

    return (
        <div>
            { (isLoading || isError && !data) && <Label className='text-green1/90 dark:text-white1 font-black'>Collateral asset</Label>}
            { isLoading && !data && <Button  variant={'outline'} className='w-full p-4 rounded-lg text-center bg-green1/90 bg-white1 text-green1/90 cursor-not-allowed hover:bg-white1'>{"Loading asset ..."}</Button>}
            { isError && !data && <Button variant={'outline'} className='w-full p-4 rounded-lg text-center bg-white1 text-green1/50 cursor-not-allowed hover:bg-white1'>{'No connection found'}</Button>}
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

