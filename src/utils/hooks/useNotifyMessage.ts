// hooks/useNotifyMessage.ts
import { useState } from 'react';

export const useNotifyMessage = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [code, setCode] = useState(500); // 默认失败

  const showMessage = (msg: string, code: number) => {
    setMessage(msg);
    setCode(code);
    setOpen(true);
  };

  const closeMessage = () => {
    setOpen(false);
  };

  return {
    open,
    message,
    code,
    showMessage,
    closeMessage,
  };
};
