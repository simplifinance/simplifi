import React from "react";
import Container from "@mui/material/Container";
import useAppStorage from "@/components/StateContextProvider/useAppStorage";

function SimpliDao(): JSX.Element {
  const { setActivepath } = useAppStorage();
  React.useEffect(() => {
    setTimeout(() => {
      setActivepath('/flexpool');
    }, 2000);
  }, [setActivepath]);

  return (
    <Container maxWidth="xs" className="space-y-4 absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
      <div className="bg-green1 text-3xl text-center w-full h-[300px] flex justify-center items-center text-orange-300 p-4 rounded-[26px]">
        <h1 className="animate-pulse">{'...In Progress'}</h1>
      </div>
    </Container>
  );
}

export default SimpliDao;
