import * as React from 'react';
import { CssVarsProvider, extendTheme, useColorScheme } from '@mui/joy/styles';
import GlobalStyles from '@mui/joy/GlobalStyles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Checkbox from '@mui/joy/Checkbox';
import Divider from '@mui/joy/Divider';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import IconButton, { type IconButtonProps } from '@mui/joy/IconButton';
import Input from '@mui/joy/Input';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';
// import Visibility from '@mui/icons-material/Visibility';
// import VisibilityOff from '@mui/icons-material/VisibilityOff';
import GoogleIcon from './GoogleIcon';
import { Link } from 'react-router-dom';
import UseSignIn from '../../../stores/SignInUp/SignIn';
import type { SignInType } from '../../../types/SignInUpType';
import NotifyMessage from '../../../utils/NotifyMessage';
import { useNotifyMessage } from '../../../utils/hooks/useNotifyMessage';
import { cacheSession } from '../../../utils/cache';
import { SIGN_IN_CONST_ID, SIGN_IN_CONST_TOKEN } from '../../../const/SignInConst';
import { useEffect } from 'react';
// import { Eye, EyeOff } from "lucide-react";
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';


interface FormElements extends HTMLFormControlsCollection {
  username: HTMLInputElement;
  password: HTMLInputElement;
  persistent: HTMLInputElement;
}
interface SignInFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

