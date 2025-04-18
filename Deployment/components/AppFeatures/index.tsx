import * as React from "react";
import Layout from "../Layout";
import { MotionDivWrap } from "../utilities/MotionDivWrap";
import type { Path, CustomNode } from "@/interfaces";
import Dashboard from "./Dashboard";
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
          appChildren.filter(({path}) => path === currentPath)
          .map(({location, element}) => (
            <React.Fragment key={location}>
              {
                element
              }
            </React.Fragment>
          ))
        }
      </MotionDivWrap>
    </Layout>
  );
}

export const appChildren : CustomNode[] = Array.from([
    {
      location: 0,
      element: ( <Dashboard /> ),
      path: 'Dashboard' 
    },
    {
      location: 1,
      element: ( <FlexPool /> ),
      path: 'Flexpool' 
    },
    {
      location: 2,
      element: ( <CreateFlexpool /> ),
      path: 'CreateFlexpool'
    },
    {
      location: 3,
      element: ( <AiAssist /> ),
      path: "AiAssist" 
    },
    { 
      location: 4,
      element: ( <Yield /> ),
      path: 'Yield'
    },
    {
      location: 5,
      element: ( <Faq /> ),
      path: 'Faq' 
    },
  ]);
  
  // {
  //   location: 3,
  //   element: ( <SimpliDao /> ),
  //   path: 'Dao'
  // },