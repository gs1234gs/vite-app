import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  alpha,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  type Theme,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
  Chip,
  Zoom,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Clear as ClearIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import useCategory from '@/stores/goods/Category';
import type { PageType } from '@/api/type/PageType';
import type { CategoryVO, CategorySaveVO } from '@/api/goods/category/CategoryType';
import CategoryDialog from './CategoryDialog';

type SearchForm = {
  q?: string;
  status?: string | number;
  recommended?: string | number;
  level?: string | number;
};

/**
 * 改动点（本次提交）
 * - 将「搜索按钮」从单独按钮改为 Input 内联动作（与输入框同高、同圆角）
 * - 搜索图标与清除图标被放入 endAdornment，样式更加一体化、现代
 * - 保留按 Enter 搜索与清除行为（UX 连贯）
 * - 其它视觉改进与之前一致（玻璃头部、柔和阴影、pill 按钮）
 */

/* ------------------------ tiny presentational bits ------------------------ */

const IconThumb: React.FC<{ src?: string; name?: string }> = ({ src, name }) =>
  src ? (
    <Box
      sx={{
        width: 52,
        height: 52,
        borderRadius: 2,
        overflow: 'hidden',
        border: (t: Theme) => `1px solid ${t.palette.divider}`,
        flexShrink: 0,
      }}
    >
      <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </Box>
  ) : (
    <Box
      sx={{
        width: 52,
        height: 52,
        borderRadius: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'action.hover',
        border: (t: Theme) => `1px dashed ${t.palette.divider}`,
        flexShrink: 0,
      }}
    >
      <SearchIcon color="disabled" />
    </Box>
  );

const StatusChip: React.FC<{ status?: number | null }> = ({ status = 0 }) => (
  <Chip
    size="small"
    label={status === 0 ? '启用' : '禁用'}
    color={status === 0 ? 'success' : 'default'}
    variant="outlined"
    sx={{ fontWeight: 600 }}
  />
);

const RecommendedChip: React.FC<{ recommended?: number | null }> = ({ recommended = 0 }) => (
  <Chip
    size="small"
    label={recommended === 1 ? '推荐' : '普通'}
    color={recommended === 1 ? 'primary' : 'default'}
    variant="outlined"
    sx={{ fontWeight: 600 }}
  />
);

const LevelDots: React.FC<{ level?: number }> = ({ level = 1 }) => {
  const theme = useTheme();
  const colors = [theme.palette.primary.main, theme.palette.secondary.main, theme.palette.info.main];
  const count = Math.max(1, Math.min(3, level));
  return (
    <Stack direction="row" alignItems="center" spacing={0.5}>
      <Box display="flex" gap={0.5}>
        {Array.from({ length: count }).map((_, i) => (
          <Box key={i} sx={{ width: 8, height: 8, bgcolor: colors[i] || theme.palette.grey[500], borderRadius: '50%' }} />
        ))}
      </Box>
      <Typography variant="body2">第 {level} 级</Typography>
    </Stack>
  );
};

const EmptyState: React.FC<{ onAdd: () => void; hasSearch?: boolean; onReset?: () => void }> = ({ onAdd, hasSearch, onReset }) => (
  <Box sx={{ py: 8, textAlign: 'center', color: 'text.secondary' }}>
    <Box
      sx={{
        width: 96,
        height: 96,
        mx: 'auto',
        borderRadius: '50%',
        bgcolor: (t) => alpha(t.palette.primary.light, 0.12),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mb: 2,
        boxShadow: (t) => `0 6px 20px ${alpha(t.palette.primary.main, 0.08)}`,
      }}
    >
      <FilterListIcon sx={{ fontSize: 44, color: 'primary.main', opacity: 0.9 }} />
    </Box>
    <Typography variant="h6" gutterBottom>
      {hasSearch ? '未找到匹配的分类' : '暂无分类'}
    </Typography>
    <Typography variant="body2" sx={{ mb: 2 }}>
      {hasSearch ? '尝试调整筛选或重置搜索' : '点击下方按钮创建第一个分类'}
    </Typography>
    <Stack direction="row" spacing={1} justifyContent="center">
      {hasSearch ? (
        <Button variant="outlined" startIcon={<ClearIcon />} onClick={onReset} sx={{ borderRadius: 999 }}>
          重置
        </Button>
      ) : (
        <Button variant="contained" startIcon={<AddIcon />} onClick={onAdd} sx={{ borderRadius: 999 }}>
          添加分类
        </Button>
      )}
    </Stack>
  </Box>
);

