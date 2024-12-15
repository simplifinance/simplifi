import React from "react";
// import SearchInput from "../SearchInput";
import { ConnectButton } from "@rainbow-me/rainbowkit";
// import { useLocation } from "react-router-dom";
import { flexSpread } from "@/constants";
import Link from 'next/link';
import useAppStorage from "@/components/StateContextProvider/useAppStorage";
import { ConnectWallet } from "@/components/ConnectWallet";

export default function Navbar() {
    const { showSidebar, toggleSidebar } = useAppStorage();
    // const location = useLocation().pathname;

    return(
        <nav className={`${flexSpread} bg-green1 p-[22px] z-50`}>
          <div className='hidden md:block'>
            <Link href="/" passHref>
                <img 
                    src="/logoSimplifi.png"
                    alt="Simiplifi-logo"
                    width={100} 
                    height={100}
                />
            </Link>
            {/* <button className='w-[fit-content] border-4 border-white1/20 py-2 px-4 rounded-lg text- font-bold text-white1/50'>{ `${location[1]?.toUpperCase()}${location?.substring(2, location.length)}` }</button> */}
          </div>
          <div className={`flex justify-between md:w-full lg:justify-end w-full md:px-4 lg:gap-4`}>
            <button className='md:hidden hover:text-orange-400' onClick={toggleSidebar}>
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
            {/* <ConnectButton 
              accountStatus={{
                smallScreen: 'avatar',
                largeScreen: 'full',
              }}
            /> */}
            {/* <SearchInput /> */}
            {/* <ModeSwitch lightMode={lightMode} toggleMode={toggleMode} /> */}
          </div>
        </nav>
    );
}
