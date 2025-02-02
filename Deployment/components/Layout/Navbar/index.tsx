import React from 'react';
import { flexSpread } from '@/constants';
import Link from 'next/link';
import Typed from 'react-typed';
import useAppStorage from '@/components/StateContextProvider/useAppStorage';
import { ConnectWallet } from '@/components/ConnectWallet';

export default function Navbar() {
    const { showSidebar, toggleSidebar } = useAppStorage();
    return(
        <nav className={`${flexSpread} bg-green1 p-4 z-50`}>
          <div className='hidden w-full md:flex justify-between items-center'>
            <Link href="/" passHref>
                <img 
                    src="/logoSimplifi.png"
                    alt="Simiplifi-logo"
                    width={100} 
                    height={100}
                />
            </Link>
            <Typed 
              strings={['Warning! This is testnet version', 'Warning! Coins and/or Tokens used are not real', 'Warning! Do not send or use real token']}
              className='text-red-400 font-extrabold bg-gray1 px-3 py-2 rounded-full text-sm'
              typeSpeed={100} backSpeed={100} loop showCursor={false}              
            />                     
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
          </div>
        </nav>
    );
}
