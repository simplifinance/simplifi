import React from 'react';
import Image from 'next/image';
import { MotionDivWrap } from '../MotionDivWrap';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils'
import { flexCenter } from '@/constants';
import Container from '@mui/material/Container';
import { fadeStyle } from '../topComponents/finance/Create/forms/transactionStatus/PopUp';
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
    <Container maxWidth={"xs"} className='bg-white1 py-4 px-2 rounded-3xl' style={fadeStyle()}>
      {
        !displaySwipeable? 
          <MotionDivWrap className={`w-full h-[400px] ${flexCenter} `} >
            <Image src="/logoSimplifi.png" alt="SimplifiLogo" height={250} width={250} />
          </MotionDivWrap> 
            : 
          <MotionDivWrap className=' w-full h-[400px] p'>
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
              <button onClick={exitOnboardScreen} className='w-[70%] p-4 bg-yellow-200 text-orangec border border-orangec rounded-full text-wh font-extrabold hover:bg-orangec hover:text-yellow-100'>Get Started</button>
            </Stack>
          </MotionDivWrap>
      }
    </Container>
  )
}

const SWIPEABLE_CONTENTS = [
  {
    title: "Welcome to Quatre Digesu",
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
    title: "Invest Easily With A Click",
    description: "Maximize your loans by leveraging our aggregrated clickable investment dashboards",
    imageComponent: <Image src="/Group32.svg" alt="Invest" height={200} width={200}/>,
    buttonContent: "Get Started"
  }
]