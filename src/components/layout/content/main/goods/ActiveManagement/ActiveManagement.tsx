import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  Grid,
  Chip,
  Typography,
  Button,
  TextField,
  MenuItem,
  InputAdornment,
  Fab,
  alpha,
  Pagination,
  CardContent,
  CardActions,
  Divider,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  Container,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  LocalOffer as DiscountIcon,
  Percent as PercentIcon,
  AttachMoney as MoneyIcon,
  CalendarToday as CalendarIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Schedule as ScheduleIcon,
  ShoppingCart as CartIcon,
  CardGiftcard as CouponIcon,
  Visibility as ViewIcon,
  Share as ShareIcon,
  Bolt as BoltIcon,
  FlashOn as FlashIcon,
  Rocket as RocketIcon
} from '@mui/icons-material';

// 类型定义
interface Promotion {
  id: string;
  name: string;
  type: 'discount' | 'coupon' | 'bundle' | 'flash';
  discountValue?: number;
  minAmount?: number;
  description: string;
  status: 'active' | 'upcoming' | 'expired' | 'paused';
  startDate: string;
  endDate: string;
  participants: number;
  revenue: number;
  conversion: number;
  image?: string;
  tags: string[];
  priority: 'high' | 'medium' | 'low';
}

// 模拟数据
const initialPromotions: Promotion[] = [
  {
    id: '1',
    name: '黑色星期五超级大促',
    type: 'discount',
    discountValue: 40,
    minAmount: 0,
    description: '年度最大促销活动，全场商品低至6折',
    status: 'active',
    startDate: '2024-11-20',
    endDate: '2024-11-30',
    participants: 15420,
    revenue: 1250000,
    conversion: 12.5,
    tags: ['热门', '限时', '全场'],
    priority: 'high'
  },
  {
    id: '2',
    name: '会员专属优惠券',
    type: 'coupon',
    discountValue: 100,
    minAmount: 500,
    description: 'VIP会员专享百元优惠券',
    status: 'active',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    participants: 8920,
    revenue: 456000,
    conversion: 8.2,
    tags: ['会员', '专属'],
    priority: 'medium'
  },
  {
    id: '3',
    name: '限时秒杀活动',
    type: 'flash',
    discountValue: 60,
    description: '每日10点准时开抢，限量特价商品',
    status: 'active',
    startDate: '2024-03-01',
    endDate: '2024-03-31',
    participants: 23450,
    revenue: 789000,
    conversion: 15.8,
    tags: ['秒杀', '限量', '热门'],
    priority: 'high'
  },
  {
    id: '4',
    name: '买一送一组合',
    type: 'bundle',
    description: '精选商品买一送一，超值组合',
    status: 'upcoming',
    startDate: '2024-04-01',
    endDate: '2024-04-15',
    participants: 0,
    revenue: 0,
    conversion: 0,
    tags: ['组合', '超值'],
    priority: 'medium'
  },
  {
    id: '5',
    name: '春季焕新季',
    type: 'discount',
    discountValue: 25,
    minAmount: 200,
    description: '春季新品上市，满200减25',
    status: 'active',
    startDate: '2024-03-15',
    endDate: '2024-04-15',
    participants: 6780,
    revenue: 234000,
    conversion: 6.7,
    tags: ['新品', '季节'],
    priority: 'medium'
  },
  {
    id: '6',
    name: '周末特惠专场',
    type: 'discount',
    discountValue: 15,
    description: '周末专属折扣，畅享购物乐趣',
    status: 'paused',
    startDate: '2024-03-01',
    endDate: '2024-06-30',
    participants: 3450,
    revenue: 123000,
    conversion: 5.2,
    tags: ['周末', '专属'],
    priority: 'low'
  },
  {
    id: '7',
    name: '新人首单立减',
    type: 'coupon',
    discountValue: 50,
    minAmount: 100,
    description: '新用户注册即可获得50元优惠券',
    status: 'active',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    participants: 15600,
    revenue: 567000,
    conversion: 18.3,
    tags: ['新人', '注册'],
    priority: 'high'
  },
  {
    id: '8',
    name: '618年中大促',
    type: 'flash',
    discountValue: 50,
    description: '年中购物狂欢节，爆款商品5折起',
    status: 'upcoming',
    startDate: '2024-06-01',
    endDate: '2024-06-20',
    participants: 0,
    revenue: 0,
    conversion: 0,
    tags: ['大促', '爆款', '限时'],
    priority: 'high'
  }
];

