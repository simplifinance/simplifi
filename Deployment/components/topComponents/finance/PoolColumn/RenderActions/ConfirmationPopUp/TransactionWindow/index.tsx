import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import useAppStorage from '@/components/StateContextProvider/useAppStorage';
import { useMediaQuery } from '@mui/material';

export default function TransactionWindow({ openDrawer, styles, children } : { openDrawer: boolean, styles: React.CSSProperties | undefined, children: React.ReactNode}) {
    const { toggleTransactionWindow, txnStatus  } = useAppStorage();
    const isLargeScreen = useMediaQuery('(min-width:768px)');
    
    return (
        <Drawer
            anchor={isLargeScreen? 'right' : 'bottom'}
            open={openDrawer}
            onClose={toggleTransactionWindow(false)}
        >
            <Box
                sx={{ width: isLargeScreen? 300 : 'auto', padding: '16px', height: '100%' }}
                role="presentation"
                onClick={toggleTransactionWindow(false)}
                onKeyDown={toggleTransactionWindow(false)}
                style={styles}
            >
                { children }
            </Box>
        </Drawer>    
    );
}