import React from 'react';
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Box from '@mui/material/Box';
import { getEpoches } from '@/apis/readContract';
import { PROFILE_MOCK } from '@/constants';
import { useAccount, useConfig } from 'wagmi';
import { TrxnResult } from '@/interfaces';

const Liquidity : React.FC<{setstate: (arg: TrxnResult) => void}> = ({setstate}) => {
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    if(location.pathname === '/liquidity'){
      navigate('open');
    }
  });

  const { isConnected, connector } = useAccount();
  const config = useConfig();

  React.useEffect(() => {
    const ctrl = new AbortController();
    setTimeout(() => {
      if(isConnected && connector) {
        const fetchData = async() => {
          const pools = await getEpoches({
            config
          });
          setstate({profile: PROFILE_MOCK, pools});
        }
        fetchData();
      }
    }, 5000);
    return () => {
      clearTimeout(50000);
      ctrl.abort();
    };
  }, [isConnected, connector, config, setstate]);

  return (
    <Box className="h-screen">
      <Outlet />
    </Box>
  )
}

export default Liquidity