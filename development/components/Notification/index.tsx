import * as React from 'react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import useAppStorage from '../StateContextProvider/useAppStorage';

type NotificationProp = {
  message: string;
  resetMessage: () => void;
}

export default function Notification(props: NotificationProp) {
  const { message, resetMessage } = props;
  const [open, setOpen] = React.useState(false);
  const [prev, setPrevious] = React.useState(message);

  // const { setTrxnStatus } = useAppStorage();
  React.useEffect(() => {
    if(message !== '' && message !== prev){
      setOpen(true);
      setPrevious(message);
    }
  }, [message]);

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const action = (
    <React.Fragment>
      <Button color="secondary" size="small" onClick={handleClose}>
        UNDO
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        {/* <CloseIcon fontSize="small" /> */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </IconButton>
    </React.Fragment>
  );

  return (
    <div hidden={!open}>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        message={message}
        action={action}
      />
    </div>
  );
}