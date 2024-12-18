import React from "react";
import { Permissioned } from "./forms/Permissioned";
import { Permissionless } from "./forms/Permissionless";
import { flexSpread, flexStart } from "@/constants";
import { PoolType } from "@/interfaces";

export const Create : React.FC<{}> = () => {
    const [formType, setFormType] = React.useState<PoolType>('Permissionless');

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
            <div className="ml-4">
                <div className={`md:hidden w-[fit-content] ${flexStart} p-1 bg-green1 gap-4 rounded-full text-sm`}>
                    <button disabled={disablebutton} onClick={() => handleSwitch('Permissionless')} className={`${flexSpread} gap-2 ${disablebutton? 'bg-gray1' : 'bg-green1'} p-3 rounded-full ${!disablebutton && 'hover:shadow-sm hover:shadow-orange-200'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 text-orange-300">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                        </svg>
                    </button>
                    <button disabled={!disablebutton} onClick={() => handleSwitch('Permissioned')} className={`${flexSpread} gap-2 ${!disablebutton? 'bg-gray1' : 'bg-green1'} p-3 rounded-full ${disablebutton && 'hover:shadow-sm hover:shadow-orange-200'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 text-red-300">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                        </svg>
                    </button>
                </div>
            </div>
            <div className="ml-4">
                <div className={`hidden md:flex items-center w-[fit-content] p-1 bg-green1 gap-4 rounded-full text-sm uppercase`}>
                    <button disabled={disablebutton} onClick={() => handleSwitch('Permissionless')} className={`${flexSpread} gap-2 ${disablebutton? 'bg-gray1 shadow-sm shadow-orange-200' : 'bg-green1 hover:text-orangec'} p-2 rounded-full`}>
                        <h1>Permissionless</h1>
                        <h1 hidden={!disablebutton} className="bg-green1 p-2 rounded-full shadow-sm shadow-orange-200">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 text-orange-300">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                            </svg>
                        </h1>
                    </button>
                    <button disabled={!disablebutton} onClick={() => handleSwitch('Permissioned')} className={`${flexSpread} gap-2 ${!disablebutton? 'bg-gray1 shadow-sm shadow-orange-200' : 'bg-green1 hover:text-orangec'} p-2 rounded-full`}>
                        <h1>Permissioned</h1>
                        <h1 hidden={disablebutton} className="bg-green1 p-2 rounded-full shadow-sm shadow-orange-200">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 text-red-300">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                            </svg>
                        </h1>
                    </button>
                </div>
            </div>
            {
                renderForm() 
            }
        </React.Fragment>
    );
}
