import React from "react";
import Container from "@mui/material/Container";
import { useNavigate } from "react-router-dom";
import { flexSpread, ROUTE_ENUM } from "@/constants";
import Collapse from "@mui/material/Collapse";
import { faqContent } from "./content";
import { Chevron } from "@/components/Collapsible";

const Content = ({title, content, subparagraph} : {title: React.ReactNode, content: React.ReactNode, subparagraph: React.ReactNode}) => {
  const [open, setOpen] = React.useState<boolean>(false);

  return(
    <div>
      <button onClick={() => setOpen(!open)} className={`w-full ${flexSpread} p-3 bg-gray1 md:border border-green1 rounded-md hover:bg-gray1/50 focus:bg-gray1/50`}>
        <span className={`text-md`}>{ title }</span>
        <Chevron open={open} />
      </button> 
      <Collapse in={open} timeout="auto" unmountOnExit className={'w-full '}>
        <div className="text-orange-100 border border-green1 rounded-b-[26px] md:rounded-b-none md:border-none p-4 bg-green1 md:bg-transparent">
          <span>{content}</span>
          <span>{subparagraph}</span>
        </div>
      </Collapse>
    </div>
  );
}

function Faq(): JSX.Element {
  return (
    <div className="md:bg-green1 w-full text-orange-200 md:p-4 md:rounded-[26px]">
      {
        faqContent.map(({title, content, subparagraph}, i) => (
          <Content {...{title, content, subparagraph}} key={i} />            
        ))
      }
    </div>
  );
}

export default Faq;
