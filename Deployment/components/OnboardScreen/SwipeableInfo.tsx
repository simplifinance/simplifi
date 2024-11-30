import React from "react";
import Stack from "@mui/material/Stack";
import Image from 'next/image';
import { MotionDivWrap } from '../MotionDivWrap';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils'
import { flexCenter } from '@/constants';
import { CustomButton } from '../ActionButton';
import useAppStorage from "../StateContextProvider/useAppStorage";

export default function SwipeableInfo() {
    const AutoSwipeableViews = autoPlay(SwipeableViews);
    const { exitOnboardScreen } = useAppStorage();
    return(
      <MotionDivWrap className='bg-white1 p-6'>
        <Stack className='place-items-center space-y-4'>
          <AutoSwipeableViews>
            {
              SWIPEABLE_CONTENTS.map(({imageComponent, title, description}, i) => (
                  <Stack className={`${flexCenter} place-items-center`} key={i}>
                    {imageComponent}
                    <Stack className={`text-center `}>
                      <h1 className='text-lg font-bold text-gray-700'>{title}</h1>
                      <span className='text-gray-400'>{ description }</span>
                    </Stack>
                  </Stack>
              ))
            }
          </AutoSwipeableViews>
          <CustomButton buttonText='Get Started' handleClick={exitOnboardScreen} overrideStyle="bg-orangec text-yellow-100 rounded-full font-extrabold hover:bg-yellow-200 hover:text-orangec w-[60%] md:w-[80%]" />
        </Stack>
      </MotionDivWrap>
    );
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