import * as React from "react";
import Layout from "../Layout";
import { MotionDivWrap } from "../utilities/MotionDivWrap";
import type { Path } from "@/interfaces";
// import Dashboard from "./InitialPopUp";
import FlexPool from "./FlexPool";
import Yield from "./Yield";
import Faq from "./Faq";
import AiAssist from "./AiAssist";
import CreateFlexpool from "./FlexPool/Create";

export default function AppFeatures({currentPath}:{currentPath: Path}) {
  return(
    <Layout>
      <MotionDivWrap className={`minHeight relative`}>
        {
          (
            [
              {
                location: 0,
                element: ( <FlexPool /> ),
                path: 'Flexpool' 
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


// {
//   location: 0,
//   element: ( <Dashboard /> ),
//   path: 'Dashboard' 
// },