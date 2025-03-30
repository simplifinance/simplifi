import React from "react";
import Box from "@mui/material/Box";
import Image from 'next/image';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils'
import { flexCenter, flexSpread, ROUTE_ENUM,} from '@/constants';
// import useAppStorage from "../../contexts/StateContextProvider/useAppStorage";
// import OnboardUser from "./OnboardUser";
import OnboardWrapperDiv from "./OnboardWrapper";
import { Button } from "@/components/ui/button";
import { useAccount, useConnect } from "wagmi";
import { useNavigate } from "react-router-dom";

export default function SwipeableInfo() { 
  const AutoSwipeableViews = autoPlay(SwipeableViews);
  // const { toggleDisplayOnboardUser, displayOnboardUser, } = useAppStorage();
  const { isConnected, connector } = useAccount();
  const { connectAsync } = useConnect();
  const navigate = useNavigate();

  const handleNavigate = () => navigate(ROUTE_ENUM.AIASSIST);

  // Try route user to flexpool dashboard if they're connected otherwise, connect their wallet first and reroute them
  const handleGetStarted = async() => {
    if(isConnected) navigate(ROUTE_ENUM.FLEXPOOL);
    else {
      try {
        if(connector) await connectAsync({connector})
          .then((res) => {
            if(res.accounts.length > 0) navigate(ROUTE_ENUM.FLEXPOOL);
        });
      } catch (error) {
        alert('Unable to connect wallet')
      }
    }
  }

  return(
    <div className="dark:bg-green1 p-8 rounded-xl">
      {
        <OnboardWrapperDiv overrideClassName="bg-wh borde border-green1/2 dark:bg-[#2e3231 shadow-m shadow-gree">
            <AutoSwipeableViews >
              {
                SWIPEABLE_CONTENTS.map(({imageComponent, title, description}, i) => (
                    <Box className={`${flexCenter} flex-col place-items-center p-4 space-y-4`} key={i}>
                      {imageComponent}
                      <Box className={`text-md text-green1/80 space-y-2 text-center`}>
                        <p className='text-xl md:text-2xl font-bold dark:text-orange-300'>{title}</p>
                        <p className='text-md md:text-lg text-center dark:text-orange-100'>{ description }</p>
                      </Box>
                    </Box>
                ))
              }
            </AutoSwipeableViews>
            <div className={`${flexSpread} gap-4`}>
              <Button onClick={handleNavigate} className="w-full">Try AI Assist</Button>
              <Button onClick={handleGetStarted} className="w-full">Get Started</Button>
            </div>
          </OnboardWrapperDiv>
      }
    </div>
  );
}


const SWIPEABLE_CONTENTS = [
    {
      title: "Simplicity And Flexibility",
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