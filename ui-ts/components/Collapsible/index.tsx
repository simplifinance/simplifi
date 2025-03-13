import Box from '@mui/material/Box'
import React from 'react'
import { flexSpread, } from '@/constants';
import useAppStorage from '../StateContextProvider/useAppStorage';
import { Path } from '@/interfaces';
import { useAccount } from 'wagmi';


export const Collapsible = (props: CollapsibleProps) => {
  const { toggleSidebar, activePath, togglePopUp, setActivepath} = useAppStorage();
  const { isConnected } = useAccount()
  // const isLargeScreen = useMediaQuery('(min-width:768px)');

  const { 
    path, 
    title,
    icon,
    disabled
  } = props;
  
  const isActivePath = activePath === path;
  const handleClick = () => {
    if(!isConnected) {
      if(activePath === '/flexpool'){
        setActivepath('/dashboard');
      } else {
        if(path === 'faq' || path === '/dashboard'){
          setActivepath(path);
        }
      }
      togglePopUp(1);
    } else {
      setActivepath(path);
    }
    setTimeout(() => toggleSidebar(false), 500);
    clearTimeout(500);
  }

  return (
    <Box className="p-1">
      <div className=''>
        <div className='relative md:hidden'>
          <button disabled={disabled} onClick={handleClick} className='w-[60px] p-3 border flex flex-col justify-center items-center border-gray1/50 bg-gray1/70 rounded-full hover:bg-stone-400/40 active:ring1 active:shadow active:shadow-white1/40'>
            { icon }
            <h1 className='text-xs text-stone-300/70'>{ title }</h1>
          </button>
        </div>
        <button disabled={disabled} onClick={handleClick} className={`hidden w-full md:flex gap-3 p-[10px] text-lg font-semibold ${isActivePath? 'border border-green1 font-bold text-orange-300 rounded-full shadow-md shadow-green1 hover:shadow-sm hover:shadow-orange-200 animate-pulse ' : 'hover:bg-green1/60 text-white1/70 rounded-[56px]'}`}>
          <span className='border border-white1/5 rounded-full p-3 bg-green1/70'>{ icon }</span>
          <h1 className={` p-1 `}>{ title }</h1>
        </button>
      </div>
    </Box>
  )
}

interface CollapsibleProps {
  // collapsedClassName?: string;
  path: Path;
  // collapsible?: boolean;
  // displayChevron?: boolean;
  title: string;
  icon: React.JSX.Element;
  // children?: React.ReactNode;
  disabled: boolean;
}

interface ChevronProps {
  open: boolean;
  hideChevron?: boolean;
}

// export const showSidebarWhenSmall = () => {
//   const sidebar = document.getElementById('sidebar');
//   sidebar?.classList.toggle('show');
// }
{/* {
  displayChevron && 
  <Chevron open={false} />
} */}
  {/* {
    collapsible && 
      <Collapse in={false} timeout="auto" unmountOnExit className={collapsedClassName || 'w-full'}>
        { children && children }
      </Collapse>
  } */}