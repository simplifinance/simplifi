import React from "react";
// import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
// import ProgressBar from "../../customProgress/Progress";
import { useNavigate } from "react-router-dom";
import { ROUTE_ENUM } from "@/constants";
// import { PopUp } from "../finance/Create/forms/transactionStatus/PopUp";

// const style = {
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   // width: 400,
//   // border: "0.1em solid #fff",
//   boxShadow: 24,
//   pt: 2,
//   px: 4,
//   pb: 3
// };

function SimpliDao(): JSX.Element {
  // const [modalOpen, popModal] = React.useState(false);
  // const handleModalClose = () => popModal(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    // popModal(true);
    setTimeout(() => {
      // popModal(false);
      navigate(ROUTE_ENUM.OPEN);
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

export default SimpliDao;
