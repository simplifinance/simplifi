import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import { commonStyle } from '@/utilities';

export const fadeStyle = (overrideWidth? : string, overrideHeight?: string) => {
    return {
        ...commonStyle(
            {
                width: overrideWidth ||  "100%",
                height: overrideHeight || {xs: '100%', md: '750px'},
                overflowY: 'auto'
            }
        )
    }
};

export const PopUp = (props: PopUpProps) => {
    const { modalOpen, handleModalClose, overrideHeight, overrideWidth, children } = props;

    return (
        <Modal
            aria-describedby="transition-modal-description"
            open={modalOpen}
            aria-labelledby="transition-modal-title"
            onClose={handleModalClose}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
                backdrop: {
                    timeout: 500,
                },
            }}
            hidden={!modalOpen}
        >
            <Fade in={modalOpen}>
                <Box sx={{...fadeStyle(overrideWidth, overrideHeight), position: 'relative'}}>
                    {children}
                </Box>
            </Fade>
        </Modal>
    );
}

export interface PopUpProps {
    handleModalClose: () => void;
    modalOpen: boolean;
    overrideWidth?: string;
    overrideHeight?: string;
    children: React.ReactNode;
}