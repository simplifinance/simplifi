import * as React from "react";
import Layout from "../Layout";
import { MotionDivWrap } from "../utilities/MotionDivWrap";
import type { Path } from "@/interfaces";
import FlexPool from "./FlexPool";
import Yield from "./Yield";
import Faq from "./Faq";
import AiAssist from "./AiAssist";
import CreateFlexpool from "./FlexPool/Create";
import Providers from "./Providers";
import OnchainStatistics from "./OnchainStatistics";

export default function AppFeatures({currentPath}:{currentPath: Path}) {
  return(
    <Layout>
      <MotionDivWrap className={`minHeight relative`}>
        {
          (
            [
              {
                location: 0,
                element: ( <FlexPool showMyPool={true} allPools={false} padding="p-4" /> ),
                path: 'Dashboard' 
              },
              {
                location: 1,
                element: ( <CreateFlexpool /> ),
                path: 'CreateFlexpool'
              },
              {
                location: 2,
                element: ( <AiAssist /> ),
                path: "AiAssist" 
              },
              { 
                location: 3,
                element: ( <Yield /> ),
                path: 'Yield'
              },
              {
                location: 4,
                element: ( <Faq /> ),
                path: 'Faq' 
              },
              {
                location: 5,
                element: ( <Providers /> ),
                path: 'Providers' 
              },
              {
                location: 6,
                element: ( <OnchainStatistics /> ),
                path: 'Home' 
              },
            ] as const
          ).filter(({path}) => path === currentPath)
          .map(({location, element}) => (
            <React.Fragment key={location}>
              { element }
            </React.Fragment>
          ))
        }
      </MotionDivWrap>
    </Layout>
  );
}
