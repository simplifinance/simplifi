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
    <div className={``}>
      <button onClick={() => setOpen(!open)} className={`w-full ${flexSpread} p-3 bg-gray1 border border-green1 rounded-md hover:bg-gray1/50 focus:bg-gray1/50`}>
        <h1 className={`text-md`}>{ title }</h1>
        <Chevron open={open} />
      </button> 
      <Collapse in={open} timeout="auto" unmountOnExit className={'w-full'}>
        <div className="p-4 text-orange-100">
          <span>{content}</span>
          <span>{subparagraph}</span>
        </div>
      </Collapse>
    </div>
  );
}

function Faq(): JSX.Element {
  const navigate = useNavigate();

  React.useEffect(() => {
    setTimeout(() => {
      // navigate(ROUTE_ENUM.OPEN);
    }, 10000);
  }, [navigate]);

  return (
    <div className="bg-green1 w-full text-orange-200 p-4 rounded-[26px]">
      {
        faqContent.map(({title, content, subparagraph}, i) => (
          <Content {...{title, content, subparagraph}} key={i} />            
        ))
      }
    </div>
  );
}

export default Faq;
