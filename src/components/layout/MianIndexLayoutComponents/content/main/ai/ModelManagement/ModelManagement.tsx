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
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  PlayArrow as PlayIcon,
  Code as CodeIcon,
  Storage as StorageIcon,
  Speed as SpeedIcon,
  Memory as MemoryIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Download as DownloadIcon,
  Compare as CompareIcon,
  BarChart as ChartIcon,
  CloudUpload as DeployIcon,
  CloudDownload as RollbackIcon,
  Visibility as ViewIcon,
  AccountTree as BranchIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';

// 类型定义
interface ModelVersion {
  id: string;
  name: string;
  version: string;
  description: string;
  status: 'active' | 'training' | 'deployed' | 'archived' | 'failed';
  accuracy: number;
  loss: number;
  dataset: string;
  framework: 'tensorflow' | 'pytorch' | 'scikit-learn' | 'xgboost';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  fileSize: string;
  metrics: {
    precision: number;
    recall: number;
    f1Score: number;
    auc: number;
  };
  deployment: {
    isDeployed: boolean;
    deployedAt?: string;
    endpoints?: string[];
    performance?: {
      latency: number;
      throughput: number;
      errorRate: number;
    };
  };
  tags: string[];
}

interface Model {
  id: string;
  name: string;
  description: string;
  category: string;
  versions: ModelVersion[];
  currentVersion: string;
  createdAt: string;
  updatedAt: string;
}

