import React from 'react';
import { flexSpread } from '@/constants';
import Link from 'next/link';
import useAppStorage from '@/components/contexts/StateContextProvider/useAppStorage';
import { ConnectWallet } from '@/components/utilities/ConnectWallet';
import { ModeToggler } from '@/components/utilities/ModeToggler';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { topBarContent } from '../LeftSidebar';

export default function Navbar() {
  const { showSidebar, toggleSidebar, setActivepath, activePath } = useAppStorage();
  return(
    <nav className={`${flexSpread} dark:bg-green1 md:border-b  border-b-green1/20 dark:border-b-white1/20 p-4 z-50 bg-white1`}>
      <div className='hidden md:block w-2/4'>
        <Link href="/" passHref>
          <Image 
            src="/logoSimplifi.png"
            alt="Projectlogo"
            width={100} 
            height={100}
          />
        </Link>
      </div>
      <div className='hidden md:flex gap-3 items-center'>
        {
          topBarContent.map(({path, title}) => (
            <Button variant={'ghost'} key={path} onClick={() => setActivepath(path)} className={`uppercase font-semibold text-green1/60 dark:text-white2 ${activePath === path? 'border-b-4 border-b-green1/50 dark:border-b-orange-200' : ''} text-xs opacity-80`}>
              { title }
            </Button>
          ))
        }
        <Link href={'https://simplifinance.gitbook.io/docs'} className='uppercase font-semibold text-green1/60 text-xs dark:text-white2 opacity-80'>
          Doc
        </Link>
      </div>
      <div className={`flex justify-between md:w-full md:justify-end w-full md:px-4 lg:gap-4`}>
        <button className='md:hidden hover:text-orange-400' onClick={() => toggleSidebar(!showSidebar)}>
          <h1 hidden={showSidebar} className="ring-1 ring-orange-200 p-2 rounded-full bg-gray1 focus:ring-orange-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-orange-200">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </h1>
          <h1 hidden={!showSidebar} className="ring-1 ring-orange-200 p-2 rounded-full bg-gray1 focus:ring-orange-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-orange-200">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </h1>
        </button> 
        <ConnectWallet />
        <ModeToggler />
      </div>
    </nav>
  );
}

