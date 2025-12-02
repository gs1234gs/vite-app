
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
  useTheme,
  Avatar,
  Pagination,
  CardContent,
  CardActions,
  Divider,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  Container,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { TreeItem, TreeView } from '@mui/lab';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Folder as FolderIcon,
  Article as ArticleIcon,
  PictureAsPdf as PdfIcon,
  Description as DocIcon,
  TableChart as TableIcon,
  Code as CodeIcon,
  Image as ImageIcon,
  VideoLibrary as VideoIcon,
  AudioFile as AudioIcon,
  Share as ShareIcon,
  Download as DownloadIcon,
  Visibility as ViewIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Group as GroupIcon,
  Security as SecurityIcon,
  TrendingUp as TrendingIcon,
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
  InsertDriveFile as FileIcon,
  CloudUpload as UploadCloudIcon,
  Lock as LockIcon,
  Public as PublicIcon,
  Storage as StorageIcon
} from '@mui/icons-material';

// 类型定义
interface KnowledgeItem {
  id: string;
  name: string;
  type: 'folder' | 'document' | 'pdf' | 'image' | 'video' | 'audio' | 'code' | 'table';
  description: string;
  size: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  tags: string[];
  starred: boolean;
  bookmarked: boolean;
  views: number;
  downloads: number;
  permissions: 'public' | 'private' | 'team';
  category: string;
  version: number;
  lastModifiedBy?: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  itemCount: number;
  color: string;
  children?: Category[];
}

// 模拟数据
const initialCategories: Category[] = [
  {
    id: '1',
    name: '产品文档',
    description: '产品需求文档和设计文档',
    itemCount: 45,
    color: '#667eea',
    children: [
      {
        id: '1-1',
        name: '需求文档',
        description: '产品需求说明',
        itemCount: 23,
        color: '#667eea'
      },
      {
        id: '1-2',
        name: '设计文档',
        description: 'UI/UX设计文档',
        itemCount: 15,
        color: '#667eea'
      },
      {
        id: '1-3',
        name: '产品路线图',
        description: '产品发展规划',
        itemCount: 7,
        color: '#667eea'
      }
    ]
  },
  {
    id: '2',
    name: '技术文档',
    description: '技术架构和开发文档',
    itemCount: 78,
    color: '#f093fb',
    children: [
      {
        id: '2-1',
        name: 'API文档',
        description: '接口文档和说明',
        itemCount: 34,
        color: '#f093fb'
      },
      {
        id: '2-2',
        name: '系统架构',
        description: '技术架构设计',
        itemCount: 12,
        color: '#f093fb'
      },
      {
        id: '2-3',
        name: '部署指南',
        description: '部署和运维文档',
        itemCount: 18,
        color: '#f093fb'
      }
    ]
  },
  {
    id: '3',
    name: '团队资源',
    description: '团队协作和流程文档',
    itemCount: 32,
    color: '#4facfe',
    children: [
      {
        id: '3-1',
        name: '会议记录',
        description: '团队会议纪要',
        itemCount: 15,
        color: '#4facfe'
      },
      {
        id: '3-2',
        name: '流程规范',
        description: '工作流程和规范',
        itemCount: 10,
        color: '#4facfe'
      },
      {
        id: '3-3',
        name: '培训材料',
        description: '新员工培训资料',
        itemCount: 7,
        color: '#4facfe'
      }
    ]
  },
  {
    id: '4',
    name: '客户资料',
    description: '客户相关文档和资料',
    itemCount: 56,
    color: '#43e97b',
    children: [
      {
        id: '4-1',
        name: '客户案例',
        description: '成功案例分享',
        itemCount: 25,
        color: '#43e97b'
      },
      {
        id: '4-2',
        name: '合同文档',
        description: '客户合同和协议',
        itemCount: 18,
        color: '#43e97b'
      },
      {
        id: '4-3',
        name: '客户反馈',
        description: '客户意见和建议',
        itemCount: 13,
        color: '#43e97b'
      }
    ]
  }
];

