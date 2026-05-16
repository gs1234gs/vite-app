
import { Footer } from 'antd/es/layout/layout';
import { Typography } from 'antd'; // 引入 Typography
const FooterIndex = () => {
  return (
    <Footer style={{
      textAlign: 'center',
      position: 'fixed',
      bottom: 0,
      width: '100%',
      zIndex: 10,
      background: 'white',
      boxShadow: '0 -2px 8px rgba(0,0,0,0.05)',
      padding: '16px 0',
      color: '#666',
    }}>
      管仕运 ©{new Date().getFullYear()} 创作
         <Typography.Link 
         href="/system" 
     
        target="_blank" 
        rel="noopener noreferrer"
        style={{ marginLeft: '8px' }}
      >
        关于系统
      </Typography.Link>
    </Footer>
  );
};

export default FooterIndex;