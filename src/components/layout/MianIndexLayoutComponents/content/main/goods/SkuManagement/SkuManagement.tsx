// import React, { useState } from 'react';
// import {
//   Box,
//   Card,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Chip,
//   IconButton,
//   Typography,
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   MenuItem,
//   InputAdornment,
//   Avatar,
//   Tooltip,
//   Fab,
//   Grid,
//   alpha,
//   Badge,
//   Switch,
//   FormControlLabel,
//   Stepper,
//   Step,
//   StepLabel,
//   StepContent
// } from '@mui/material';
// import {
//   Add as AddIcon,
//   Edit as EditIcon,
//   Delete as DeleteIcon,
//   Search as SearchIcon,
//   Inventory as SkuIcon,
//   LocalOffer as PriceIcon,
//   Storage as StockIcon,
//   Warning as WarningIcon,
//   CheckCircle as CheckIcon,
//   Cancel as CancelIcon,
//   Barcode as BarcodeIcon,
//   ColorLens as ColorIcon,
//   Straighten as SizeIcon,
//   Style as StyleIcon
// } from '@mui/icons-material';

// // 简化类型定义
// interface Sku {
//   id: string;
//   productId: string;
//   productName: string;
//   skuCode: string;
//   specifications: { name: string; value: string; type: string }[];
//   price: number;
//   stock: number;
//   alertStock: number;
//   status: 'active' | 'inactive';
//   barcode?: string;
// }

// interface Product {
//   id: string;
//   name: string;
// }

// // 模拟数据
// const defaultProducts: Product[] = [
//   { id: '1', name: 'iPhone 15 Pro' },
//   { id: '2', name: 'MacBook Air M3' },
//   { id: '3', name: '耐克运动鞋' }
// ];

// const defaultSkus: Sku[] = [
//   {
//     id: '1',
//     productId: '1',
//     productName: 'iPhone 15 Pro',
//     skuCode: 'IP15P-128-BLK',
//     specifications: [
//       { name: '颜色', value: '黑色', type: 'color' },
//       { name: '存储', value: '128GB', type: 'text' }
//     ],
//     price: 7999,
//     stock: 156,
//     alertStock: 10,
//     status: 'active',
//     barcode: '1234567890123'
//   },
//   {
//     id: '2',
//     productId: '1',
//     productName: 'iPhone 15 Pro',
//     skuCode: 'IP15P-256-BLK',
//     specifications: [
//       { name: '颜色', value: '黑色', type: 'color' },
//       { name: '存储', value: '256GB', type: 'text' }
//     ],
//     price: 8999,
//     stock: 89,
//     alertStock: 10,
//     status: 'active',
//     barcode: '1234567890124'
//   },
//   {
//     id: '3',
//     productId: '2',
//     productName: 'MacBook Air M3',
//     skuCode: 'MBA-M3-8-256',
//     specifications: [
//       { name: '内存', value: '8GB', type: 'text' },
//       { name: '存储', value: '256GB', type: 'text' }
//     ],
//     price: 8999,
//     stock: 45,
//     alertStock: 5,
//     status: 'active',
//     barcode: '1234567890125'
//   }
// ];

// // 简化玻璃卡片组件
// const GlassCard = ({ children, sx = {} }) => (
//   <Card
//     sx={{
//       background: 'rgba(255, 255, 255, 0.9)',
//       backdropFilter: 'blur(10px)',
//       border: '1px solid rgba(255, 255, 255, 0.3)',
//       borderRadius: 2,
//       boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.1)',
//       overflow: 'hidden',
//       ...sx
//     }}
//   >
//     {children}
//   </Card>
// );

