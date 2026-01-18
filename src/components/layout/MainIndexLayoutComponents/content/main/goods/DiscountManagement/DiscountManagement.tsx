import React, { useState } from 'react';
import {
  Box,
  Card,
  Grid,
  Chip,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  InputAdornment,
  Fab,
  alpha,
  useTheme,
  Avatar,
  FormControlLabel,
  Pagination,
  CardContent,
  CardActions,
  Divider,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  RadioGroup,
  Radio,
  FormControl,
  FormLabel,
  Tabs,
  Tab
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
  Category as CategoryIcon,
  Inventory as ProductIcon,
  Star as StarIcon,
  CardGiftcard as CouponIcon
} from '@mui/icons-material';
import { defaultDiscounts, type Discount, type DiscountDialogProps, type DiscountStats, type GlassCardProps } from './DiscountManagementType';





// 玻璃拟态效果卡片
const GlassCard: React.FC<GlassCardProps> = ({ children, sx = {} }) => (
  <Card
    sx={{
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      borderRadius: 3,
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
      overflow: 'hidden',
      ...sx
    }}
  >
    {children}
  </Card>
);

// 统计卡片组件
const StatCard = ({ title, value, subtitle, icon, color, trend }: {
  title: string;
  value: number;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  trend: number;
}) => {
  
  const formatValue = (val: number) => {
    if (title.includes('节省')) {
      return `¥${val.toLocaleString()}`;
    }
    return val.toLocaleString();
  };

  return (
    <Grid>
      <GlassCard
        sx={{
          p: 3,
          background: `linear-gradient(135deg, ${alpha(color, 0.1)} 0%, ${alpha(color, 0.05)} 100%)`,
          border: `1px solid ${alpha(color, 0.2)}`,
          height: '100%'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box sx={{ flex: 1 }}>
            <Typography 
              variant="h3" 
              fontWeight="800" 
              sx={{ 
                background: `linear-gradient(135deg, ${color} 0%, ${alpha(color, 0.8)} 100%)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1
              }}
            >
              {formatValue(value)}
            </Typography>
            <Typography variant="h6" fontWeight="600" sx={{ mb: 0.5 }}>
              {title}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.7, mb: 1 }}>
              {subtitle}
            </Typography>
            {trend !== undefined && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <TrendingUpIcon 
                  sx={{ 
                    fontSize: 16, 
                    color: trend >= 0 ? '#10b981' : '#ef4444',
                    transform: trend >= 0 ? 'none' : 'rotate(180deg)'
                  }} 
                />
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: trend >= 0 ? '#10b981' : '#ef4444',
                    fontWeight: 600
                  }}
                >
                  {trend >= 0 ? '+' : ''}{trend}%
                </Typography>
              </Box>
            )}
          </Box>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              background: `linear-gradient(135deg, ${color} 0%, ${alpha(color, 0.8)} 100%)`,
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 6px 20px ${alpha(color, 0.3)}`,
              ml: 1
            }}
          >
            {icon}
          </Box>
        </Box>
      </GlassCard>
    </Grid>
  );
};

// 优惠类型标签
const DiscountTypeChip = ({ type }: { type: 'percentage' | 'fixed' | 'coupon' | 'bundle' }) => {
  const typeConfig = {
    percentage: { label: '折扣', color: '#667eea', icon: <PercentIcon /> },
    fixed: { label: '满减', color: '#f093fb', icon: <MoneyIcon /> },
    coupon: { label: '优惠券', color: '#4facfe', icon: <CouponIcon /> },
    bundle: { label: '捆绑', color: '#43e97b', icon: <CartIcon /> }
  };

  const config = typeConfig[type];

  return (
    <Chip
      icon={config.icon}
      label={config.label}
      size="small"
      sx={{
        backgroundColor: alpha(config.color, 0.1),
        color: config.color,
        border: `1px solid ${alpha(config.color, 0.3)}`,
        fontWeight: 600
      }}
    />
  );
};

// 目标类型标签
const TargetTypeChip = ({ type }: { type: 'all' | 'category' | 'product' | 'userGroup' }) => {
  const typeConfig = {
    all: { label: '全场', color: '#667eea', icon: <StarIcon /> },
    category: { label: '分类', color: '#f093fb', icon: <CategoryIcon /> },
    product: { label: '商品', color: '#4facfe', icon: <ProductIcon /> },
    userGroup: { label: '用户组', color: '#43e97b', icon: <PeopleIcon /> }
  };

  const config = typeConfig[type];

  return (
    <Chip
      icon={config.icon}
      label={config.label}
      size="small"
      sx={{
        backgroundColor: alpha(config.color, 0.1),
        color: config.color,
        border: `1px solid ${alpha(config.color, 0.3)}`,
        fontWeight: 500
      }}
    />
  );
};

// 状态标签
const StatusChip = ({ status }: { status: 'active' | 'inactive' | 'scheduled' | 'expired' }) => {
  const statusConfig = {
    active: { label: '进行中', color: 'success' as const, icon: <CheckIcon /> },
    inactive: { label: '未开始', color: 'default' as const, icon: <ScheduleIcon /> },
    scheduled: { label: '已计划', color: 'warning' as const, icon: <CalendarIcon /> },
    expired: { label: '已过期', color: 'error' as const, icon: <CancelIcon /> }
  };

  const config = statusConfig[status];

  return (
    <Chip
      icon={config.icon}
      label={config.label}
      color={config.color}
      variant="filled"
      size="small"
      sx={{ fontWeight: 600 }}
    />
  );
};

// 优惠策略卡片组件
const DiscountCard = ({ discount, onEdit, onDelete }: {
  discount: Discount;
  onEdit: (discount: Discount) => void;
  onDelete: (id: string) => void;
}) => {
  
  const formatTime = (timeStr: string) => {
    return new Date(timeStr).toLocaleDateString();
  };

  const getDiscountDisplay = () => {
    switch (discount.type) {
      case 'percentage':
        return `${discount.value}% OFF`;
      case 'fixed':
        return `¥${discount.value} 减`;
      case 'coupon':
        return `优惠码: ${discount.code}`;
      case 'bundle':
        return '买一送一';
      default:
        return discount.value.toString();
    }
  };

  const getProgressValue = () => {
    if (!discount.usageLimit) return 0;
    return (discount.usedCount / discount.usageLimit) * 100;
  };

  return (
    <Grid>
      <GlassCard
        sx={{
          height: '100%',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
          }
        }}
      >
        <CardContent sx={{ p: 3, pb: 2 }}>
          {/* 卡片头部 */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                }}
              >
                <DiscountIcon sx={{ fontSize: 20 }} />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight="700" sx={{ mb: 0.5 }}>
                  {discount.name}
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <DiscountTypeChip type={discount.type} />
                  <TargetTypeChip type={discount.targetType} />
                </Box>
              </Box>
            </Box>
            <StatusChip status={discount.status} />
          </Box>

          {/* 优惠信息 */}
          <Box sx={{ textAlign: 'center', mb: 2, p: 2, backgroundColor: alpha('#667eea', 0.1), borderRadius: 2 }}>
            <Typography variant="h4" fontWeight="800" color="primary">
              {getDiscountDisplay()}
            </Typography>
            {discount.minAmount && (
              <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5 }}>
                满{discount.minAmount}元可用
              </Typography>
            )}
          </Box>

          {/* 描述 */}
          <Typography 
            variant="body2" 
            sx={{ 
              opacity: 0.8, 
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {discount.description}
          </Typography>

          {/* 时间信息 */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CalendarIcon sx={{ fontSize: 16, opacity: 0.7 }} />
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                {formatTime(discount.startTime)} - {formatTime(discount.endTime)}
              </Typography>
            </Box>
          </Box>

          {/* 使用情况 */}
          {discount.usageLimit && (
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2" sx={{ opacity: 0.7 }}>
                  使用进度
                </Typography>
                <Typography variant="body2" fontWeight="600">
                  {discount.usedCount} / {discount.usageLimit}
                </Typography>
              </Box>
              <Box
                sx={{
                  width: '100%',
                  height: 6,
                  backgroundColor: alpha('#000', 0.1),
                  borderRadius: 3,
                  overflow: 'hidden'
                }}
              >
                <Box
                  sx={{
                    width: `${getProgressValue()}%`,
                    height: '100%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: 3
                  }}
                />
              </Box>
            </Box>
          )}
        </CardContent>

        <Divider />

        <CardActions sx={{ p: 2, pt: 1.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PeopleIcon sx={{ fontSize: 16, opacity: 0.7 }} />
              <Typography variant="body2" fontWeight="600">
                {discount.usedCount} 次使用
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <MoneyIcon sx={{ fontSize: 16, opacity: 0.7 }} />
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                ¥{discount.totalDiscount.toLocaleString()}
              </Typography>
            </Box>
          </Box>
        </CardActions>

        {/* 操作按钮 */}
        <Box sx={{ p: 2, pt: 0, display: 'flex', gap: 1 }}>
          <Button
            fullWidth
            variant="outlined"
            size="small"
            startIcon={<EditIcon />}
            onClick={() => onEdit(discount)}
          >
            编辑
          </Button>
          <Button
            fullWidth
            variant="outlined"
            size="small"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => onDelete(discount.id)}
          >
            删除
          </Button>
        </Box>
      </GlassCard>
    </Grid>
  );
};

// 优惠策略对话框组件
const DiscountDialog: React.FC<DiscountDialogProps> = ({ open, onClose, onSave, discount }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    type: 'percentage' as 'percentage' | 'fixed' | 'coupon' | 'bundle',
    value: 10,
    minAmount: 0,
    maxDiscount: 0,
    description: '',
    targetType: 'all' as 'all' | 'category' | 'product' | 'userGroup',
    targetIds: [] as string[],
    startTime: '',
    endTime: '',
    status: 'active' as 'active' | 'inactive' | 'scheduled' | 'expired',
    usageLimit: 0,
    code: ''
  });

  React.useEffect(() => {
    if (discount) {
      setFormData({
        name: discount.name,
        type: discount.type,
        value: discount.value,
        minAmount: discount.minAmount || 0,
        maxDiscount: discount.maxDiscount || 0,
        description: discount.description,
        targetType: discount.targetType,
        targetIds: discount.targetIds,
        startTime: discount.startTime.split(' ')[0],
        endTime: discount.endTime.split(' ')[0],
        status: discount.status,
        usageLimit: discount.usageLimit || 0,
        code: discount.code || ''
      });
      setActiveStep(0);
    } else {
      setFormData({
        name: '',
        type: 'percentage',
        value: 10,
        minAmount: 0,
        maxDiscount: 0,
        description: '',
        targetType: 'all',
        targetIds: [],
        startTime: '',
        endTime: '',
        status: 'active',
        usageLimit: 0,
        code: ''
      });
    }
  }, [discount]);

  const handleSubmit = () => {
    const submitData = {
      ...formData,
      startTime: `${formData.startTime} 00:00:00`,
      endTime: `${formData.endTime} 23:59:59`
    };
    onSave(submitData);
  };

  const isFormValid = formData.name && formData.description && formData.startTime && formData.endTime;

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const steps = [
    { label: '基本信息', description: '设置优惠策略基本信息' },
    { label: '优惠规则', description: '配置优惠规则和条件' },
    { label: '适用范围', description: '设置优惠适用范围' },
    { label: '时间限制', description: '设置优惠时间范围' }
  ];

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid >
              <TextField
                fullWidth
                label="优惠名称"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                variant="outlined"
                required
                placeholder="例如：春季大促全场8折"
              />
            </Grid>
            
            <Grid >
              <TextField
                fullWidth
                multiline
                rows={3}
                label="优惠描述"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                variant="outlined"
                required
                placeholder="详细描述优惠策略的内容和规则"
              />
            </Grid>

            <Grid >
              <FormControl component="fieldset">
                <FormLabel component="legend">优惠类型</FormLabel>
                <RadioGroup
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                >
                  <FormControlLabel value="percentage" control={<Radio />} label="百分比折扣" />
                  <FormControlLabel value="fixed" control={<Radio />} label="固定金额减免" />
                  <FormControlLabel value="coupon" control={<Radio />} label="优惠券" />
                  <FormControlLabel value="bundle" control={<Radio />} label="捆绑优惠" />
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid >
              <FormControl component="fieldset">
                <FormLabel component="legend">状态</FormLabel>
                <RadioGroup
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                >
                  <FormControlLabel value="active" control={<Radio />} label="立即生效" />
                  <FormControlLabel value="scheduled" control={<Radio />} label="计划中" />
                  <FormControlLabel value="inactive" control={<Radio />} label="暂不启用" />
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid >
              <TextField
                fullWidth
                type="number"
                label={formData.type === 'percentage' ? '折扣比例 (%)' : '减免金额 (¥)'}
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                variant="outlined"
                InputProps={{
                  endAdornment: formData.type === 'percentage' ? 
                    <InputAdornment position="end">%</InputAdornment> : 
                    <InputAdornment position="start">¥</InputAdornment>,
                }}
              />
            </Grid>

            <Grid >
              <TextField
                fullWidth
                type="number"
                label="最低消费金额"
                value={formData.minAmount}
                onChange={(e) => setFormData({ ...formData, minAmount: Number(e.target.value) })}
                variant="outlined"
                InputProps={{
                  startAdornment: <InputAdornment position="start">¥</InputAdornment>,
                }}
              />
            </Grid>

            {formData.type === 'percentage' && (
              <Grid >
                <TextField
                  fullWidth
                  type="number"
                  label="最高优惠金额"
                  value={formData.maxDiscount}
                  onChange={(e) => setFormData({ ...formData, maxDiscount: Number(e.target.value) })}
                  variant="outlined"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">¥</InputAdornment>,
                  }}
                />
              </Grid>
            )}

            {formData.type === 'coupon' && (
              <Grid >
                <TextField
                  fullWidth
                  label="优惠码"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  variant="outlined"
                  placeholder="例如：SPRING2024"
                />
              </Grid>
            )}

            <Grid >
              <TextField
                fullWidth
                type="number"
                label="使用次数限制"
                value={formData.usageLimit}
                onChange={(e) => setFormData({ ...formData, usageLimit: Number(e.target.value) })}
                variant="outlined"
                helperText="0表示无限制"
              />
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid >
              <FormControl component="fieldset">
                <FormLabel component="legend">适用范围</FormLabel>
                <RadioGroup
                  value={formData.targetType}
                  onChange={(e) => setFormData({ ...formData, targetType: e.target.value as any })}
                >
                  <FormControlLabel value="all" control={<Radio />} label="全场商品" />
                  <FormControlLabel value="category" control={<Radio />} label="指定分类" />
                  <FormControlLabel value="product" control={<Radio />} label="指定商品" />
                  <FormControlLabel value="userGroup" control={<Radio />} label="指定用户组" />
                </RadioGroup>
              </FormControl>
            </Grid>

            {(formData.targetType === 'category' || formData.targetType === 'product' || formData.targetType === 'userGroup') && (
              <Grid >
                <TextField
                  fullWidth
                  label={`选择${formData.targetType === 'category' ? '分类' : formData.targetType === 'product' ? '商品' : '用户组'}`}
                  variant="outlined"
                  select
                  SelectProps={{
                    multiple: true
                  }}
                  value={formData.targetIds}
                  onChange={(e) => setFormData({ ...formData, targetIds: e.target.value as unknown as string[] })}
                >
                  <MenuItem value="electronics">电子产品</MenuItem>
                  <MenuItem value="clothing">服装服饰</MenuItem>
                  <MenuItem value="home">家居用品</MenuItem>
                  <MenuItem value="new_users">新用户</MenuItem>
                  <MenuItem value="vip_members">VIP会员</MenuItem>
                </TextField>
              </Grid>
            )}
          </Grid>
        );
      case 3:
        return (
          <Grid container spacing={3}>
            <Grid >
              <TextField
                fullWidth
                type="date"
                label="开始时间"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                variant="outlined"
                slotProps={{
  inputLabel: { shrink: true }
}}
              />
            </Grid>
            <Grid >
              <TextField
                fullWidth
                type="date"
                label="结束时间"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                variant="outlined"
                slotProps={{
  inputLabel: { shrink: true }
}}
              />
            </Grid>
          </Grid>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      slotProps={{
         paper:{sx: {
          borderRadius: 3,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          maxHeight: '90vh'
        }}
      }}
    >
      <DialogTitle sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        textAlign: 'center',
        py: 3
      }}>
        <Typography variant="h5" fontWeight="700">
          {discount ? '编辑优惠策略' : '创建新优惠策略'}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
          {discount ? '更新优惠策略信息' : '添加新的优惠策略'}
        </Typography>
      </DialogTitle>
      
      <DialogContent sx={{ p: 3 }}>
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel>
                <Typography variant="h6">{step.label}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {step.description}
                </Typography>
              </StepLabel>
              <StepContent>
                {getStepContent(index)}
                <Box sx={{ mb: 2, mt: 3 }}>
                  <div>
                    <Button
                      variant="contained"
                      onClick={index === steps.length - 1 ? handleSubmit : handleNext}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      {index === steps.length - 1 ? '完成' : '继续'}
                    </Button>
                    <Button
                      disabled={index === 0}
                      onClick={handleBack}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      返回
                    </Button>
                  </div>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, gap: 2 }}>
        <Button 
          onClick={onClose} 
          variant="outlined"
          sx={{ borderRadius: 2, px: 3 }}
        >
          取消
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          disabled={!isFormValid}
          sx={{
            borderRadius: 2,
            px: 3,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
          }}
        >
          {discount ? '更新策略' : '创建策略'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// 主组件
const DiscountManagement = () => {
  const theme = useTheme();
  const [discounts, setDiscounts] = useState<Discount[]>(defaultDiscounts);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [tabValue, setTabValue] = useState(0);
  
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;

  // 过滤优惠策略
  const filteredDiscounts = discounts.filter((discount) => {
    const matchesSearch = discount.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         discount.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || discount.status === statusFilter;
    const matchesType = typeFilter === 'all' || discount.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  // 分页数据
  const paginatedDiscounts = filteredDiscounts.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleAddClick = () => {
    setEditingDiscount(null);
    setOpenDialog(true);
  };

  const handleEditClick = (discount: Discount) => {
    setEditingDiscount(discount);
    setOpenDialog(true);
  };

  const handleSave = (discountData: Omit<Discount, 'id' | 'usedCount' | 'totalDiscount' | 'createdAt'>) => {
    if (editingDiscount) {
      setDiscounts(discounts.map(d => 
        d.id === editingDiscount.id ? { 
          ...d, 
          ...discountData
        } : d
      ));
    } else {
      const newDiscount: Discount = {
        ...discountData,
        id: (Math.max(...discounts.map(d => parseInt(d.id))) + 1).toString(),
        usedCount: 0,
        totalDiscount: 0,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setDiscounts([...discounts, newDiscount]);
    }
    setOpenDialog(false);
  };

  const handleDelete = (discountId: string) => {
    if (window.confirm('确定要删除这个优惠策略吗？此操作不可撤销。')) {
      setDiscounts(discounts.filter(d => d.id !== discountId));
    }
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    const statusMap = ['all', 'active', 'scheduled', 'expired'];
    setStatusFilter(statusMap[newValue]);
  };

  // 状态统计
  const stats: DiscountStats = {
    total: discounts.length,
    active: discounts.filter(d => d.status === 'active').length,
    scheduled: discounts.filter(d => d.status === 'scheduled').length,
    expired: discounts.filter(d => d.status === 'expired').length,
    totalUsage: discounts.reduce((sum, d) => sum + d.usedCount, 0),
    totalSavings: discounts.reduce((sum, d) => sum + d.totalDiscount, 0)
  };

  const statCards = [
    {
      title: '总策略数',
      value: stats.total,
      subtitle: '所有优惠策略',
      icon: <DiscountIcon sx={{ fontSize: 24 }} />,
      color: '#667eea',
      trend: 12
    },
    {
      title: '进行中',
      value: stats.active,
      subtitle: '活跃优惠策略',
      icon: <CheckIcon sx={{ fontSize: 24 }} />,
      color: '#f093fb',
      trend: 8
    },
    {
      title: '总使用次数',
      value: stats.totalUsage,
      subtitle: '策略使用总次数',
      icon: <PeopleIcon sx={{ fontSize: 24 }} />,
      color: '#4facfe',
      trend: 25
    },
    {
      title: '总节省金额',
      value: stats.totalSavings,
      subtitle: '为用户节省金额',
      icon: <MoneyIcon sx={{ fontSize: 24 }} />,
      color: '#43e97b',
      trend: 18
    }
  ];

  return (
    <Box sx={{ 
      p: 3, 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
    }}>
      {/* 报表部分 */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={3}>
          {statCards.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              subtitle={stat.subtitle}
              icon={stat.icon}
              color={stat.color}
              trend={stat.trend}
            />
          ))}
        </Grid>
      </Box>

      {/* 主要内容区域 */}
      <GlassCard>
        {/* 工具栏 */}
        <Box sx={{ p: 3, borderBottom: '1px solid rgba(0, 0, 0, 0.08)' }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between', 
            alignItems: { xs: 'stretch', md: 'center' },
            gap: 2
          }}>
            <Box sx={{ mb: { xs: 2, md: 0 } }}>
              <Typography variant="h4" fontWeight="700" sx={{ mb: 1 }}>
                优惠策略管理
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.7 }}>
                管理商品优惠策略和促销活动
              </Typography>
            </Box>
            
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2, 
              alignItems: { xs: 'stretch', sm: 'center' }
            }}>
              <GlassCard sx={{ minWidth: { xs: 'auto', sm: 250 } }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="搜索策略名称或描述..."
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
              
              <GlassCard sx={{ minWidth: { xs: 'auto', sm: 120 } }}>
                <TextField
                  select
                  size="small"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  InputProps={{
                    disableUnderline: true,
                  }}
                  variant="standard"
                >
                  <MenuItem value="all">全部类型</MenuItem>
                  <MenuItem value="percentage">折扣</MenuItem>
                  <MenuItem value="fixed">满减</MenuItem>
                  <MenuItem value="coupon">优惠券</MenuItem>
                  <MenuItem value="bundle">捆绑</MenuItem>
                </TextField>
              </GlassCard>
              
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddClick}
                sx={{
                  borderRadius: 2,
                  px: 3,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                  whiteSpace: 'nowrap'
                }}
              >
                新建策略
              </Button>
            </Box>
          </Box>
        </Box>

        {/* 标签页 */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="全部策略" />
            <Tab label="进行中" />
            <Tab label="已计划" />
            <Tab label="已过期" />
          </Tabs>
        </Box>

        {/* 优惠策略网格 */}
        <Box sx={{ p: 3 }}>
          {paginatedDiscounts.length > 0 ? (
            <>
              <Grid container spacing={3}>
                {paginatedDiscounts.map((discount) => (
                  <DiscountCard
                    key={discount.id}
                    discount={discount}
                    onEdit={handleEditClick}
                    onDelete={handleDelete}
                  />
                ))}
              </Grid>

              {/* 分页控件 */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                  count={Math.ceil(filteredDiscounts.length / itemsPerPage)}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  showFirstButton
                  showLastButton
                />
              </Box>
            </>
          ) : (
            /* 空状态 */
            <Box sx={{ p: 6, textAlign: 'center' }}>
              <DiscountIcon sx={{ fontSize: 80, opacity: 0.3, mb: 2 }} />
              <Typography variant="h5" sx={{ mb: 1, opacity: 0.7 }}>
                没有找到匹配的优惠策略
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.5, mb: 3 }}>
                尝试调整搜索条件或创建新的优惠策略
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddClick}
                sx={{
                  borderRadius: 2,
                  px: 4,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}
              >
                创建第一个策略
              </Button>
            </Box>
          )}
        </Box>
      </GlassCard>

      {/* 添加/编辑优惠策略对话框 */}
      <DiscountDialog 
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSave={handleSave}
        discount={editingDiscount}
      />

      {/* 悬浮添加按钮 */}
      <Fab
        onClick={handleAddClick}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          '&:hover': {
            background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
            transform: 'scale(1.05)'
          },
          transition: 'all 0.3s ease'
        }}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};

export default DiscountManagement;