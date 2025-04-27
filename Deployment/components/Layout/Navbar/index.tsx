import React from 'react';
import { flexSpread } from '@/constants';
import Link from 'next/link';
import Typed from 'react-typed';
import useAppStorage from '@/components/contexts/StateContextProvider/useAppStorage';
import { ConnectWallet } from '@/components/utilities/ConnectWallet';
import { ModeToggler } from '@/components/utilities/ModeToggler';
import Image from 'next/image';

export default function Navbar() {
  const { showSidebar, toggleSidebar } = useAppStorage();
  return(
    <nav className={`${flexSpread} relativ dark:bg-green1 md:border-b  border-b-green1/30 dark:border-b-white1/20 p-4 z-50 bg-white1`}>
      <div className='hidden w-full md:flex justify-between items-center'>
        <Link href="/" passHref>
          <Image 
            src="/logoSimplifi.png"
            alt="Projectlogo"
            width={100} 
            height={100}
          />
        </Link>
        <div className='hidden md:block absolute left-[20%] bg-green1 border border-green1/30 min-w-[500px] text-white1 dark:bg-white1 px-3 py-2 rounded-xl dark:text-green1 font-bold'>
          <Typed 
            strings={['Warning! This is testnet version', 'Warning! Coins and/or Tokens used are not real', 'Warning! Do not send or use real token']}
            className='text-md'
            typeSpeed={100} backSpeed={100} loop showCursor={false}              
          />                     
        </div>
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