// // 简化统计卡片
// const StatCard = ({ title, value, subtitle, icon, color }) => (
//   <Grid item xs={12} sm={6} md={3}>
//     <GlassCard
//       sx={{
//         p: 2,
//         background: `linear-gradient(135deg, ${alpha(color, 0.1)} 0%, ${alpha(color, 0.05)} 100%)`,
//         border: `1px solid ${alpha(color, 0.2)}`
//       }}
//     >
//       <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//         <Box>
//           <Typography 
//             variant="h4" 
//             fontWeight="800" 
//             sx={{ 
//               background: `linear-gradient(135deg, ${color} 0%, ${alpha(color, 0.8)} 100%)`,
//               backgroundClip: 'text',
//               WebkitBackgroundClip: 'text',
//               WebkitTextFillColor: 'transparent',
//               mb: 1
//             }}
//           >
//             {value}
//           </Typography>
//           <Typography variant="h6" fontWeight="600" sx={{ mb: 0.5 }}>
//             {title}
//           </Typography>
//           <Typography variant="body2" sx={{ opacity: 0.7 }}>
//             {subtitle}
//           </Typography>
//         </Box>
//         <Box
//           sx={{
//             p: 1,
//             borderRadius: 2,
//             background: `linear-gradient(135deg, ${color} 0%, ${alpha(color, 0.8)} 100%)`,
//             color: 'white',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center'
//           }}
//         >
//           {icon}
//         </Box>
//       </Box>
//     </GlassCard>
//   </Grid>
// );

// // 规格显示组件
// const SpecificationChip = ({ spec }) => {
//   const getIcon = () => {
//     switch (spec.type) {
//       case 'color': return <ColorIcon sx={{ fontSize: 14 }} />;
//       case 'size': return <SizeIcon sx={{ fontSize: 14 }} />;
//       default: return <StyleIcon sx={{ fontSize: 14 }} />;
//     }
//   };

//   const getColor = () => {
//     switch (spec.type) {
//       case 'color': return '#667eea';
//       case 'size': return '#f093fb';
//       default: return '#4facfe';
//     }
//   };

//   return (
//     <Chip
//       icon={getIcon()}
//       label={`${spec.name}: ${spec.value}`}
//       size="small"
//       variant="outlined"
//       sx={{
//         borderColor: alpha(getColor(), 0.3),
//         color: getColor(),
//         backgroundColor: alpha(getColor(), 0.1),
//         fontWeight: 500,
//         margin: '2px'
//       }}
//     />
//   );
// };

// // SKU对话框组件
// const SkuDialog = ({ open, onClose, onSave, sku, products }) => {
//   const [activeStep, setActiveStep] = useState(0);
//   const [formData, setFormData] = useState({
//     productId: '',
//     skuCode: '',
//     specifications: [],
//     price: 0,
//     stock: 0,
//     alertStock: 0,
//     status: 'active',
//     barcode: ''
//   });

//   const [newSpec, setNewSpec] = useState({
//     name: '',
//     value: '',
//     type: 'text'
//   });

//   React.useEffect(() => {
//     if (sku) {
//       setFormData({
//         productId: sku.productId,
//         skuCode: sku.skuCode,
//         specifications: sku.specifications,
//         price: sku.price,
//         stock: sku.stock,
//         alertStock: sku.alertStock,
//         status: sku.status,
//         barcode: sku.barcode || ''
//       });
//     }
//   }, [sku]);

//   const handleSubmit = () => {
//     onSave(formData);
//     onClose();
//   };

//   const handleNext = () => {
//     setActiveStep((prev) => prev + 1);
//   };

//   const handleBack = () => {
//     setActiveStep((prev) => prev - 1);
//   };

//   const addSpecification = () => {
//     if (newSpec.name && newSpec.value) {
//       setFormData({
//         ...formData,
//         specifications: [...formData.specifications, { ...newSpec }]
//       });
//       setNewSpec({ name: '', value: '', type: 'text' });
//     }
//   };

//   const removeSpecification = (index) => {
//     const newSpecs = [...formData.specifications];
//     newSpecs.splice(index, 1);
//     setFormData({ ...formData, specifications: newSpecs });
//   };

//   const steps = [
//     { label: '基础信息', description: '选择商品和设置SKU基础信息' },
//     { label: '规格配置', description: '配置SKU的规格属性' },
//     { label: '价格库存', description: '设置价格和库存信息' }
//   ];

