// components/NotifyMessage.tsx
import { useEffect } from 'react';
import { message as antdMessage } from 'antd';

interface NotifyMessageProps {
  open: boolean;
  code: number;
  message: string;
  onClose: () => void;
  duration?: number; // 秒
}

const NotifyMessage: React.FC<NotifyMessageProps> = ({
  open,
  code,
  message,
  onClose,
  duration = 3,
}) => {
  useEffect(() => {
    if (open) {
      const key = 'notify-message'; // 可确保同一条消息重复刷新不会堆积
      if (code === 200) {
        antdMessage.success({ content: message, key, duration });
      } else {
        antdMessage.error({ content: message, key, duration });
      }
      // 模拟 MUI Snackbar 的自动关闭
      const timer = setTimeout(() => {
        onClose();
      }, duration * 1000);
      return () => clearTimeout(timer);
    }
  }, [open, code, message, duration, onClose]);

  return null; // 不渲染任何 JSX
};

export default NotifyMessage;
