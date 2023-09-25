import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

interface CustomSnackbarProps {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'info' | 'warning';
  autoHideDuration?: number;
  onClose?: () => void;
}

const CustomSnackbar: React.FC<CustomSnackbarProps> = ({
  open,
  message,
  severity,
  autoHideDuration = 3000,
  onClose,
}: CustomSnackbarProps) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert variant='filled' severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackbar;