//   const getStepContent = (step) => {
//     switch (step) {
//       case 0:
//         return (
//           <Grid container spacing={2}>
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 select
//                 label="关联商品"
//                 value={formData.productId}
//                 onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
//                 variant="outlined"
//               >
//                 {products.map((product) => (
//                   <MenuItem key={product.id} value={product.id}>
//                     {product.name}
//                   </MenuItem>
//                 ))}
//               </TextField>
//             </Grid>
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 label="SKU编码"
//                 value={formData.skuCode}
//                 onChange={(e) => setFormData({ ...formData, skuCode: e.target.value })}
//                 variant="outlined"
//                 InputProps={{
//                   startAdornment: <BarcodeIcon sx={{ mr: 1, opacity: 0.7 }} />,
//                 }}
//               />
//             </Grid>
//             <Grid item xs={12}>
//               <FormControlLabel
//                 control={
//                   <Switch
//                     checked={formData.status === 'active'}
//                     onChange={(e) => setFormData({ ...formData, status: e.target.checked ? 'active' : 'inactive' })}
//                     color="primary"
//                   />
//                 }
//                 label={formData.status === 'active' ? '已启用' : '已停用'}
//               />
//             </Grid>
//           </Grid>
//         );
//       case 1:
//         return (
//           <Box>
//             <Typography variant="h6" gutterBottom>
//               规格配置
//             </Typography>
//             <Grid container spacing={2} sx={{ mb: 2 }}>
//               <Grid item xs={4}>
//                 <TextField
//                   fullWidth
//                   label="规格名称"
//                   value={newSpec.name}
//                   onChange={(e) => setNewSpec({ ...newSpec, name: e.target.value })}
//                   variant="outlined"
//                   size="small"
//                 />
//               </Grid>
//               <Grid item xs={4}>
//                 <TextField
//                   fullWidth
//                   label="规格值"
//                   value={newSpec.value}
//                   onChange={(e) => setNewSpec({ ...newSpec, value: e.target.value })}
//                   variant="outlined"
//                   size="small"
//                 />
//               </Grid>
//               <Grid item xs={3}>
//                 <TextField
//                   fullWidth
//                   select
//                   label="类型"
//                   value={newSpec.type}
//                   onChange={(e) => setNewSpec({ ...newSpec, type: e.target.value })}
//                   variant="outlined"
//                   size="small"
//                 >
//                   <MenuItem value="text">文本</MenuItem>
//                   <MenuItem value="color">颜色</MenuItem>
//                   <MenuItem value="size">尺寸</MenuItem>
//                 </TextField>
//               </Grid>
//               <Grid item xs={1}>
//                 <Button
//                   variant="contained"
//                   onClick={addSpecification}
//                   disabled={!newSpec.name || !newSpec.value}
//                   sx={{ height: '40px', minWidth: '40px' }}
//                 >
//                   <AddIcon />
//                 </Button>
//               </Grid>
//             </Grid>

//             <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
//               {formData.specifications.map((spec, index) => (
//                 <Box key={index} sx={{ position: 'relative' }}>
//                   <SpecificationChip spec={spec} />
//                   <IconButton 
//                     size="small" 
//                     onClick={() => removeSpecification(index)}
//                     sx={{ 
//                       position: 'absolute', 
//                       top: -8, 
//                       right: -8, 
//                       backgroundColor: 'white',
//                       width: 20,
//                       height: 20
//                     }}
//                   >
//                     <DeleteIcon sx={{ fontSize: 14 }} />
//                   </IconButton>
//                 </Box>
//               ))}
//             </Box>
//           </Box>
//         );
//       case 2:
//         return (
//           <Grid container spacing={2}>
//             <Grid item xs={6}>
//               <TextField
//                 fullWidth
//                 type="number"
//                 label="销售价格"
//                 value={formData.price}
//                 onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
//                 variant="outlined"
//                 InputProps={{
//                   startAdornment: <InputAdornment position="start">¥</InputAdornment>,
//                 }}
//               />
//             </Grid>
//             <Grid item xs={6}>
//               <TextField
//                 fullWidth
//                 type="number"
//                 label="库存数量"
//                 value={formData.stock}
//                 onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
//                 variant="outlined"
//               />
//             </Grid>
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 type="number"
//                 label="预警库存"
//                 value={formData.alertStock}
//                 onChange={(e) => setFormData({ ...formData, alertStock: Number(e.target.value) })}
//                 variant="outlined"
//               />
//             </Grid>
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 label="商品条码"
//                 value={formData.barcode}
//                 onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
//                 variant="outlined"
//                 InputProps={{
//                   startAdornment: <BarcodeIcon sx={{ mr: 1, opacity: 0.7 }} />,
//                 }}
//               />
//             </Grid>
//           </Grid>
//         );
//       default:
//         return 'Unknown step';
//     }
//   };

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
//       <DialogTitle sx={{ 
//         background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//         color: 'white'
//       }}>
//         <Typography variant="h6" fontWeight="700">
//           {sku ? '编辑SKU' : '创建新SKU'}
//         </Typography>
//       </DialogTitle>
      