// 模拟数据
const initialModels: Model[] = [
  {
    id: '1',
    name: '图像分类模型',
    description: '用于商品图像分类的深度学习模型',
    category: '计算机视觉',
    currentVersion: 'v2.1.0',
    createdAt: '2024-01-15',
    updatedAt: '2024-03-20',
    versions: [
      {
        id: '1-1',
        name: '图像分类模型',
        version: 'v2.1.0',
        description: '优化了数据增强策略，提升泛化能力',
        status: 'deployed',
        accuracy: 94.5,
        loss: 0.12,
        dataset: 'ImageNet-1K',
        framework: 'tensorflow',
        createdAt: '2024-03-20',
        updatedAt: '2024-03-20',
        createdBy: '张伟',
        fileSize: '245 MB',
        metrics: {
          precision: 0.943,
          recall: 0.948,
          f1Score: 0.945,
          auc: 0.982
        },
        deployment: {
          isDeployed: true,
          deployedAt: '2024-03-21',
          endpoints: ['https://api.example.com/model/v2.1.0/predict'],
          performance: {
            latency: 45,
            throughput: 2200,
            errorRate: 0.02
          }
        },
        tags: ['生产环境', '高精度', '稳定']
      },
      {
        id: '1-2',
        name: '图像分类模型',
        version: 'v2.0.0',
        description: '引入注意力机制，提升复杂场景识别',
        status: 'archived',
        accuracy: 92.8,
        loss: 0.18,
        dataset: 'ImageNet-1K',
        framework: 'tensorflow',
        createdAt: '2024-02-15',
        updatedAt: '2024-02-15',
        createdBy: '张伟',
        fileSize: '238 MB',
        metrics: {
          precision: 0.925,
          recall: 0.931,
          f1Score: 0.928,
          auc: 0.975
        },
        deployment: {
          isDeployed: false
        },
        tags: ['稳定', '历史版本']
      }
    ]
  },
  {
    id: '2',
    name: '推荐系统模型',
    description: '基于深度学习的个性化推荐模型',
    category: '推荐系统',
    currentVersion: 'v1.5.0',
    createdAt: '2024-02-01',
    updatedAt: '2024-03-25',
    versions: [
      {
        id: '2-1',
        name: '推荐系统模型',
        version: 'v1.5.0',
        description: '优化embedding层，提升推荐相关性',
        status: 'deployed',
        accuracy: 88.3,
        loss: 0.25,
        dataset: '用户行为日志',
        framework: 'pytorch',
        createdAt: '2024-03-25',
        updatedAt: '2024-03-25',
        createdBy: '李娜',
        fileSize: '156 MB',
        metrics: {
          precision: 0.879,
          recall: 0.887,
          f1Score: 0.883,
          auc: 0.934
        },
        deployment: {
          isDeployed: true,
          deployedAt: '2024-03-26',
          endpoints: ['https://api.example.com/recommend/v1.5.0'],
          performance: {
            latency: 28,
            throughput: 3500,
            errorRate: 0.015
          }
        },
        tags: ['A/B测试', '高性能']
      },
      {
        id: '2-2',
        name: '推荐系统模型',
        version: 'v1.4.0',
        description: '引入时序特征，提升实时推荐效果',
        status: 'active',
        accuracy: 86.7,
        loss: 0.29,
        dataset: '用户行为日志',
        framework: 'pytorch',
        createdAt: '2024-03-10',
        updatedAt: '2024-03-10',
        createdBy: '李娜',
        fileSize: '148 MB',
        metrics: {
          precision: 0.863,
          recall: 0.871,
          f1Score: 0.867,
          auc: 0.921
        },
        deployment: {
          isDeployed: false
        },
        tags: ['备选版本']
      }
    ]
  },
  {
    id: '3',
    name: '情感分析模型',
    description: '基于BERT的文本情感分析模型',
    category: '自然语言处理',
    currentVersion: 'v3.2.0',
    createdAt: '2024-01-20',
    updatedAt: '2024-03-28',
    versions: [
      {
        id: '3-1',
        name: '情感分析模型',
        version: 'v3.2.0',
        description: '在金融领域数据上fine-tune',
        status: 'training',
        accuracy: 91.2,
        loss: 0.21,
        dataset: '金融文本',
        framework: 'pytorch',
        createdAt: '2024-03-28',
        updatedAt: '2024-03-28',
        createdBy: '王磊',
        fileSize: '420 MB',
        metrics: {
          precision: 0.908,
          recall: 0.916,
          f1Score: 0.912,
          auc: 0.961
        },
        deployment: {
          isDeployed: false
        },
        tags: ['训练中', '金融领域']
      }
    ]
  },
  {
    id: '4',
    name: '欺诈检测模型',
    description: '基于XGBoost的交易欺诈检测模型',
    category: '风控',
    currentVersion: 'v1.0.0',
    createdAt: '2024-03-01',
    updatedAt: '2024-03-22',
    versions: [
      {
        id: '4-1',
        name: '欺诈检测模型',
        version: 'v1.0.0',
        description: '初始版本，基础特征工程',
        status: 'failed',
        accuracy: 95.8,
        loss: 0.08,
        dataset: '交易数据',
        framework: 'xgboost',
        createdAt: '2024-03-22',
        updatedAt: '2024-03-22',
        createdBy: '陈静',
        fileSize: '45 MB',
        metrics: {
          precision: 0.955,
          recall: 0.961,
          f1Score: 0.958,
          auc: 0.989
        },
        deployment: {
          isDeployed: false
        },
        tags: ['测试失败', '需要调优']
      }
    ]
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
              <TrendingUpIcon sx={{ fontSize: 16, color: trend >= 0 ? '#10b981' : '#ef4444' }} />
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

// 状态标签
const StatusChip = ({ status }: { status: string }) => {
  const statusConfig: any = {
    active: { label: '可用', color: 'success', icon: <CheckIcon /> },
    training: { label: '训练中', color: 'warning', icon: <ScheduleIcon /> },
    deployed: { label: '已部署', color: 'primary', icon: <PlayIcon /> },
    archived: { label: '已归档', color: 'default', icon: <StorageIcon /> },
    failed: { label: '失败', color: 'error', icon: <ErrorIcon /> }
  };

  const config = statusConfig[status] || { label: '未知', color: 'default', icon: <InfoIcon /> };

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

// 框架标签
const FrameworkChip = ({ framework }: { framework: string }) => {
  const frameworkConfig: any = {
    tensorflow: { label: 'TensorFlow', color: '#FF6F00' },
    pytorch: { label: 'PyTorch', color: '#EE4C2C' },
    'scikit-learn': { label: 'Scikit-Learn', color: '#F7931E' },
    xgboost: { label: 'XGBoost', color: '#2CAAF2' }
  };

  const config = frameworkConfig[framework] || { label: framework, color: '#666' };

  return (
    <Chip
      label={config.label}
      size="small"
      sx={{
        backgroundColor: alpha(config.color, 0.1),
        color: config.color,
        border: `1px solid ${alpha(config.color, 0.3)}`,
        fontWeight: 500,
        borderRadius: 1
      }}
    />
  );
};

// 性能指标组件
const PerformanceIndicator = ({ value, max = 100, label, color = '#667eea' }: any) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
    <Box sx={{ minWidth: 80 }}>
      <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
        {label}
      </Typography>
      <Typography variant="h6" sx={{ color, fontWeight: 700 }}>
        {value}%
      </Typography>
    </Box>
    <Box sx={{ flex: 1 }}>
      <LinearProgress 
        variant="determinate" 
        value={value} 
        sx={{ 
          height: 8, 
          borderRadius: 4,
          backgroundColor: alpha(color, 0.2),
          '& .MuiLinearProgress-bar': {
            backgroundColor: color,
            borderRadius: 4
          }
        }}
      />
    </Box>
  </Box>
);

// 模型卡片组件
const ModelCard = ({ model, onDeploy, onEdit, onDelete }: any) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 150);
    return () => clearTimeout(timer);
  }, []);

  const currentVersion = model.versions.find((v: any) => v.version === model.currentVersion);

  return (
    <Grid  >
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
              <Avatar
                sx={{
                  width: 48,
                  height: 48,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                }}
              >
                <CodeIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight="700">
                  {model.name}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.7 }}>
                  {model.category}
                </Typography>
              </Box>
            </Box>
            <StatusChip status={currentVersion?.status || 'active'} />
          </Box>

          {/* 描述 */}
          <Typography variant="body2" sx={{ opacity: 0.8, mb: 3 }}>
            {model.description}
          </Typography>

          {/* 版本信息 */}
          <Box sx={{ mb: 3, p: 2, backgroundColor: alpha('#667eea', 0.05), borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle2" fontWeight="600">
                当前版本
              </Typography>
              <Chip 
                label={model.currentVersion} 
                size="small" 
                color="primary" 
                variant="outlined"
              />
            </Box>
            <Typography variant="body2" sx={{ opacity: 0.7, fontSize: '0.875rem' }}>
              {currentVersion?.description}
            </Typography>
          </Box>

          {/* 性能指标 */}
          {currentVersion && (
            <Box sx={{ mb: 2 }}>
              <PerformanceIndicator 
                value={currentVersion.accuracy} 
                label="准确率" 
                color="#10b981"
              />
              <Box sx={{ mt: 1 }}>
                <PerformanceIndicator 
                  value={(1 - currentVersion.loss) * 100} 
                  label="训练效果" 
                  color="#667eea"
                />
              </Box>
            </Box>
          )}

          {/* 标签 */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            <FrameworkChip framework={currentVersion?.framework} />
            {currentVersion?.tags.slice(0, 2).map((tag: string, index: number) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                variant="outlined"
                sx={{ borderRadius: 1, fontSize: '0.75rem' }}
              />
            ))}
          </Box>
        </CardContent>

        <Divider />

        <CardActions sx={{ p: 2, gap: 1 }}>
          <Tooltip title="部署模型">
            <IconButton 
              size="small" 
              color="primary"
              onClick={() => onDeploy(model)}
            >
              <DeployIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="查看详情">
            <IconButton size="small">
              <ViewIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="版本比较">
            <IconButton size="small">
              <CompareIcon />
            </IconButton>
          </Tooltip>
          <Box sx={{ flex: 1 }} />
          <Tooltip title="编辑">
            <IconButton 
              size="small"
              onClick={() => onEdit(model)}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="删除">
            <IconButton 
              size="small" 
              color="error"
              onClick={() => onDelete(model.id)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </CardActions>
      </GlassCard>
    </Grid>
  );
};

// 版本详情组件
const VersionDetailCard = ({ version, onRollback, onDownload }: any) => {
  return (
    <GlassCard sx={{ mb: 2 }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box>
            <Typography variant="h6" fontWeight="700" sx={{ mb: 1 }}>
              {version.name} {version.version}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <StatusChip status={version.status} />
              <FrameworkChip framework={version.framework} />
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="回滚到此版本">
              <IconButton 
                size="small" 
                color="primary"
                onClick={() => onRollback(version)}
              >
                <RollbackIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="下载模型">
              <IconButton 
                size="small"
                onClick={() => onDownload(version)}
              >
                <DownloadIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Typography variant="body2" sx={{ opacity: 0.8, mb: 3 }}>
          {version.description}
        </Typography>

        <Grid container spacing={3}>
          <Grid >
            <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 2 }}>
              模型指标
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <PerformanceIndicator value={version.accuracy} label="准确率" color="#10b981" />
              <PerformanceIndicator value={version.metrics.precision * 100} label="精确率" color="#667eea" />
              <PerformanceIndicator value={version.metrics.recall * 100} label="召回率" color="#f093fb" />
              <PerformanceIndicator value={version.metrics.f1Score * 100} label="F1分数" color="#43e97b" />
            </Box>
          </Grid>

          <Grid >
            <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 2 }}>
              部署信息
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <ScheduleIcon sx={{ fontSize: 20, opacity: 0.7 }} />
                </ListItemIcon>
                <ListItemText 
                  primary="创建时间" 
                  secondary={version.createdAt}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <MemoryIcon sx={{ fontSize: 20, opacity: 0.7 }} />
                </ListItemIcon>
                <ListItemText 
                  primary="文件大小" 
                  secondary={version.fileSize}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <SpeedIcon sx={{ fontSize: 20, opacity: 0.7 }} />
                </ListItemIcon>
                <ListItemText 
                  primary="数据集" 
                  secondary={version.dataset}
                />
              </ListItem>
              {version.deployment.isDeployed && (
                <>
                  <ListItem>
                    <ListItemIcon>
                      <PlayIcon sx={{ fontSize: 20, opacity: 0.7 }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="部署时间" 
                      secondary={version.deployment.deployedAt}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <ChartIcon sx={{ fontSize: 20, opacity: 0.7 }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="延迟" 
                      secondary={`${version.deployment.performance?.latency}ms`}
                    />
                  </ListItem>
                </>
              )}
            </List>
          </Grid>
        </Grid>

        {/* 标签 */}
        <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {version.tags.map((tag: string, index: number) => (
            <Chip
              key={index}
              label={tag}
              size="small"
              variant="outlined"
              sx={{ borderRadius: 1 }}
            />
          ))}
        </Box>
      </CardContent>
    </GlassCard>
  );
};

