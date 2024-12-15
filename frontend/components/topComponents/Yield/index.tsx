import React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import ProgressBar from "../../customProgress/Progress";
import { useNavigate } from "react-router-dom";
import { ROUTE_ENUM } from "@/constants";
import Container from "@mui/material/Container";
import { PopUp } from "../finance/Create/forms/transactionStatus/PopUp";
import OnboardWrapperDiv from "@/components/OnboardScreen/OnboardWrapper";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: '30%',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3
};

function Yield(): JSX.Element {
  // const [modalOpen, popModal] = React.useState(false);
  // const handleModalClose = () => popModal(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    // popModal(true);
    setTimeout(() => {
      // handleModalClose();
      navigate(ROUTE_ENUM.DASHBOARD);
    }, 10000);
  }, [navigate]);

  return (
    <Container maxWidth="xs" className="space-y-4 absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
      <div className="bg-green1 text-3xl text-center w-full h-[300px] flex justify-center items-center text-orange-300 p-4 rounded-[26px]">
        <h1 className="animate-pulse">{'...In Progress'}</h1>
      </div>
    </Container>
  );
}

export default Yield;

      // <Box sx={style} className="p-4 rounded-lg border border-white1/30 bg-white1/20 text-white1 shadow-lg shadow-yellow-400">
      //   <div className="w-full flex justify-end cursor-pointer" onClick={() => navigate(ROUTE_ENUM.DASHBOARD)}>
      //     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10 text-orangec hover:text-white1/70 active:ring-1 rounded-lg p-2">
      //       <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
      //     </svg>
      //   </div>
      //   <div className="text-center space-y-4">
      //     <h3 className="text-xl font-black text-orangec">Yield Strategy</h3>
      //     <p className="text-orange-200">...in development</p>
      //     {/* <ProgressBar inProgress={5} /> */}
      //   </div>
      // </Box>