const initialKnowledgeItems: KnowledgeItem[] = [
  {
    id: '1',
    name: '产品需求文档 v2.0',
    type: 'document',
    description: '最新版本的产品需求文档，包含所有功能模块的详细说明',
    size: '2.4 MB',
    createdAt: '2024-03-20',
    updatedAt: '2024-03-25',
    createdBy: '张伟',
    tags: ['重要', '产品', '需求'],
    starred: true,
    bookmarked: true,
    views: 156,
    downloads: 45,
    permissions: 'public',
    category: '产品文档',
    version: 2,
    lastModifiedBy: '李娜'
  },
  {
    id: '2',
    name: '系统架构设计',
    type: 'pdf',
    description: '系统整体架构设计文档，包含技术选型和架构图',
    size: '5.7 MB',
    createdAt: '2024-03-15',
    updatedAt: '2024-03-18',
    createdBy: '王磊',
    tags: ['技术', '架构', '设计'],
    starred: true,
    bookmarked: false,
    views: 89,
    downloads: 23,
    permissions: 'team',
    category: '技术文档',
    version: 1
  },
  {
    id: '3',
    name: 'API接口文档',
    type: 'document',
    description: '完整的API接口文档，包含请求示例和响应格式',
    size: '1.2 MB',
    createdAt: '2024-03-10',
    updatedAt: '2024-03-22',
    createdBy: '陈静',
    tags: ['API', '接口', '开发'],
    starred: false,
    bookmarked: true,
    views: 234,
    downloads: 67,
    permissions: 'public',
    category: '技术文档',
    version: 3,
    lastModifiedBy: '张伟'
  },
  {
    id: '4',
    name: 'UI设计稿',
    type: 'image',
    description: '产品UI设计稿，包含所有页面的设计图',
    size: '15.8 MB',
    createdAt: '2024-03-05',
    updatedAt: '2024-03-12',
    createdBy: '李娜',
    tags: ['设计', 'UI', '视觉'],
    starred: false,
    bookmarked: false,
    views: 78,
    downloads: 34,
    permissions: 'team',
    category: '产品文档',
    version: 1
  },
  {
    id: '5',
    name: '数据库设计',
    type: 'table',
    description: '数据库表结构设计和关系图',
    size: '3.1 MB',
    createdAt: '2024-02-28',
    updatedAt: '2024-03-20',
    createdBy: '王磊',
    tags: ['数据库', '设计', 'SQL'],
    starred: true,
    bookmarked: true,
    views: 112,
    downloads: 28,
    permissions: 'team',
    category: '技术文档',
    version: 2,
    lastModifiedBy: '陈静'
  },
  {
    id: '6',
    name: '项目会议记录',
    type: 'document',
    description: '最近项目会议记录和讨论要点',
    size: '0.8 MB',
    createdAt: '2024-03-24',
    updatedAt: '2024-03-24',
    createdBy: '张伟',
    tags: ['会议', '记录', '项目'],
    starred: false,
    bookmarked: false,
    views: 45,
    downloads: 12,
    permissions: 'private',
    category: '团队资源',
    version: 1
  },
  {
    id: '7',
    name: '部署指南',
    type: 'document',
    description: '系统部署和配置详细指南',
    size: '2.1 MB',
    createdAt: '2024-03-08',
    updatedAt: '2024-03-19',
    createdBy: '陈静',
    tags: ['部署', '运维', '指南'],
    starred: false,
    bookmarked: true,
    views: 167,
    downloads: 56,
    permissions: 'public',
    category: '技术文档',
    version: 2,
    lastModifiedBy: '王磊'
  },
  {
    id: '8',
    name: '客户案例研究',
    type: 'pdf',
    description: '成功客户案例分析和总结',
    size: '4.3 MB',
    createdAt: '2024-03-01',
    updatedAt: '2024-03-15',
    createdBy: '李娜',
    tags: ['客户', '案例', '成功'],
    starred: true,
    bookmarked: false,
    views: 98,
    downloads: 31,
    permissions: 'public',
    category: '客户资料',
    version: 1
  }
];

