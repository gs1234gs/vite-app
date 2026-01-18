import React, { useState } from 'react';
import {
  Box,
  Card,
  Grid,
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
  Tooltip,
  Fab,
  alpha,
  Avatar,
  Switch,
  FormControlLabel,
  Pagination,
  CardContent,
  CardActions,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  LocalOffer as TagIcon,
  ColorLens as ColorIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckIcon,
  Label as LabelIcon,
  Star as StarIcon,
  ShoppingBag as ProductIcon
} from '@mui/icons-material';

// 类型定义
interface Tag {
  id: string;
  name: string;
  color: string;
  description: string;
  productCount: number;
  status: 'active' | 'inactive';
  createdAt: string;
  usageCount?: number;
  isHot?: boolean;
}

// 模拟数据
const defaultTags: Tag[] = [
  {
    id: '1',
    name: '热销爆款',
    color: '#ff4757',
    description: '当前热销的商品标签',
    productCount: 156,
    status: 'active',
    createdAt: '2024-01-15',
    usageCount: 289,
    isHot: true
  },
  {
    id: '2',
    name: '新品上市',
    color: '#2ed573',
    description: '最新上架的商品',
    productCount: 89,
    status: 'active',
    createdAt: '2024-03-01',
    usageCount: 134,
    isHot: true
  },
  {
    id: '3',
    name: '限时特惠',
    color: '#ffa502',
    description: '限时优惠活动商品',
    productCount: 203,
    status: 'active',
    createdAt: '2024-02-10',
    usageCount: 367
  },
  {
    id: '4',
    name: '精选推荐',
    color: '#3742fa',
    description: '平台精选推荐商品',
    productCount: 178,
    status: 'active',
    createdAt: '2024-01-20',
    usageCount: 245
  },
  {
    id: '5',
    name: '库存紧张',
    color: '#ff6348',
    description: '库存较少的商品',
    productCount: 45,
    status: 'active',
    createdAt: '2024-02-28',
    usageCount: 67
  },
  {
    id: '6',
    name: '会员专享',
    color: '#8e44ad',
    description: '仅限会员购买的商品',
    productCount: 92,
    status: 'inactive',
    createdAt: '2024-01-05',
    usageCount: 156
  },
  {
    id: '7',
    name: '环保商品',
    color: '#27ae60',
    description: '环保材料制作商品',
    productCount: 78,
    status: 'active',
    createdAt: '2024-03-15',
    usageCount: 89
  },
  {
    id: '8',
    name: '进口商品',
    color: '#e67e22',
    description: '海外进口商品',
    productCount: 134,
    status: 'active',
    createdAt: '2024-02-20',
    usageCount: 198
  }
];

// 玻璃拟态效果卡片
const GlassCard = ({ children, sx = {} } : any) => (
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
const StatCard = ({ title, value, subtitle, icon, color, trend } :any) => {
  
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
                mb: 1
              }}
            >
              {value}
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

// 标签卡片组件
const TagCard = ({ tag, onEdit, onDelete } : any) => {
 
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
          {/* 标签头部 */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  background: `linear-gradient(135deg, ${tag.color} 0%, ${alpha(tag.color, 0.8)} 100%)`,
                  boxShadow: `0 4px 12px ${alpha(tag.color, 0.3)}`
                }}
              >
                <TagIcon sx={{ fontSize: 20 }} />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight="700" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {tag.name}
                  {tag.isHot && (
                    <StarIcon sx={{ fontSize: 16, color: '#ff6b6b' }} />
                  )}
                </Typography>
                <Chip
                  label={tag.status === 'active' ? '启用' : '停用'}
                  size="small"
                  color={tag.status === 'active' ? 'success' : 'default'}
                  sx={{ height: 20, fontSize: '0.7rem', mt: 0.5 }}
                />
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <Tooltip title="编辑">
                <IconButton 
                  size="small"
                  onClick={() => onEdit(tag)}
                  sx={{ 
                    background: 'rgba(59, 130, 246, 0.1)',
                    '&:hover': { background: 'rgba(59, 130, 246, 0.2)' }
                  }}
                >
                  <EditIcon sx={{ fontSize: 18, color: '#3b82f6' }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="删除">
                <IconButton 
                  size="small"
                  onClick={() => onDelete(tag.id)}
                  sx={{ 
                    background: 'rgba(239, 68, 68, 0.1)',
                    '&:hover': { background: 'rgba(239, 68, 68, 0.2)' }
                  }}
                >
                  <DeleteIcon sx={{ fontSize: 18, color: '#ef4444' }} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* 标签描述 */}
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
            {tag.description}
          </Typography>

          {/* 标签颜色预览 */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <ColorIcon sx={{ fontSize: 16, opacity: 0.7 }} />
            <Box
              sx={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: tag.color,
                border: `1px solid ${alpha('#000', 0.1)}`
              }}
            />
            <Typography variant="body2" sx={{ opacity: 0.7, fontSize: '0.8rem' }}>
              {tag.color}
            </Typography>
          </Box>
        </CardContent>

        <Divider />

        <CardActions sx={{ p: 2, pt: 1.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ProductIcon sx={{ fontSize: 16, opacity: 0.7 }} />
              <Typography variant="body2" fontWeight="600">
                {tag.productCount} 商品
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LabelIcon sx={{ fontSize: 16, opacity: 0.7 }} />
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                {tag.usageCount} 次使用
              </Typography>
            </Box>
          </Box>
        </CardActions>
      </GlassCard>
    </Grid>
  );
};

