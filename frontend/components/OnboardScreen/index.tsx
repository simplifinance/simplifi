import React from 'react';
import Image from 'next/image';
import { MotionDivWrap } from '../MotionDivWrap';
import Container from '@mui/material/Container';
import SwipeableInfo from './SwipeableInfo';

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
          width={100}
          height={100}
          src="images/hero/hero-bg1.png"
          alt="background image"
          className=""
        />
        <Image
          width={100}
          height={100}
          src="images/hero/hero-bg2.png"
          alt="background image"
          className="hidden lg:flex right-0 absolute"
        />
      </div>
      <Container maxWidth={"xs"} >
        {
          !displaySwipeable? 
            <MotionDivWrap><Image src="/logoSimplifi.png" alt="SimplifiLogo" height={250} width={250} /></MotionDivWrap> 
              : 
            <SwipeableInfo />
        }
      </Container>
    </div>
  )
}
