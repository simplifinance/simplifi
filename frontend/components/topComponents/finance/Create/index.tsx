import React from "react";
import Stack from "@mui/material/Stack";
import { Permissioned } from "./forms/Permissioned";
import { Permissionless } from "./forms/Permissionless";
// import { Input } from "./Input";

export type PoolType = 'Permissioned' | 'Permissionless' | '';
const poolType : PoolType[] = ['Permissioned', 'Permissionless'] as const;

const SelectPooType = (options: {handleSelected: (arg: PoolType) => void, handleNext: () => void, selected: PoolType}) => {
    const { selected, handleSelected, handleNext } = options;

    return(
        <Stack className="space-y-14 text-center">
            <h1 className="text-2xl font-semibold text-black text-opacity-70">Select the type of liquidity pool</h1>
            <Stack className="space-y-6">
                {
                    poolType.map((item) => (
                        <button 
                            key={item}
                            className={`w-full border uppercase border-gray-300 p-4 rounded-lg ${selected === item? 'bg-yellow-200 ' : 'bg-gray-50'}`}
                            onClick={() => handleSelected(item)}    
                        >
                            { item }
                        </button>
                    ))
                }
            </Stack>
            <div>
                <button onClick={handleNext} className="w-[30%] bg-orangec p-4 rounded-lg text-white font-semibold">
                    Next
                </button>
            </div>
        </Stack>
    );
}

export const Create : React.FC<{}> = () => {
    const [selected, setSelected] = React.useState<PoolType>('');
    const [displayForm, setDisplayForm] = React.useState<boolean>(false);

    const handleSelected = (arg: PoolType) => {
        setSelected(arg);
    };

    const handleNext = () => setDisplayForm(!displayForm);

    const renderForm = () => {
        let element : React.JSX.Element;
        switch (selected) {
            case "Permissioned":
                element = <Permissioned {...{handleBack: handleNext}} />
                break;
        
            default:
                element = <Permissionless {...{handleBack: handleNext}} />;
        }
        return(
            element
        )
    }

    return(
        !displayForm? 
            <SelectPooType {...{handleSelected, selected, handleNext}} /> 
                :
                    renderForm()
    );
}