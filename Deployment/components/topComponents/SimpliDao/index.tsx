import React from "react";
import Container from "@mui/material/Container";
import { useNavigate } from "react-router-dom";
import { ROUTE_ENUM } from "@/constants";

function SimpliDao(): JSX.Element {
  const navigate = useNavigate();

  React.useEffect(() => {
    setTimeout(() => {
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
