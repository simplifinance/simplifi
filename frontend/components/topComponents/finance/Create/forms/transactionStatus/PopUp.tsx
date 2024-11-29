import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
// import { TrxnResult } from '@/interfaces';

export const fadeStyle = (overrideWidth? : string, overrideHeight?: string) => {
    return {
        top: '50%',
        transform: 'translate(-50%, -50%)',
        width:overrideWidth ||  "100%",
        height: overrideHeight || "100%",
        left: '50%',
        p: {sx: 2, md: 4},
        position: 'absolute' as 'absolute',
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
        >
            <Fade in={modalOpen}>
                <Box sx={fadeStyle(overrideWidth, overrideHeight)}>
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