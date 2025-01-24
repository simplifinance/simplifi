import React from 'react';
import SwipeableInfo from './SwipeableInfo';
import { Container } from '@mui/material';

export default function OnbaordScreen () {
  return (
    <div className="bg-[url(/images/hero/hero-bg1.png) h-screen object-cover background">
      <Container maxWidth="xs" className='absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] '>
        <SwipeableInfo />
      </Container>
    </div>
  )
}