// 玻璃拟态效果卡片
const GlassCard = ({ children, sx = {} }: any) => (
  <Card
    sx={{
      background: 'rgba(255, 255, 255, 0.75)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      borderRadius: 3,
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

// 渐变按钮组件
const GradientButton = ({ children, ...props }: any) => (
  <Button
    {...props}
    sx={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      borderRadius: 2,
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

// 统计卡片组件
const StatCard = ({ title, value, subtitle, icon, color, trend }: any) => {
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
          <Typography variant="body2" sx={{ opacity: 0.7, mb: 1 }}>
            {subtitle}
          </Typography>
          {trend !== undefined && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <TrendingIcon sx={{ fontSize: 16, color: trend >= 0 ? '#10b981' : '#ef4444' }} />
              <Typography variant="body2" sx={{ color: trend >= 0 ? '#10b981' : '#ef4444', fontWeight: 600 }}>
                {trend >= 0 ? '+' : ''}{trend}%
              </Typography>
            </Box>
          )}
        </Box>
        <Box
          sx={{
            p: 2,
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
  );
};

// 文件类型图标
const FileTypeIcon = ({ type, sx = {} }: any) => {
  const iconConfig: any = {
    folder: <FolderIcon sx={{ color: '#667eea', ...sx }} />,
    document: <DocIcon sx={{ color: '#f093fb', ...sx }} />,
    pdf: <PdfIcon sx={{ color: '#ff6b6b', ...sx }} />,
    image: <ImageIcon sx={{ color: '#4facfe', ...sx }} />,
    video: <VideoIcon sx={{ color: '#43e97b', ...sx }} />,
    audio: <AudioIcon sx={{ color: '#a8e6cf', ...sx }} />,
    code: <CodeIcon sx={{ color: '#667eea', ...sx }} />,
    table: <TableIcon sx={{ color: '#f093fb', ...sx }} />
  };

  return iconConfig[type] || <FileIcon sx={{ color: '#666', ...sx }} />;
};

// 权限标签
const PermissionChip = ({ permissions }: { permissions: string }) => {
  const permissionConfig: any = {
    public: { label: '公开', color: 'success', icon: <PublicIcon /> },
    private: { label: '私有', color: 'error', icon: <LockIcon /> },
    team: { label: '团队', color: 'primary', icon: <GroupIcon /> }
  };

  const config = permissionConfig[permissions] || { label: '未知', color: 'default', icon: <SecurityIcon /> };

  return (
    <Chip
      icon={config.icon}
      label={config.label}
      color={config.color}
      variant="filled"
      size="small"
      sx={{ fontWeight: 600, borderRadius: 1 }}
    />
  );
};

// 知识项卡片组件
const KnowledgeItemCard = ({ item, onStar, onBookmark, onEdit, onDelete }: any) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 150);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Grid>
      <GlassCard
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          opacity: isVisible ? 1 : 0,
          transition: 'all 0.5s ease'
        }}
      >
        <CardContent sx={{ p: 3, flex: 1 }}>
          {/* 卡片头部 */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <FileTypeIcon type={item.type} sx={{ fontSize: 32 }} />
              <Box>
                <Typography variant="h6" fontWeight="700" sx={{ mb: 0.5 }}>
                  {item.name}
                </Typography>
                <PermissionChip permissions={item.permissions} />
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <IconButton 
                size="small" 
                onClick={() => onStar(item.id)}
                color={item.starred ? 'warning' : 'default'}
              >
                {item.starred ? <StarIcon /> : <StarBorderIcon />}
              </IconButton>
              <IconButton 
                size="small" 
                onClick={() => onBookmark(item.id)}
                color={item.bookmarked ? 'primary' : 'default'}
              >
                {item.bookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
              </IconButton>
            </Box>
          </Box>

          {/* 描述 */}
          <Typography variant="body2" sx={{ opacity: 0.8, mb: 3 }}>
            {item.description}
          </Typography>

          {/* 标签 */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
            {item.tags.map((tag: string, index: number) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                variant="outlined"
                sx={{ borderRadius: 1, fontSize: '0.75rem' }}
              />
            ))}
          </Box>

          {/* 元信息 */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <Box>
              <Typography variant="caption" sx={{ opacity: 0.7, display: 'block' }}>
                大小
              </Typography>
              <Typography variant="body2" fontWeight="600">
                {item.size}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ opacity: 0.7, display: 'block' }}>
                版本
              </Typography>
              <Typography variant="body2" fontWeight="600">
                v{item.version}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ opacity: 0.7, display: 'block' }}>
                浏览
              </Typography>
              <Typography variant="body2" fontWeight="600">
                {item.views}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ opacity: 0.7, display: 'block' }}>
                下载
              </Typography>
              <Typography variant="body2" fontWeight="600">
                {item.downloads}
              </Typography>
            </Box>
          </Box>
        </CardContent>

        <Divider />

        <CardActions sx={{ p: 2, gap: 1 }}>
          <Tooltip title="查看">
            <IconButton size="small">
              <ViewIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="下载">
            <IconButton size="small">
              <DownloadIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="分享">
            <IconButton size="small">
              <ShareIcon />
            </IconButton>
          </Tooltip>
          <Box sx={{ flex: 1 }} />
          <Tooltip title="编辑">
            <IconButton 
              size="small"
              onClick={() => onEdit(item)}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="删除">
            <IconButton 
              size="small" 
              color="error"
              onClick={() => onDelete(item.id)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </CardActions>
      </GlassCard>
    </Grid>
  );
};

