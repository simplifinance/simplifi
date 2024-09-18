import { Box, Collapse, Stack } from '@mui/material'
import React from 'react'
import { flexCenter, flexEnd, flexEven, flexSpread, flexStart, ROUTE_ENUM } from '@/constants';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAccount } from 'wagmi';

export interface CollapsibleProps {
  collapsedClassName?: string;
  parentPath: string;
  parentLinkActive: boolean;
  collapsible?: boolean;
  displayChevron?: boolean;
  parentTitle: string;
  setIcon: (arg:string) => React.JSX.Element;
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
    displayChevron,
    setIcon,
    setParentActiveLink,
    children } = props;

  return (
    <Stack>
      <NavLink onClick={() => setOpen(!open)} to={parentPath} style={({isActive}) => {
        if(isActive) {
          setParentActiveLink(parentPath);
        }
        return {}
        }} 
      >
        <div className={`${parentLinkActive? 'bg-orangec rounded-xl' : ''}`}>
          <div className={`w-[180px] ${flexStart} gap-3 p-3 ml-3 ${parentLinkActive? 'bg-yellow-100 rounded-r-xl' : ''}`}>
            { setIcon(parentPath) }
            <div onClick={() => setOpen(!open)} className={`${flexSpread} text-lg ${parentLinkActive? '': 'text-gray-400'} gap-2 cursor-pointer p-1 rounded`}>
              <h1 className={`text-xl font-`}>{ parentTitle }</h1>
              {
                displayChevron && 
                  <Chevron open={open} />
              }
            </div> 
          </div>
        </div>
      </NavLink>
      {
        collapsible && 
          <Collapse in={open} timeout="auto" unmountOnExit className={collapsedClassName || 'w-full'}>
            { children && children }
          </Collapse>
      }
    </Stack>
  )
}
