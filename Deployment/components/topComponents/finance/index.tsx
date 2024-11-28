import React from 'react';
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Box from '@mui/material/Box';
import { getEpoches } from '@/apis/read/readContract';
import { useAccount, useConfig } from 'wagmi';
import useAppStorage from '@/components/StateContextProvider/useAppStorage';

const Liquidity : React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setstate } = useAppStorage();

  React.useEffect(() => {
    if(location.pathname === '/flexpool'){
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
          setstate({pools});
        }
        fetchData();
      }
    }, 6000);
    return () => {
      clearTimeout(6000);
      ctrl.abort();
    };
  }, [isConnected, connector, config, setstate]);

  return (
    <Box className='w-full'>
      <Outlet />
    </Box>
  )
}

export default Liquidity