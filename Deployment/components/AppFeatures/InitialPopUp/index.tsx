import * as React from "react";
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import useAppStorage from "@/components/contexts/StateContextProvider/useAppStorage";
import { MotionDivWrap } from "@/components/utilities/MotionDivWrap";
import DialogBox from "@/components/utilities/DialogBox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
// import useMediaQuery from "@mui/material/useMediaQuery";
import { flexCenter, flexSpread } from "@/constants";
import Link from "next/link";

export default function InitialPopUp() {
  const { setActivepath } = useAppStorage();
  const handleNavigate = () => setActivepath("AiAssist");
  // const isLargeScreen = useMediaQuery('(min-width:768px)');

  return(
    <DialogBox
      footerContent={
        <Button variant={'default'} onClick={handleNavigate} className="w-full">Try AI Assist</Button>
      }
      description="Get personalized assistance with your financial tasks"
    >
      <MotionDivWrap>
        <Carousel 
          opts={{align: "start"}}
          orientation={'horizontal' }
        >
          <div className='space-y-2'>
            <div className={`${flexSpread} md:dark:bg-green1 md:border md:border-green1/20 md:p-4 md:rounded-xl`}>
              <h1 className='text-2xl text-green1/90 dark:text-orange-300 font-semibold md:font-black'>Welcome to Simplifi!</h1>
              <Button className={`${flexSpread} gap-4 max-w-sm text-sm`}>
                <Link href={'https://simplifinance.gitbook.io/docs'}>How it works</Link>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </Button>
            </div>
            <div className=' bg-white2 dark:bg-green1/80 border-2 border-dashed p-2 rounded-lg text-xs md:text-sm text-green1/80 dark:text-white1 space-y-2'>
              <h3 className='md:text-xl font-semibold text-orange-700 dark:text-orange-300 flex justify-start items-center gap-4'>
                {/* <span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                  </svg>
                </span> */}
                {`Simplifi is live!`}
              </h3>
              <p className="font-semibold">Participate in onchain activities and social tasks to earn points which are convertible to SIMPL Token on mainnet</p>
            </div>
          </div> 
          <CarouselContent className="h-[250px] max-w-xs ">
            {
              swipeableContent.map(({title, description, imageComponent}) => (
                <CarouselItem key={title} className="pt-1 md:basis-3/3">
                  <div className="p-1">
                    <Card className="border-none">
                      <CardHeader>
                        <CardTitle className="text-center text-lg md:text-2xl font-bold md:font-black text-orange-700 dark:text-orange-300">{title}</CardTitle>
                      </CardHeader>
                      <CardContent className="place-items-center space-y-2">
                        <div className={`${flexCenter}`}>
                          { imageComponent }
                        </div>
                        <h1 className="md:font-semibold text-center text-green1/80 dark:text-orange-100 text-md">{description}</h1>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))
            }
          </CarouselContent>
          <CarouselPrevious className="-left-6" />
          <CarouselNext className="-right-5" />
        </Carousel>
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
