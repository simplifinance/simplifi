import React from "react";
import useAppStorage from "@/components/contexts/StateContextProvider/useAppStorage";
import { routeEnum } from "@/constants";
import { Path } from "@/interfaces";
// import OnchainStatistics from "@/components/AppFeatures/OnchainStatistics";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LeftSidebar() {
  // const emptyPath : Path = '';
  const { showSidebar, activePath, setActivepath, toggleSidebar } = useAppStorage();
    
  const handleClick = (path: Path) => {
    setActivepath(path);
    const timeoutObj = setTimeout(() => toggleSidebar(false), 500);
    clearTimeout(timeoutObj);
  };
 
  return(
    <aside className={`${!showSidebar? 'hidden' : 'flex max-w-xs'} z-50`}>
      <div className={`flex flex-col justify-start items-start text-start bg-white1 dark:bg-green1/90 border-r border-r-green1/30 dark:border-r-gray1 place-items-center space-y-4 pt-4`}>
        {
          topBarContent.map(({path, title }) => (
            <Button variant={'ghost'} key={title} onClick={() => handleClick(path)} className={`uppercase font-semibold text-green1/60 dark:text-white2 ${activePath === path? 'border-b-4 border-b-green1/50 dark:border-b-orange-200' : ''} text-xs opacity-80`}>
              { title }
            </Button>
            )
          )
        }
        <Link href={'https://simplifinance.gitbook.io/docs'} className='uppercase font-semibold text-green1/40 text-xs pl-4'>
          Doc
        </Link>
      </div>
    </aside>
  );
}

export const topBarContent : {
  title: string, 
  path: Path
}[] = Array.from([
  {
    title: 'Dashboard',
    path: routeEnum.DASHBOARD
  },
  {
    title: 'Providers',
    path: routeEnum.PROVIDERS
  },
  {
    title: 'Create',
    path: routeEnum.CREATE
  },
  {
    title: 'Faq',
    path: routeEnum.FAQ
  },
]);

// {
  //   title: 'Dashboard',
  //   path: routeEnum.DASHBOARD,
  //   displayChevron: false,
  //   icon: 
  //     <svg key={0} width="20" height="20" viewBox="0 0 20 20" fill="#000" xmlns="http://www.w3.org/2000/svg" className=''>
  //       <path d="M19.4603 8.69904C19.4598 8.69858 19.4594 8.69812 19.4589 8.69766L11.3005 0.539551C10.9527 0.19165 10.4904 0 9.99862 0C9.50682 0 9.04448 0.191498 8.69658 0.539398L0.54244 8.69339C0.539693 8.69614 0.536947 8.69904 0.5342 8.70178C-0.179911 9.42001 -0.17869 10.5853 0.53771 11.3017C0.865011 11.6292 1.29729 11.8188 1.75948 11.8387C1.77825 11.8405 1.79717 11.8414 1.81624 11.8414H2.14141V17.8453C2.14141 19.0334 3.10805 20 4.29641 20H7.48824C7.81173 20 8.07418 19.7377 8.07418 19.4141V14.707C8.07418 14.1649 8.51516 13.7239 9.0573 13.7239H10.9399C11.4821 13.7239 11.9231 14.1649 11.9231 14.707V19.4141C11.9231 19.7377 12.1854 20 12.509 20H15.7008C16.8892 20 17.8558 19.0334 17.8558 17.8453V11.8414H18.1573C18.649 11.8414 19.1113 11.6499 19.4594 11.302C20.1765 10.5844 20.1768 9.41711 19.4603 8.69904Z" fill="#000" />
  //     </svg>
