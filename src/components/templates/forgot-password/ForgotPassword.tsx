import * as React from 'react';
import { CssVarsProvider, extendTheme, useColorScheme } from '@mui/joy/styles';
import GlobalStyles from '@mui/joy/GlobalStyles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import IconButton, { type IconButtonProps } from '@mui/joy/IconButton';
import Input from '@mui/joy/Input';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import Link from '@mui/joy/Link';
import { forgotPasswordReset } from '@/api/SignInUp/SignIn';
import NotifyMessage from '@/utils/NotifyMessage';
import { useNotifyMessage } from '@/utils/hooks/useNotifyMessage';
import { useNavigate } from 'react-router-dom';
import { cacheLocal } from '@/utils/cache';
import { SIGN_IN_CONST_TOKEN } from '@/const/SignInConst';

interface FormElements extends HTMLFormControlsCollection {
  username: HTMLInputElement;
  password: HTMLInputElement;
  confirmPassword: HTMLInputElement;
}
interface ForgotPasswordFormElement extends HTMLFormElement {
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
        setMode(mode === 'dark' ? 'light' : 'dark');
        onClick?.(event);
      }}
      {...other}
    >
      {mode === 'light' ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
    </IconButton>
  );
}

const customTheme = extendTheme({ defaultColorScheme: 'dark' } as any);

