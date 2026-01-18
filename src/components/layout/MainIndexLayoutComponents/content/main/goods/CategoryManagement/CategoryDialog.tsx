import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Switch,
  FormControlLabel,
  Avatar,
  Typography,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import type { CategorySaveVO } from '@/api/goods/category/CategoryType';
import UploadImage from '@/components/upload/UploadFile';

interface CategoryDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: CategorySaveVO) => Promise<void>;
  initialData: CategorySaveVO | null;
}

type CategoryFormValues = Omit<Required<CategorySaveVO>, 'id' | 'code'>;

const schema = yup.object({
  name: yup.string().required('分类名称不能为空').max(50, '分类名称最多50个字符'),
  level: yup.number().required('请选择分类层级').min(1).max(3),
  description: yup.string().max(200, '描述最多200个字符').default(''),
  sortOrder: yup.number().min(0).default(0),
  iconUrl: yup.string().default(''),
  status: yup.number().oneOf([0, 1]).default(1),
  recommended: yup.number().oneOf([0, 1]).default(0),
});

const CategoryDialog: React.FC<CategoryDialogProps> = ({
  open,
  onClose,
  onSave,
  initialData,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<CategoryFormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      level: 1,
      description: '',
      sortOrder: 0,
      iconUrl: '',
      status: 1,
      recommended: 0,
    },
  });

  const currentIconUrl = watch('iconUrl');

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset();
    }
  }, [initialData, reset]);

  const generateCode = (name: string | undefined): string => {
    if (!name) return '';
    return name
      .split('')
      .map((char) => char.charCodeAt(0))
      .join('')
      .substring(0, 20);
  };

  const onSubmit = async (data: CategoryFormValues) => {
    const submitData: CategorySaveVO = {
      ...data,
      id: initialData?.id,
      code: initialData?.code || generateCode(data.name),
    };

    await onSave(submitData);
    reset();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 4,  // 更圆润的边角
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: 3,  // 添加阴影
            backgroundColor: '#fafafa',  // 更柔和的背景色
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          pb: 2,
          borderBottom: 2,
          borderColor: 'divider',
          fontWeight: 'bold',  // 加粗标题
          color: '#333',  // 更深的文字颜色
        }}
      >
        {initialData ? '编辑分类' : '新增分类'}
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent
          sx={{
            flex: 1,
            overflow: 'auto',
            p: 4,
            display: 'grid',
            gap: 3,  // 增加间距
          }}
        >
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            {/* 分类名称 */}
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="分类名称"
                  fullWidth
                  required
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  disabled={isSubmitting}
                  size="small"
                  sx={{ borderRadius: 2 }}  // 更圆润的边角
                />
              )}
            />

            {/* 分类层级 */}
            <Controller
              name="level"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.level} disabled={isSubmitting} size="small">
                  <InputLabel>分类层级</InputLabel>
                  <Select {...field} label="分类层级" sx={{ borderRadius: 2 }}>
                    <MenuItem value={1}>一级分类</MenuItem>
                    <MenuItem value={2}>二级分类</MenuItem>
                    <MenuItem value={3}>三级分类</MenuItem>
                  </Select>
                  {errors.level && <FormHelperText>{errors.level.message}</FormHelperText>}
                </FormControl>
              )}
            />

            {/* 排序 */}
            <Controller
              name="sortOrder"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="number"
                  label="排序"
                  fullWidth
                  slotProps={{
                    htmlInput: { min: 0 },
                  }}
                  error={!!errors.sortOrder}
                  helperText={errors.sortOrder?.message}
                  disabled={isSubmitting}
                  size="small"
                  sx={{ borderRadius: 2 }}  // 更圆润的边角
                />
              )}
            />

            {/* 分类描述 */}
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="分类描述"
                  fullWidth
                  multiline
                  rows={3}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                  disabled={isSubmitting}
                  size="small"
                  sx={{
                    gridColumn: { xs: '1', sm: '1 / span 2' },
                    borderRadius: 2,  // 更圆润的边角
                  }}
                />
              )}
            />

            {/* 分类图标上传 */}
            <Box sx={{ gridColumn: { xs: '1', sm: '1 / span 2' } }}>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                分类图标
              </Typography>
              <Controller
                name="iconUrl"
                control={control}
                render={({ field }) => (
                  <UploadImage
                    value={field.value}
                    onChange={(url: any) => field.onChange(url)}
                  />
                )}
              />
              {currentIconUrl && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    mt: 2,
                  }}
                >
                  <Avatar
                    src={currentIconUrl}
                    sx={{
                      width: 64,
                      height: 64,
                      border: '2px solid #ddd',
                      boxShadow: 2,  // 增加阴影
                    }}
                  />
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    noWrap
                    sx={{
                      width: '200px',
                      textOverflow: 'ellipsis',  // 超长文本显示省略号
                    }}
                  >
                    {currentIconUrl}
                  </Typography>
                </Box>
              )}
            </Box>

            {/* 开关 */}
            <Box
              sx={{
                gridColumn: { xs: '1', sm: '1 / span 2' },
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 3,
                py: 2,
              }}
            >
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={field.value === 0}
                        onChange={(e) => field.onChange(e.target.checked ? 0 : 1)}
                        color="primary"
                        disabled={isSubmitting}
                      />
                    }
                    label="启用分类"
                    sx={{ fontWeight: 'bold' }}  // 加粗标签
                  />
                )}
              />

              <Controller
                name="recommended"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={field.value === 1}
                        onChange={(e) => field.onChange(e.target.checked ? 1 : 0)}
                        color="secondary"
                        disabled={isSubmitting}
                      />
                    }
                    label="设为推荐"
                    sx={{ fontWeight: 'bold' }}  // 加粗标签
                  />
                )}
              />
            </Box>
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            px: 4,
            py: 3,
            borderTop: 1,
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'flex-end',  // 右对齐按钮
          }}
        >
          <Button onClick={handleClose} disabled={isSubmitting} variant="outlined" sx={{ borderRadius: 2 }}>
            取消
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            sx={{
              minWidth: 120,
              borderRadius: 2,
              backgroundColor: '#4CAF50',  // 绿色按钮
              '&:hover': {
                backgroundColor: '#388E3C',  // 鼠标悬停时更深的绿色
              },
            }}
          >
            {isSubmitting ? '保存中...' : '保存'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CategoryDialog;
