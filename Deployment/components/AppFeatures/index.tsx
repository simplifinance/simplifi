import * as React from "react";
import Layout from "../Layout";
import { MotionDivWrap } from "../utilities/common/MotionDivWrap";
import type { Path, CustomNode } from "@/interfaces";
import Dashboard from "./Dashboard";
import FlexPool from "./FlexPool";
import Yield from "./Yield";
import SimpliDao from "./SimpliDao";
import Faq from "./Faq";
import AiAssist from "./AiAssist";
import CreateFlexpool from "./FlexPool/Create";


export default function AppFeatures({currentPath}:{currentPath: Path}) {
  return(
    <Layout>
      <MotionDivWrap className={`minHeight md:bg-white1 md:dark:bg-gray1 md:rounded-2xl md:border border-green1/30 md:dark:border-gray1 relative flex justify-center items-center`}>
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
      element: ( <Yield /> ),
      path: 'Yield'
    },
    {
      location: 3,
      element: ( <SimpliDao /> ),
      path: 'Dao'
    },
    {
      location: 4,
      element: ( <Faq /> ),
      path: 'Faq' 
    },
    {
      location: 5,
      element: ( <AiAssist /> ),
      path: "AiAssist" 
    },
    {
      location: 6,
      element: ( <CreateFlexpool /> ),
      path: 'CreateFlexpool'
    },
]);
    