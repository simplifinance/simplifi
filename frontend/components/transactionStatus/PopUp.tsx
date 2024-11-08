import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';

export const fadeStyle = (overrideWidth? : string) => {
    return {
        top: '50%',
        transform: 'translate(-50%, -50%)',
        width:overrideWidth ||  "100%",
        left: '50%',
        p: 4,
        position: 'absolute' as 'absolute',
    }
};

export const PopUp = (props: PopUpProps) => {
    const { modalOpen, handleModalClose, overrideWidth, children } = props;

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
                <Box sx={fadeStyle(overrideWidth)}>
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
    children: React.ReactNode;
}