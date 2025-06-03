import React from "react";
import { flexSpread } from "@/constants";
import Collapse from "@mui/material/Collapse";
import { faqContent } from "./content";
import { PlusMinusIcons } from "@/components/utilities/Icons";
import { MotionDivWrap } from "@/components/utilities/MotionDivWrap";

const Content = ({title, content, subparagraph} : {title: React.ReactNode, content: React.ReactNode, subparagraph: React.ReactNode}) => {
  const [open, setOpen] = React.useState<boolean>(false);
  return(
    <React.Fragment>
      <button onClick={() => setOpen(!open)} className={`w-full ${flexSpread} p-3 hover:bg-white1 text-green1/80 dark:hover:bg-green1 hover:text-orangec/50 dark:hover:text-white1 rounded-t-md focus:bg-green1/50 focus:text-white1 dark:text-orange-200`}>
        <span className={`text font-bold ${open && "dark:text-orange-300 font-bold"}`}>{ title }</span>
        <PlusMinusIcons open={open} />
      </button> 
      <Collapse in={open} timeout="auto" unmountOnExit className={'w-full '}>
        <div className="text-green1 dark:text-white1/80 bg:orange-200 rounded-b-xl text-lg p-8">
          <span>{content}</span>
          <span>{subparagraph}</span>
        </div>
      </Collapse>
    </React.Fragment>
  );
}

export default function Faq(){
  return (
    <MotionDivWrap className="p-4">
      {
        faqContent.map(({title, content, subparagraph}, i) => (
          <Content {...{title, content, subparagraph}} key={i} />            
        ))
      }
    </MotionDivWrap>
  )
}
