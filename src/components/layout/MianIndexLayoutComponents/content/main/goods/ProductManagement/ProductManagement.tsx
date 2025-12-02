import React, { useState, useEffect } from 'react';
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
  Fade,
  Grow,
  Pagination,
  Switch,
  FormControlLabel,
  Rating,
  Badge
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Visibility as ViewIcon,
  ShoppingBag as ProductIcon,
  LocalOffer as OfferIcon,
  Inventory as InventoryIcon,
  TrendingUp as TrendingUpIcon,
  Image as ImageIcon,
  PlayArrow as VideoIcon,
  Star as StarIcon,
  Business as BusinessIcon,
  Place as PlaceIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';

// 类型定义 - 基于 Java 实体
export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  video: string;
  brand: string;
  placeOfOrigin: string;
  level: number;
  categoryId: string;
  publishTime: string;
  offlineTime: string;
  status?: 'active' | 'inactive';
  stock?: number;
  price?: number;
  rating?: number;
}

export interface ProductDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (productData: Omit<Product, 'id'>) => void;
  product: Product | null;
  categories: Category[];
}

export interface Category {
  id: string;
  name: string;
}

export interface ProductStats {
  total: number;
  active: number;
  inactive: number;
  totalStock: number;
  averageRating: number;
}

export interface ProductManagementProps {
  showStats?: boolean;
  containerStyle?: React.CSSProperties;
  className?: string;
  initialProducts?: Product[];
  categories?: Category[];
  onProductAdd?: (product: Product) => void;
  onProductEdit?: (product: Product) => void;
  onProductDelete?: (productId: string) => void;
}

// 模拟数据
const defaultCategories: Category[] = [
  { id: '1', name: '电子产品' },
  { id: '2', name: '服装服饰' },
  { id: '3', name: '家居用品' },
  { id: '4', name: '美妆护肤' },
  { id: '5', name: '食品饮料' }
];

const defaultProducts: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro',
    description: '最新款苹果手机，搭载A17 Pro芯片',
    image: '',
    video: '',
    brand: 'Apple',
    placeOfOrigin: '中国',
    level: 1,
    categoryId: '1',
    publishTime: '2024-01-15T10:00:00',
    offlineTime: '2025-01-15T10:00:00',
    status: 'active',
    stock: 156,
    price: 8999,
    rating: 4.8
  },
  {
    id: '2',
    name: 'MacBook Air M3',
    description: '轻薄便携的笔记本电脑，性能卓越',
    image: '',
    video: '',
    brand: 'Apple',
    placeOfOrigin: '中国',
    level: 1,
    categoryId: '1',
    publishTime: '2024-02-01T10:00:00',
    offlineTime: '2025-02-01T10:00:00',
    status: 'active',
    stock: 89,
    price: 10999,
    rating: 4.9
  },
  {
    id: '3',
    name: '索尼4K电视',
    description: '75英寸4K超高清智能电视',
    image: '',
    video: '',
    brand: 'Sony',
    placeOfOrigin: '日本',
    level: 2,
    categoryId: '1',
    publishTime: '2024-01-20T10:00:00',
    offlineTime: '2024-12-20T10:00:00',
    status: 'active',
    stock: 45,
    price: 12999,
    rating: 4.6
  },
  {
    id: '4',
    name: '耐克运动鞋',
    description: '舒适透气的运动跑步鞋',
    image: '',
    video: '',
    brand: 'Nike',
    placeOfOrigin: '越南',
    level: 3,
    categoryId: '2',
    publishTime: '2024-03-01T10:00:00',
    offlineTime: '2024-12-31T10:00:00',
    status: 'inactive',
    stock: 0,
    price: 699,
    rating: 4.4
  },
  {
    id: '5',
    name: '香奈儿香水',
    description: '经典女士香水，持久留香',
    image: '',
    video: '',
    brand: 'Chanel',
    placeOfOrigin: '法国',
    level: 1,
    categoryId: '4',
    publishTime: '2024-01-10T10:00:00',
    offlineTime: '2025-01-10T10:00:00',
    status: 'active',
    stock: 234,
    price: 1299,
    rating: 4.7
  }
];

