import { Box, Collapse, } from '@mui/material'
import React from 'react'
import { flexSpread, } from '@/constants';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import useAppStorage from '../StateContextProvider/useAppStorage';
// import { useAccount } from 'wagmi';

// export const showSidebarWhenSmall = () => {
//   const sidebar = document.getElementById('sidebar');
//   sidebar?.classList.toggle('show');
// }

export interface CollapsibleProps {
  collapsedClassName?: string;
  parentPath: string;
  parentLinkActive: boolean;
  collapsible?: boolean;
  displayChevron?: boolean;
  parentTitle: string;
  icon: React.JSX.Element;
  // setIcon: (arg:string, isActive: boolean) => React.JSX.Element;
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
        {/* <div className={` ${parentLinkActive? 'bg-orangec rounded-lg' : 'underlineFromLeft'}`}>
        </div> */}
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

// const setIcon = (selector: string, isActive: boolean) => {
//   const iconsUrl = ['dashboard', 'flexpool', 'yield', 'simplidao', 'faq'];
//   // 'dashboard': 
//   // 'flexpool': 
//   // 'yeild': 
//   // 'simplidao': 
//   // 'faq': 
//   const icons = [
//       <svg key={0} width="20" height="20" viewBox="0 0 20 20" fill="#D1F3DC" xmlns="http://www.w3.org/2000/svg" className='text-orangec'>
//         <path stroke='#D1F3DC' d="M19.4603 8.69904C19.4598 8.69858 19.4594 8.69812 19.4589 8.69766L11.3005 0.539551C10.9527 0.19165 10.4904 0 9.99862 0C9.50682 0 9.04448 0.191498 8.69658 0.539398L0.54244 8.69339C0.539693 8.69614 0.536947 8.69904 0.5342 8.70178C-0.179911 9.42001 -0.17869 10.5853 0.53771 11.3017C0.865011 11.6292 1.29729 11.8188 1.75948 11.8387C1.77825 11.8405 1.79717 11.8414 1.81624 11.8414H2.14141V17.8453C2.14141 19.0334 3.10805 20 4.29641 20H7.48824C7.81173 20 8.07418 19.7377 8.07418 19.4141V14.707C8.07418 14.1649 8.51516 13.7239 9.0573 13.7239H10.9399C11.4821 13.7239 11.9231 14.1649 11.9231 14.707V19.4141C11.9231 19.7377 12.1854 20 12.509 20H15.7008C16.8892 20 17.8558 19.0334 17.8558 17.8453V11.8414H18.1573C18.649 11.8414 19.1113 11.6499 19.4594 11.302C20.1765 10.5844 20.1768 9.41711 19.4603 8.69904Z" fill="#D1F3DC" />
//       </svg>,

//       <svg key={1} width="20" height="20" viewBox="0 0 20 20" fill={`${isActive? "rgba(0, 0, 0, 0.7)" : "rgba(255, 255, 255, 0.3)"}`} xmlns="http://www.w3.org/2000/svg">
//         <path d="M2.86719 21.4849H22.1359V14.6631L2.86719 21.4849ZM3.8724 19.6292L11.6797 11.8229L14.3401 14.4834L22.1359 6.68753V12.4459L3.8724 19.6292ZM16.3333 6.68701H22.1359H16.3333Z" fill={`${isActive? "rgba(0, 0, 0, 0.7)" : "rgba(255, 255, 255, 0.3)"}`}/>
//         <path d="M16.3333 6.68701H22.1359M2.86719 21.4849H22.1359V14.6631L2.86719 21.4849ZM3.8724 19.6292L11.6797 11.8229L14.3401 14.4834L22.1359 6.68753V12.4459L3.8724 19.6292Z" stroke={`${isActive? "rgba(0, 0, 0, 0.7)" : "rgba(255, 255, 255, 0.3)"}`} strokeLinecap="round" strokeLinejoin="round"/>
//         <path d="M8.56588 6.45947H3.99922C3.37186 6.45947 2.86328 6.96805 2.86328 7.59541V11.2392C2.86328 11.8665 3.37186 12.3751 3.99922 12.3751H8.56588C9.19324 12.3751 9.70182 11.8665 9.70182 11.2392V7.59541C9.70182 6.96805 9.19324 6.45947 8.56588 6.45947Z" stroke={`${isActive? "rgba(0, 0, 0, 0.7)" : "rgba(255, 255, 255, 0.3)"}`} strokeLinecap="round" strokeLinejoin="round"/>
//         <path d="M2.86328 10.403H8.10651M4.45807 8.43115H9.7013H4.45807Z" stroke={`${isActive? "rgba(0, 0, 0, 0.7)" : "rgba(255, 255, 255, 0.3)"}`} strokeLinecap="round" strokeLinejoin="round"/>
//         <path d="M6.27865 5.4318C6.80792 5.4318 7.23698 5.00274 7.23698 4.47347C7.23698 3.9442 6.80792 3.51514 6.27865 3.51514C5.74937 3.51514 5.32031 3.9442 5.32031 4.47347C5.32031 5.00274 5.74937 5.4318 6.27865 5.4318Z" stroke={`${isActive? "rgba(0, 0, 0, 0.7)" : "rgba(255, 255, 255, 0.3)"}`} strokeLinecap="round" strokeLinejoin="round"/>
//       </svg>,
//       <svg key={2} width="20" height="20" viewBox="0 0 20 20" fill={`${isActive? "rgba(0, 0, 0, 0.7)" : "rgba(255, 255, 255, 0.3)"}`} xmlns="http://www.w3.org/2000/svg">
//         <path d="M5.25 15.125L2.625 17.82V10.0833H5.25V15.125ZM9.625 13.4383L8.25125 12.21L7 13.42V6.41667H9.625V13.4383ZM14 11.9167L11.375 14.6667V2.75H14V11.9167ZM16.4588 11.7425L14.875 10.0833H19.25V14.6667L17.6838 13.0258L11.375 19.58L8.33875 16.8117L5.03125 20.1667H2.625L8.28625 14.355L11.375 17.0867" fill={`${isActive? "rgba(0, 0, 0, 0.7)" : "rgba(255, 255, 255, 0.3)"}`}/>
//       </svg>,
//       <svg key={3} width="20" height="20" viewBox="0 0 20 20" fill={`${isActive? "rgba(0, 0, 0, 0.7)" : "rgba(255, 255, 255, 0.3)"}`} xmlns="http://www.w3.org/2000/svg">
//         <path d="M0 3H20V15H19.25C19.25 13.21 17.79 11.75 16 11.75C14.69 11.75 13.58 12.54 13.06 13.66C12.81 13.56 12.54 13.5 12.25 13.5C11.27 13.5 10.45 14.13 10.14 15H0V3ZM8.37 6.11C8.31 6.26 8.27 6.42 8.26 6.58C8.25 6.74 8.25 6.91 8.27 7.08L8.29 7.16C8.3 7.22 8.31 7.3 8.34 7.39C8.36 7.49 8.4 7.59 8.44 7.7C8.47 7.81 8.53 7.92 8.59 8.03C8.66 8.15 8.74 8.25 8.82 8.34C8.9 8.43 9 8.51 9.13 8.57C9.25 8.63 9.38 8.66 9.53 8.66C9.67 8.66 9.8 8.63 9.92 8.57C10.04 8.51 10.14 8.43 10.22 8.35C10.31 8.26 10.38 8.15 10.44 8.03C10.51 7.91 10.56 7.8 10.6 7.7C10.64 7.6 10.67 7.5 10.69 7.39C10.72 7.28 10.73 7.21 10.74 7.17C10.75 7.13 10.75 7.1 10.75 7.08C10.8 6.79 10.78 6.52 10.71 6.26C10.64 6 10.5 5.78 10.3 5.6C10.09 5.42 9.83 5.33 9.51 5.33C9.32 5.33 9.15 5.36 8.99 5.43C8.84 5.5 8.71 5.59 8.61 5.71C8.52 5.82 8.44 5.96 8.37 6.11ZM12.85 12.15V11.01C12.85 10.68 12.75 10.35 12.56 10.03C12.37 9.71 12.11 9.44 11.79 9.24C11.47 9.03 11.13 8.93 10.77 8.93L9.53 9.77L8.25 8.95C7.88 8.95 7.53 9.05 7.21 9.25C6.9 9.45 6.65 9.71 6.47 10.02C6.29 10.34 6.2 10.67 6.2 11.01V12.15L6.38 12.2C6.5 12.24 6.67 12.28 6.89 12.34C7.12 12.39 7.36 12.44 7.63 12.49C7.89 12.54 8.2 12.58 8.54 12.62C8.88 12.65 9.21 12.67 9.53 12.67C9.83 12.67 10.16 12.65 10.51 12.62C10.85 12.58 11.15 12.54 11.4 12.49C11.65 12.45 11.9 12.39 12.16 12.33L12.66 12.21C12.74 12.19 12.8 12.17 12.85 12.15ZM16 12.25C17.52 12.25 18.75 13.48 18.75 15C18.75 16.52 17.52 17.75 16 17.75C15.27 17.75 14.62 17.45 14.13 16.98C14.4558 16.4875 14.5735 15.8861 14.4573 15.3071C14.3412 14.7281 14.0006 14.2187 13.51 13.89C13.94 12.93 14.88 12.25 16 12.25ZM10.5 15.75C10.5 14.79 11.29 14 12.25 14C13.21 14 14 14.79 14 15.75C14 16.71 13.21 17.5 12.25 17.5C11.29 17.5 10.5 16.71 10.5 15.75Z" fill={`${isActive? "rgba(0, 0, 0, 0.7)" : "rgba(255, 255, 255, 0.2)"}`}/>
//       </svg>,
//       <svg key={4} width="20" height="20" viewBox="0 0 20 20" fill={`${isActive? "rgba(0, 0, 0, 0.7)" : "rgba(255, 255, 255, 0.3)"}`} xmlns="http://www.w3.org/2000/svg">
//         <path d="M1.91797 6C1.91797 6 3.35547 4 6.70964 4C10.0638 4 11.5013 6 11.5013 6V20C11.5013 20 10.0638 19 6.70964 19C3.35547 19 1.91797 20 1.91797 20V6ZM11.5013 6C11.5013 6 12.9388 4 16.293 4C19.6471 4 21.0846 6 21.0846 6V20C21.0846 20 19.6471 19 16.293 19C12.9388 19 11.5013 20 11.5013 20V6Z" fill={`${isActive? "rgba(0, 0, 0, 0.7)" : "rgba(255, 255, 255, 0.3)"}`} stroke={`${isActive? "rgba(0, 0, 0, 0.7)" : "rgba(255, 255, 255, 0.3)"}`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//       </svg>
//   ];
//   return icons[iconsUrl.indexOf(selector)];
// }