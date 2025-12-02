import React, { useState, useEffect, useRef } from 'react';
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
  LinearProgress,
  alpha,
  useTheme,
  Fade,
  Grow,
  Pagination
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Category as CategoryIcon,
  Inventory as InventoryIcon,
  TrendingUp as TrendingUpIcon,
  Image as ImageIcon,
  Store as StoreIcon
} from '@mui/icons-material';

// 类型定义
export interface Category {
  id: number;
  name: string;
  description: string;
  productCount: number;
  status: 'active' | 'inactive';
  image: string;
  createdAt: string;
  growth?: number;
}

export interface CategoryDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (categoryData: Omit<Category, 'id' | 'productCount' | 'createdAt' | 'growth'>) => void;
  category: Category | null;
}

export interface Stats {
  total: number;
  active: number;
  inactive: number;
  totalProducts: number;
  growthRate: number;
}

export interface CategoryManagementProps {
  // 允许父组件控制是否显示报表
  showStats?: boolean;
  // 允许父组件传递自定义样式
  containerStyle?: React.CSSProperties;
  // 允许父组件传递自定义类名
  className?: string;
  // 允许父组件控制初始数据
  initialCategories?: Category[];
  // 回调函数
  onCategoryAdd?: (category: Category) => void;
  onCategoryEdit?: (category: Category) => void;
  onCategoryDelete?: (categoryId: number) => void;
}

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

