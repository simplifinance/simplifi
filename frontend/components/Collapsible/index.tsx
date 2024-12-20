import { Box, Collapse, } from '@mui/material'
import React from 'react'
import { flexSpread, } from '@/constants';
import useAppStorage from '../StateContextProvider/useAppStorage';
import { useMediaQuery } from '@mui/material';
import { Path } from '@/interfaces';

export const Chevron = (props: ChevronProps) => {
  const { open, hideChevron } = props;

  return (
    <React.Fragment>
      {
        !hideChevron? 
        open ? (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>  
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
      </svg>      
    ) : null
      }
    </React.Fragment>
  )
}

// interface ActiveState {
//   : 
// }
export const Collapsible = (props: CollapsibleProps) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const { toggleSidebar, activePath, setActivepath} = useAppStorage();
  const isLargeScreen = useMediaQuery('(min-width:768px)');

  const { 
    collapsedClassName, 
    parentPath, 
    parentTitle,
    collapsible,
    icon,
    displayChevron,
    children 
  } = props;

  const isParentActive = activePath === parentPath;
  const handleClick = () => {
    setActivepath(parentPath);
    if(displayChevron) setOpen(!open);
    // navigate(parentPath);
    // if(parentPath === ROUTE_ENUM.FLEXPOOL) {
    //   navigate(ROUTE_ENUM.OPEN);
    // } else {
    //   navigate(parentPath);
    // }
  }

  console.log("ActiePath", activePath)

  React.useEffect(() => {
    if(!isLargeScreen) {
      if(activePath !== '/flexpool'){
        toggleSidebar();
      } 
    }
  }, [activePath, isLargeScreen]);

  return (
    <Box className="p-1">
      <div onClick={handleClick} className='cursor-pointer'>
        <div className='relative md:hidden'>
          <button className='w-[60px] p-3 border flex flex-col justify-center items-center border-gray1/50 bg-gray1/70 rounded-full hover:bg-stone-400/40 active:ring1 active:shadow active:shadow-white1/40'>
            { icon }
            <h1 className='text-xs text-stone-300/70'>{ parentTitle }</h1>
          </button>
        </div>

        <div className={`hidden md:flex gap-3 p-[10px] text-lg font-semibold ${isParentActive? 'border border-green1 font-bold text-orange-300 rounded-full shadow-md shadow-green1 hover:shadow-sm hover:shadow-orange-200 animate-pulse ' : 'hover:bg-green1/60 text-white1/70 rounded-[56px]'}`}>
          <span className='border border-white1/5 rounded-full p-3 bg-green1/70'>{ icon }</span>
          <div className={`w-full ${flexSpread} gap-2 p-1 `}>
            <h1>{ parentTitle }</h1>
            {
              displayChevron && 
              <Chevron open={open} />
            }
          </div> 
        </div>
      </div>
      {
        collapsible && 
          <Collapse in={open} timeout="auto" unmountOnExit className={collapsedClassName || 'w-full'}>
            { children && children }
          </Collapse>
      }
    </Box>
  )
}

interface CollapsibleProps {
  collapsedClassName?: string;
  parentPath: Path;
  collapsible?: boolean;
  displayChevron?: boolean;
  parentTitle: string;
  icon: React.JSX.Element;
  children?: React.ReactNode;
}

interface ChevronProps {
  open: boolean;
  hideChevron?: boolean;
}

// export const showSidebarWhenSmall = () => {
//   const sidebar = document.getElementById('sidebar');
//   sidebar?.classList.toggle('show');
// }