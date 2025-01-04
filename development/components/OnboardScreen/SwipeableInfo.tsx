import React from "react";
import Box from "@mui/material/Box";
import Image from 'next/image';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils'
import { flexCenter,} from '@/constants';
import ButtonTemplate from "./ButtonTemplate";
import useAppStorage from "../StateContextProvider/useAppStorage";
import OnboardUser from "./OnboardUser";
import OnboardWrapperDiv from "./OnboardWrapper";

export default function SwipeableInfo() {
  const AutoSwipeableViews = autoPlay(SwipeableViews);
  const { displayOnboardUser, } = useAppStorage();

  return(
    <React.Fragment>
      {
        displayOnboardUser? <OnboardUser /> : <OnboardWrapperDiv>
            <AutoSwipeableViews>
              {
                SWIPEABLE_CONTENTS.map(({imageComponent, title, description}, i) => (
                    <Box className={`${flexCenter} flex-col place-items-center space-y-4`} key={i}>
                      {imageComponent}
                      <Box className={`text-md text-orange-300 space-y-2 flex flex-col text-center justify-center items-center`}>
                        <p className='md:text-xl font-black max-w-[300px]'>{title}</p>
                        <p className='md:text-lg max-w-[200px] sm:max-w-[250px] md:max-w-[300px] lg:max-w-[400px] overflow-hidden'>{ description }</p>
                      </Box>
                    </Box>
                ))
              }
            </AutoSwipeableViews>
            <ButtonTemplate 
              buttonAContent="Onboard Me" 
              buttonBContent="Let Me In"
              disableButtonA={false}
              disableButtonB={false}
              overrideClassName="text-orange-200"
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