import React from "react";
import Image from 'next/image';
import { flexSpread, } from '@/constants';
import { Button } from "@/components/ui/button";
import { useAccount, } from "wagmi";
import useAppStorage from "@/components/contexts/StateContextProvider/useAppStorage";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { MotionDivWrap } from "@/components/utilities/MotionDivWrap";

export default function Dashboard() {
  const { isConnected, } = useAccount();
  const { setActivepath } = useAppStorage();

  const { connectModalOpen, openConnectModal } = useConnectModal();
  const handleNavigate = () => setActivepath("AiAssist");

  // Try route user to flexpool dashboard if they're connected otherwise, connect their wallet first and reroute them
  const handleGetStarted = async() => {
    if(isConnected) setActivepath("Flexpool");
    else {
      if(!connectModalOpen) openConnectModal?.();
    }
  }

  return(
    <div className=" md:border-none p-4 md:p-8 space-y-4">
      <MotionDivWrap className="space-y-4">
        {
          swipeableContent.map(({imageComponent, title, description}, i) => (
              <div key={i} className="grid grid-cols-2 border border-green1/30 p-4 rounded-lg ">
                <div className="">
                  {imageComponent}
                </div>
                <div className={`text-md text-green1/80 space-y-2 text-`}>
                  <p className='text-xl md:text-2xl font-bold dark:text-orange-300'>{title}</p>
                  <p className='text-m dark:text-orange-100'>{ description }</p>
                </div>
              </div>
          ))
        }
      </MotionDivWrap>
      <MotionDivWrap className={`${flexSpread} gap-4`}>
        <Button onClick={handleNavigate} className="w-full">Try AI Assist</Button>
        <Button onClick={handleGetStarted} className="w-full">Get Started</Button>
      </MotionDivWrap>
    </div>
  );
}
// className={`${flexCenter} flex-col place-items-center p-4 space-y-4`}
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
];