//       <DialogContent sx={{ p: 3 }}>
//         <Stepper activeStep={activeStep} orientation="vertical">
//           {steps.map((step, index) => (
//             <Step key={step.label}>
//               <StepLabel>{step.label}</StepLabel>
//               <StepContent>
//                 {getStepContent(index)}
//                 <Box sx={{ mb: 2, mt: 2 }}>
//                   <div>
//                     <Button
//                       variant="contained"
//                       onClick={index === steps.length - 1 ? handleSubmit : handleNext}
//                       sx={{ mt: 1, mr: 1 }}
//                     >
//                       {index === steps.length - 1 ? '完成' : '继续'}
//                     </Button>
//                     <Button
//                       disabled={index === 0}
//                       onClick={handleBack}
//                       sx={{ mt: 1, mr: 1 }}
//                     >
//                       返回
//                     </Button>
//                   </div>
//                 </Box>
//               </StepContent>
//             </Step>
//           ))}
//         </Stepper>
//       </DialogContent>
//     </Dialog>
//   );
// };

// // 主组件
// const SkuManagement = () => {
//   const [skus, setSkus] = useState(defaultSkus);
//   const [openDialog, setOpenDialog] = useState(false);
//   const [editingSku, setEditingSku] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('all');
  
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);

//   // 过滤SKU
//   const filteredSkus = skus.filter((sku) => {
//     const matchesSearch = sku.skuCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          sku.productName.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesStatus = statusFilter === 'all' || sku.status === statusFilter;
//     return matchesSearch && matchesStatus;
//   });

//   // 分页数据
//   const paginatedSkus = filteredSkus.slice(
//     page * rowsPerPage,
//     page * rowsPerPage + rowsPerPage
//   );

//   const handleAddClick = () => {
//     setEditingSku(null);
//     setOpenDialog(true);
//   };

//   const handleEditClick = (sku) => {
//     setEditingSku(sku);
//     setOpenDialog(true);
//   };

//   const handleSave = (skuData) => {
//     if (editingSku) {
//       setSkus(skus.map(s => 
//         s.id === editingSku.id ? { ...s, ...skuData } : s
//       ));
//     } else {
//       const newSku = {
//         ...skuData,
//         id: Math.max(...skus.map(s => parseInt(s.id))) + 1 + ''
//       };
//       setSkus([...skus, newSku]);
//     }
//     setOpenDialog(false);
//   };

//   const handleDelete = (skuId) => {
//     if (window.confirm('确定要删除这个SKU吗？')) {
//       setSkus(skus.filter(s => s.id !== skuId));
//     }
//   };

//   const handleChangePage = (newPage) => {
//     setPage(newPage);
//   };

//   // 状态统计
//   const stats = {
//     total: skus.length,
//     active: skus.filter(s => s.status === 'active').length,
//     lowStock: skus.filter(s => s.stock <= s.alertStock && s.stock > 0).length,
//     totalStock: skus.reduce((sum, s) => sum + s.stock, 0)
//   };

//   const statCards = [
//     {
//       title: 'SKU总数',
//       value: stats.total,
//       subtitle: '所有SKU规格',
//       icon: <SkuIcon sx={{ fontSize: 24 }} />,
//       color: '#667eea'
//     },
//     {
//       title: '活跃SKU',
//       value: stats.active,
//       subtitle: '已启用SKU',
//       icon: <CheckIcon sx={{ fontSize: 24 }} />,
//       color: '#f093fb'
//     },
//     {
//       title: '库存预警',
//       value: stats.lowStock,
//       subtitle: '低库存SKU',
//       icon: <WarningIcon sx={{ fontSize: 24 }} />,
//       color: '#4facfe'
//     },
//     {
//       title: '总库存',
//       value: stats.totalStock,
//       subtitle: '所有SKU库存',
//       icon: <StockIcon sx={{ fontSize: 24 }} />,
//       color: '#43e97b'
//     }
//   ];

