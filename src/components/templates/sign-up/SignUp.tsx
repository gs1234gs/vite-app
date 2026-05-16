import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import AppTheme from '../shared-theme/AppTheme';
import ColorModeSelect from '../shared-theme/ColorModeSelect';
import { GoogleIcon, FacebookIcon, SitemarkIcon } from './components/CustomIcons';
import useSignUp from '@/stores/SignInUp/SignUp';
import type { SignUpType } from '@/types/SignInUpType';
import { message } from 'antd';
import { findCode } from '@/api/SignInUp/SignIn';

// 卡片样式保持不变
const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

export default function SignUp(props: { disableCustomTheme?: boolean }) {
  const [phoneError, setPhoneError] = React.useState(false);
  const [phoneErrorMessage, setPhoneErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [nameError, setNameError] = React.useState(false);
  const [nameErrorMessage, setNameErrorMessage] = React.useState('');

  const [confirmPasswordError, setConfirmPasswordError] = React.useState(false);
  const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = React.useState('');
  const [countdown, setCountdown] = React.useState(0); // 验证码倒计时
  const timerRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
  const { signUpApi, loading, dataResult } = useSignUp();

  // 获取验证码
  const handleGetCode = async () => {
    const phone = document.getElementById('phone') as HTMLInputElement;
    
    if (!phone.value) {
      setPhoneError(true);
      setPhoneErrorMessage('请先输入邮箱');
      return;
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(phone.value)) {
      setPhoneError(true);
      setPhoneErrorMessage('请输入正确的邮箱格式');
      return;
    }

    try {
      const res = await findCode({ username: phone.value });
      if (res.data.code === 200) {
        message.success(res.data.msg || '验证码已发送');
        // 开始倒计时
        setCountdown(60);
        timerRef.current = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
              }
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        message.error(res.data.msg || '获取验证码失败');
      }
    } catch (error: any) {
      message.error(error.response?.data?.msg || '获取验证码失败，请检查网络连接');
    }
  };

  const validateInputs = () => {
    const phone = document.getElementById('phone') as HTMLInputElement;
    const password = document.getElementById('password') as HTMLInputElement;
    const confirmPassword = document.getElementById('confirmPassword') as HTMLInputElement;
    const name = document.getElementById('name') as HTMLInputElement;
    const code = document.getElementById('code') as HTMLInputElement;

    let isValid = true;
    // 邮箱格式验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!phone.value || !emailRegex.test(phone.value)) {
      setPhoneError(true);
      setPhoneErrorMessage('请输入正确的邮箱格式');
      isValid = false;
    } else {
      setPhoneError(false);
      setPhoneErrorMessage('');
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('密码至少需 6 位。');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    if (!confirmPassword.value || confirmPassword.value !== password.value) {
      setConfirmPasswordError(true);
      setConfirmPasswordErrorMessage('两次输入的密码不一致');
      isValid = false;
    } else {
      setConfirmPasswordError(false);
      setConfirmPasswordErrorMessage('');
    }

    if (!name.value || name.value.trim().length < 1) {
      setNameError(true);
      setNameErrorMessage('请输入姓名。');
      isValid = false;
    } else {
      setNameError(false);
      setNameErrorMessage('');
    }

    // 验证码非空校验
    if (!code.value || code.value.trim().length === 0) {
      message.error('请输入验证码');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateInputs()) return;

    const formData = new FormData(event.currentTarget);
    // 获取表单数据
    const data: SignUpType = {
      nickName: formData.get('name') as string,
      username: formData.get('phone') as string,
      password: formData.get('password') as string,
      code: formData.get('code') as string,
    };
    try {
      const res = await signUpApi(data);
      console.log('注册成功返回：', res);
      // 可以在这里跳转页面或者显示提示
    } catch (err) {
      console.error('注册失败：', err);
    }
  };

  // 清理定时器
  React.useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
      <SignUpContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <SitemarkIcon />
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            邮箱注册
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <FormControl>
              <FormLabel htmlFor="name">姓名</FormLabel>
              <TextField
                autoComplete="name"
                name="name"
                required
                fullWidth
                id="name"
                placeholder="张三"
                error={nameError}
                helperText={nameErrorMessage}
                color={nameError ? 'error' : 'primary'}
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="phone">邮箱</FormLabel>
              <TextField
                required
                fullWidth
                id="phone"
                placeholder="请输入邮箱地址"
                name="phone"
                autoComplete="email"
                variant="outlined"
                error={phoneError}
                helperText={phoneErrorMessage}
                color={phoneError ? 'error' : 'primary'}
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="code">验证码</FormLabel>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  required
                  id="code"
                  name="code"
                  placeholder="请输入验证码"
                  autoComplete="one-time-code"
                  variant="outlined"
                  sx={{ flex: 1 }}
                />
                <Button 
                  variant="outlined" 
                  onClick={handleGetCode}
                  disabled={countdown > 0}
                  sx={{ minWidth: 120 }}
                >
                  {countdown > 0 ? `${countdown}s` : '获取验证码'}
                </Button>
              </Box>
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="password">密码</FormLabel>
              <TextField
                required
                fullWidth
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="new-password"
                variant="outlined"
                error={passwordError}
                helperText={passwordErrorMessage}
                color={passwordError ? 'error' : 'primary'}
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="confirmPassword">确认密码</FormLabel>
              <TextField
                required
                fullWidth
                name="confirmPassword"
                placeholder="再次输入密码"
                type="password"
                id="confirmPassword"
                autoComplete="new-password"
                variant="outlined"
                error={confirmPasswordError}
                helperText={confirmPasswordErrorMessage}
                color={confirmPasswordError ? 'error' : 'primary'}
              />
            </FormControl>


            <FormControlLabel
              control={<Checkbox value="allowExtraEmails" color="primary" />}
              label="我希望接收系统更新与通知。"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={validateInputs}
              disabled={loading} // 提交时禁用按钮
            >
              {loading ? '注册中...' : '注册'}
            </Button>
          </Box>

          <Divider>
            <Typography sx={{ color: 'text.secondary' }}>或</Typography>
          </Divider>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => alert('使用谷歌注册')}
              startIcon={<GoogleIcon />}
            >
              使用谷歌注册
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => alert('使用支付宝注册')}
              startIcon={<FacebookIcon />}
            >
              使用支付宝注册
            </Button>
            <Typography sx={{ textAlign: 'center' }}>
              已有账号？{' '}
              <Link href="/sign-in" variant="body2">
                立即登录
              </Link>
            </Typography>
          </Box>
        </Card>
      </SignUpContainer>
    </AppTheme>
  );
}
