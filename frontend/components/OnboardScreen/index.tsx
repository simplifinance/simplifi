import React from 'react';
import Image from 'next/image';
import { MotionDivWrap } from '../MotionDivWrap';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils'
import { flexCenter } from '@/constants';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
// import { fadeStyle } from '../topComponents/finance/Create/forms/transactionStatus/PopUp';
import Stack from '@mui/material/Stack';

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
    <div className='relative flex flex-col justify-center h-screen p-4 md:p-0'>
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
      <Container maxWidth={"xs"} className={`${!displaySwipeable? "bg-orange" : "bg-white1"} p-4 rounded-3xl absolute right-0 left-0 `} >
        {
          !displaySwipeable? 
            <MotionDivWrap className={`place-content-center`} >
              <Image src="/logoSimplifi.png" alt="SimplifiLogo" height={250} width={250} />
            </MotionDivWrap> 
              : 
            <MotionDivWrap className='w-full h-[400px]'>
              <Stack className='place-items-center space-y-4'>
                <AutoSwipeableViews>
                  {
                    SWIPEABLE_CONTENTS.map(({imageComponent, title, description}, i) => (
                      <Stack className={`${flexCenter} place-items-center`} key={i}>
                        {imageComponent}
                        <Stack className={`text-center w-[80%]`}>
                          <h1 className='text-lg font-bold'>{title}</h1>
                          <p className='text-center text-gray-400'>{description}</p>
                        </Stack>
                      </Stack>
                    ))
                  }
                </AutoSwipeableViews>
                <button onClick={exitOnboardScreen} className='w-[70%] p-4  bg-orangec text-yellow-100 rounded-full text-wh font-extrabold hover:bg-yellow-200 hover:text-orangec'>Get Started</button>
              </Stack>
            </MotionDivWrap>
        }
      </Container>
    </div>
  )
}

const SWIPEABLE_CONTENTS = [
  {
    title: "Welcome to Simplifinance",
    description: "The application brings you the full power of decentralization and allows you to earn in multiple ways",
    imageComponent: <Image src="/blockchain.svg" alt="Decentralization" height={180} width={180}/>,
    buttonContent: "Get Started"
  },
  {
    title: "Peer-Funding, Lending And Borrowing",
    description: "Enjoy the super benefits of lending and borrowing assets, via a decentralized stucture and staking",
    imageComponent: <Image src="/Group2.svg" alt="Peer-Funding" height={200} width={200}/>,
    buttonContent: "Get Started"
  },
  {
    title: "Collateral Maximization",
    description: "Maximize your collateral leveraging our aggregrated yield strategies",
    imageComponent: <Image src="/Group32.svg" alt="Invest" height={200} width={200}/>,
    buttonContent: "Get Started"
  }
]