//   const getStockStatus = (sku) => {
//     if (sku.stock === 0) {
//       return { status: '缺货', color: 'error', icon: <CancelIcon /> };
//     } else if (sku.stock <= sku.alertStock) {
//       return { status: '低库存', color: 'warning', icon: <WarningIcon /> };
//     } else {
//       return { status: '库存正常', color: 'success', icon: <CheckIcon /> };
//     }
//   };

//   return (
//     <Box sx={{ 
//       p: 3, 
//       minHeight: '100vh',
//       background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
//     }}>
//       {/* 报表部分 */}
//       <Box sx={{ mb: 4 }}>
//         <Grid container spacing={2}>
//           {statCards.map((stat, index) => (
//             <StatCard
//               key={index}
//               title={stat.title}
//               value={stat.value}
//               subtitle={stat.subtitle}
//               icon={stat.icon}
//               color={stat.color}
//             />
//           ))}
//         </Grid>
//       </Box>

//       {/* 主要内容区域 */}
//       <GlassCard>
//         {/* 工具栏 */}
//         <Box sx={{ p: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.08)' }}>
//           <Box sx={{ 
//             display: 'flex', 
//             justifyContent: 'space-between', 
//             alignItems: 'center',
//             flexWrap: 'wrap',
//             gap: 2
//           }}>
//             <Box>
//               <Typography variant="h5" fontWeight="700" sx={{ mb: 0.5 }}>
//                 SKU规格管理
//               </Typography>
//               <Typography variant="body2" sx={{ opacity: 0.7 }}>
//                 管理商品的多规格属性和库存信息
//               </Typography>
//             </Box>
            
//             <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
//               <GlassCard sx={{ minWidth: 200 }}>
//                 <TextField
//                   size="small"
//                   placeholder="搜索SKU..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   InputProps={{
//                     startAdornment: <SearchIcon sx={{ opacity: 0.7 }} />,
//                     disableUnderline: true,
//                   }}
//                   variant="standard"
//                 />
//               </GlassCard>
              
//               <TextField
//                 select
//                 size="small"
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value)}
//                 sx={{ minWidth: 120 }}
//               >
//                 <MenuItem value="all">全部状态</MenuItem>
//                 <MenuItem value="active">启用</MenuItem>
//                 <MenuItem value="inactive">停用</MenuItem>
//               </TextField>
              
//               <Button
//                 variant="contained"
//                 startIcon={<AddIcon />}
//                 onClick={handleAddClick}
//                 sx={{
//                   background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
//                 }}
//               >
//                 新建SKU
//               </Button>
//             </Box>
//           </Box>
//         </Box>