// },
  // {
  //   title: 'Yield',
  //   path: routeEnum.YIELD,
  //   displayChevron: false,
  //   icon: 
  //     <svg key={2} width="20" height="20" viewBox="0 0 20 20" fill="#000" xmlns="http://www.w3.org/2000/svg">
  //     <path d="M5.25 15.125L2.625 17.82V10.0833H5.25V15.125ZM9.625 13.4383L8.25125 12.21L7 13.42V6.41667H9.625V13.4383ZM14 11.9167L11.375 14.6667V2.75H14V11.9167ZM16.4588 11.7425L14.875 10.0833H19.25V14.6667L17.6838 13.0258L11.375 19.58L8.33875 16.8117L5.03125 20.1667H2.625L8.28625 14.355L11.375 17.0867" fill="#000"/>
  //   </svg>
  // },
  // {
  //   title: 'AiAssist',
  //   path: routeEnum.AIASSIST,
  //   displayChevron: false,
  //   icon: 
  //     <svg key={3} width="20" height="20" viewBox="0 0 20 20" fill="#000" xmlns="http://www.w3.org/2000/svg">
  //     <path d="M0 3H20V15H19.25C19.25 13.21 17.79 11.75 16 11.75C14.69 11.75 13.58 12.54 13.06 13.66C12.81 13.56 12.54 13.5 12.25 13.5C11.27 13.5 10.45 14.13 10.14 15H0V3ZM8.37 6.11C8.31 6.26 8.27 6.42 8.26 6.58C8.25 6.74 8.25 6.91 8.27 7.08L8.29 7.16C8.3 7.22 8.31 7.3 8.34 7.39C8.36 7.49 8.4 7.59 8.44 7.7C8.47 7.81 8.53 7.92 8.59 8.03C8.66 8.15 8.74 8.25 8.82 8.34C8.9 8.43 9 8.51 9.13 8.57C9.25 8.63 9.38 8.66 9.53 8.66C9.67 8.66 9.8 8.63 9.92 8.57C10.04 8.51 10.14 8.43 10.22 8.35C10.31 8.26 10.38 8.15 10.44 8.03C10.51 7.91 10.56 7.8 10.6 7.7C10.64 7.6 10.67 7.5 10.69 7.39C10.72 7.28 10.73 7.21 10.74 7.17C10.75 7.13 10.75 7.1 10.75 7.08C10.8 6.79 10.78 6.52 10.71 6.26C10.64 6 10.5 5.78 10.3 5.6C10.09 5.42 9.83 5.33 9.51 5.33C9.32 5.33 9.15 5.36 8.99 5.43C8.84 5.5 8.71 5.59 8.61 5.71C8.52 5.82 8.44 5.96 8.37 6.11ZM12.85 12.15V11.01C12.85 10.68 12.75 10.35 12.56 10.03C12.37 9.71 12.11 9.44 11.79 9.24C11.47 9.03 11.13 8.93 10.77 8.93L9.53 9.77L8.25 8.95C7.88 8.95 7.53 9.05 7.21 9.25C6.9 9.45 6.65 9.71 6.47 10.02C6.29 10.34 6.2 10.67 6.2 11.01V12.15L6.38 12.2C6.5 12.24 6.67 12.28 6.89 12.34C7.12 12.39 7.36 12.44 7.63 12.49C7.89 12.54 8.2 12.58 8.54 12.62C8.88 12.65 9.21 12.67 9.53 12.67C9.83 12.67 10.16 12.65 10.51 12.62C10.85 12.58 11.15 12.54 11.4 12.49C11.65 12.45 11.9 12.39 12.16 12.33L12.66 12.21C12.74 12.19 12.8 12.17 12.85 12.15ZM16 12.25C17.52 12.25 18.75 13.48 18.75 15C18.75 16.52 17.52 17.75 16 17.75C15.27 17.75 14.62 17.45 14.13 16.98C14.4558 16.4875 14.5735 15.8861 14.4573 15.3071C14.3412 14.7281 14.0006 14.2187 13.51 13.89C13.94 12.93 14.88 12.25 16 12.25ZM10.5 15.75C10.5 14.79 11.29 14 12.25 14C13.21 14 14 14.79 14 15.75C14 16.71 13.21 17.5 12.25 17.5C11.29 17.5 10.5 16.71 10.5 15.75Z" fill="#000" />
  //   </svg>
  // },

  // {
  //   prevPaths.length > 0 && 
  //     <Button variant={'ghost'} onClick={() => setActivepath(emptyPath)} className="absolute top-0 right-0">
  //       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3.5} stroke="currentColor" className="size-6 dark:text-orange-200">
  //         <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
  //       </svg>
  //     </Button>
  // }