// 标签对话框组件
const TagDialog = ({ open, onClose, onSave, tag }:any) => {
  const [formData, setFormData] = useState({
    name: '',
    color: '#667eea',
    description: '',
    status: 'active',
    isHot: false
  });

  React.useEffect(() => {
    if (tag) {
      setFormData({
        name: tag.name,
        color: tag.color,
        description: tag.description,
        status: tag.status,
        isHot: tag.isHot || false
      });
    } else {
      setFormData({
        name: '',
        color: '#667eea',
        description: '',
        status: 'active',
        isHot: false
      });
    }
  }, [tag]);

  const handleSubmit = () => {
    onSave(formData);
  };

  const isFormValid = formData.name.trim() && formData.description.trim();

  // 预设颜色选项
  const colorOptions = [
    '#667eea', '#f093fb', '#4facfe', '#43e97b', '#ff6b6b', 
    '#ffa502', '#8e44ad', '#27ae60', '#e67e22', '#3498db'
  ];

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
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
          {tag ? '编辑标签' : '创建新标签'}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
          {tag ? '更新标签信息' : '添加新的商品标签'}
        </Typography>
      </DialogTitle>
      
      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid >
            <TextField
              fullWidth
              label="标签名称"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              variant="outlined"
              required
              placeholder="请输入标签名称"
            />
          </Grid>
          
          <Grid >
            <TextField
              fullWidth
              multiline
              rows={3}
              label="标签描述"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              variant="outlined"
              required
              placeholder="请输入标签描述"
            />
          </Grid>

          <Grid >
            <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2 }}>
              选择标签颜色
            </Typography>
            <Grid container spacing={1}>
              {colorOptions.map((color) => (
                <Grid key={color}>
                  <Tooltip title={color}>
                    <IconButton
                      onClick={() => setFormData({ ...formData, color })}
                      sx={{
                        width: 40,
                        height: 40,
                        background: color,
                        border: formData.color === color ? `3px solid ${alpha(color, 0.6)}` : 'none',
                        '&:hover': {
                          background: color,
                          transform: 'scale(1.1)'
                        },
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {formData.color === color && (
                        <CheckIcon sx={{ color: 'white', fontSize: 20 }} />
                      )}
                    </IconButton>
                  </Tooltip>
                </Grid>
              ))}
            </Grid>
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
              label={formData.status === 'active' ? '启用标签' : '停用标签'}
            />
          </Grid>

          <Grid >
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isHot}
                  onChange={(e) => setFormData({ ...formData, isHot: e.target.checked })}
                  color="secondary"
                />
              }
              label="热门标签"
            />
          </Grid>

          {/* 颜色预览 */}
          <Grid >
            <Box sx={{ p: 2, background: alpha(formData.color, 0.1), borderRadius: 2, textAlign: 'center' }}>
              <Chip
                label={formData.name || '标签预览'}
                sx={{
                  background: formData.color,
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '1rem',
                  px: 2,
                  py: 1
                }}
              />
              <Typography variant="body2" sx={{ mt: 1, opacity: 0.7 }}>
                当前颜色: {formData.color}
              </Typography>
            </Box>
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
          {tag ? '更新标签' : '创建标签'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// 主组件
const TagManagement = () => {
  const [tags, setTags] = useState(defaultTags);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTag, setEditingTag] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [hotFilter, setHotFilter] = useState('all');
  
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;

  // 过滤标签
  const filteredTags = tags.filter((tag) => {
    const matchesSearch = tag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tag.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || tag.status === statusFilter;
    const matchesHot = hotFilter === 'all' || 
                      (hotFilter === 'hot' && tag.isHot) ||
                      (hotFilter === 'normal' && !tag.isHot);
    return matchesSearch && matchesStatus && matchesHot;
  });

  // 分页数据
  const paginatedTags = filteredTags.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleAddClick = () => {
    setEditingTag(null);
    setOpenDialog(true);
  };

  const handleEditClick = (tag : any) => {
    setEditingTag(tag);
    setOpenDialog(true);
  };

  const handleSave = (tagData : any) => {
    if (editingTag) {
      setTags(tags.map(t => 
        t.id === editingTag.id ? { 
          ...t, 
          ...tagData,
          usageCount: tagData.isHot ? (t.usageCount || 0) + 50 : t.usageCount
        } : t
      ));
    } else {
      const newTag = {
        ...tagData,
        id: Math.max(...tags.map(t => parseInt(t.id))) + 1 + '',
        productCount: 0,
        usageCount: tagData.isHot ? 100 : 0,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setTags([...tags, newTag]);
    }
    setOpenDialog(false);
  };

  const handleDelete = (tagId : any) => {
    if (window.confirm('确定要删除这个标签吗？此操作不可撤销。')) {
      setTags(tags.filter(t => t.id !== tagId));
    }
  };

  const handlePageChange = (event : any, value : any) => {
    setPage(value);
  };

  // 状态统计
  const stats = {
    total: tags.length,
    active: tags.filter(t => t.status === 'active').length,
    inactive: tags.filter(t => t.status === 'inactive').length,
    hotTags: tags.filter(t => t.isHot).length,
    totalUsage: tags.reduce((sum, t) => sum + (t.usageCount || 0), 0)
  };

  const statCards = [
    {
      title: '标签总数',
      value: stats.total,
      subtitle: '所有商品标签',
      icon: <TagIcon sx={{ fontSize: 24 }} />,
      color: '#667eea',
      trend: 12
    },
    {
      title: '活跃标签',
      value: stats.active,
      subtitle: '正在使用的标签',
      icon: <CheckIcon sx={{ fontSize: 24 }} />,
      color: '#f093fb',
      trend: 8
    },
    {
      title: '热门标签',
      value: stats.hotTags,
      subtitle: '热门推荐标签',
      icon: <StarIcon sx={{ fontSize: 24 }} />,
      color: '#4facfe',
      trend: 15
    },
    {
      title: '总使用量',
      value: stats.totalUsage,
      subtitle: '标签使用次数',
      icon: <LabelIcon sx={{ fontSize: 24 }} />,
      color: '#43e97b',
      trend: 25
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
                商品标签管理
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.7 }}>
                管理商品标签和分类信息
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
                  placeholder="搜索标签名称或描述..."
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
                  <MenuItem value="active">启用</MenuItem>
                  <MenuItem value="inactive">停用</MenuItem>
                </TextField>
              </GlassCard>

              <GlassCard sx={{ minWidth: { xs: 'auto', sm: 120 } }}>
                <TextField
                  select
                  size="small"
                  value={hotFilter}
                  onChange={(e) => setHotFilter(e.target.value)}
                  InputProps={{
                    disableUnderline: true,
                  }}
                  variant="standard"
                >
                  <MenuItem value="all">全部标签</MenuItem>
                  <MenuItem value="hot">热门</MenuItem>
                  <MenuItem value="normal">普通</MenuItem>
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
                新建标签
              </Button>
            </Box>
          </Box>
        </Box>

        {/* 标签网格 */}
        <Box sx={{ p: 3 }}>
          {paginatedTags.length > 0 ? (
            <>
              <Grid container spacing={3}>
                {paginatedTags.map((tag) => (
                  <TagCard
                    key={tag.id}
                    tag={tag}
                    onEdit={handleEditClick}
                    onDelete={handleDelete}
                  />
                ))}
              </Grid>

              {/* 分页控件 */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                  count={Math.ceil(filteredTags.length / itemsPerPage)}
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
              <TagIcon sx={{ fontSize: 80, opacity: 0.3, mb: 2 }} />
              <Typography variant="h5" sx={{ mb: 1, opacity: 0.7 }}>
                没有找到匹配的标签
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.5, mb: 3 }}>
                尝试调整搜索条件或创建新的标签
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
                创建第一个标签
              </Button>
            </Box>
          )}
        </Box>
      </GlassCard>

      {/* 添加/编辑标签对话框 */}
      <TagDialog 
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSave={handleSave}
        tag={editingTag}
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

export default TagManagement;