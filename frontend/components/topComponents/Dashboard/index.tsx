import { flexStart } from '@/constants';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import React from 'react'
import Image from 'next/image';

const Dashboard = () => {
  return (
    <Stack className="space-y-10">
      <Box>
        <button className='w-[30%] float-end bg-orange-400 rounded-lg p-4 text-white cursor-pointer hover:shadow-sm hover:shadow-gray-600'>ConnectWallet</button>
      </Box>
      <Box>
        <div className='grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 justify-between gap-12' >
          {
            dashboardInfo.map((item, i) => (
              <div>
                <div className={`w-full bg-orange-400 rounded-lg p-8 text-white flex justify-start gap-4`}>
                  <div>
                    <Image 
                      alt={item.title}
                      src={item.icon}
                      width={50}
                      height={50}
                    />
                  </div>
                  <Stack>
                    <h3 className='font-semibold'>{ item.title }</h3>
                    <h1 className='text-2xl font-bold'>{ item.value() }</h1>
                  </Stack>
                </div>
              </div>
            ))
          }
        </div>
      </Box>

      {/* <Grid className=''>
        <Grid >
          <Grid item container xs={12} sx={{display: 'flex', justifyContent: 'end'}}>
          </Grid>

        </Grid>
      </Grid> */}
    </Stack>
  )
}

export default Dashboard;

const dashboardInfo = [
  {
    title: 'TVL',
    value: (param: string = '$450,000') => param,
    icon: '/TVL.svg'
  },
  {
    title: 'CURRENCY',
    value: (param: string = 'XFI') => param,
     icon: '/TVL.svg'
  },
  {
    title: 'NETWORK',
    value: (param: string = 'CROSSFI') => param,
    icon: '/TVL.svg'
  },
  {
    title: 'PROPOSALS',
    value: (param: number = 120) => param,
    icon: '/PROPOSAL.svg'
  },
  {
    title: 'PERMISSIONLESS POOL',
    value: (param: number = 10) => param,
    icon: '/OPENED.svg'
  },
  {
    title: 'PERMISSIONED POOL',
    value: (param: number = 20) => param,
    icon: '/CLOSED.svg'
  },
]