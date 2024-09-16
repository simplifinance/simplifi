import React from 'react';
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Box from '@mui/material/Box';

const Liquidity = () => {
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    if(location.pathname === '/liquidity'){
      navigate('open');
    }
  });

  return (
    <Box className="h-screen">
      <Outlet />
    </Box>
  )
}

export default Liquidity