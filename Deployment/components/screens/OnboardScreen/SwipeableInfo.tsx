import React from "react";
import Box from "@mui/material/Box";
import Image from 'next/image';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils'
import { flexCenter, flexSpread, } from '@/constants';
import OnboardWrapperDiv from "./OnboardWrapper";
import { Button } from "@/components/ui/button";
import { useAccount, useConnect } from "wagmi";
import useAppStorage from "@/components/contexts/StateContextProvider/useAppStorage";

export default function SwipeableInfo() {
  const AutoSwipeableViews = autoPlay(SwipeableViews);
  const { isConnected, connector } = useAccount();
  const { connectAsync } = useConnect();
  const { setActivepath } = useAppStorage();

  const handleNavigate = () => setActivepath("AiAssist");

  // Try route user to flexpool dashboard if they're connected otherwise, connect their wallet first and reroute them
  const handleGetStarted = async() => {
    if(isConnected) setActivepath("Flexpool");
    else {
      try {
        if(connector) await connectAsync({connector})
          .then((res) => {
            if(res.accounts.length > 0) setActivepath("Flexpool");
        });
      } catch (error) {
        alert('Unable to connect wallet')
      }
    }
  }

  return(
    <div className="bg-white1 dark:bg-green1 border border-gray1/50 md:border-none p-4 md:p-8 rounded-xl">
      {
        <OnboardWrapperDiv overrideClassName="shadow-m">
            <AutoSwipeableViews >
              {
                swipeableContent.map(({imageComponent, title, description}, i) => (
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

const swipeableContent = [
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