// 分类树组件
const CategoryTree = ({ categories, onSelect }: any) => {
  const renderTree = (nodes: any) => (
    <TreeItem
      key={nodes.id}
      nodeId={nodes.id}
      label={
        <Box sx={{ display: 'flex', alignItems: 'center', py: 0.5 }}>
          <FolderIcon sx={{ color: nodes.color, mr: 1 }} />
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" fontWeight="600">
              {nodes.name}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.7 }}>
              {nodes.itemCount} 个文档
            </Typography>
          </Box>
        </Box>
      }
      onClick={() => onSelect(nodes)}
    >
      {Array.isArray(nodes.children) ? nodes.children.map((node: any) => renderTree(node)) : null}
    </TreeItem>
  );

  return (
    <GlassCard sx={{ p: 2 }}>
      <Typography variant="h6" fontWeight="700" sx={{ mb: 2 }}>
        分类目录
      </Typography>
      <TreeView
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        sx={{ flexGrow: 1 }}
      >
        {categories.map((category: any) => renderTree(category))}
      </TreeView>
    </GlassCard>
  );
};

// 最近活动组件
const RecentActivity = ({ activities }: any) => (
  <GlassCard sx={{ p: 3 }}>
    <Typography variant="h6" fontWeight="700" sx={{ mb: 2 }}>
      最近活动
    </Typography>
    <List dense>
      {activities.map((activity: any, index: number) => (
        <ListItem key={index} sx={{ px: 0 }}>
          <ListItemIcon sx={{ minWidth: 40 }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: activity.color }}>
              {activity.user.charAt(0)}
            </Avatar>
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography variant="body2">
                <strong>{activity.user}</strong> {activity.action} <strong>{activity.item}</strong>
              </Typography>
            }
            secondary={activity.time}
          />
        </ListItem>
      ))}
    </List>
  </GlassCard>
);