// 玻璃拟态效果卡片 - 修复版本
const GlassCard = ({ children, sx = {} }: any) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  return (
    <Card
      ref={cardRef}
      sx={{
        background: 'rgba(255, 255, 255, 0.75)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        borderRadius: 4,
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        overflow: 'hidden',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
        },
        ...sx
      }}
    >
      {children}
    </Card>
  );
};

// 渐变按钮组件
const GradientButton = ({ children, ...props }: any) => (
  <Button
    {...props}
    sx={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      borderRadius: 3,
      textTransform: 'none',
      fontWeight: 600,
      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
        background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
      },
      ...props.sx
    }}
  >
    {children}
  </Button>
);

// 统计卡片组件 - 修复版本
const StatCard = ({ title, value, change, icon, color }: any) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <GlassCard
      sx={{
        p: 3,
        background: `linear-gradient(135deg, ${alpha(color, 0.1)} 0%, ${alpha(color, 0.05)} 100%)`,
        border: `1px solid ${alpha(color, 0.2)}`,
        height: '100%',
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        opacity: isVisible ? 1 : 0,
        transition: 'all 0.5s ease'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h3" fontWeight="800" sx={{ 
            background: `linear-gradient(135deg, ${color} 0%, ${alpha(color, 0.8)} 100%)`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1
          }}>
            {value}
          </Typography>
          <Typography variant="h6" fontWeight="600" sx={{ mb: 0.5 }}>
            {title}
          </Typography>
          {change && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <TrendingUpIcon sx={{ fontSize: 16, color: change >= 0 ? '#10b981' : '#ef4444' }} />
              <Typography variant="body2" sx={{ color: change >= 0 ? '#10b981' : '#ef4444', fontWeight: 600 }}>
                {change >= 0 ? '+' : ''}{change}%
              </Typography>
            </Box>
          )}
        </Box>
        <Box
          sx={{
            p: 2,
            borderRadius: 3,
            background: `linear-gradient(135deg, ${color} 0%, ${alpha(color, 0.8)} 100%)`,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 6px 20px ${alpha(color, 0.3)}`
          }}
        >
          {icon}
        </Box>
      </Box>
    </GlassCard>
  );
};

// 促销类型图标
const PromotionTypeIcon = ({ type }: { type: string }) => {
  const icons: any = {
    discount: <PercentIcon sx={{ color: '#667eea' }} />,
    coupon: <CouponIcon sx={{ color: '#f093fb' }} />,
    bundle: <CartIcon sx={{ color: '#4facfe' }} />,
    flash: <FlashIcon sx={{ color: '#43e97b' }} />
  };
  
  return icons[type] || <DiscountIcon />;
};

// 状态标签
const StatusChip = ({ status }: { status: string }) => {
  const statusConfig : any = {
    active: { label: '进行中', color: 'success', icon: <CheckIcon /> },
    upcoming: { label: '即将开始', color: 'warning', icon: <ScheduleIcon /> },
    expired: { label: '已结束', color: 'error', icon: <CancelIcon /> },
    paused: { label: '已暂停', color: 'default', icon: <CancelIcon /> }
  };

  const config = statusConfig[status];

  return (
    <Chip
      icon={config.icon}
      label={config.label}
      color={config.color}
      variant="filled"
      size="small"
      sx={{ fontWeight: 600, borderRadius: 2 }}
    />
  );
};

// 优先级标签
const PriorityChip = ({ priority }: { priority: any } ) => {
  const priorityConfig : any = {
    high: { label: '高优先级', color: '#ef4444', icon: <BoltIcon /> },
    medium: { label: '中优先级', color: '#f59e0b', icon: <RocketIcon /> },
    low: { label: '低优先级', color: '#10b981', icon: <TrendingUpIcon /> }
  };

  const config = priorityConfig[priority];

  return (
    <Chip
      icon={config.icon}
      label={config.label}
      size="small"
      sx={{
        backgroundColor: alpha(config.color, 0.1),
        color: config.color,
        border: `1px solid ${alpha(config.color, 0.3)}`,
        fontWeight: 600,
        borderRadius: 2
      }}
    />
  );
};

// 促销卡片组件 - 修复版本
const PromotionCard = ({ promotion, onEdit, onDelete }: any) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 150);
    return () => clearTimeout(timer);
  }, []);

  const getGradientByType = (type: string) => {
    const gradients: Record<string, string> = {
      discount: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      coupon: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      bundle: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      flash: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    };
    return gradients[type] || gradients.discount;
  };

  return (
    <Grid >
      <GlassCard
        ref={cardRef}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          opacity: isVisible ? 1 : 0,
          transition: 'all 0.5s ease'
        }}
      >
        {/* 卡片头部 - 渐变背景 */}
        <Box
          sx={{
            background: getGradientByType(promotion.type),
            p: 3,
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <PromotionTypeIcon type={promotion.type} />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <StatusChip status={promotion.status} />
              <PriorityChip priority={promotion.priority} />
            </Box>
          </Box>
          
          <Typography variant="h6" fontWeight="700" sx={{ mb: 1 }}>
            {promotion.name}
          </Typography>
          
          {promotion.discountValue && (
            <Typography variant="h3" fontWeight="800" sx={{ opacity: 0.9 }}>
              {promotion.type === 'discount' ? `${promotion.discountValue}% OFF` : `¥${promotion.discountValue}`}
            </Typography>
          )}
          
          {/* 装饰性元素 */}
          <Box
            sx={{
              position: 'absolute',
              top: -20,
              right: -20,
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)'
            }}
          />
        </Box>

        <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* 标签 */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {promotion.tags.map((tag: string, index: number) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                variant="outlined"
                sx={{ borderRadius: 2, fontSize: '0.75rem' }}
              />
            ))}
          </Box>

          {/* 描述 */}
          <Typography variant="body2" sx={{ opacity: 0.8, mb: 2, flex: 1 }}>
            {promotion.description}
          </Typography>

          {/* 时间信息 */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <CalendarIcon sx={{ fontSize: 16, opacity: 0.7 }} />
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              {promotion.startDate} - {promotion.endDate}
            </Typography>
          </Box>

          {/* 数据指标 */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <Box sx={{ textAlign: 'center' }}>
              <PeopleIcon sx={{ fontSize: 20, color: '#667eea', mb: 0.5 }} />
              <Typography variant="h6" fontWeight="700">
                {promotion.participants.toLocaleString()}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                参与人数
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <MoneyIcon sx={{ fontSize: 20, color: '#f093fb', mb: 0.5 }} />
              <Typography variant="h6" fontWeight="700">
                ¥{(promotion.revenue / 10000).toFixed(1)}万
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                营收
              </Typography>
            </Box>
          </Box>
        </CardContent>

        <Divider />

        <CardActions sx={{ p: 2, gap: 1 }}>
          <Tooltip title="查看详情">
            <IconButton size="small" sx={{ borderRadius: 2 }}>
              <ViewIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="分享">
            <IconButton size="small" sx={{ borderRadius: 2 }}>
              <ShareIcon />
            </IconButton>
          </Tooltip>
          <Box sx={{ flex: 1 }} />
          <Tooltip title="编辑">
            <IconButton 
              size="small" 
              sx={{ borderRadius: 2 }}
              onClick={() => onEdit(promotion)}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="删除">
            <IconButton 
              size="small" 
              color="error" 
              sx={{ borderRadius: 2 }}
              onClick={() => onDelete(promotion.id)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </CardActions>
      </GlassCard>
    </Grid>
  );
};

// 主组件 - 修复版本
const ActiveManagement = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [tabValue, setTabValue] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 8;

  // 模拟数据加载
  useEffect(() => {
    const timer = setTimeout(() => {
      setPromotions(initialPromotions);
      setLoading(false);
    }, 0);
    
    return () => clearTimeout(timer);
  }, []);

  // 统计数据
  const stats = {
    total: promotions.length,
    active: promotions.filter(p => p.status === 'active').length,
    revenue: promotions.reduce((sum, p) => sum + p.revenue, 0),
    participants: promotions.reduce((sum, p) => sum + p.participants, 0)
  };

  // 过滤促销活动
  const filteredPromotions = promotions.filter((promotion) => {
    const matchesSearch = promotion.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         promotion.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || promotion.status === statusFilter;
    const matchesType = typeFilter === 'all' || promotion.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  // 分页数据
  const paginatedPromotions = filteredPromotions.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    const statusMap = ['all', 'active', 'upcoming', 'expired'];
    setStatusFilter(statusMap[newValue]);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('确定要删除这个促销活动吗？此操作不可撤销。')) {
      setPromotions(promotions.filter(p => p.id !== id));
    }
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const statCards = [
    {
      title: '总活动数',
      value: stats.total,
      change: 12,
      icon: <DiscountIcon sx={{ fontSize: 28 }} />,
      color: '#667eea'
    },
    {
      title: '进行中',
      value: stats.active,
      change: 8,
      icon: <CheckIcon sx={{ fontSize: 28 }} />,
      color: '#f093fb'
    },
    {
      title: '总参与人数',
      value: (stats.participants / 10000).toFixed(1) + '万',
      change: 25,
      icon: <PeopleIcon sx={{ fontSize: 28 }} />,
      color: '#4facfe'
    },
    {
      title: '总营收',
      value: '¥' + (stats.revenue / 1000000).toFixed(1) + '百万',
      change: 18,
      icon: <MoneyIcon sx={{ fontSize: 28 }} />,
      color: '#43e97b'
    }
  ];

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
      }}>
        <GlassCard sx={{ p: 6, textAlign: 'center' }}>
          <CircularProgress size={60} sx={{ mb: 3, color: '#667eea' }} />
          <Typography variant="h5" sx={{ mb: 2 }}>
            加载中...
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.7 }}>
            正在获取促销活动数据
          </Typography>
        </GlassCard>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      py: 4
    }}>
      <Container maxWidth="xl">
        {/* 标题区域 */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h2" 
            fontWeight="800" 
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2
            }}
          >
            促销活动管理
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.7, maxWidth: 600, mx: 'auto' }}>
            高效管理所有促销活动，实时监控活动效果，提升销售转化率
          </Typography>
        </Box>

        {/* 统计卡片 */}
        <Box sx={{ mb: 6 }}>
          <Grid container spacing={3}>
            {statCards.map((stat, index) => (
              <Grid  key={index}>
                <StatCard {...stat} />
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* 主要内容区域 */}
        <GlassCard>
          {/* 工具栏 */}
          <Box sx={{ p: 4, borderBottom: '1px solid rgba(0, 0, 0, 0.08)' }}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'space-between', 
              alignItems: { xs: 'stretch', md: 'center' },
              gap: 3
            }}>
              <Box>
                <Typography variant="h4" fontWeight="700" sx={{ mb: 1 }}>
                  活动列表
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.7 }}>
                  管理和监控所有促销活动
                </Typography>
              </Box>
              
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2, 
                alignItems: { xs: 'stretch', sm: 'center' }
              }}>
                <GlassCard sx={{ minWidth: 280 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="搜索活动名称或描述..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon sx={{ opacity: 0.7 }} />
                        </InputAdornment>
                      ),
                      disableUnderline: true,
                    }}
                    variant="standard"
                  />
                </GlassCard>
                
                <GlassCard sx={{ minWidth: 140 }}>
                  <TextField
                    select
                    size="small"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    InputProps={{ disableUnderline: true }}
                    variant="standard"
                  >
                    <MenuItem value="all">全部类型</MenuItem>
                    <MenuItem value="discount">折扣</MenuItem>
                    <MenuItem value="coupon">优惠券</MenuItem>
                    <MenuItem value="bundle">组合</MenuItem>
                    <MenuItem value="flash">秒杀</MenuItem>
                  </TextField>
                </GlassCard>

                <GradientButton startIcon={<AddIcon />}>
                  创建活动
                </GradientButton>
              </Box>
            </Box>
          </Box>

          {/* 标签页 */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange} sx={{ px: 3 }}>
              <Tab label="全部活动" />
              <Tab label="进行中" />
              <Tab label="即将开始" />
              <Tab label="已结束" />
            </Tabs>
          </Box>

          {/* 活动网格 */}
          <Box sx={{ p: 4 }}>
            {paginatedPromotions.length > 0 ? (
              <>
                <Grid container spacing={3}>
                  {paginatedPromotions.map((promotion) => (
                    <PromotionCard
                      key={promotion.id}
                      promotion={promotion}
                      onEdit={() => {}}
                      onDelete={handleDelete}
                    />
                  ))}
                </Grid>

                {/* 分页控件 */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                  <Pagination
                    count={Math.ceil(filteredPromotions.length / itemsPerPage)}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                    showFirstButton
                    showLastButton
                  />
                </Box>
              </>
            ) : (
              /* 空状态 */
              <Box sx={{ p: 8, textAlign: 'center' }}>
                <DiscountIcon sx={{ fontSize: 80, opacity: 0.3, mb: 3 }} />
                <Typography variant="h5" sx={{ mb: 2, opacity: 0.7 }}>
                  没有找到匹配的促销活动
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.5, mb: 4 }}>
                  尝试调整搜索条件或创建新的促销活动
                </Typography>
                <GradientButton startIcon={<AddIcon />} size="large">
                  创建第一个活动
                </GradientButton>
              </Box>
            )}
          </Box>
        </GlassCard>

        {/* 悬浮操作按钮 */}
        <Fab
          sx={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            width: 60,
            height: 60,
            '&:hover': {
              transform: 'scale(1.1)',
              background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
            },
            transition: 'all 0.3s ease'
          }}
        >
          <AddIcon />
        </Fab>
      </Container>
    </Box>
  );
};

export default ActiveManagement;