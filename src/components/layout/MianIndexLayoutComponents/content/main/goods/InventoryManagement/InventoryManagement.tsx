import React, { useState } from 'react';
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  InputAdornment,
  Avatar,
  Tooltip,
  Fab,
  Grid,
  alpha,
  useTheme,
  LinearProgress,
  Pagination,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  Inventory as InventoryIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  LocalShipping as ShippingIcon,
  Store as StoreIcon,
  AttachMoney as MoneyIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';

// 类型定义
interface Inventory {
  id: string;
  productId: string;
  productName: string;
  skuCode: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  reservedStock: number;
  availableStock: number;
  costPrice: number;
  totalValue: number;
  status: 'normal' | 'low' | 'out' | 'overstock';
  location: string;
  lastUpdated: string;
  turnoverRate?: number;
}

// 模拟数据
const defaultInventory: Inventory[] = [
  {
    id: '1',
    productId: '1',
    productName: 'iPhone 15 Pro',
    skuCode: 'IP15P-128-BLK',
    currentStock: 156,
    minStock: 10,
    maxStock: 500,
    reservedStock: 12,
    availableStock: 144,
    costPrice: 6500,
    totalValue: 1014000,
    status: 'normal',
    location: 'A区-01-01',
    lastUpdated: '2024-03-20 14:30:00',
    turnoverRate: 2.5
  },
  {
    id: '2',
    productId: '1',
    productName: 'iPhone 15 Pro',
    skuCode: 'IP15P-256-BLK',
    currentStock: 89,
    minStock: 10,
    maxStock: 300,
    reservedStock: 8,
    availableStock: 81,
    costPrice: 7500,
    totalValue: 667500,
    status: 'normal',
    location: 'A区-01-02',
    lastUpdated: '2024-03-20 09:15:00',
    turnoverRate: 1.8
  },
  {
    id: '3',
    productId: '2',
    productName: 'MacBook Air M3',
    skuCode: 'MBA-M3-8-256',
    currentStock: 3,
    minStock: 5,
    maxStock: 100,
    reservedStock: 2,
    availableStock: 1,
    costPrice: 7800,
    totalValue: 23400,
    status: 'low',
    location: 'A区-02-01',
    lastUpdated: '2024-03-19 16:45:00',
    turnoverRate: 3.2
  },
  {
    id: '4',
    productId: '3',
    productName: '耐克运动鞋',
    skuCode: 'NIKE-AIR-42-BLK',
    currentStock: 0,
    minStock: 5,
    maxStock: 200,
    reservedStock: 0,
    availableStock: 0,
    costPrice: 450,
    totalValue: 0,
    status: 'out',
    location: 'B区-01-01',
    lastUpdated: '2024-03-18 11:20:00',
    turnoverRate: 4.1
  },
  {
    id: '5',
    productId: '4',
    productName: '香奈儿香水',
    skuCode: 'CHANEL-50ML',
    currentStock: 234,
    minStock: 20,
    maxStock: 300,
    reservedStock: 45,
    availableStock: 189,
    costPrice: 900,
    totalValue: 210600,
    status: 'normal',
    location: 'C区-01-01',
    lastUpdated: '2024-03-20 10:30:00',
    turnoverRate: 1.2
  },
  {
    id: '6',
    productId: '5',
    productName: '索尼4K电视',
    skuCode: 'SONY-75-4K',
    currentStock: 567,
    minStock: 10,
    maxStock: 200,
    reservedStock: 23,
    availableStock: 544,
    costPrice: 8000,
    totalValue: 4536000,
    status: 'overstock',
    location: 'D区-01-01',
    lastUpdated: '2024-03-19 14:15:00',
    turnoverRate: 0.8
  },
  {
    id: '7',
    productId: '6',
    productName: '戴森吸尘器',
    skuCode: 'DYSON-V11',
    currentStock: 7,
    minStock: 5,
    maxStock: 50,
    reservedStock: 3,
    availableStock: 4,
    costPrice: 3200,
    totalValue: 22400,
    status: 'low',
    location: 'A区-03-01',
    lastUpdated: '2024-03-20 08:45:00',
    turnoverRate: 2.9
  },
  {
    id: '8',
    productId: '7',
    productName: '华为MatePad',
    skuCode: 'HUAWEI-MATEPAD',
    currentStock: 45,
    minStock: 10,
    maxStock: 100,
    reservedStock: 12,
    availableStock: 33,
    costPrice: 2800,
    totalValue: 126000,
    status: 'normal',
    location: 'B区-02-01',
    lastUpdated: '2024-03-20 13:20:00',
    turnoverRate: 2.1
  }
];

