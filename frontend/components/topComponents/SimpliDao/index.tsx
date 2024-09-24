import React from "react";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import ProgressBar from "../../customProgress/Progress";
import { useNavigate } from "react-router-dom";
import { ROUTE_ENUM } from "@/constants";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  // width: 400,
  // border: "0.1em solid #fff",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3
};

function SimpliDao(): JSX.Element {
  const [modalPop, popModal] = React.useState(false);
  const closeModal = () => popModal(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    popModal(true);
    setTimeout(() => {
      popModal(false);
      navigate(ROUTE_ENUM.OPEN);
    }, 5000);
  }, []);

  return (
    <React.Fragment>
      <Modal open={modalPop} onClose={closeModal} aria-labelledby="child-modal-title" aria-describedby="child-modal-description">
        <Stack sx={{ ...style }} onClick={() => navigate(ROUTE_ENUM.DASHBOARD)} className="text-xl text-center place-items-center text-orangec font-semibold">
          <h3 className="text-2xl">Simplifi Decentralized Autonomaus Community</h3>
          <h3>...in development</h3>
          <ProgressBar inProgress={0} />
        </Stack>
      </Modal>
    </React.Fragment>
  );
}

export default SimpliDao;
