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
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import GoogleIcon from './GoogleIcon';

import UseSignIn from '@/stores/SignInUp/SignIn';
import type { SignInType } from '@/types/SignInUpType';
import NotifyMessage from '@/utils/NotifyMessage';
import { useNotifyMessage } from '@/utils/hooks/useNotifyMessage';
import { cacheSession } from '@/utils/cache';
import { SIGN_IN_CONST_ID, SIGN_IN_CONST_TOKEN } from '@/const/SignInConst';
import { useEffect } from 'react';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import Link from '@mui/joy/Link';
import useProductCarousal from '@/stores/goods/ProductCarousel';
import type { ProductCarousalVO } from '@/api/goods/carousel/ProductCarouselType';

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

// 轮播图组件
function Carousel({ images }: { images: ProductCarousalVO[] }) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  // 清理定时器
  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // 启动定时器
  const startTimer = () => {
    clearTimer();
    if (images.length > 1) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, 2000);
    }
  };

  // 自动轮播 - 移除 isHovered 依赖，一直播放
  useEffect(() => {
    if (images.length > 1) {
      startTimer();
    }
    return () => clearTimer();
  }, [images.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    // 点击后重新开始计时
    if (images.length > 1) {
      startTimer();
    }
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    if (images.length > 1) {
      startTimer();
    }
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    if (images.length > 1) {
      startTimer();
    }
  };

  if (!images || images.length === 0) {
    return (
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'background.level1',
        }}
      >
        <Typography level="body-md" color="neutral">
          {/* 暂无轮播图 */}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* 轮播图片容器 */}
      <Box
        sx={{
          display: 'flex',
          height: '100%',
          width: `${images.length * 100}%`,
          transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: `translateX(-${(currentIndex * 100) / images.length}%)`,
        }}
      >
        {images.map((item, index) => (
          <Box
            key={item.id || index}
            sx={{
              width: `${100 / images.length}%`,
              height: '100%',
              flexShrink: 0,
              backgroundImage: `url(${item.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              position: 'relative',
            }}
          >
            {/* 图片遮罩层，提升文字可读性 */}
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.7) 100%)',
              }}
            />
            {/* 轮播图标题和描述 */}
            {item.title && (
              <Box
                sx={{
                  position: 'absolute',
                  bottom: { xs: 60, md: 80 },
                  left: { xs: 16, md: 24 },
                  right: { xs: 16, md: 24 },
                  zIndex: 2,
                }}
              >
                <Typography
                  level="h4"
                  sx={{
                    color: 'common.white',
                    textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                    mb: 1,
                  }}
                >
                  {item.title}
                </Typography>
                {item.description && (
                  <Typography
                    level="body-md"
                    sx={{
                      color: 'rgba(255,255,255,0.9)',
                      textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                    }}
                  >
                    {item.description}
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        ))}
      </Box>

      {/* 左侧切换按钮 */}
      {images.length > 1 && (
        <IconButton
          size="md"
          variant="soft"
          color="neutral"
          onClick={prevSlide}
          sx={{
            position: 'absolute',
            left: 16,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 3,
            backgroundColor: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(8px)',
            color: 'common.white',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.3)',
            },
          }}
        >
          <ChevronLeftRoundedIcon />
        </IconButton>
      )}

      {/* 右侧切换按钮 */}
      {images.length > 1 && (
        <IconButton
          size="md"
          variant="soft"
          color="neutral"
          onClick={nextSlide}
          sx={{
            position: 'absolute',
            right: 16,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 3,
            backgroundColor: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(8px)',
            color: 'common.white',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.3)',
            },
          }}
        >
          <ChevronRightRoundedIcon />
        </IconButton>
      )}

      {/* 轮播指示器 */}
      {images.length > 1 && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 8,
            zIndex: 3,
          }}
        >
          {images.map((_, index) => (
            <Box
              key={index}
              onClick={() => goToSlide(index)}
              sx={{
                width: currentIndex === index ? 24 : 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: currentIndex === index ? 'common.white' : 'rgba(255,255,255,0.5)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.8)',
                },
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}

export default function JoySignInSideTemplate() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [usernameError, setUsernameError] = React.useState('');
  const [carouselImages, setCarouselImages] = React.useState<ProductCarousalVO[]>([]);
  const {
    open,
    message,
    code,
    showMessage,
    closeMessage,
  } = useNotifyMessage();
  const { signInApi, loading, dataResult } = UseSignIn();
  const { findByType } = useProductCarousal();

  // 获取轮播图数据
  useEffect(() => {
    const fetchCarousel = async () => {
      try {
        const res = await findByType(1);
        if (res.data && Array.isArray(res.data)) {
          setCarouselImages(res.data);
          console.log('轮播图数据:', res.data);
        }
      } catch (error) {
        console.error('获取轮播图失败:', error);
      }
    };
    fetchCarousel();
  }, [findByType]);

  const handleSubmit = async (event: React.FormEvent<SignInFormElement>) => {
    event.preventDefault();
    const formElements = event.currentTarget.elements;

    const username = formElements.username.value.trim();
    const password = formElements.password.value;
    const rememberMe = formElements.persistent.checked;

    if (username.length < 4) {
      setUsernameError('用户名长度不能少于 4 位');
      return;
    }
    setUsernameError('');

    const userInfo: SignInType = {
      username,
      password,
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
  }, [dataResult, showMessage]);

  // 获取背景图片（使用第一张轮播图或默认图片）
  const getBackgroundImage = () => {
    if (carouselImages.length > 0 && carouselImages[0].image) {
      return `url(${carouselImages[0].image})`;
    }
    // 默认背景图片
    return 'url(https://gsy-ai-recommend-cloud.oss-cn-beijing.aliyuncs.com/843f0c54-1217-4771-b8d8-a5e2cf1c2e5b.jpg)';
  };

  const getDarkBackgroundImage = () => {
    if (carouselImages.length > 1 && carouselImages[1].image) {
      return `url(${carouselImages[1].image})`;
    }
    // 默认深色背景图片
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

        {/* 左侧登录表单区域 - 带有背景图片 */}
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
            // 设置背景图片
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
          {/* 添加半透明遮罩层，确保文字可读性 */}
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
                <Typography level="title-lg">公司 Logo</Typography>
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
                    <Link href="/sign-up" underline="hover">
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
                    <Input 
                      type="text" 
                      name="username" 
                      autoComplete="username"
                      error={!!usernameError}
                    />
                    {usernameError && (
                      <Typography level="body-xs" color="danger" sx={{ mt: 0.5 }}>
                        {usernameError}
                      </Typography>
                    )}
                  </FormControl>

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
                          {showPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                        </IconButton>
                      }
                    />
                  </FormControl>

                  <Stack sx={{ gap: 4, mt: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Checkbox size="sm" label="记住我" name="persistent" />
                      <Link href="/forgot-password" underline="hover">
                        忘记密码？
                      </Link>
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

        {/* 右侧轮播图区域 */}
        <Box
          sx={{
            height: '100%',
            position: 'fixed',
            right: 0,
            top: 0,
            bottom: 0,
            left: { xs: 0, md: '50vw' },
            backgroundColor: 'background.level1',
          }}
        >
          <Carousel images={carouselImages} />
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