// 玻璃拟态效果卡片
const GlassCard = ({ children, sx = {} }:any) => (
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
const StatCard = ({ title, value, subtitle, icon, color, trend, format }:any) => {
  const formatValue = (val:any) => {
    if (format === 'currency') {
      return `¥${val.toLocaleString()}`;
    } else if (format === 'percent') {
      return `${val}%`;
    }
    return val.toLocaleString();
  };

  return (
    <Grid >
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
                mb: 1,
                fontSize: { xs: '2rem', md: '2.5rem' }
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
                {trend >= 0 ? (
                  <TrendingUpIcon sx={{ fontSize: 16, color: '#10b981' }} />
                ) : (
                  <TrendingDownIcon sx={{ fontSize: 16, color: '#ef4444' }} />
                )}
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

// 库存状态指示器
const StockStatus = ({ inventory }:any) => {
  const getStatusConfig = () => {
    switch (inventory.status) {
      case 'low':
        return {
          label: '低库存',
          color: 'warning',
          icon: <WarningIcon />,
          bgColor: '#fef3c7',
          textColor: '#92400e'
        };
      case 'out':
        return {
          label: '缺货',
          color: 'error',
          icon: <CancelIcon />,
          bgColor: '#fee2e2',
          textColor: '#dc2626'
        };
      case 'overstock':
        return {
          label: '积压',
          color: 'secondary',
          icon: <InventoryIcon />,
          bgColor: '#e0e7ff',
          textColor: '#3730a3'
        };
      default:
        return {
          label: '正常',
          color: 'success',
          icon: <CheckIcon />,
          bgColor: '#d1fae5',
          textColor: '#065f46'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <Chip
      icon={config.icon}
      label={config.label}
      color={config.color as any}
      variant="filled"
      sx={{
        backgroundColor: config.bgColor,
        color: config.textColor,
        fontWeight: 600,
        '& .MuiChip-icon': {
          color: config.textColor
        }
      }}
    />
  );
};

// 库存进度条
const StockProgress = ({ current, min, max }:any) => {
  const percentage = (current / max) * 100;
  const lowStockPercentage = (min / max) * 100;
  
  let color;
  if (current === 0) {
    color = '#ef4444';
  } else if (current <= min) {
    color = '#f59e0b';
  } else if (current > max) {
    color = '#8b5cf6';
  } else {
    color = '#10b981';
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
        <Typography variant="body2" sx={{ fontSize: '0.75rem', opacity: 0.7 }}>
          {current} / {max}
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.75rem', opacity: 0.7 }}>
          预警: {min}
        </Typography>
      </Box>
      <Box sx={{ position: 'relative', width: '100%' }}>
        <LinearProgress 
          variant="determinate" 
          value={Math.min(percentage, 100)}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: '#e5e7eb',
            '& .MuiLinearProgress-bar': {
              borderRadius: 4,
              backgroundColor: color
            }
          }}
        />
        {current > 0 && (
          <Box
            sx={{
              position: 'absolute',
              left: `${lowStockPercentage}%`,
              top: -2,
              width: 2,
              height: 12,
              backgroundColor: '#f59e0b',
              borderRadius: 1
            }}
          />
        )}
      </Box>
    </Box>
  );
};

// 库存操作对话框
const InventoryDialog = ({ open, onClose, onSave, inventory, type }:any) => {
  const [formData, setFormData] = useState({
    quantity: 0,
    type: 'in',
    reason: '',
    notes: '',
    fromLocation: '',
    toLocation: ''
  });

  React.useEffect(() => {
    if (inventory) {
      setFormData({
        quantity: 0,
        type: 'in',
        reason: '',
        notes: '',
        fromLocation: inventory.location,
        toLocation: ''
      });
    }
  }, [inventory]);

  const handleSubmit = () => {
    onSave({
      ...formData,
      productId: inventory?.productId,
      skuCode: inventory?.skuCode
    });
  };

  const dialogConfig :any = {
    adjust: {
      title: '调整库存',
      description: '手动调整商品库存数量'
    },
    transfer: {
      title: '库存调拨',
      description: '在不同仓库间调拨库存'
    },
    count: {
      title: '库存盘点',
      description: '进行库存盘点操作'
    }
  };

  const config = dialogConfig[type];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}>
        <Typography variant="h6" fontWeight="700">
          {config.title}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
          {config.description}
        </Typography>
      </DialogTitle>
      
      <DialogContent sx={{ p: 3 }}>
        {inventory && (
          <Box sx={{ mb: 3, p: 2, backgroundColor: '#f8fafc', borderRadius: 2 }}>
            <Typography variant="subtitle1" fontWeight="600">
              {inventory.productName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              SKU: {inventory.skuCode} | 当前位置: {inventory.location}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              当前库存: {inventory.currentStock} | 可用库存: {inventory.availableStock}
            </Typography>
          </Box>
        )}

        <Grid container spacing={2}>
          {type === 'adjust' && (
            <>
              <Grid >
                <TextField
                  fullWidth
                  select
                  label="操作类型"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  variant="outlined"
                >
                  <MenuItem value="in">入库</MenuItem>
                  <MenuItem value="out">出库</MenuItem>
                  <MenuItem value="adjust">调整</MenuItem>
                </TextField>
              </Grid>
              <Grid >
                <TextField
                  fullWidth
                  type="number"
                  label="数量"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                  variant="outlined"
                />
              </Grid>
              <Grid >
                <TextField
                  fullWidth
                  select
                  label="原因"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  variant="outlined"
                >
                  <MenuItem value="purchase">采购入库</MenuItem>
                  <MenuItem value="return">退货入库</MenuItem>
                  <MenuItem value="sale">销售出库</MenuItem>
                  <MenuItem value="damage">破损出库</MenuItem>
                  <MenuItem value="adjust">库存调整</MenuItem>
                </TextField>
              </Grid>
            </>
          )}

          {type === 'transfer' && (
            <>
              <Grid >
                <TextField
                  fullWidth
                  label="从位置"
                  value={formData.fromLocation}
                  onChange={(e) => setFormData({ ...formData, fromLocation: e.target.value })}
                  variant="outlined"
                />
              </Grid>
              <Grid >
                <TextField
                  fullWidth
                  label="到位置"
                  value={formData.toLocation}
                  onChange={(e) => setFormData({ ...formData, toLocation: e.target.value })}
                  variant="outlined"
                />
              </Grid>
              <Grid >
                <TextField
                  fullWidth
                  type="number"
                  label="调拨数量"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                  variant="outlined"
                />
              </Grid>
            </>
          )}

          {type === 'count' && (
            <>
              <Grid >
                <TextField
                  fullWidth
                  type="number"
                  label="盘点数量"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                  variant="outlined"
                />
              </Grid>
              <Grid >
                <TextField
                  fullWidth
                  label="差异说明"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  variant="outlined"
                  multiline
                  rows={3}
                />
              </Grid>
            </>
          )}

          <Grid >
            <TextField
              fullWidth
              label="备注"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              variant="outlined"
              multiline
              rows={2}
            />
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, gap: 2 }}>
        <Button onClick={onClose} variant="outlined">
          取消
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          disabled={!formData.quantity}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }}
        >
          确认操作
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// 主组件
const InventoryManagement = () => {
  const [inventory, setInventory] = useState(defaultInventory);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState('adjust');
  const [selectedInventory, setSelectedInventory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;

  // 过滤库存
  const filteredInventory = inventory.filter((item) => {
    const matchesSearch = item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.skuCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesLocation = locationFilter === 'all' || item.location.includes(locationFilter);
    return matchesSearch && matchesStatus && matchesLocation;
  });

  // 分页数据
  const paginatedInventory = filteredInventory.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // 打开对话框
  const handleOpenDialog = (type:any, item = null) => {
    setDialogType(type);
    setSelectedInventory(item);
    setDialogOpen(true);
  };

  // 保存操作
  const handleSave = (operationData:any) => {
    // 在实际应用中，这里会调用API
    console.log('库存操作:', operationData);
    setDialogOpen(false);
  };

  // 处理分页变化
  const handlePageChange = (event:any, value:any) => {
    setPage(value);
  };

  // 状态统计
  const stats = {
    totalProducts: inventory.length,
    totalValue: inventory.reduce((sum, item) => sum + item.totalValue, 0),
    lowStockItems: inventory.filter(item => item.status === 'low').length,
    outOfStockItems: inventory.filter(item => item.status === 'out').length,
    turnoverRate: inventory.reduce((sum, item) => sum + (item.turnoverRate || 0), 0) / inventory.length,
    totalStock: inventory.reduce((sum, item) => sum + item.currentStock, 0)
  };

  const statCards = [
    {
      title: '总库存价值',
      value: stats.totalValue,
      subtitle: '所有商品库存总值',
      icon: <MoneyIcon sx={{ fontSize: 24 }} />,
      color: '#667eea',
      trend: 8.5,
      format: 'currency'
    },
    {
      title: '总商品数',
      value: stats.totalProducts,
      subtitle: '所有SKU数量',
      icon: <InventoryIcon sx={{ fontSize: 24 }} />,
      color: '#f093fb',
      trend: 12,
      format: 'number'
    },
    {
      title: '低库存预警',
      value: stats.lowStockItems,
      subtitle: '需要补货的商品',
      icon: <WarningIcon sx={{ fontSize: 24 }} />,
      color: '#4facfe',
      trend: -5,
      format: 'number'
    },
    {
      title: '库存周转率',
      value: stats.turnoverRate.toFixed(1),
      subtitle: '平均周转率',
      icon: <RefreshIcon sx={{ fontSize: 24 }} />,
      color: '#43e97b',
      trend: 2.3,
      format: 'percent'
    }
  ];

  // 获取所有位置
  const locations = [...new Set(inventory.map(item => {
    const area = item.location.split('-')[0];
    return area;
  }))];

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
              format={stat.format}
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
                库存管理
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.7 }}>
                管理商品库存和库存操作
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
                  placeholder="搜索商品名称或SKU..."
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
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  InputProps={{
                    disableUnderline: true,
                  }}
                  variant="standard"
                >
                  <MenuItem value="all">全部状态</MenuItem>
                  <MenuItem value="normal">正常</MenuItem>
                  <MenuItem value="low">低库存</MenuItem>
                  <MenuItem value="out">缺货</MenuItem>
                  <MenuItem value="overstock">积压</MenuItem>
                </TextField>
              </GlassCard>

              <GlassCard sx={{ minWidth: { xs: 'auto', sm: 100 } }}>
                <TextField
                  select
                  size="small"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  InputProps={{
                    disableUnderline: true,
                  }}
                  variant="standard"
                >
                  <MenuItem value="all">全部区域</MenuItem>
                  {locations.map(location => (
                    <MenuItem key={location} value={location}>
                      {location}
                    </MenuItem>
                  ))}
                </TextField>
              </GlassCard>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  sx={{ whiteSpace: 'nowrap' }}
                >
                  导出
                </Button>
                <Button
                  variant="contained"
                  startIcon={<FilterIcon />}
                  onClick={() => handleOpenDialog('adjust')}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    whiteSpace: 'nowrap'
                  }}
                >
                  库存操作
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* 库存表格 */}
        <TableContainer>
          <Table sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow sx={{ 
                '& th': {
                  borderBottom: '2px solid rgba(0, 0, 0, 0.08)',
                  py: 2,
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: 'text.primary'
                }
              }}>
                <TableCell>商品信息</TableCell>
                <TableCell align="center">库存状态</TableCell>
                <TableCell align="center">库存数量</TableCell>
                <TableCell align="center">库存价值</TableCell>
                <TableCell align="center">周转率</TableCell>
                <TableCell align="center">库位</TableCell>
                <TableCell align="center">更新时间</TableCell>
                <TableCell align="center">操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedInventory.map((item : any) => (
                <TableRow 
                  key={item.id}
                  sx={{ 
                    '&:hover': { 
                      backgroundColor: 'rgba(0, 0, 0, 0.02)',
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar 
                        sx={{ 
                          width: 50, 
                          height: 50,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                        }}
                      >
                        <InventoryIcon sx={{ color: 'white' }} />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" fontWeight="600">
                          {item.productName}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.7 }}>
                          SKU: {item.skuCode}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <StockStatus inventory={item} />
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ minWidth: 120 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" fontWeight="600">
                          {item.currentStock}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.7 }}>
                          可用: {item.availableStock}
                        </Typography>
                      </Box>
                      <StockProgress 
                        current={item.currentStock}
                        min={item.minStock}
                        max={item.maxStock}
                      />
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" fontWeight="700" color="primary">
                        ¥{(item.totalValue / 10000).toFixed(1)}万
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.7 }}>
                        成本: ¥{item.costPrice}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                      {item.turnoverRate && item.turnoverRate >= 2 ? (
                        <TrendingUpIcon sx={{ color: '#10b981', fontSize: 20 }} />
                      ) : (
                        <TrendingDownIcon sx={{ color: '#ef4444', fontSize: 20 }} />
                      )}
                      <Typography 
                        variant="body1" 
                        fontWeight="600"
                        sx={{ color: item.turnoverRate && item.turnoverRate >= 2 ? '#10b981' : '#ef4444' }}
                      >
                        {item.turnoverRate}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                      <StoreIcon sx={{ fontSize: 16, opacity: 0.7 }} />
                      <Typography variant="body2" fontWeight="600">
                        {item.location}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      {item.lastUpdated.split(' ')[0]}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.6 }}>
                      {item.lastUpdated.split(' ')[1]}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                      <Tooltip title="调整库存">
                        <IconButton 
                          onClick={() => handleOpenDialog('adjust', item)}
                          sx={{ 
                            background: 'rgba(59, 130, 246, 0.1)',
                            '&:hover': { background: 'rgba(59, 130, 246, 0.2)' }
                          }}
                        >
                          <EditIcon sx={{ color: '#3b82f6', fontSize: 20 }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="库存调拨">
                        <IconButton
                          onClick={() => handleOpenDialog('transfer', item)}
                          sx={{ 
                            background: 'rgba(16, 185, 129, 0.1)',
                            '&:hover': { background: 'rgba(16, 185, 129, 0.2)' }
                          }}
                        >
                          <ShippingIcon sx={{ color: '#10b981', fontSize: 20 }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="库存盘点">
                        <IconButton
                          onClick={() => handleOpenDialog('count', item)}
                          sx={{ 
                            background: 'rgba(139, 92, 246, 0.1)',
                            '&:hover': { background: 'rgba(139, 92, 246, 0.2)' }
                          }}
                        >
                          <ViewIcon sx={{ color: '#8b5cf6', fontSize: 20 }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* 空状态 */}
        {paginatedInventory.length === 0 && (
          <Box sx={{ p: 6, textAlign: 'center' }}>
            <InventoryIcon sx={{ fontSize: 80, opacity: 0.3, mb: 2 }} />
            <Typography variant="h5" sx={{ mb: 1, opacity: 0.7 }}>
              没有找到匹配的库存记录
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.5, mb: 3 }}>
              尝试调整搜索条件
            </Typography>
          </Box>
        )}

        {/* 分页控件 */}
        {inventory.length > 0 && (
          <Box sx={{ 
            p: 2, 
            borderTop: '1px solid rgba(0, 0, 0, 0.08)',
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center'
          }}>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              共 {filteredInventory.length} 条库存记录
            </Typography>
            <Pagination
              count={Math.ceil(filteredInventory.length / itemsPerPage)}
              page={page}
              onChange={handlePageChange}
              color="primary"
              showFirstButton
              showLastButton
            />
          </Box>
        )}
      </GlassCard>

      {/* 库存操作对话框 */}
      <InventoryDialog 
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
        inventory={selectedInventory}
        type={dialogType}
      />

      {/* 悬浮操作按钮 */}
      <Fab
        onClick={() => handleOpenDialog('adjust')}
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

export default InventoryManagement;