import { Box, Collapse, Stack } from '@mui/material'
import React from 'react'
import { flexCenter, flexEnd, flexEven, flexSpread, flexStart } from '@/constants';

interface CollapsibleProps {
  collapsedClassName?: string;
  icon: React.ReactNode;
  title: string;
  linkActive?: boolean;
  collapsible: boolean;
  children: React.ReactNode;
}

interface ChevronProps {
  open: boolean;
  hideChevron: boolean;
}

const Chevron = (props: ChevronProps) => {
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
  const { title, collapsedClassName, icon, collapsible, linkActive, children } = props;
  // width: '70%',
  // borderRadius: '14px',
  // background: 'rgba(94, 90, 86, 0.9)'
  return (
    <React.Fragment>
      <Stack>
        <div className={`${linkActive? 'bg-orange-400 rounded-xl' : ''}`}>
          <div className={`w-[180px] ${flexStart} gap-3 p-3 ml-3 ${linkActive? 'bg-yellow-100 rounded-r-xl' : ''}`}>
            {icon}
            <div onClick={() => setOpen(!open)} className={`${flexSpread} text-lg ${linkActive? '': 'text-gray-400'} gap-2 cursor-pointer p-1 rounded`}>
              <h1 className={`text-xl font-`}>{ title }</h1>
              <Chevron open={open} hideChevron={!collapsible} />
            </div> 
          </div>
        </div>
        { collapsible? <Collapse in={open} timeout="auto" unmountOnExit className={collapsedClassName || 'w-full'}>{ children }</Collapse> : null }
      </Stack>
    </React.Fragment>
  )
}
