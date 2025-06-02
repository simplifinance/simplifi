import * as React from "react";
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import useAppStorage from "@/components/contexts/StateContextProvider/useAppStorage";
import { MotionDivWrap } from "@/components/utilities/MotionDivWrap";
import DialogBox from "@/components/utilities/DialogBox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function InitialPopUp() {
  const { setActivepath } = useAppStorage();
  const handleNavigate = () => setActivepath("AiAssist");
  const isLargeScreen = useMediaQuery('(min-width:768px)');

  return(
    <DialogBox
      footerContent={
        <Button variant={'default'} onClick={handleNavigate} className="w-full">Try AI Assist</Button>
      }
    >
      <MotionDivWrap className="">
        <Carousel 
          opts={{align: "start"}}
          orientation={'horizontal' }
        >
          <CarouselContent className="-mt-1 h-[300px] max-w-xs ">
            {
              swipeableContent.map(({title, description, imageComponent}) => (
                <CarouselItem key={title} className="pt-1 md:basis-3/3">
                  <div className="p-1">
                    <Card className="border-none">
                      <CardHeader>
                        <CardTitle className="text-center text-orangec dark:text-orange-300">{title}</CardTitle>
                      </CardHeader>
                      <CardContent className="aspect-square place-items-center space-y-4">
                        { imageComponent }
                        <h1 className="font-semibold text-center dark:text-orange-100">{description}</h1>
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
