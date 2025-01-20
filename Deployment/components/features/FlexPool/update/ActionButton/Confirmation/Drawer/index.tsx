import * as React from 'react';
import Box from '@mui/material/Box';
import { Drawer as MuiDrawer, } from '@mui/material';
// import useAppStorage from '@/components/StateContextProvider/useAppStorage';
import { useMediaQuery } from '@mui/material';
import type { ToggleDrawer } from '@/interfaces';

const toggleDrawer : ToggleDrawer =
    (value: number, setState: (value: number) => void) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
        return;
    }

    setState(value );
};

export default function Drawer({ openDrawer, styles, setDrawerState, children } : { openDrawer: number, styles: React.CSSProperties | undefined, setDrawerState: (arg: number) => void, children: React.ReactNode}) {
    const isLargeScreen = useMediaQuery('(min-width:768px)');
    const entry = openDrawer === 0? false : true;
    return (
        <MuiDrawer
            anchor={isLargeScreen? 'right' : 'bottom'}
            open={entry}
            onClose={() => toggleDrawer(0, setDrawerState)}
        >
            <Box
                style={{ width: isLargeScreen? 300 : 'auto', padding: '16px', background: '#121212', ...styles}}
                role="presentation"
                onClick={() => toggleDrawer(0, setDrawerState)}
                onKeyDown={() => toggleDrawer(0, setDrawerState)}
                // style={styles}
            >
                { children }
            </Box>
        </MuiDrawer>    
    );
}