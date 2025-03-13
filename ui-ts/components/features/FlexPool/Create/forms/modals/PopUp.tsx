import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import { commonStyle } from '@/utilities';

export const PopUp = (props: PopUpProps) => {
    const { modalOpen, handleModalClose, children } = props;

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
            // className="relative"
        >
            <Fade in={modalOpen}>
                <Box className="absolute top-[50%] left-0 w-full translate-[-50%] translate-y-[-50%]">
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