// 独立的报表组件 - 可以被父组件单独使用
export const CategoryStats: React.FC<{ 
  stats: Stats;
  showGrowth?: boolean;
  compact?: boolean;
  sx?: any;
}> = ({ stats, showGrowth = true, compact = false, sx }) => {
  const statCards = [
    {
      title: '分类总数',
      value: stats.total,
      subtitle: '所有商品分类',
      icon: <CategoryIcon sx={{ fontSize: compact ? 20 : 24 }} />,
      color: '#667eea',
      trend: 12
    },
    {
      title: '活跃分类',
      value: stats.active,
      subtitle: '正在使用的分类',
      icon: <InventoryIcon sx={{ fontSize: compact ? 20 : 24 }} />,
      color: '#f093fb',
      trend: 8
    },
    {
      title: '总商品数',
      value: stats.totalProducts,
      subtitle: '所有分类商品',
      icon: <StoreIcon sx={{ fontSize: compact ? 20 : 24 }} />,
      color: '#4facfe',
      trend: 15
    },
    {
      title: '本月增长',
      value: stats.growthRate,
      subtitle: '相比上月',
      icon: <TrendingUpIcon sx={{ fontSize: compact ? 20 : 24 }} />,
      color: '#43e97b',
      trend: 8.5
    }
  ];

  return (
    <Grid container spacing={compact ? 1 : 2} sx={sx}>
      {statCards.map((stat, index) => (
        <Grid key={index}>
          <Grow in timeout={800}>
            <GlassCard
              sx={{
                p: compact ? 1.5 : 2,
                background: `linear-gradient(135deg, ${alpha(stat.color, 0.1)} 0%, ${alpha(stat.color, 0.05)} 100%)`,
                border: `1px solid ${alpha(stat.color, 0.2)}`,
                height: '100%'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <Box sx={{ flex: 1 }}>
                  <Typography 
                    variant={compact ? "h5" : "h4"} 
                    fontWeight="800" 
                    sx={{ 
                      background: `linear-gradient(135deg, ${stat.color} 0%, ${alpha(stat.color, 0.8)} 100%)`,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      mb: 0.5
                    }}
                  >
                    {stat.value.toLocaleString()}
                  </Typography>
                  <Typography 
                    variant={compact ? "body1" : "h6"} 
                    fontWeight="600" 
                    sx={{ mb: 0.25, fontSize: compact ? '0.8rem' : '0.9rem' }}
                  >
                    {stat.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      opacity: 0.7, 
                      fontSize: compact ? '0.7rem' : '0.75rem' 
                    }}
                  >
                    {stat.subtitle}
                  </Typography>
                  {showGrowth && stat.trend !== undefined && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                      <TrendingUpIcon 
                        sx={{ 
                          fontSize: compact ? 12 : 14, 
                          color: stat.trend >= 0 ? '#10b981' : '#ef4444',
                          transform: stat.trend >= 0 ? 'none' : 'rotate(180deg)'
                        }} 
                      />
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: stat.trend >= 0 ? '#10b981' : '#ef4444',
                          fontWeight: 600,
                          fontSize: compact ? '0.7rem' : '0.75rem'
                        }}
                      >
                        {stat.trend >= 0 ? '+' : ''}{stat.trend}%
                      </Typography>
                    </Box>
                  )}
                </Box>
                <Box
                  sx={{
                    p: compact ? 1 : 1,
                    borderRadius: 2,
                    background: `linear-gradient(135deg, ${stat.color} 0%, ${alpha(stat.color, 0.8)} 100%)`,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 4px 12px ${alpha(stat.color, 0.3)}`,
                    ml: 1
                  }}
                >
                  {stat.icon}
                </Box>
              </Box>
            </GlassCard>
          </Grow>
        </Grid>
      ))}
    </Grid>
  );
};

// 分类表格组件 - 可以被父组件单独使用
export const CategoryTable: React.FC<{
  categories: Category[];
  stats: Stats;
  onEdit: (category: Category) => void;
  onDelete: (categoryId: number) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  onAddClick: () => void;
  paginatedCategories: Category[];
  page: number;
  rowsPerPage: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newRowsPerPage: number) => void;
  totalCount: number;
  showToolbar?: boolean;
  sx?: any;
}> = ({
  categories,
  stats,
  onEdit,
  onDelete,
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onAddClick,
  paginatedCategories,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  totalCount,
  showToolbar = true,
  sx
}) => {
  return (
    <GlassCard sx={sx}>
      {/* 工具栏 */}
      {showToolbar && (
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
                商品分类管理
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.7 }}>
                管理您的商品分类和库存信息
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
                  placeholder="搜索分类..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
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
                  onChange={(e) => onStatusFilterChange(e.target.value)}
                  InputProps={{
                    disableUnderline: true,
                  }}
                  variant="standard"
                >
                  <MenuItem value="all">全部状态</MenuItem>
                  <MenuItem value="active">启用</MenuItem>
                  <MenuItem value="inactive">停用</MenuItem>
                </TextField>
              </GlassCard>
              
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={onAddClick}
                sx={{
                  borderRadius: 2,
                  px: 3,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                  whiteSpace: 'nowrap'
                }}
              >
                新建分类
              </Button>
            </Box>
          </Box>
        </Box>
      )}

      {/* 分类表格 */}
      <TableContainer>
        <Table sx={{ minWidth: 650 }}>
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
              <TableCell>分类信息</TableCell>
              <TableCell align="center">商品数量</TableCell>
              <TableCell align="center">增长趋势</TableCell>
              <TableCell align="center">状态</TableCell>
              <TableCell align="center">创建时间</TableCell>
              <TableCell align="center">操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedCategories.map((category) => (
              <TableRow 
                key={category.id}
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
                      <CategoryIcon sx={{ fontSize: 28, color: 'white' }} />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight="600" sx={{ mb: 0.5 }}>
                        {category.name}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.7, maxWidth: 300 }}>
                        {category.description}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" fontWeight="700" color="primary">
                      {category.productCount}
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={Math.min((category.productCount / stats.totalProducts) * 100, 100)}
                      sx={{ 
                        mt: 1, 
                        height: 6, 
                        borderRadius: 3,
                        backgroundColor: 'rgba(0, 0, 0, 0.1)',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 3,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                        }
                      }}
                    />
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                    <TrendingUpIcon 
                      sx={{ 
                        fontSize: 20, 
                        color: category.growth && category.growth >= 0 ? '#10b981' : '#ef4444'
                      }} 
                    />
                    <Typography 
                      variant="body1" 
                      fontWeight="600"
                      sx={{ 
                        color: category.growth && category.growth >= 0 ? '#10b981' : '#ef4444'
                      }}
                    >
                      {category.growth && category.growth >= 0 ? '+' : ''}{category.growth}%
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Chip 
                    label={category.status === 'active' ? '启用中' : '已停用'} 
                    color={category.status === 'active' ? 'success' : 'default'}
                    sx={{
                      fontWeight: 600,
                      borderRadius: 1,
                      background: category.status === 'active' 
                        ? 'rgba(16, 185, 129, 0.1)' 
                        : 'rgba(107, 114, 128, 0.1)',
                      color: category.status === 'active' ? '#10b981' : '#6b7280',
                      border: `1px solid ${category.status === 'active' ? '#10b981' : '#6b7280'}20`
                    }}
                  />
                </TableCell>
                <TableCell align="center">
                  <Typography variant="body1" fontWeight="600" sx={{ opacity: 0.8 }}>
                    {category.createdAt}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                    <Tooltip title="编辑">
                      <IconButton 
                        onClick={() => onEdit(category)}
                        sx={{ 
                          background: 'rgba(59, 130, 246, 0.1)',
                          '&:hover': { background: 'rgba(59, 130, 246, 0.2)' }
                        }}
                      >
                        <EditIcon sx={{ color: '#3b82f6', fontSize: 20 }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="删除">
                      <IconButton 
                        onClick={() => onDelete(category.id)}
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
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 空状态 */}
      {paginatedCategories.length === 0 && (
        <Box sx={{ p: 6, textAlign: 'center' }}>
          <CategoryIcon sx={{ fontSize: 80, opacity: 0.3, mb: 2 }} />
          <Typography variant="h5" sx={{ mb: 1, opacity: 0.7 }}>
            没有找到匹配的分类
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.5, mb: 3 }}>
            尝试调整搜索条件或创建新的分类
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onAddClick}
            sx={{
              borderRadius: 2,
              px: 4,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}
          >
            创建第一个分类
          </Button>
        </Box>
      )}

      {/* 分页控件 */}
      {categories.length > 0 && (
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
            共 {totalCount} 个分类
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              每页显示:
            </Typography>
            <TextField
              select
              size="small"
              value={rowsPerPage}
              onChange={(e) => onRowsPerPageChange(parseInt(e.target.value, 10))}
              sx={{ minWidth: 80 }}
            >
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={50}>50</MenuItem>
            </TextField>
            
            <Pagination
              count={Math.ceil(totalCount / rowsPerPage)}
              page={page + 1}
              onChange={(event, value) => onPageChange(value - 1)}
              color="primary"
              showFirstButton
              showLastButton
            />
          </Box>
        </Box>
      )}
    </GlassCard>
  );
};

// 分类对话框组件
const CategoryDialog: React.FC<CategoryDialogProps> = ({ open, onClose, onSave, category }) => {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    description: category?.description || '',
    status: category?.status || 'active' as 'active' | 'inactive',
    image: category?.image || ''
  });

  React.useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description,
        status: category.status,
        image: category.image
      });
    } else {
      setFormData({
        name: '',
        description: '',
        status: 'active',
        image: ''
      });
    }
  }, [category]);

  const handleSubmit = () => {
    onSave(formData);
  };

  const isFormValid = formData.name.trim() && formData.description.trim();

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      TransitionComponent={Fade}
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
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
          {category ? '编辑分类' : '创建新分类'}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
          {category ? '更新分类信息' : '添加新的商品分类'}
        </Typography>
      </DialogTitle>
      
      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={2}>
          <Grid >
            <TextField
              fullWidth
              label="分类名称"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              variant="outlined"
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  background: 'rgba(255, 255, 255, 0.8)'
                }
              }}
            />
          </Grid>
          
          <Grid  >
            <TextField
              fullWidth
              multiline
              rows={3}
              label="分类描述"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              variant="outlined"
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  background: 'rgba(255, 255, 255, 0.8)'
                }
              }}
            />
          </Grid>
          
          <Grid >
            <TextField
              fullWidth
              select
              label="状态"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  background: 'rgba(255, 255, 255, 0.8)'
                }
              }}
            >
              <MenuItem value="active">启用</MenuItem>
              <MenuItem value="inactive">停用</MenuItem>
            </TextField>
          </Grid>
          
          <Grid >
            <Button
              fullWidth
              variant="outlined"
              startIcon={<ImageIcon />}
              sx={{ 
                height: '56px',
                borderRadius: 2,
                borderColor: 'divider'
              }}
            >
              上传图片
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button 
          onClick={onClose} 
          variant="outlined"
          sx={{ 
            borderRadius: 2,
            px: 3,
            borderColor: 'divider'
          }}
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
            '&:hover': {
              boxShadow: '0 8px 25px rgba(102, 126, 234, 0.6)'
            }
          }}
        >
          {category ? '更新分类' : '创建分类'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// 模拟数据
const defaultCategories: Category[] = Array.from({ length: 45 }, (_, index) => ({
  id: index + 1,
  name: `分类 ${index + 1}`,
  description: `这是分类 ${index + 1} 的详细描述信息`,
  productCount: Math.floor(Math.random() * 500) + 50,
  status: Math.random() > 0.2 ? 'active' : 'inactive',
  image: '',
  createdAt: `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
  growth: Math.floor(Math.random() * 30) - 5
}));

// 主组件
const CategoryManagement: React.FC<CategoryManagementProps> = ({
  showStats = true,
  containerStyle,
  className,
  initialCategories = defaultCategories,
  onCategoryAdd,
  onCategoryEdit,
  onCategoryDelete,
}) => {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [mounted, setMounted] = useState<boolean>(false);
  
  // 分页状态
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 过滤分类
  const filteredCategories = categories.filter((category: Category) => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || category.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // 分页数据
  const paginatedCategories = filteredCategories.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // 打开添加对话框
  const handleAddClick = (): void => {
    setEditingCategory(null);
    setOpenDialog(true);
  };

  // 打开编辑对话框
  const handleEditClick = (category: Category): void => {
    setEditingCategory(category);
    setOpenDialog(true);
  };

  // 保存分类
  const handleSave = (categoryData: Omit<Category, 'id' | 'productCount' | 'createdAt' | 'growth'>): void => {
    if (editingCategory) {
      const updatedCategory = { ...editingCategory, ...categoryData };
      setCategories(categories.map(cat => 
        cat.id === editingCategory.id ? updatedCategory : cat
      ));
      onCategoryEdit?.(updatedCategory);
    } else {
      const newCategory: Category = {
        ...categoryData,
        id: Math.max(...categories.map(c => c.id)) + 1,
        productCount: 0,
        createdAt: new Date().toISOString().split('T')[0],
        growth: Math.floor(Math.random() * 21) - 5
      };
      setCategories([...categories, newCategory]);
      onCategoryAdd?.(newCategory);
    }
    setOpenDialog(false);
  };

  // 删除分类
  const handleDelete = (categoryId: number): void => {
    if (window.confirm('确定要删除这个分类吗？此操作不可撤销。')) {
      setCategories(categories.filter(cat => cat.id !== categoryId));
      onCategoryDelete?.(categoryId);
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
  const stats: Stats = {
    total: categories.length,
    active: categories.filter(cat => cat.status === 'active').length,
    inactive: categories.filter(cat => cat.status === 'inactive').length,
    totalProducts: categories.reduce((sum, cat) => sum + cat.productCount, 0),
    growthRate: 8.5
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
      {/* 报表部分 - 父组件可以通过 showStats 控制是否显示 */}
      {showStats && (
        <Box sx={{ mb: 3 }}>
          <CategoryStats stats={stats} />
        </Box>
      )}

      {/* 表格部分 */}
      <Box sx={{ flex: 1 }}>
        <CategoryTable
          categories={categories}
          stats={stats}
          onEdit={handleEditClick}
          onDelete={handleDelete}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          onAddClick={handleAddClick}
          paginatedCategories={paginatedCategories}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          totalCount={filteredCategories.length}
        />
      </Box>

      {/* 添加/编辑分类对话框 */}
      <CategoryDialog 
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSave={handleSave}
        category={editingCategory}
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

export default CategoryManagement;