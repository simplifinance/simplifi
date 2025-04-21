import Box from '@mui/material/Box'
import React from 'react'
import useAppStorage from '../../contexts/StateContextProvider/useAppStorage';
import { useAccount } from 'wagmi';
import { routeEnum } from '@/constants';
import { Path } from '@/interfaces';

export const Collapsible = ({ path, title, icon, disabled }: CollapsibleProps) => {
  const { toggleSidebar, togglePopUp, activePath, setActivepath } = useAppStorage();
  const { isConnected } = useAccount()
  const isActivePath = activePath === path;
  
  const handleClick = () => {
    let popUp = false;
    setActivepath(path);
    // if(!isConnected) {
    //   if(activePath === routeEnum.FLEXPOOL){
    //     setActivepath(routeEnum.DASHBOARD);
    //     popUp = true;
    //   } else {
    //     if(path === 'Faq' || path === 'Dashboard'){
    //       setActivepath(path);
    //     } else {
    //       popUp = true;
    //     }
    //   }
    //   popUp && togglePopUp(1);
    // } else {
    //   setActivepath(path);
    // }
    setTimeout(() => toggleSidebar(false), 500);
    clearTimeout(500);
  }
  
  return (
    <Box className="p-1">
      <div className=''>
        <div className='relative md:hidden'>
          <button disabled={false} onClick={handleClick} className='w-[60px] p-3 border flex flex-col justify-center items-center border-gray1/50 bg-gray1/70 rounded-full hover:bg-stone-400/40 active:ring1 active:shadow active:shadow-white1/40'>
            { icon }
            <h1 className='text-xs text-green1 dark:text-white1'>{ title }</h1>
          </button>
        </div>
        <button disabled={false} onClick={handleClick} className={`hidden w-full rounded-xl md:flex gap-3 p-[10px] text-lg font-semibold border border-green1/40 ${isActivePath? 'font-bold bg-gray1 dark:bg-white1 text-white1 dark:text-green1' : 'border border-gray1/50 dark:border-green1/20 text-green1 dark:text-white1 hover:bg-green1 hover:text-white1'}`}>
          <span className='p-3 border border-green1/50 dark:border-none rounded-full bg-orangec'>{ icon }</span>
          <h1 className={` p-1 `}>{ title }</h1>
        </button>
      </div>
    </Box>
  )
}

interface CollapsibleProps {
  path: Path;
  title: string;
  icon: React.JSX.Element;
  disabled: boolean;
}
