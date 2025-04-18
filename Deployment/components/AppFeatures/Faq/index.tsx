import React from "react";
import { flexSpread } from "@/constants";
import Collapse from "@mui/material/Collapse";
import { faqContent } from "./content";
import { PlusMinusIcons } from "@/components/utilities/Icons";

const Content = ({title, content, subparagraph} : {title: React.ReactNode, content: React.ReactNode, subparagraph: React.ReactNode}) => {
  const [open, setOpen] = React.useState<boolean>(false);
  return(
    <React.Fragment>
      <button onClick={() => setOpen(!open)} className={`w-full ${flexSpread} p-3 hover:bg-green1 hover:text-white1 rounded-t-md focus:bg-green1 focus:text-white1 text-green1 dark:text-white1`}>
        <span className={`text-lg  dark:text-white2/90 ${open && "dark:text-orange-300 font-bold"}`}>{ title }</span>
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
    <div className="w-full md:p-4 md:rounded-xl dark:bg-green">
      {
        faqContent.map(({title, content, subparagraph}, i) => (
          <Content {...{title, content, subparagraph}} key={i} />            
        ))
      }
    </div>
  )
}
