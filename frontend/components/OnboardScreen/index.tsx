import React from 'react';
import { MotionDivWrap } from '../MotionDivWrap';
import Box from '@mui/material/Box';
// import Container from '@mui/material/Container';
import SwipeableInfo from './SwipeableInfo';
import { commonStyle } from '@/utilities';
import Image from 'next/image';

export default function OnbaordScreen ({exitOnboardScreen} : {exitOnboardScreen : () => void}) {
  const [displaySwipeable, activateSwipeable] = React.useState<boolean>(false);

  React.useEffect(() => {
    setTimeout(() => {
      activateSwipeable(true);
    }, 5000);
    return () => {
      clearTimeout(5000);
    }
  }, []);

  return (
    <div className='relative flex flex-col justify-center h-screen w-full'>
      <div className="absolute flex z-0 justify-between w-full top-[-5rem]">
        <Image
          width={500}
          height={500}
          src="/images/hero/hero-bg1.png"
          alt="background image"
          className=""
        />
        <Image
          width={500}
          height={500}
          src="/images/hero/hero-bg2.png"
          alt="background image"
          className="hidden lg:flex right-0 absolute"
        />
      </div>
      <Box sx={commonStyle({})}>
        {
          !displaySwipeable? 
            <MotionDivWrap className='bg-transparent'>
              <span className='hidden md:inline-block'>
                <img src="/logoSimplifi.png" alt="SimplifiLogo"/>
              </span>
              <span className='md:hidden text-green1 flex justify-center items-center'>
                <img src="/favicon.ico" alt="SimplifiLogo" className=''/>
                <p>SimpliFi</p>
              </span>
            </MotionDivWrap> 
              : 
            <SwipeableInfo />
        }
      </Box>
    </div>
  )
}
