// components/NotifyMessage.tsx
import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

interface NotifyMessageProps {
  open: boolean;
  code: number;
  message: string;
  onClose: () => void;
  duration?: number;
}

const NotifyMessage: React.FC<NotifyMessageProps> = ({
  open,
  code,
  message,
  onClose,
  duration = 3000,
}) => {
  const severity = code === 200 ? 'success' : 'error';

  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert
        onClose={onClose}
        severity={severity as 'success' | 'error'}
        variant="filled"
        sx={{ width: '100%' }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default NotifyMessage;
