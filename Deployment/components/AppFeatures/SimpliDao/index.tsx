import React from "react";
import Container from "@mui/material/Container";
import useAppStorage from "@/components/contexts/StateContextProvider/useAppStorage";
import { CustomNode } from "@/interfaces";
import FlexPool from "../FlexPool";

export default function SimpliDao() {
  const { addNode } = useAppStorage();
  React.useEffect(() => {
    setTimeout(() => {
      addNode({type: 'Current', item: FlexPool()});
    }, 2000);
  }, [addNode]);

  return(
    <Container maxWidth="xs" className="space-y-4 absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
      <div className="bg-green1 text-3xl text-center w-full h-[300px] flex justify-center items-center text-orange-300 p-4 rounded-[26px]">
        <h1 className="animate-pulse">{'...In Progress'}</h1>
      </div>
    </Container>
  );
}
