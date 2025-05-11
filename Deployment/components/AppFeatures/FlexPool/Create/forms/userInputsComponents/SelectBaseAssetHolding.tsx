// import * as React from 'react';
// import { Address, InputCategoryProp } from '@/interfaces';
// import SelectComponent from '@/components/AppFeatures/Dashboard/WelcomeTabs/SelectComponent';
// import { Label } from '@/components/ui/label';
// import useAppStorage from '@/components/contexts/StateContextProvider/useAppStorage';

// export default function SelectBaseAssetHolding({handleChange} : InputCategoryProp) {    
//     const { supportedAssets } = useAppStorage();
//     const callback = (arg: Address | string) => {
//         handleChange(arg.toString(), 'SelectBaseAssetHolding');
//     };
//     return (
//         <div>
//             <Label className='font-black text-green1/90 dark:text-orange-200 pb-2'>Base asset</Label>
//             <SelectComponent 
//                 callback={callback}
//                 data={'convertible'}
//                 label='Base asset'
//                 placeholder='Which asset are you holding?'
//             />
            
//         </div>
//     );
// }

