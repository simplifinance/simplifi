import React from 'react';
import Image from 'next/image';
import { MotionDivWrap } from '../MotionDivWrap';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils'
import { flexCenter } from '@/constants';

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
    <div className='flex justify-center bg-black items-center h-full py-[50px]'>
      {
        !displaySwipeable? 
          <MotionDivWrap className='flex justify-center items-center rounded-3xl' >
            <Image src="/logoSimplifi.png" alt="SimplifiLogo" height={300} width={300} />
          </MotionDivWrap> 
            : 
          <MotionDivWrap className='bg-white '>
            <div className='w-full h-full flex flex-col justify-center items-center space-y-8'>
              <AutoSwipeableViews>
                {
                  SWIPEABLE_CONTENTS.map((item, i) => (
                    <div className={`${flexCenter} flex-col space-y-8`} key={i}>
                      {item.imageComponent}
                      <div className={`${flexCenter} flex-col w-[80%] text-center`}>
                        <h1 className='text-lg font-bold'>{item.title}</h1>
                        <p className='text-center text-gray-400'>{item.description}</p>
                      </div>
                    </div>
                  ))
                }
              </AutoSwipeableViews>
              <button onClick={exitOnboardScreen} className='w-[70%] h-16 bg-orange-500 rounded-full text-white font-semibold'>Get Started</button>
            </div>
          </MotionDivWrap>
      }
    </div>
  )
}

const SWIPEABLE_CONTENTS = [
  {
    title: "Welcome to Quatre Digesu",
    description: "The application brings you the full power of decentralization and allows you to earn in multiple ways",
    imageComponent: <Image src="/blockchain.svg" alt="Decentralization" height={200} width={200}/>,
    buttonContent: "Get Started"
  },
  {
    title: "Peer-Funding, Lending And Borrowing",
    description: "Enjoy the super benefits of lending and borrowing assets, via a decentralized stucture and staking",
    imageComponent: <Image src="/Group2.svg" alt="Peer-Funding" height={300} width={300}/>,
    buttonContent: "Get Started"
  },
  {
    title: "Invest Easily With A Click",
    description: "Maximize your loans by leveraging our aggregrated clickable investment dashboards",
    imageComponent: <Image src="/Group32.svg" alt="Invest" height={300} width={300}/>,
    buttonContent: "Get Started"
  }
]