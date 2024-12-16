import { Box, Collapse, } from '@mui/material'
import React from 'react'
import { flexSpread, } from '@/constants';
import { NavLink, useLocation } from 'react-router-dom';
import useAppStorage from '../StateContextProvider/useAppStorage';

export interface CollapsibleProps {
  collapsedClassName?: string;
  parentPath: string;
  parentLinkActive: boolean;
  collapsible?: boolean;
  displayChevron?: boolean;
  parentTitle: string;
  icon: React.JSX.Element;
  setParentActiveLink: (arg:string) => void;
  children?: React.ReactNode;
}

interface ChevronProps {
  open: boolean;
  hideChevron?: boolean;
}

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

export const Collapsible = (props: CollapsibleProps) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const { 
    collapsedClassName, 
    parentPath, 
    parentLinkActive,
    parentTitle,
    collapsible,
    icon,
    displayChevron,
    setParentActiveLink,
    children 
  } = props;
  const { toggleSidebar, showSidebar } = useAppStorage();
  const location = useLocation();

  return (
    <Box className="p-1">
      <NavLink 
        onClick={
          () => {
            setOpen(!open);
            if(parentPath !== "/flexpool"){
              toggleSidebar();
            } else {
              if(location.pathname !== "/flexpool/open"){
                toggleSidebar();
              }
            }
            }
          } 
        to={parentPath} 
        style={
          ({isActive}) => {
            if(isActive) {
              setParentActiveLink(parentPath);
            }
              return {}
          }
        } 
      >
        <div className='relative md:hidden'>
          <button className='w-[60px] p-3 border flex flex-col justify-center items-center border-gray1/50 bg-gray1/70 rounded-full hover:bg-stone-400/40 active:ring1 active:shadow active:shadow-white1/40'>
            { icon }
            <h1 className='text-xs text-stone-300/70'>{ parentTitle }</h1>
          </button>
        </div>
        <div className={`hidden md:flex gap-1 p-3 ${parentLinkActive? 'bg-green1 text-orangec font-semibold rounded-[56px] border-b-4 border-b-orangec' : 'hover:bg-green1 rounded-[56px]'}`}>
          <span className='border border-white1/5 rounded-full p-2 bg-green1/70'>{ icon }</span>
          <button onClick={() => setOpen(!open)} className={`w-full ${flexSpread} ${parentLinkActive? '': 'text-white1'} gap-2 p-1 `}>
            <h1 className={`text-xl`}>{ parentTitle }</h1>
            {
              displayChevron && 
              <Chevron open={open} />
            }
          </button> 
        </div>
      </NavLink>
      {
        collapsible && 
          <Collapse in={open} timeout="auto" unmountOnExit className={collapsedClassName || 'w-full'}>
            { children && children }
          </Collapse>
      }
    </Box>
  )
}

// export const showSidebarWhenSmall = () => {
//   const sidebar = document.getElementById('sidebar');
//   sidebar?.classList.toggle('show');
// }