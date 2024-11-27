import React from 'react';
import Image from 'next/image';
import { MotionDivWrap } from '../MotionDivWrap';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils'
import { flexCenter } from '@/constants';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import { CustomButton } from '../ActionButton';
import SwipeableInfo from './SwipeableInfo';

export default function OnbaordScreen ({exitOnboardScreen} : {exitOnboardScreen : () => void}) {
  const [displaySwipeable, activateSwipeable] = React.useState<boolean>(false);
  const AutoSwipeableViews = autoPlay(SwipeableViews);

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
        <img
          src="images/hero/hero-bg1.png"
          alt="background image"
          className=""
        />
        <img
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

const SWIPEABLE_CONTENTS = [
  {
    title: "Welcome to Simplifinance",
    description: <div>
      <p>{"Experience the power of flexible finance,"}</p>
      <p>{"while earning in multiple ways"}</p>
    </div>,
    imageComponent: <Image src="/blockchain.svg" alt="Decentralization" height={150} width={150}/>,
  },
  {
    title: "Peer-Funding",
    description: <p>{"Enjoy the super benefits of lending and borrowing assets, through a decentralized p2p structure, with near-zero interest"}</p>,
    imageComponent: <Image src="/Group2.svg" alt="Peer-Funding" height={200} width={200}/>,
  },
  {
    title: "Collateral Maximization",
    description: <p>{"Maximize your collateral leveraging our aggregrated yield strategies"}</p>,
    imageComponent: <Image src="/Group32.svg" alt="Invest" height={200} width={200}/>,
  }
]