// 主组件
const ModelManagement = () => {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tabValue, setTabValue] = useState(0);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  // 模拟数据加载
  useEffect(() => {
    const timer = setTimeout(() => {
      setModels(initialModels);
      setLoading(false);
    }, 0);
    
    return () => clearTimeout(timer);
  }, []);

  // 统计数据
  const stats = {
    total: models.length,
    deployed: models.filter(m => 
      m.versions.some(v => v.status === 'deployed')
    ).length,
    training: models.filter(m => 
      m.versions.some(v => v.status === 'training')
    ).length,
    totalVersions: models.reduce((sum, m) => sum + m.versions.length, 0)
  };

  // 过滤模型
  const filteredModels = models.filter((model) => {
    const matchesSearch = model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         model.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || model.category === categoryFilter;
    
    let matchesStatus = true;
    if (statusFilter !== 'all') {
      matchesStatus = model.versions.some(v => v.status === statusFilter);
    }
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // 分页数据
  const paginatedModels = filteredModels.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleDeploy = (model: Model) => {
    console.log('部署模型:', model.name);
    // 这里可以添加部署逻辑
  };

  const handleEdit = (model: Model) => {
    console.log('编辑模型:', model.name);
    // 这里可以添加编辑逻辑
  };

  const handleDelete = (modelId: string) => {
    if (window.confirm('确定要删除这个模型吗？此操作不可撤销。')) {
      setModels(models.filter(m => m.id !== modelId));
    }
  };

  const handleRollback = (version: ModelVersion) => {
    console.log('回滚到版本:', version.version);
    // 这里可以添加回滚逻辑
  };

  const handleDownload = (version: ModelVersion) => {
    console.log('下载版本:', version.version);
    // 这里可以添加下载逻辑
  };

  const statCards = [
    {
      title: '总模型数',
      value: stats.total,
      subtitle: '所有机器学习模型',
      icon: <CodeIcon sx={{ fontSize: 28 }} />,
      color: '#667eea',
      trend: 15
    },
    {
      title: '已部署',
      value: stats.deployed,
      subtitle: '生产环境运行中',
      icon: <DeployIcon sx={{ fontSize: 28 }} />,
      color: '#f093fb',
      trend: 8
    },
    {
      title: '训练中',
      value: stats.training,
      subtitle: '正在训练的模型',
      icon: <ScheduleIcon sx={{ fontSize: 28 }} />,
      color: '#4facfe',
      trend: 12
    },
    {
      title: '版本总数',
      value: stats.totalVersions,
      subtitle: '所有模型版本',
      icon: <BranchIcon sx={{ fontSize: 28 }} />,
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
            加载模型数据...
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.7 }}>
            正在获取模型版本信息
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
            模型版本管理
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.7, maxWidth: 600, mx: 'auto' }}>
            管理机器学习模型的版本、部署和性能监控
          </Typography>
        </Box>

        {/* 统计卡片 */}
        <Box sx={{ mb: 6 }}>
          <Grid container spacing={3}>
            {statCards.map((stat, index) => (
              <Grid key={index}>
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
                  模型列表
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.7 }}>
                  管理和部署机器学习模型
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
                    placeholder="搜索模型名称或描述..."
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
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    InputProps={{ disableUnderline: true }}
                    variant="standard"
                  >
                    <MenuItem value="all">全部分类</MenuItem>
                    <MenuItem value="计算机视觉">计算机视觉</MenuItem>
                    <MenuItem value="自然语言处理">自然语言处理</MenuItem>
                    <MenuItem value="推荐系统">推荐系统</MenuItem>
                    <MenuItem value="风控">风控</MenuItem>
                  </TextField>
                </GlassCard>

                <GlassCard sx={{ minWidth: 140 }}>
                  <TextField
                    select
                    size="small"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    InputProps={{ disableUnderline: true }}
                    variant="standard"
                  >
                    <MenuItem value="all">全部状态</MenuItem>
                    <MenuItem value="deployed">已部署</MenuItem>
                    <MenuItem value="training">训练中</MenuItem>
                    <MenuItem value="active">可用</MenuItem>
                    <MenuItem value="archived">已归档</MenuItem>
                  </TextField>
                </GlassCard>

                <GradientButton startIcon={<AddIcon />}>
                  新建模型
                </GradientButton>
              </Box>
            </Box>
          </Box>

          {/* 标签页 */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange} sx={{ px: 3 }}>
              <Tab label="模型概览" />
              <Tab label="版本详情" />
              <Tab label="部署监控" />
              <Tab label="性能分析" />
            </Tabs>
          </Box>

          {/* 内容区域 */}
          <Box sx={{ p: 4 }}>
            {tabValue === 0 && (
              <>
                {paginatedModels.length > 0 ? (
                  <>
                    <Grid container spacing={3}>
                      {paginatedModels.map((model) => (
                        <ModelCard
                          key={model.id}
                          model={model}
                          onDeploy={handleDeploy}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                        />
                      ))}
                    </Grid>

                    {/* 分页控件 */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                      <Pagination
                        count={Math.ceil(filteredModels.length / itemsPerPage)}
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
                    <CodeIcon sx={{ fontSize: 80, opacity: 0.3, mb: 3 }} />
                    <Typography variant="h5" sx={{ mb: 2, opacity: 0.7 }}>
                      没有找到匹配的模型
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.5, mb: 4 }}>
                      尝试调整搜索条件或创建新的模型
                    </Typography>
                    <GradientButton startIcon={<AddIcon />} size="large">
                      创建第一个模型
                    </GradientButton>
                  </Box>
                )}
              </>
            )}

            {tabValue === 1 && selectedModel && (
              <Box>
                <Typography variant="h5" fontWeight="700" sx={{ mb: 3 }}>
                  {selectedModel.name} - 版本历史
                </Typography>
                {selectedModel.versions.map((version) => (
                  <VersionDetailCard
                    key={version.id}
                    version={version}
                    onRollback={handleRollback}
                    onDownload={handleDownload}
                  />
                ))}
              </Box>
            )}

            {tabValue === 1 && !selectedModel && (
              <Box sx={{ p: 8, textAlign: 'center' }}>
                <BranchIcon sx={{ fontSize: 80, opacity: 0.3, mb: 3 }} />
                <Typography variant="h5" sx={{ mb: 2, opacity: 0.7 }}>
                  选择模型查看版本详情
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.5 }}>
                  请在模型概览中选择一个模型来查看其版本历史
                </Typography>
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

export default ModelManagement;