// 玻璃拟态效果卡片
const GlassCard: React.FC<{ 
  children: React.ReactNode; 
  sx?: any;
  component?: React.ElementType;
}> = ({ children, sx, component = 'div', ...props }) => (
  <Card
    component={component}
    sx={{
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      borderRadius: 3,
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
      overflow: 'hidden',
      ...sx
    }}
    {...props}
  >
    {children}
  </Card>
);

// 统计卡片组件
const StatCard: React.FC<{
  title: string;
  value: number | string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  trend?: number;
  index: number;
}> = ({ title, value, subtitle, icon, color, trend, index }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * 100);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <Grid  >
      <Grow in={isVisible} timeout={800}>
        <GlassCard
          sx={{
            p: 3,
            background: `linear-gradient(135deg, ${alpha(color, 0.1)} 0%, ${alpha(color, 0.05)} 100%)`,
            border: `1px solid ${alpha(color, 0.2)}`,
            position: 'relative',
            overflow: 'visible',
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
                {typeof value === 'number' ? value.toLocaleString() : value}
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
      </Grow>
    </Grid>
  );
};

// 商品对话框组件
const ProductDialog: React.FC<ProductDialogProps> = ({ open, onClose, onSave, product, categories }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    image: product?.image || '',
    video: product?.video || '',
    brand: product?.brand || '',
    placeOfOrigin: product?.placeOfOrigin || '',
    level: product?.level || 1,
    categoryId: product?.categoryId || '',
    publishTime: product?.publishTime || '',
    offlineTime: product?.offlineTime || '',
    status: product?.status || 'active',
    stock: product?.stock || 0,
    price: product?.price || 0
  });

  React.useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        image: product.image,
        video: product.video,
        brand: product.brand,
        placeOfOrigin: product.placeOfOrigin,
        level: product.level,
        categoryId: product.categoryId,
        publishTime: product.publishTime,
        offlineTime: product.offlineTime,
        status: product.status || 'active',
        stock: product.stock || 0,
        price: product.price || 0
      });
    } else {
      setFormData({
        name: '',
        description: '',
        image: '',
        video: '',
        brand: '',
        placeOfOrigin: '',
        level: 1,
        categoryId: '',
        publishTime: '',
        offlineTime: '',
        status: 'active',
        stock: 0,
        price: 0
      });
    }
  }, [product]);

  const handleSubmit = () => {
    onSave(formData);
  };

  const isFormValid = formData.name.trim() && formData.description.trim() && formData.categoryId;

  const formatDateTime = (dateTime: string) => {
    if (!dateTime) return '';
    return dateTime.replace('T', ' ');
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      TransitionComponent={Fade}
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        textAlign: 'center',
        py: 3
      }}>
        <Typography variant="h5" fontWeight="700">
          {product ? '编辑商品' : '创建新商品'}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
          {product ? '更新商品信息' : '添加新的商品'}
        </Typography>
      </DialogTitle>
      
      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid>
            <TextField
              fullWidth
              label="商品名称"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              variant="outlined"
              required
            />
          </Grid>
          
          <Grid >
            <TextField
              fullWidth
              select
              label="商品等级"
              value={formData.level}
              onChange={(e) => setFormData({ ...formData, level: Number(e.target.value) })}
              variant="outlined"
            >
              <MenuItem value={1}>一级</MenuItem>
              <MenuItem value={2}>二级</MenuItem>
              <MenuItem value={3}>三级</MenuItem>
              <MenuItem value={4}>四级</MenuItem>
              <MenuItem value={5}>五级</MenuItem>
            </TextField>
          </Grid>

          <Grid>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="商品描述"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              variant="outlined"
              required
            />
          </Grid>

          <Grid >
            <TextField
              fullWidth
              label="品牌"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              variant="outlined"
            />
          </Grid>

          <Grid >
            <TextField
              fullWidth
              label="产地"
              value={formData.placeOfOrigin}
              onChange={(e) => setFormData({ ...formData, placeOfOrigin: e.target.value })}
              variant="outlined"
            />
          </Grid>

          <Grid >
            <TextField
              fullWidth
              select
              label="分类"
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              variant="outlined"
              required
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid >
            <FormControlLabel
              control={
                <Switch
                  checked={formData.status === 'active'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.checked ? 'active' : 'inactive' })}
                  color="primary"
                />
              }
              label={formData.status === 'active' ? '已上架' : '已下架'}
            />
          </Grid>

          <Grid >
            <TextField
              fullWidth
              type="number"
              label="库存数量"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
              variant="outlined"
            />
          </Grid>

          <Grid >
            <TextField
              fullWidth
              type="number"
              label="价格"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              variant="outlined"
              InputProps={{
                startAdornment: <InputAdornment position="start">¥</InputAdornment>,
              }}
            />
          </Grid>

          <Grid >
            <TextField
              fullWidth
              type="datetime-local"
              label="上架时间"
              value={formData.publishTime ? formatDateTime(formData.publishTime) : ''}
              onChange={(e) => setFormData({ ...formData, publishTime: e.target.value })}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid >
            <TextField
              fullWidth
              type="datetime-local"
              label="下架时间"
              value={formData.offlineTime ? formatDateTime(formData.offlineTime) : ''}
              onChange={(e) => setFormData({ ...formData, offlineTime: e.target.value })}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid >
            <Button
              fullWidth
              variant="outlined"
              startIcon={<ImageIcon />}
              sx={{ height: '56px' }}
            >
              上传商品图片
            </Button>
          </Grid>

          <Grid >
            <Button
              fullWidth
              variant="outlined"
              startIcon={<VideoIcon />}
              sx={{ height: '56px' }}
            >
              上传商品视频
            </Button>
          </Grid>
        </Grid>
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
          {product ? '更新商品' : '创建商品'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// 主组件
const ProductManagement: React.FC<ProductManagementProps> = ({
  showStats = true,
  containerStyle,
  className,
  initialProducts = defaultProducts,
  categories = defaultCategories,
  onProductAdd,
  onProductEdit,
  onProductDelete,
}) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [mounted, setMounted] = useState<boolean>(false);
  
  // 分页状态
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 过滤商品
  const filteredProducts = products.filter((product: Product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || product.categoryId === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // 分页数据
  const paginatedProducts = filteredProducts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // 打开添加对话框
  const handleAddClick = (): void => {
    setEditingProduct(null);
    setOpenDialog(true);
  };

  // 打开编辑对话框
  const handleEditClick = (product: Product): void => {
    setEditingProduct(product);
    setOpenDialog(true);
  };

  // 保存商品
  const handleSave = (productData: Omit<Product, 'id'>): void => {
    if (editingProduct) {
      const updatedProduct = { ...editingProduct, ...productData };
      setProducts(products.map(p => 
        p.id === editingProduct.id ? updatedProduct : p
      ));
      onProductEdit?.(updatedProduct);
    } else {
      const newProduct: Product = {
        ...productData,
        id: Math.max(...products.map(p => parseInt(p.id))) + 1 + '',
        rating: 0
      };
      setProducts([...products, newProduct]);
      onProductAdd?.(newProduct);
    }
    setOpenDialog(false);
  };

  // 删除商品
  const handleDelete = (productId: string): void => {
    if (window.confirm('确定要删除这个商品吗？此操作不可撤销。')) {
      setProducts(products.filter(p => p.id !== productId));
      onProductDelete?.(productId);
    }
  };

  // 处理分页变化
  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  // 状态统计
  const stats: ProductStats = {
    total: products.length,
    active: products.filter(p => p.status === 'active').length,
    inactive: products.filter(p => p.status === 'inactive').length,
    totalStock: products.reduce((sum, p) => sum + (p.stock || 0), 0),
    averageRating: products.reduce((sum, p) => sum + (p.rating || 0), 0) / products.length
  };

  const statCards = [
    {
      title: '商品总数',
      value: stats.total,
      subtitle: '所有商品数量',
      icon: <ProductIcon sx={{ fontSize: 24 }} />,
      color: '#667eea',
      trend: 15
    },
    {
      title: '在售商品',
      value: stats.active,
      subtitle: '已上架商品',
      icon: <InventoryIcon sx={{ fontSize: 24 }} />,
      color: '#f093fb',
      trend: 8
    },
    {
      title: '总库存',
      value: stats.totalStock,
      subtitle: '所有商品库存',
      icon: <OfferIcon sx={{ fontSize: 24 }} />,
      color: '#4facfe',
      trend: 12
    },
    {
      title: '平均评分',
      value: stats.averageRating.toFixed(1),
      subtitle: '商品平均评分',
      icon: <StarIcon sx={{ fontSize: 24 }} />,
      color: '#43e97b',
      trend: 5
    }
  ];

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : '未知分类';
  };

  const formatDate = (dateTime: string) => {
    if (!dateTime) return '-';
    return new Date(dateTime).toLocaleDateString();
  };

  const getStatusInfo = (product: Product) => {
    const now = new Date();
    const publishTime = new Date(product.publishTime);
    const offlineTime = new Date(product.offlineTime);
    
    if (product.status === 'inactive') {
      return { status: '已下架', color: 'error' as const };
    }
    
    if (now < publishTime) {
      return { status: '待上架', color: 'warning' as const };
    }
    
    if (now > offlineTime) {
      return { status: '已过期', color: 'error' as const };
    }
    
    return { status: '销售中', color: 'success' as const };
  };

  return (
    <Box 
      className={className}
      sx={{ 
        p: { xs: 2, md: 3 }, 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        ...containerStyle
      }}
    >
      {/* 报表部分 */}
      {showStats && (
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={3}>
            {statCards.map((stat, index) => (
              <StatCard
                key={index}
                index={index}
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
      )}

      {/* 主要内容区域 */}
      <GlassCard sx={{ flex: 1 }}>
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
                商品管理
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.7 }}>
                管理您的商品信息和库存
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
                  placeholder="搜索商品名称、描述或品牌..."
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
                  <MenuItem value="active">销售中</MenuItem>
                  <MenuItem value="inactive">已下架</MenuItem>
                </TextField>
              </GlassCard>

              <GlassCard sx={{ minWidth: { xs: 'auto', sm: 140 } }}>
                <TextField
                  select
                  size="small"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  InputProps={{
                    disableUnderline: true,
                  }}
                  variant="standard"
                >
                  <MenuItem value="all">全部分类</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
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
                新建商品
              </Button>
            </Box>
          </Box>
        </Box>

        {/* 商品表格 */}
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
                <TableCell align="center">品牌产地</TableCell>
                <TableCell align="center">分类等级</TableCell>
                <TableCell align="center">库存价格</TableCell>
                <TableCell align="center">评分状态</TableCell>
                <TableCell align="center">上架时间</TableCell>
                <TableCell align="center">操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedProducts.map((product) => {
                const statusInfo = getStatusInfo(product);
                return (
                <TableRow 
                  key={product.id}
                  sx={{ 
                    '&:hover': { 
                      backgroundColor: 'rgba(0, 0, 0, 0.02)',
                    },
                    transition: 'all 0.2s ease',
                    '& td': {
                      borderBottom: '1px solid rgba(0, 0, 0, 0.04)',
                      py: 2
                    }
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar 
                        sx={{ 
                          width: 60, 
                          height: 60,
                          borderRadius: 2,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                        }}
                      >
                        <ProductIcon sx={{ fontSize: 28, color: 'white' }} />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight="600" sx={{ mb: 0.5 }}>
                          {product.name}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.7, maxWidth: 300 }}>
                          {product.description}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ textAlign: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
                        <BusinessIcon sx={{ fontSize: 16, opacity: 0.7 }} />
                        <Typography variant="body2" fontWeight="600">
                          {product.brand}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                        <PlaceIcon sx={{ fontSize: 16, opacity: 0.7 }} />
                        <Typography variant="body2" sx={{ opacity: 0.7 }}>
                          {product.placeOfOrigin}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ textAlign: 'center' }}>
                      <Chip 
                        label={getCategoryName(product.categoryId)} 
                        size="small"
                        sx={{ mb: 1 }}
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                        <StarIcon sx={{ fontSize: 16, color: '#ffc107' }} />
                        <Typography variant="body2" fontWeight="600">
                          等级 {product.level}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ textAlign: 'center' }}>
                      <Badge 
                        badgeContent={product.stock} 
                        color={product.stock && product.stock > 0 ? "primary" : "error"}
                        sx={{ mb: 1 }}
                      >
                        <InventoryIcon color="action" />
                      </Badge>
                      <Typography variant="h6" fontWeight="700" color="primary">
                        ¥{product.price?.toLocaleString()}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ textAlign: 'center' }}>
                      <Rating 
                        value={product.rating} 
                        readOnly 
                        size="small"
                        sx={{ mb: 1 }}
                      />
                      <Chip 
                        label={statusInfo.status} 
                        color={statusInfo.color}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ textAlign: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 0.5 }}>
                        <ScheduleIcon sx={{ fontSize: 14, opacity: 0.7 }} />
                        <Typography variant="body2" fontWeight="600">
                          {formatDate(product.publishTime)}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ opacity: 0.7 }}>
                        至 {formatDate(product.offlineTime)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                      <Tooltip title="编辑">
                        <IconButton 
                          onClick={() => handleEditClick(product)}
                          sx={{ 
                            background: 'rgba(59, 130, 246, 0.1)',
                            '&:hover': { background: 'rgba(59, 130, 246, 0.2)' }
                          }}
                        >
                          <EditIcon sx={{ color: '#3b82f6', fontSize: 20 }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="查看">
                        <IconButton
                          sx={{ 
                            background: 'rgba(16, 185, 129, 0.1)',
                            '&:hover': { background: 'rgba(16, 185, 129, 0.2)' }
                          }}
                        >
                          <ViewIcon sx={{ color: '#10b981', fontSize: 20 }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="删除">
                        <IconButton 
                          onClick={() => handleDelete(product.id)}
                          sx={{ 
                            background: 'rgba(239, 68, 68, 0.1)',
                            '&:hover': { background: 'rgba(239, 68, 68, 0.2)' }
                          }}
                        >
                          <DeleteIcon sx={{ color: '#ef4444', fontSize: 20 }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              )})}
            </TableBody>
          </Table>
        </TableContainer>

        {/* 空状态 */}
        {paginatedProducts.length === 0 && (
          <Box sx={{ p: 6, textAlign: 'center' }}>
            <ProductIcon sx={{ fontSize: 80, opacity: 0.3, mb: 2 }} />
            <Typography variant="h5" sx={{ mb: 1, opacity: 0.7 }}>
              没有找到匹配的商品
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.5, mb: 3 }}>
              尝试调整搜索条件或创建新的商品
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
              创建第一个商品
            </Button>
          </Box>
        )}

        {/* 分页控件 */}
        {products.length > 0 && (
          <Box sx={{ 
            p: 2, 
            borderTop: '1px solid rgba(0, 0, 0, 0.08)',
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2
          }}>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              共 {filteredProducts.length} 个商品
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                每页显示:
              </Typography>
              <TextField
                select
                size="small"
                value={rowsPerPage}
                onChange={(e) => handleChangeRowsPerPage(parseInt(e.target.value, 10))}
                sx={{ minWidth: 80 }}
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
              </TextField>
              
              <Pagination
                count={Math.ceil(filteredProducts.length / rowsPerPage)}
                page={page + 1}
                onChange={(event, value) => handleChangePage(value - 1)}
                color="primary"
                showFirstButton
                showLastButton
              />
            </Box>
          </Box>
        )}
      </GlassCard>

      {/* 添加/编辑商品对话框 */}
      <ProductDialog 
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSave={handleSave}
        product={editingProduct}
        categories={categories}
      />

      {/* 悬浮添加按钮 */}
      {mounted && (
        <Fab
          onClick={handleAddClick}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            width: 56,
            height: 56,
            '&:hover': {
              background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
              transform: 'scale(1.05)'
            },
            transition: 'all 0.3s ease',
            boxShadow: '0 6px 20px rgba(102, 126, 234, 0.3)'
          }}
        >
          <AddIcon />
        </Fab>
      )}
    </Box>
  );
};

export default ProductManagement;