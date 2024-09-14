import React from 'react';
import Image from 'next/image';
import { MotionDivWrap } from '../MotionDivWrap';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils'
import { flexCenter } from '@/constants';
// import { useNavigate } from 'react-router-dom';

export default function OnbaordScreen ({exitOnboardScreen} : {exitOnboardScreen : () => void}) {
  const [displaySwipeable, activateSwipeable] = React.useState<boolean>(false);
  // const [index, setIndex] = React.useState<number>(0);
  // const navigate = useNavigate();
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
            <Image src="/LogoFinal.svg" alt="QuatreLogo" height={300} width={300} />
          </MotionDivWrap> 
            : 
          <MotionDivWrap className='bg-white '>
            <div className='w-full h-full flex flex-col justify-center items-center space-y-8'>
              {/* <div className='flex justify-end py-2'>
                <button onClick={exitOnboardScreen} className='bg-stone-900 bg-opacity-50 p-3 rounded-2xl hover:bg-opacity-70 '>skip</button>
              </div> */}
              <AutoSwipeableViews>
                {
                  SWIPEABLE_CONTENTS.map((item, i) => (
                    <div className={`${flexCenter} flex-col space-y-8`} key={i}>
                      {item.imageComponent}
                      <div className={`${flexCenter} flex-col w-[80%] text-center`}>
                        <h1 className='text-lg font-bold'>{item.title}</h1>
                        <p className='text-center text-gray-400'>{item.description}</p>
                      </div>
                      {/* <div className={`${flexCenter} flex-col leading-8 my-4 `}>
                      </div> */}
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