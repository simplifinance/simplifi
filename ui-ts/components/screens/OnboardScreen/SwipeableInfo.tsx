import React from "react";
import Box from "@mui/material/Box";
import Image from 'next/image';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils'
import { flexCenter,} from '@/constants';
import ButtonTemplate from "./ButtonTemplate";
import useAppStorage from "../../contexts/StateContextProvider/useAppStorage";
import OnboardUser from "./OnboardUser";
import OnboardWrapperDiv from "./OnboardWrapper";

export default function SwipeableInfo() {
  const AutoSwipeableViews = autoPlay(SwipeableViews);
  const { displayOnboardUser, } = useAppStorage();

  return(
    <React.Fragment>
      {
        displayOnboardUser? <OnboardUser /> : <OnboardWrapperDiv overrideClassName="bg-white1 border border-green1/20 dark:bg-[#2e3231] shadow-md shadow-green1">
            <AutoSwipeableViews >
              {
                SWIPEABLE_CONTENTS.map(({imageComponent, title, description}, i) => (
                    <Box className={`${flexCenter} flex-col place-items-center p-4 space-y-4`} key={i}>
                      {imageComponent}
                      <Box className={`text-md text-green1/80 dark:text-orange-300 space-y-2  text-center`}>
                        <p className='text-xl md:text-2xl font-bold'>{title}</p>
                        <p className='text-md md:text-lg text-center'>{ description }</p>
                      </Box>
                    </Box>
                ))
              }
            </AutoSwipeableViews>
            <ButtonTemplate 
              buttonAContent="AI-Assist" 
              buttonBContent="Action-Based"
              disableButtonA={false}
              disableButtonB={false}
              overrideClassName="font-bold"
            />
          </OnboardWrapperDiv>
      }
    </React.Fragment>
  );
}


const SWIPEABLE_CONTENTS = [
    {
      title: "Welcome to Simplifinance",
      description: "Experience the power of flexible finance, while earning in multiple ways",
      imageComponent: <Image src="/blockchain.svg" alt="Decentralization" height={150} width={150}/>,
    },
    {
      title: "Peer-Funding",
      description: "Enjoy the super benefits of lending and borrowing assets, through a decentralized p2p structure, with near-zero interest",
      imageComponent: <Image src="/Group2.svg" alt="Peer-Funding" height={200} width={200}/>,
    },
    {
      title: "Collateral Maximization",
      description: "Maximize your collateral leveraging our aggregrated yield strategies",
      imageComponent: <Image src="/Group32.svg" alt="Invest" height={200} width={200}/>,
    }
]