// 步骤枚举
type Step = 'username' | 'reset';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = React.useState<Step>('username');
  const [username, setUsername] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  
  // 错误状态
  const [usernameError, setUsernameError] = React.useState('');
  const [passwordError, setPasswordError] = React.useState('');
  const [confirmPasswordError, setConfirmPasswordError] = React.useState('');

  const {
    open,
    message,
    code,
    showMessage,
    closeMessage,
  } = useNotifyMessage();

  const [loading, setLoading] = React.useState(false);

  // 验证用户名并进入下一步
  const handleNextStep = () => {
    if (!username || username.trim().length < 4) {
      setUsernameError('请输入有效的用户名（至少4位）');
      return;
    }
    setUsernameError('');
    setStep('reset');
  };

  // 重置密码
  const handleResetPassword = async (event: React.FormEvent<ForgotPasswordFormElement>) => {
    event.preventDefault();
    const formElements = event.currentTarget.elements;

    const password = formElements.password.value;
    const confirmPassword = formElements.confirmPassword.value;

    // 校验密码
    if (!password || password.length < 6) {
      setPasswordError('密码长度不能少于6位');
      return;
    }
    setPasswordError('');

    // 校验确认密码
    if (password !== confirmPassword) {
      setConfirmPasswordError('两次输入的密码不一致');
      return;
    }
    setConfirmPasswordError('');

    try {
      setLoading(true);
      const res = await forgotPasswordReset({
        username: username.trim(),
        password,
      });

      if (res.data?.code === 200) {
        showMessage(res.data.msg || '密码重置成功', res.data.code);
        // 延迟跳转到登录页，让用户看到成功提示
        setTimeout(() => {
          cacheLocal.removeCache(SIGN_IN_CONST_TOKEN)
          navigate('/sign-in');
        }, 2000);
      } else {
        showMessage(res.data?.msg || '密码重置失败', res.data?.code || 500);
      }
    } catch (error: any) {
      showMessage(error.response?.data?.msg || '密码重置失败', 500);
    } finally {
      setLoading(false);
    }
  };

  // 返回上一步
  const handleBack = () => {
    if (step === 'reset') {
      setStep('username');
      setPasswordError('');
      setConfirmPasswordError('');
    }
  };

  // 获取背景图片
  const getBackgroundImage = () => {
    return 'url(https://gsy-ai-recommend-cloud.oss-cn-beijing.aliyuncs.com/843f0c54-1217-4771-b8d8-a5e2cf1c2e5b.jpg)';
  };

  const getDarkBackgroundImage = () => {
    return 'url(https://gsy-ai-recommend-cloud.oss-cn-beijing.aliyuncs.com/843f0c54-1217-4771-b8d8-a5e2cf1c2e5b.jpg)';
  };

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

        {/* 左侧忘记密码表单区域 */}
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
            backgroundImage: getBackgroundImage(),
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            [theme.getColorSchemeSelector('dark')]: {
              backgroundColor: 'rgba(19 19 24 / 0.4)',
              backgroundImage: getDarkBackgroundImage(),
            },
          })}
        >
          {/* 半透明遮罩层 */}
          <Box
            sx={(theme) => ({
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              [theme.getColorSchemeSelector('dark')]: {
                backgroundColor: 'rgba(19, 19, 24, 0.7)',
              },
            })}
          />
          
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              minHeight: '100dvh',
              width: '100%',
              px: 2,
              position: 'relative',
              zIndex: 2,
            }}
          >
            <Box component="header" sx={{ py: 3, display: 'flex', justifyContent: 'space-between' }}>
              <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
                <IconButton variant="soft" color="primary" size="sm">
                  <BadgeRoundedIcon />
                </IconButton>
                <Typography level="title-lg">滇西集团</Typography>
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
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {step !== 'username' && (
                      <IconButton size="sm" variant="plain" onClick={handleBack}>
                        <ArrowBackRoundedIcon />
                      </IconButton>
                    )}
                    <Typography component="h1" level="h3">
                      {step === 'username' && '忘记密码'}
                      {step === 'reset' && '重置密码'}
                    </Typography>
                  </Box>
                  <Typography level="body-sm">
                    {step === 'username' && '请输入您的用户名，然后设置新密码'}
                    {step === 'reset' && `为用户 "${username}" 设置新密码`}
                  </Typography>
                </Stack>
              </Stack>

              {/* 第一步：输入用户名 */}
              {step === 'username' && (
                <Stack sx={{ gap: 4, mt: 2 }}>
                  <FormControl required error={!!usernameError}>
                    <FormLabel>用户名</FormLabel>
                    <Input 
                      type="text" 
                      name="username"
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        setUsernameError('');
                      }}
                      autoComplete="username"
                      error={!!usernameError}
                      placeholder="请输入用户名"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleNextStep();
                        }
                      }}
                    />
                    {usernameError && (
                      <Typography level="body-xs" color="danger" sx={{ mt: 0.5 }}>
                        {usernameError}
                      </Typography>
                    )}
                  </FormControl>

                  <Button 
                    fullWidth 
                    onClick={handleNextStep}
                    disabled={!username || username.length < 4}
                  >
                    下一步
                  </Button>

                  <Box sx={{ textAlign: 'center' }}>
                    <Link href="/sign-in" underline="hover">
                      返回登录
                    </Link>
                  </Box>
                </Stack>
              )}

              {/* 第二步：重置密码 */}
              {step === 'reset' && (
                <form onSubmit={handleResetPassword}>
                  <FormControl required error={!!passwordError}>
                    <FormLabel>新密码</FormLabel>
                    <Input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      error={!!passwordError}
                      placeholder="请输入新密码（至少6位）"
                      endDecorator={
                        <IconButton
                          aria-label={showPassword ? '隐藏密码' : '显示密码'}
                          onClick={() => setShowPassword(!showPassword)}
                          size="sm"
                          variant="plain"
                          color="neutral"
                        >
                          {showPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                        </IconButton>
                      }
                    />
                    {passwordError && (
                      <Typography level="body-xs" color="danger" sx={{ mt: 0.5 }}>
                        {passwordError}
                      </Typography>
                    )}
                  </FormControl>

                  <FormControl required error={!!confirmPasswordError}>
                    <FormLabel>确认密码</FormLabel>
                    <Input
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      error={!!confirmPasswordError}
                      placeholder="请再次输入新密码"
                      endDecorator={
                        <IconButton
                          aria-label={showConfirmPassword ? '隐藏密码' : '显示密码'}
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          size="sm"
                          variant="plain"
                          color="neutral"
                        >
                          {showConfirmPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                        </IconButton>
                      }
                    />
                    {confirmPasswordError && (
                      <Typography level="body-xs" color="danger" sx={{ mt: 0.5 }}>
                        {confirmPasswordError}
                      </Typography>
                    )}
                  </FormControl>

                  <Button type="submit" fullWidth loading={loading}>
                    重置密码
                  </Button>
                </form>
              )}
            </Box>

            <Box component="footer" sx={{ py: 3 }}>
              <Typography level="body-xs" sx={{ textAlign: 'center' }}>
                © {new Date().getFullYear()} 某某科技公司 版权所有
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* 右侧装饰区域 */}
        <Box
          sx={{
            height: '100%',
            position: 'fixed',
            right: 0,
            top: 0,
            bottom: 0,
            left: { xs: 0, md: '50vw' },
            backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box sx={{ textAlign: 'center', color: 'white', px: 4 }}>
            <Typography level="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
              找回密码
            </Typography>
            <Typography level="body-lg" sx={{ opacity: 0.9 }}>
              通过简单的两步操作，快速找回您的账户密码
            </Typography>
          </Box>
        </Box>
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