const LoadingState: React.FC = () => (
  <Box sx={{ py: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
    <CircularProgress thickness={5} />
    <Typography color="text.secondary">加载中...</Typography>
  </Box>
);

/* ------------------------ main component ------------------------ */

const CategoryManagement: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { enqueueSnackbar } = useSnackbar();
  const { loading, error, findPageApi, saveApi, deleteByIdApi, findByIdApi } = useCategory();

  const [rows, setRows] = useState<CategoryVO[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [search, setSearch] = useState<SearchForm>({});
  const [searchOpen, setSearchOpen] = useState<boolean>(!isMobile);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<CategoryVO | null>(null);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name?: string } | null>(null);

  const buildCondition = useCallback(() => {
    const cond: Partial<CategoryVO> = { delFlag: 0 };
    if (search.q) cond.name = String(search.q).trim();
    if (search.status !== undefined && search.status !== '') cond.status = Number(search.status) as 0 | 1;
    if (search.recommended !== undefined && search.recommended !== '') cond.recommended = Number(search.recommended) as 0 | 1;
    if (search.level !== undefined && search.level !== '') cond.level = Number(search.level);
    return cond as CategoryVO;
  }, [search]);

  const loadData = useCallback(async () => {
    try {
      const res = await findPageApi({
        pageNum: page + 1,
        pageSize: rowsPerPage,
        condition: buildCondition(),
      } as PageType<CategoryVO>);
      if (res) {
        setRows(res.rows || []);
        setTotal(res.total || 0);
      }
    } catch (e) {
      enqueueSnackbar('加载分类失败', { variant: 'error' });
    }
  }, [findPageApi, page, rowsPerPage, buildCondition, enqueueSnackbar]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSearchChange = (k: keyof SearchForm, v: any) => setSearch((s) => ({ ...s, [k]: v }));

  const resetSearch = () => {
    setSearch({});
    setPage(0);
    loadData();
  };

  const applySearch = () => {
    setPage(0);
    loadData();
  };

  const openAdd = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = async (item: CategoryVO) => {
    try {
      const latest = await findByIdApi(item.id);
      setEditing(latest || item);
      setDialogOpen(true);
    } catch {
      enqueueSnackbar('获取详情失败', { variant: 'error' });
    }
  };

  const requestDelete = (id: string, name?: string) => setDeleteTarget({ id, name });

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      if (!deleteByIdApi) throw new Error('删除接口未配置');
      await deleteByIdApi(deleteTarget.id);
      enqueueSnackbar('删除成功', { variant: 'success' });
      loadData();
    } catch (e: any) {
      enqueueSnackbar(`删除失败: ${e?.message ?? ''}`, { variant: 'error' });
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleSave = async (payload: CategorySaveVO) => {
    try {
      await saveApi(payload);
      enqueueSnackbar(`分类${payload.id ? '更新' : '添加'}成功`, { variant: 'success' });
      setDialogOpen(false);
      loadData();
    } catch (e: any) {
      enqueueSnackbar(`保存失败: ${e?.message ?? ''}`, { variant: 'error' });
    }
  };

  const toggleSelect = (id: string) =>
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const selectAllOnPage = (checked: boolean) => setSelectedIds(checked ? new Set(rows.map((r) => r.id)) : new Set());

  const clearSelection = () => setSelectedIds(new Set());

  const batchDelete = async () => {
    const ids = Array.from(selectedIds);
    if (!ids.length) return;
    if (!confirm(`确认删除 ${ids.length} 项？此操作不可恢复。`)) return;
    // TODO: 调用实际 batch-delete API
    enqueueSnackbar(`已删除 ${ids.length} 项（模拟）`, { variant: 'success' });
    clearSelection();
    loadData();
  };

  const batchSetStatus = async (status: 0 | 1) => {
    const ids = Array.from(selectedIds);
    if (!ids.length) return;
    // TODO: 调用批量更新接口
    enqueueSnackbar(`已将 ${ids.length} 项设置为 ${status === 0 ? '启用' : '禁用'}（模拟）`, { variant: 'success' });
    clearSelection();
    loadData();
  };

  const hasSearch = useMemo(() => Object.values(search).some((v) => v !== undefined && v !== '' && v !== null), [search]);

  /* modern search grid */
  const searchGridSx = {
    display: 'grid',
    gap: 1,
    gridTemplateColumns: {
      xs: '1fr',
      sm: 'repeat(2, minmax(0, 1fr))',
      md: 'repeat(3, minmax(0, 1fr))',
    },
    width: '100%',
  } as const;

  /* header glass style */
  const headerSx = {
    px: { xs: 2, sm: 3 },
    py: { xs: 1.5, sm: 2 },
    borderRadius: 2,
    bgcolor: (t: Theme) => alpha(t.palette.background.paper, 0.7),
    backdropFilter: 'blur(6px)',
    boxShadow: (t: Theme) => `0 8px 30px ${alpha(t.palette.primary.main, 0.06)}`,
    border: (t: Theme) => `1px solid ${alpha(t.palette.primary.main, 0.08)}`,
  };

  return (
    <Box sx={{ p: { xs: 1.5, sm: 2.5 }, display: 'flex', flexDirection: 'column', gap: 2, height: '100%' }}>
      {/* header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, ...headerSx }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.2px' }}>
            分类管理
          </Typography>
          <Typography variant="body2" color="text.secondary">
            现代化界面 — 卡片、玻璃感、柔和阴影与流畅交互
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} alignItems="center">
          {hasSearch && (
            <Chip
              label={`匹配 ${total} 条`}
              color="info"
              variant="outlined"
              onDelete={resetSearch}
              deleteIcon={<ClearIcon />}
              sx={{ fontWeight: 600 }}
            />
          )}

          {selectedIds.size > 0 && (
            <Chip label={`${selectedIds.size} 已选`} color="primary" onDelete={clearSelection} deleteIcon={<ClearIcon />} sx={{ fontWeight: 600 }} />
          )}

          <Button variant="contained" startIcon={<AddIcon />} onClick={openAdd} sx={{ borderRadius: 999, px: 2 }}>
            新增
          </Button>

          <Tooltip title="刷新">
            <IconButton onClick={loadData} disabled={loading} sx={{ bgcolor: 'background.paper', borderRadius: 2 }}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>

      {/* search card */}
      <Card variant="outlined" sx={{ borderRadius: 2, boxShadow: (t) => `0 6px 20px ${alpha(t.palette.primary.main, 0.04)}` }}>
        <CardContent sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <FilterListIcon color="action" />
            <Typography fontWeight={700}>搜索筛选</Typography>
            <Box sx={{ flex: 1 }} />
            <Button size="small" startIcon={<ExpandMoreIcon />} onClick={() => setSearchOpen((s) => !s)} sx={{ textTransform: 'none' }}>
              {searchOpen ? '收起' : '展开'}
            </Button>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            {/* 关键改动：把搜索操作内联到输入框的 endAdornment，使按钮与输入框高度、圆角一致 */}
            <TextField
              fullWidth
              size="small"
              placeholder="名称 / 编码"
              value={search.q ?? ''}
              onChange={(e) => handleSearchChange('q', e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && applySearch()}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 999,
                  pr: 0, // remove default right padding so adornment aligns
                },
                boxShadow: (t) => `0 4px 18px ${alpha(t.palette.primary.main, 0.02)}`,
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end" sx={{ mr: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {search.q ? (
                        <IconButton
                          size="small"
                          onClick={() => {
                            handleSearchChange('q', '');
                            // keep focus in input after clear
                            const active = document.activeElement as HTMLElement | null;
                            active?.blur?.();
                          }}
                          sx={{
                            width: 36,
                            height: 36,
                            bgcolor: 'background.paper',
                            borderRadius: 8,
                          }}
                        >
                          <ClearIcon fontSize="small" />
                        </IconButton>
                      ) : null}

                      <IconButton
                        size="small"
                        onClick={applySearch}
                        color="primary"
                        sx={{
                          width: 40,
                          height: 40,
                          bgcolor: (t) => alpha(t.palette.primary.main, 0.12),
                          borderRadius: 8,
                          '&:hover': { bgcolor: (t) => alpha(t.palette.primary.main, 0.18) },
                          boxShadow: (t) => `0 4px 12px ${alpha(t.palette.primary.main, 0.06)}`,
                        }}
                      >
                        <SearchIcon />
                      </IconButton>
                    </Box>
                  </InputAdornment>
                ),
              }}
            />

            {/* 保留备用的可见搜索入口（非必要），但视觉上隐藏以便在极窄屏显示 */}
            <Box sx={{ display: { xs: 'none', sm: 'none' } }}>
              <Button variant="contained" onClick={applySearch} startIcon={<SearchIcon />} sx={{ borderRadius: 999 }}>
                搜索
              </Button>
            </Box>
          </Box>

          <Collapse in={searchOpen}>
            <Box sx={{ mt: 1, ...searchGridSx }}>
              <Select fullWidth size="small" displayEmpty value={search.status ?? ''} onChange={(e) => handleSearchChange('status', e.target.value)} sx={{ borderRadius: 1.5 }}>
                <MenuItem value="">全部状态</MenuItem>
                <MenuItem value={0}>启用</MenuItem>
                <MenuItem value={1}>禁用</MenuItem>
              </Select>

              <Select fullWidth size="small" displayEmpty value={search.recommended ?? ''} onChange={(e) => handleSearchChange('recommended', e.target.value)} sx={{ borderRadius: 1.5 }}>
                <MenuItem value="">全部推荐</MenuItem>
                <MenuItem value={1}>推荐</MenuItem>
                <MenuItem value={0}>普通</MenuItem>
              </Select>

              <Select fullWidth size="small" displayEmpty value={search.level ?? ''} onChange={(e) => handleSearchChange('level', e.target.value)} sx={{ borderRadius: 1.5 }}>
                <MenuItem value="">全部层级</MenuItem>
                <MenuItem value={1}>第 1 级</MenuItem>
                <MenuItem value={2}>第 2 级</MenuItem>
                <MenuItem value={3}>第 3 级</MenuItem>
              </Select>
            </Box>
          </Collapse>
        </CardContent>
      </Card>

      {/* content */}
      <Paper variant="outlined" sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRadius: 2 }}>
        {loading ? (
          <LoadingState />
        ) : rows.length === 0 ? (
          <EmptyState onAdd={openAdd} hasSearch={hasSearch} onReset={resetSearch} />
        ) : isMobile ? (
          <Box sx={{ p: 2 }}>
            <Stack spacing={2}>
              {rows.map((r) => (
                <Paper
                  key={r.id}
                  sx={{
                    p: 1.25,
                    display: 'flex',
                    gap: 1,
                    alignItems: 'center',
                    borderRadius: 2,
                    transition: 'transform .18s, box-shadow .18s',
                    '&:hover': { transform: 'translateY(-4px)', boxShadow: (t) => `0 12px 30px ${alpha(t.palette.primary.main, 0.06)}` },
                  }}
                >
                  <IconThumb src={r.iconUrl} name={r.name} />
                  <Box sx={{ flex: 1 }}>
                    <Typography fontWeight={800}>{r.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {r.code} · 第 {r.level} 级
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={0.5}>
                    <Tooltip title="编辑">
                      <IconButton size="small" onClick={() => openEdit(r)} sx={{ bgcolor: 'background.paper' }}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="删除">
                      <IconButton size="small" color="error" onClick={() => requestDelete(r.id, r.name)} sx={{ bgcolor: 'background.paper' }}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table size="small" sx={{ minWidth: 800 }}>
                <TableHead>
                  <TableRow>
                    <TableCell width={66}>
                      <IconButton size="small" onClick={() => selectAllOnPage(selectedIds.size !== rows.length)}>
                        <Box
                          sx={{
                            width: 22,
                            height: 22,
                            borderRadius: 1,
                            border: 2,
                            borderColor: selectedIds.size === rows.length && rows.length > 0 ? 'primary.main' : 'divider',
                            bgcolor: selectedIds.size === rows.length && rows.length > 0 ? 'primary.main' : 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {selectedIds.size === rows.length && rows.length > 0 && <Typography sx={{ color: '#fff' }} variant="caption">✓</Typography>}
                        </Box>
                      </IconButton>
                    </TableCell>

                    <TableCell>图标</TableCell>
                    <TableCell>名称</TableCell>
                    <TableCell>编码</TableCell>
                    <TableCell>层级</TableCell>
                    <TableCell align="center">状态</TableCell>
                    <TableCell align="center">推荐</TableCell>
                    <TableCell>排序</TableCell>
                    <TableCell>创建时间</TableCell>
                    <TableCell align="right">操作</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {rows.map((r) => {
                    const selected = selectedIds.has(r.id);
                    return (
                      <TableRow
                        key={r.id}
                        hover
                        selected={selected}
                        sx={{
                          transition: 'transform .16s, box-shadow .16s, background-color .12s',
                          '&:hover': { transform: 'translateY(-4px)', boxShadow: (t) => `0 12px 26px ${alpha(t.palette.primary.main, 0.04)}` },
                          '&.Mui-selected': { bgcolor: alpha(theme.palette.primary.main, 0.04) },
                        }}
                      >
                        <TableCell>
                          <IconButton size="small" onClick={() => toggleSelect(r.id)}>
                            <Box
                              sx={{
                                width: 22,
                                height: 22,
                                borderRadius: 1,
                                border: 2,
                                borderColor: selected ? 'primary.main' : 'divider',
                                bgcolor: selected ? 'primary.main' : 'transparent',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              {selected && <Typography sx={{ color: '#fff' }} variant="caption">✓</Typography>}
                            </Box>
                          </IconButton>
                        </TableCell>

                        <TableCell>
                          <IconThumb src={r.iconUrl} name={r.name} />
                        </TableCell>

                        <TableCell>
                          <Typography fontWeight={800}>{r.name}</Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                            {r.description ?? '暂无描述'}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Chip size="small" label={r.code} variant="outlined" sx={{ fontWeight: 600 }} />
                        </TableCell>

                        <TableCell>
                          <LevelDots level={r.level} />
                        </TableCell>

                        <TableCell align="center">
                          <StatusChip status={r.status} />
                        </TableCell>

                        <TableCell align="center">
                          <RecommendedChip recommended={r.recommended} />
                        </TableCell>

                        <TableCell>{r.sortOrder}</TableCell>

                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(r.createTime).toLocaleDateString()}
                          </Typography>
                        </TableCell>

                        <TableCell align="right">
                          <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                            <Tooltip title="编辑">
                              <IconButton size="small" onClick={() => openEdit(r)} sx={{ bgcolor: 'background.paper' }}>
                                <EditIcon />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="删除">
                              <IconButton size="small" color="error" onClick={() => requestDelete(r.id, r.name)} sx={{ bgcolor: 'background.paper' }}>
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component="div"
              count={total}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(_e, p) => setPage(p)}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
              rowsPerPageOptions={[5, 10, 25, 50]}
              sx={{ px: 2, py: 1 }}
            />
          </>
        )}
      </Paper>

      {/* batch action bar */}
      {selectedIds.size > 0 && (
        <Zoom in>
          <Paper
            elevation={8}
            sx={{
              position: 'fixed',
              bottom: 92,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 1400,
              px: 2,
              py: 1,
              display: 'flex',
              gap: 1,
              alignItems: 'center',
              borderRadius: 2,
              bgcolor: alpha(theme.palette.background.paper, 0.98),
              boxShadow: (t) => `0 12px 30px ${alpha(t.palette.primary.main, 0.06)}`,
            }}
          >
            <Typography variant="body2" fontWeight={800}>
              已选 {selectedIds.size}
            </Typography>
            <Button size="small" color="error" onClick={batchDelete} sx={{ borderRadius: 999 }}>
              批量删除
            </Button>
            <Button size="small" onClick={() => batchSetStatus(0)} sx={{ borderRadius: 999 }}>
              批量启用
            </Button>
            <Button size="small" onClick={() => batchSetStatus(1)} sx={{ borderRadius: 999 }}>
              批量禁用
            </Button>
            <Button size="small" onClick={clearSelection} startIcon={<ClearIcon />} sx={{ borderRadius: 999 }}>
              取消
            </Button>
          </Paper>
        </Zoom>
      )}

      {/* edit dialog */}
      <CategoryDialog open={dialogOpen} initialData={editing} onClose={() => setDialogOpen(false)} onSave={handleSave} />

      {/* delete confirm */}
      <Dialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)}>
        <DialogTitle>确认删除</DialogTitle>
        <DialogContent>
          <Typography>
            确定删除分类 <strong>{deleteTarget?.name}</strong> 吗？此操作不可恢复。
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)} sx={{ textTransform: 'none' }}>
            取消
          </Button>
          <Button color="error" variant="contained" onClick={confirmDelete} sx={{ textTransform: 'none' }}>
            删除
          </Button>
        </DialogActions>
      </Dialog>

      {/* floating add */}
      <Zoom in>
        <Fab
          color="primary"
          onClick={openAdd}
          sx={{
            position: 'fixed',
            right: 28,
            bottom: 28,
            borderRadius: 999,
            boxShadow: (t) => `0 12px 30px ${alpha(t.palette.primary.main, 0.18)}`,
          }}
        >
          <AddIcon />
        </Fab>
      </Zoom>

      {/* global error */}
      {error && (
        <Paper sx={{ position: 'fixed', top: 20, right: 20, p: 1.25, bgcolor: alpha(theme.palette.error.main, 0.08), borderRadius: 1.5 }}>
          <Typography color="error">{error.message ?? '加载出错'}</Typography>
        </Paper>
      )}
    </Box>
  );
};

export default CategoryManagement;