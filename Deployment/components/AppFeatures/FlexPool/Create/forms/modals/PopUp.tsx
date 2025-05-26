import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Container from '@mui/material/Container';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';

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
            sx={{p: 4}}
        >
            <Fade in={modalOpen}>
                <Container maxWidth={'md'}>
                    <div className="">
                        {children}
                    </div>
                </Container>
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