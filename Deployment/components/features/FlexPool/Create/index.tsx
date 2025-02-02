import React from "react";
import { Permissioned } from "./forms/Permissioned";
import { Permissionless } from "./forms/Permissionless";
import { flexSpread, flexStart } from "@/constants";
import type { PoolType, } from "@/interfaces";
import useAppStorage from "@/components/StateContextProvider/useAppStorage";

export const Create : React.FC = () => {
    const [formType, setFormType] = React.useState<PoolType>('Permissionless');
    
    const { closeDisplayForm } = useAppStorage();
    const disablebutton = formType === 'Permissionless';
    const handleSwitch = (arg: PoolType) => setFormType(arg);
    const renderForm = () => {
        let element : React.JSX.Element;
        switch (formType) {
            case "Permissioned":
                element = <Permissioned />
                break;
            default:
                element = <Permissionless />;
        }
        return(element);
    }

    return(
        <React.Fragment>
            <div className={`${flexSpread}`}>

            <div className={`md:hidden w-[fit-content] ${flexStart}`}>
                <button disabled={disablebutton} onClick={() => handleSwitch('Permissionless')} className={`${flexSpread} gap-2 ${!disablebutton? 'bg-gray1 animate-pulse' : 'bg-green1'} p-3 rounded-full ${!disablebutton && 'hover:shadow-sm hover:shadow-orange-200'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 text-orange-300">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                  </svg>
                </button>
                <button disabled={!disablebutton} onClick={() => handleSwitch('Permissioned')} className={`${flexSpread} gap-2 ${disablebutton? 'bg-gray1 animate-pulse' : 'bg-green1'} p-3 rounded-full ${disablebutton && 'hover:shadow-sm hover:shadow-orange-200'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 text-red-300">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                  </svg>
                </button>
              </div>
              <div className={`hidden md:flex items-center w-[fit-content] text-xs uppercase`}>
                <button disabled={disablebutton} onClick={() => handleSwitch('Permissionless')} className={`${flexSpread} gap-2 uppercase text-orange-300 border border-green1 ${!disablebutton? 'bg-gray1 animate-pulse hover:text-orangec' : 'bg-green1 '} p-3 rounded-l-full`}>
                  Permissionless
                </button>
                <button disabled={!disablebutton} onClick={() => handleSwitch('Permissioned')} className={`${flexSpread} gap-2 uppercase text-orange-300 border border-green1 ${disablebutton? 'bg-gray1 animate-pulse hover:text-orangec' : 'bg-green1 '} p-3 rounded-r-full`}>
                  Permissioned
                </button>
              </div>
                <button onClick={closeDisplayForm} className="w-[fit-content] focus:ring-1 p-3 hover:shadow-sm text-orange-300 hover:shadow-orange-200 bg-green1 rounded-r-full text-xs uppercase focus:ring-gray1 active:ring-1">
                    <h1 className="animate-pulse">Back</h1>
                </button>
            </div>
            {
                renderForm() 
            }
        </React.Fragment>
    );
}