// 主组件
const KnowledgeManagement = () => {
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [permissionFilter, setPermissionFilter] = useState('all');
  const [tabValue, setTabValue] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 9;

  // 模拟数据加载
  useEffect(() => {
    const timer = setTimeout(() => {
      setKnowledgeItems(initialKnowledgeItems);
      setCategories(initialCategories);
      setLoading(false);
    }, 0);
    
    return () => clearTimeout(timer);
  }, []);

  // 统计数据
  const stats = {
    total: knowledgeItems.length,
    documents: knowledgeItems.filter(item => item.type === 'document').length,
    starred: knowledgeItems.filter(item => item.starred).length,
    totalSize: '45.2 MB'
  };

  // 最近活动数据
  const recentActivities = [
    {
      user: '张伟',
      action: '上传了',
      item: '产品需求文档 v2.0',
      time: '2小时前',
      color: '#667eea'
    },
    {
      user: '李娜',
      action: '更新了',
      item: 'UI设计稿',
      time: '5小时前',
      color: '#f093fb'
    },
    {
      user: '王磊',
      action: '创建了',
      item: '技术架构文档',
      time: '昨天',
      color: '#4facfe'
    },
    {
      user: '陈静',
      action: '分享了',
      item: 'API接口文档',
      time: '2天前',
      color: '#43e97b'
    }
  ];

  // 过滤知识项
  const filteredItems = knowledgeItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    const matchesPermission = permissionFilter === 'all' || item.permissions === permissionFilter;
    
    return matchesSearch && matchesCategory && matchesType && matchesPermission;
  });

  // 分页数据
  const paginatedItems = filteredItems.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setCategoryFilter(category.name);
  };

  const handleStar = (id: string) => {
    setKnowledgeItems(items => 
      items.map(item => 
        item.id === id ? { ...item, starred: !item.starred } : item
      )
    );
  };

  const handleBookmark = (id: string) => {
    setKnowledgeItems(items => 
      items.map(item => 
        item.id === id ? { ...item, bookmarked: !item.bookmarked } : item
      )
    );
  };

  const handleEdit = (item: KnowledgeItem) => {
    console.log('编辑知识项:', item.name);
    // 这里可以添加编辑逻辑
  };

  const handleDelete = (id: string) => {
    if (window.confirm('确定要删除这个知识项吗？此操作不可撤销。')) {
      setKnowledgeItems(items => items.filter(item => item.id !== id));
    }
  };

  const statCards = [
    {
      title: '总文档数',
      value: stats.total,
      subtitle: '所有知识文档',
      icon: <ArticleIcon sx={{ fontSize: 28 }} />,
      color: '#667eea',
      trend: 12
    },
    {
      title: '文本文档',
      value: stats.documents,
      subtitle: '文档和PDF文件',
      icon: <DocIcon sx={{ fontSize: 28 }} />,
      color: '#f093fb',
      trend: 8
    },
    {
      title: '收藏项目',
      value: stats.starred,
      subtitle: '星标重要文档',
      icon: <StarIcon sx={{ fontSize: 28 }} />,
      color: '#4facfe',
      trend: 15
    },
    {
      title: '总存储',
      value: stats.totalSize,
      subtitle: '知识库总容量',
      icon: <StorageIcon sx={{ fontSize: 28 }} />,
      color: '#43e97b',
      trend: 25
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
            加载知识库数据...
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.7 }}>
            正在获取知识文档和分类信息
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
            知识库管理
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.7, maxWidth: 600, mx: 'auto' }}>
            集中管理团队知识资产，促进知识共享和协作
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
        <Grid container spacing={3}>
          {/* 侧边栏 */}
          <Grid >
            <CategoryTree categories={categories} onSelect={handleCategorySelect} />
            <Box sx={{ mt: 3 }}>
              <RecentActivity activities={recentActivities} />
            </Box>
          </Grid>

          {/* 主内容区 */}
          <Grid >
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
                      {selectedCategory ? selectedCategory.name : '所有知识'}
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.7 }}>
                      {selectedCategory ? selectedCategory.description : '管理和浏览所有知识文档'}
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
                        placeholder="搜索文档、标签或描述..."
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
                        <MenuItem value="document">文档</MenuItem>
                        <MenuItem value="pdf">PDF</MenuItem>
                        <MenuItem value="image">图片</MenuItem>
                        <MenuItem value="code">代码</MenuItem>
                      </TextField>
                    </GlassCard>

                    <GradientButton startIcon={<UploadCloudIcon />}>
                      上传文档
                    </GradientButton>
                  </Box>
                </Box>
              </Box>

              {/* 标签页 */}
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={handleTabChange} sx={{ px: 3 }}>
                  <Tab label="所有文档" />
                  <Tab label="我的收藏" />
                  <Tab label="最近查看" />
                  <Tab label="团队共享" />
                </Tabs>
              </Box>

              {/* 内容区域 */}
              <Box sx={{ p: 4 }}>
                {paginatedItems.length > 0 ? (
                  <>
                    <Grid container spacing={3}>
                      {paginatedItems.map((item) => (
                        <KnowledgeItemCard
                          key={item.id}
                          item={item}
                          onStar={handleStar}
                          onBookmark={handleBookmark}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                        />
                      ))}
                    </Grid>

                    {/* 分页控件 */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                      <Pagination
                        count={Math.ceil(filteredItems.length / itemsPerPage)}
                        page={page}
                        onChange={(e, value) => setPage(value)}
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
                    <ArticleIcon sx={{ fontSize: 80, opacity: 0.3, mb: 3 }} />
                    <Typography variant="h5" sx={{ mb: 2, opacity: 0.7 }}>
                      没有找到匹配的文档
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.5, mb: 4 }}>
                      尝试调整搜索条件或上传新的文档
                    </Typography>
                    <GradientButton startIcon={<UploadCloudIcon />} size="large">
                      上传第一个文档
                    </GradientButton>
                  </Box>
                )}
              </Box>
            </GlassCard>
          </Grid>
        </Grid>

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

export default KnowledgeManagement;
