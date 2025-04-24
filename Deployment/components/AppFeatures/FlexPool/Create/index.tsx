import React from "react";
import { Permissioned } from "./forms/Permissioned";
import { Permissionless } from "./forms/Permissionless";
import { flexSpread, flexStart } from "@/constants";
import type { Router, } from "@/interfaces";
import { Button } from "@/components/ui/button";

export default function CreateFlexpool() {
  const [formType, setFormType] = React.useState<Router>('Permissionless');

  const disablebutton = formType === 'Permissionless';
  const handleSwitch = (arg: Router) => setFormType(arg);

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

  return (
    <div>
      <div className={`${flexSpread} pb-4 border-b-4 border-b-green1/90 dark:border-b-2`}>
        <div className={`md:hidden w-[fit-content] ${flexStart}`}>
          <Button disabled={disablebutton} onClick={() => handleSwitch('Permissionless')} className={`${flexSpread} gap-2 ${!disablebutton? 'bg-gray1 animate-pulse' : 'bg-green1'} p-3 rounded-full ${!disablebutton && 'hover:shadow-sm hover:shadow-orange-200'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 text-orange-300">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
          </Button>
          <Button disabled={!disablebutton} onClick={() => handleSwitch('Permissioned')} className={`${flexSpread} gap-2 ${disablebutton? 'bg-gray1 animate-pulse' : 'bg-green1'} p-3 rounded-full ${disablebutton && 'hover:shadow-sm hover:shadow-orange-200'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 text-red-300">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
          </Button>
        </div>
        <div className={`hidden md:flex items-center gap-2 w-[fit-content] text-xs uppercase`}>
          <Button variant={'outline'} disabled={disablebutton} onClick={() => handleSwitch('Permissionless')} className={`dark:bg-green1/90 dark:text-orange-300`}>
            Permissionless
          </Button>
          <Button variant={'outline'} disabled={!disablebutton} onClick={() => handleSwitch('Permissioned')} className={`dark:bg-green1/90 dark:text-orange-300`}>
            Permissioned
          </Button>
        </div>
      </div>
      <div className="p-4 border dark:border-none rounded-b-xl">{ renderForm() }</div>
    </div>
  );
}
