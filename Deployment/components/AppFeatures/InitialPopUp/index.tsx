import React from "react";
import Image from 'next/image';
// import { flexSpread, } from '@/constants';
import { Button } from "@/components/ui/button";
// import { useAccount, } from "wagmi";
import useAppStorage from "@/components/contexts/StateContextProvider/useAppStorage";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { MotionDivWrap } from "@/components/utilities/MotionDivWrap";
import DialogBox from "@/components/utilities/DialogBox";

export default function InitialPopUp() {
  // const { isConnected, } = useAccount();
  const { setActivepath } = useAppStorage();
  
  // const { connectModalOpen, openConnectModal } = useConnectModal();
  const handleNavigate = () => setActivepath("AiAssist");
  
  // Try route user to flexpool dashboard if they're connected otherwise, connect their wallet first and reroute them
  // const handleGetStarted = async() => {
  //   if(isConnected) setActivepath("Flexpool");
  //   else {
  //     if(!connectModalOpen) openConnectModal?.();
  //   }
  // }

  return(
    <DialogBox
      footerContent={
          <Button variant={'default'} onClick={handleNavigate} className="w-full">Try AI Assist</Button>
      }
    >
      <MotionDivWrap className="grid grid-cols-1 md:grid-cols-3 md:gap-2 md:border-none p-4 space-y-4 h-[400px] overflow-auto md:h-full md:overflow-clip ">
        {
          swipeableContent.map(({imageComponent, title, description}, i) => (
              <div key={i} className=" flex flex-col justify-evenly md:space-y-8 border border-green1/30 md:border-none p-4 rounded-lg h-[320px]">
                <div className="place-items-center p-4 rounded-lg h-[100px]">
                  {imageComponent}
                </div>
                <div className={`flex flex-col justify-start gap-4 items-baseline text-md text-green1/80 space-y-2 text-center h-[220px]`}>
                  <p className='text-xl font-bold dark:text-orange-300'>{title}</p>
                  <p className='dark:text-orange-100'>{ description }</p>
                </div>
              </div>
          ))
        }
      </MotionDivWrap>
    </DialogBox>
  );
}

const swipeableContent = [
  {
    title: "Simple and flexible",
    description: "Experience the power of flexible finance, while earning in multiple ways",
    imageComponent: <Image src="/blockchain.svg" alt="Decentralization" height={100} width={100}/>,
  },
  {
    title: "Peer-Funding mechanism",
    description: "Through a p2p contribution strategy, we provide a near-zero interest credit system",
    imageComponent: <Image src="/Group2.svg" alt="Peer-Funding" height={100} width={100}/>,
  },
  {
    title: "Risk-free saving",
    description: "Deposit your idle stablecoins to finance Flexpool users to earn interest at your rate",
    imageComponent: <Image src="/Group32.svg" alt="Invest" height={100} width={100}/>,
  }
];