function ColorSchemeToggle(props: IconButtonProps) {
  const { onClick, ...other } = props;
  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  return (
    <IconButton
      aria-label="切换明暗模式"
      size="sm"
      variant="outlined"
      disabled={!mounted}
      onClick={(event) => {
        setMode(mode === 'light' ? 'dark' : 'light');
        onClick?.(event);
      }}
      {...other}
    >
      {mode === 'light' ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
    </IconButton>
  );
}

const customTheme = extendTheme({ defaultColorScheme: 'dark' } as any);

export default function JoySignInSideTemplate() {
  const [showPassword, setShowPassword] = React.useState(false);
  // @ts-ignore
  const [usernameError, setUsernameError] = React.useState('');
  const {
    open,
    message,
    code,
    showMessage,
    closeMessage,
  } = useNotifyMessage();
  const { signInApi, loading, dataResult } = UseSignIn();

  const handleSubmit = async (event: React.FormEvent<SignInFormElement>) => {
    event.preventDefault();
    const formElements = event.currentTarget.elements;

    const username = formElements.username.value.trim();
    const password = formElements.password.value;
    const rememberMe = formElements.persistent.checked;

    if (username.length < 4) {
      alert('用户名长度不能少于4位');
      return;
    }

    const data = {
      username,
      password,
      rememberMe,
    };
    const userInfo: SignInType = {
      username: data.username,
      password: data.password,
    };

    await signInApi(userInfo);
  };

  useEffect(() => {
    if (dataResult?.code === 200) {
      showMessage(dataResult.msg, dataResult.code);
      cacheSession.setCache(SIGN_IN_CONST_ID, dataResult.data.id);
      cacheSession.setCache(SIGN_IN_CONST_TOKEN, dataResult.data.token);
    } else if (dataResult?.code !== undefined) {
      showMessage(dataResult.msg || '登录失败', dataResult.code);
    }
  }, [dataResult]);

  return (
    <>
      <CssVarsProvider theme={customTheme} disableTransitionOnChange>
        <CssBaseline />
        <GlobalStyles
          styles={{
            ':root': {
              '--Form-maxWidth': '800px',
              '--Transition-duration': '0.4s',
            },
          }}
        />

        <Box
          sx={(theme) => ({
            width: { xs: '100%', md: '50vw' },
            transition: 'width var(--Transition-duration)',
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            justifyContent: 'flex-end',
            backdropFilter: 'blur(12px)',
            backgroundColor: 'rgba(255 255 255 / 0.2)',
            [theme.getColorSchemeSelector('dark')]: {
              backgroundColor: 'rgba(19 19 24 / 0.4)',
            },
          })}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              minHeight: '100dvh',
              width: '100%',
              px: 2,
            }}
          >
            <Box component="header" sx={{ py: 3, display: 'flex', justifyContent: 'space-between' }}>
              <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
                <IconButton variant="soft" color="primary" size="sm">
                  <BadgeRoundedIcon />
                </IconButton>
                <Typography level="title-lg">公司Logo</Typography>
              </Box>
              <ColorSchemeToggle />
            </Box>

            <Box
              component="main"
              sx={{
                my: 'auto',
                py: 2,
                pb: 5,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                width: 400,
                maxWidth: '100%',
                mx: 'auto',
                borderRadius: 'sm',
                '& form': { display: 'flex', flexDirection: 'column', gap: 2 },
              }}
            >
              <Stack sx={{ gap: 4, mb: 2 }}>
                <Stack sx={{ gap: 1 }}>
                  <Typography component="h1" level="h3">
                    登录账号
                  </Typography>
                  <Typography level="body-sm">
                    还没有账户？{' '}
                    <Link to="/sign-up" style={{ textDecoration: 'none' }}>
                      点击注册
                    </Link>
                  </Typography>
                </Stack>
                <Button variant="soft" color="neutral" fullWidth startDecorator={<GoogleIcon />}>
                  使用 Google 登录
                </Button>
              </Stack>

              <Divider>或</Divider>

              <Stack sx={{ gap: 4, mt: 2 }}>
                <form onSubmit={handleSubmit} method="post">
                  <FormControl required error={!!usernameError}>
                    <FormLabel>用户名</FormLabel>
                    <Input type="text" name="username" autoComplete="username" />
                    {usernameError && (
                      <Typography level="body-xs" color="danger" sx={{ mt: 0.5 }}>
                        {usernameError}
                      </Typography>
                    )}
                  </FormControl>

                  {/* <FormControl required>
                    <FormLabel>密码</FormLabel>
                    <Input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      endDecorator={
                        <IconButton
                          aria-label={showPassword ? '隐藏密码' : '显示密码'}
                          onClick={() => setShowPassword(!showPassword)}
                          size="sm"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      }
                    />
                  </FormControl> */}
                  <FormControl required>
                    <FormLabel>密码</FormLabel>
                    <Input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      endDecorator={
                        <IconButton
                          aria-label={showPassword ? '隐藏密码' : '显示密码'}
                          onClick={() => setShowPassword(!showPassword)}
                          size="sm"
                          variant="plain"
                          color="neutral"
                        >
                          {/* {showPassword ? <EyeOff size={18} /> : <Eye size={18} />} */}
                          {showPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}

                        </IconButton>
                      }
                    />
                  </FormControl>


                  <Stack sx={{ gap: 4, mt: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Checkbox size="sm" label="记住我" name="persistent" />
                      <Link to="#" style={{ textDecoration: 'none' }}>忘记密码？</Link>
                    </Box>
                    <Button type="submit" fullWidth loading={loading}>
                      登录
                    </Button>
                  </Stack>
                </form>
              </Stack>
            </Box>

            <Box component="footer" sx={{ py: 3 }}>
              <Typography level="body-xs" sx={{ textAlign: 'center' }}>
                © {new Date().getFullYear()} 某某科技公司 版权所有
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box
          sx={(theme) => ({
            height: '100%',
            position: 'fixed',
            right: 0,
            top: 0,
            bottom: 0,
            left: { xs: 0, md: '50vw' },
            transition: 'background-image var(--Transition-duration)',
            backgroundColor: 'background.level1',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundImage:
              'url(https://images.unsplash.com/photo-1527181152855-fc03fc7949c8?auto=format&w=1000&dpr=2)',
            [theme.getColorSchemeSelector('dark')]: {
              backgroundImage:
                'url(https://images.unsplash.com/photo-1572072393749-3ca9c8ea0831?auto=format&w=1000&dpr=2)',
            },
          })}
        />
      </CssVarsProvider>
      <NotifyMessage
        open={open}
        message={message}
        code={code}
        onClose={closeMessage}
      />
    </>
  );
}
