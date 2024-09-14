import React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { LiquidityInnerLinkEntry, Pools } from '@/interfaces';
import { Outlet, Route, Routes, useNavigate } from "react-router-dom"
import { ROUTE_ENUM } from '@/constants';
import { Closed } from './Closed';
import { Create } from './Create';
import { Open } from './Open';

const Liquidity = ({elementId, displayChild} : {elementId: LiquidityInnerLinkEntry, displayChild: boolean}) => {
  const [pools, setPools] = React.useState<Pools>();
  const renderChild = () => {
    const filteredChildElement = (
      [
        {
          id: 'Create',
          element: <Create />,
        },
        {
          id: 'Open',
          element: <Open />,
        },
        {
          id: 'Closed',
          element: <Closed />
        }
    ] as const).filter(({id}) => id === elementId);
    return filteredChildElement[0].element;
  }
  // React.useEffect(() => {
  //   navigate('/liquidity/create', {replace: true});
  // })

  return (
    <div className='h-screen space-y-6'>
      {
        !displayChild? 
          <Stack>
            <Typography>Permissionless</Typography>
            <Typography>Permissioned</Typography>
          </Stack> : renderChild()
      }
    </div>
  )
}

export default Liquidity