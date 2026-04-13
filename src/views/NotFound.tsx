// src/components/NotFound.tsx
import React from 'react';
import {Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ textAlign: 'center', py: 10 }}>
      <Typography variant="h1" color="primary" gutterBottom>
        404
      </Typography>
      <Typography variant="h5" color="text.secondary" gutterBottom>
        页面未找到
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        抱歉，您访问的页面不存在或已被删除。
      </Typography>
      <Button variant="contained" color="primary" onClick={() => navigate('/home')}>
        返回首页
      </Button>
    </Container>
  );
};

export default NotFound;