//         {/* SKU表格 */}
//         <TableContainer>
//           <Table>
//             <TableHead>
//               <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
//                 <TableCell><strong>SKU信息</strong></TableCell>
//                 <TableCell><strong>规格属性</strong></TableCell>
//                 <TableCell align="center"><strong>价格</strong></TableCell>
//                 <TableCell align="center"><strong>库存状态</strong></TableCell>
//                 <TableCell align="center"><strong>操作</strong></TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {paginatedSkus.map((sku) => {
//                 const stockStatus = getStockStatus(sku);
//                 return (
//                   <TableRow 
//                     key={sku.id}
//                     sx={{ '&:hover': { backgroundColor: '#f8f9fa' } }}
//                   >
//                     <TableCell>
//                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//                         <Avatar 
//                           sx={{ 
//                             background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
//                           }}
//                         >
//                           <SkuIcon sx={{ color: 'white' }} />
//                         </Avatar>
//                         <Box>
//                           <Typography variant="subtitle1" fontWeight="600">
//                             {sku.skuCode}
//                           </Typography>
//                           <Typography variant="body2" sx={{ opacity: 0.7 }}>
//                             {sku.productName}
//                           </Typography>
//                           <Chip 
//                             label={sku.status === 'active' ? '启用' : '停用'} 
//                             size="small"
//                             color={sku.status === 'active' ? 'success' : 'default'}
//                             sx={{ mt: 0.5 }}
//                           />
//                         </Box>
//                       </Box>
//                     </TableCell>
//                     <TableCell>
//                       <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
//                         {sku.specifications.map((spec, index) => (
//                           <SpecificationChip key={index} spec={spec} />
//                         ))}
//                       </Box>
//                     </TableCell>
//                     <TableCell align="center">
//                       <Typography variant="h6" fontWeight="700" color="primary">
//                         ¥{sku.price.toLocaleString()}
//                       </Typography>
//                     </TableCell>
//                     <TableCell align="center">
//                       <Box sx={{ textAlign: 'center' }}>
//                         <Badge 
//                           badgeContent={sku.stock} 
//                           color={
//                             sku.stock === 0 ? "error" : 
//                             sku.stock <= sku.alertStock ? "warning" : "primary"
//                           }
//                           sx={{ mb: 1 }}
//                         >
//                           <StockIcon color="action" />
//                         </Badge>
//                         <Chip 
//                           icon={stockStatus.icon}
//                           label={stockStatus.status}
//                           color={stockStatus.color}
//                           size="small"
//                           sx={{ fontWeight: 500 }}
//                         />
//                       </Box>
//                     </TableCell>
//                     <TableCell align="center">
//                       <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
//                         <Tooltip title="编辑">
//                           <IconButton 
//                             onClick={() => handleEditClick(sku)}
//                             sx={{ color: '#3b82f6' }}
//                           >
//                             <EditIcon />
//                           </IconButton>
//                         </Tooltip>
//                         <Tooltip title="删除">
//                           <IconButton 
//                             onClick={() => handleDelete(sku.id)}
//                             sx={{ color: '#ef4444' }}
//                           >
//                             <DeleteIcon />
//                           </IconButton>
//                         </Tooltip>
//                       </Box>
//                     </TableCell>
//                   </TableRow>
//                 );
//               })}
//             </TableBody>
//           </Table>
//         </TableContainer>

//         {/* 空状态 */}
//         {paginatedSkus.length === 0 && (
//           <Box sx={{ p: 4, textAlign: 'center' }}>
//             <SkuIcon sx={{ fontSize: 60, opacity: 0.3, mb: 2 }} />
//             <Typography variant="h6" sx={{ mb: 1, opacity: 0.7 }}>
//               没有找到匹配的SKU
//             </Typography>
//             <Button
//               variant="contained"
//               startIcon={<AddIcon />}
//               onClick={handleAddClick}
//               sx={{
//                 background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
//               }}
//             >
//               创建第一个SKU
//             </Button>
//           </Box>
//         )}

//         {/* 简单分页 */}
//         {skus.length > 0 && (
//           <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//             <Typography variant="body2" sx={{ opacity: 0.7 }}>
//               共 {filteredSkus.length} 个SKU
//             </Typography>
//             <Box sx={{ display: 'flex', gap: 1 }}>
//               <Button 
//                 size="small" 
//                 disabled={page === 0}
//                 onClick={() => handleChangePage(page - 1)}
//               >
//                 上一页
//               </Button>
//               <Button 
//                 size="small" 
//                 disabled={page >= Math.ceil(filteredSkus.length / rowsPerPage) - 1}
//                 onClick={() => handleChangePage(page + 1)}
//               >
//                 下一页
//               </Button>
//             </Box>
//           </Box>
//         )}
//       </GlassCard>

//       {/* 添加/编辑SKU对话框 */}
//       <SkuDialog 
//         open={openDialog}
//         onClose={() => setOpenDialog(false)}
//         onSave={handleSave}
//         sku={editingSku}
//         products={defaultProducts}
//       />

//       {/* 悬浮添加按钮 */}
//       <Fab
//         onClick={handleAddClick}
//         sx={{
//           position: 'fixed',
//           bottom: 24,
//           right: 24,
//           background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//           color: 'white'
//         }}
//       >
//         <AddIcon />
//       </Fab>
//     </Box>
//   );
// };

// export default SkuManagement;