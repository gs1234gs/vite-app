import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Button,
  Card,
  Table,
  Space,
  Input,
  Modal,
  Form,
  Select,
  Tag,
  Badge,
  Popconfirm,
  message,
  Row,
  Col,
  Divider,
  Typography,
  Image,
  Flex,
  ConfigProvider,
  theme
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  ClearOutlined,
  UpOutlined,
  DownOutlined
} from '@ant-design/icons';
import useCategory from '@/stores/goods/Category';
import type { PageType } from '@/api/type/PageType';
import type { CategoryVO, CategorySaveVO } from '@/api/goods/category/CategoryType';
import CategoryDialog from './CategoryDialog';

const { Text, Title } = Typography;

type SearchForm = {
  q?: string;
  status?: string | number;
  recommended?: string | number;
  level?: string | number;
};

/**
 * 使用 Ant Design 风格重构分类管理页面
 */

const CategoryManagement: React.FC = () => {
  const [form] = Form.useForm();
  const [mobileSearchOpen, setMobileSearchOpen] = useState<boolean>(false);
  const { loading, error, findPageApi, saveApi, deleteByIdApi, findByIdApi } = useCategory();

  const [rows, setRows] = useState<CategoryVO[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const [search, setSearch] = useState<SearchForm>({});

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<CategoryVO | null>(null);

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

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
        pageSize: pageSize,
        condition: buildCondition(),
      } as PageType<CategoryVO>);
      if (res) {
        setRows(res.rows || []);
        setTotal(res.total || 0);
      }
    } catch (e) {
      message.error('加载分类失败');
    }
  }, [findPageApi, page, pageSize, buildCondition]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSearchChange = (k: keyof SearchForm, v: any) => setSearch((s) => ({ ...s, [k]: v }));

  const resetSearch = () => {
    setSearch({});
    setPage(0);
    form.resetFields();
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
      message.error('获取详情失败');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      if (!deleteByIdApi) throw new Error('删除接口未配置');
      await deleteByIdApi(id);
      // message.success('删除成功');
      loadData();
    } catch (e: any) {
      message.error(`删除失败: ${e?.message ?? ''}`);
    }
  };

  const handleSave = async (payload: CategorySaveVO) => {
    try {
      await saveApi(payload);
      // message.success(`分类${payload.id ? '更新' : '添加'}成功`);
      setDialogOpen(false);
      loadData();
    } catch (e: any) {
      message.error(`保存失败: ${e?.message ?? ''}`);
    }
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const hasSearch = useMemo(() => Object.values(search).some((v) => v !== undefined && v !== '' && v !== null), [search]);

  // 定义表格列
  const columns = [
    {
      title: '图标',
      dataIndex: 'iconUrl',
      key: 'iconUrl',
      render: (url: string) => url ? (
        <Image 
          src={url} 
          width={52} 
          height={52} 
          style={{ borderRadius: 8 }}
          fallback="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        />
      ) : (
        <div style={{ 
          width: 52, 
          height: 52, 
          borderRadius: 8, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          backgroundColor: '#f5f5f5' 
        }}>
          <SearchOutlined />
        </div>
      ),
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: CategoryVO, b: CategoryVO) => a.name.localeCompare(b.name),
      render: (name: string, record: CategoryVO) => (
        <div>
          <Text strong>{name}</Text>
          <br />
          <Text type="secondary" ellipsis style={{ maxWidth: 200, display: 'block' }}>{record.description || '暂无描述'}</Text>
        </div>
      )
    },
    {
      title: '编码',
      dataIndex: 'code',
      key: 'code',
      render: (code: string) => <Tag color="blue">{code}</Tag>
    },
    {
      title: '层级',
      dataIndex: 'level',
      key: 'level',
      filters: [
        { text: '一级分类', value: 1 },
        { text: '二级分类', value: 2 },
        { text: '三级分类', value: 3 },
      ],
      onFilter: (value: any, record: CategoryVO) => record.level === value,
      render: (level: number) => {
        const colors = ['#1890ff', '#52c41a', '#722ed1'];
        return (
          <Space>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {Array.from({ length: level }).map((_, i) => (
                <div 
                  key={i} 
                  style={{ 
                    width: 8, 
                    height: 8, 
                    backgroundColor: colors[i % colors.length], 
                    borderRadius: '50%',
                    marginRight: 4
                  }} 
                />
              ))}
            </div>
            <Text>第 {level} 级</Text>
          </Space>
        );
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: '启用', value: 0 },
        { text: '禁用', value: 1 },
      ],
      onFilter: (value: any, record: CategoryVO) => record.status === value,
      render: (status: number) => (
        <Badge status={status === 0 ? 'success' : 'default'} text={status === 0 ? '启用' : '禁用'} />
      ),
    },
    {
      title: '推荐',
      dataIndex: 'recommended',
      key: 'recommended',
      filters: [
        { text: '推荐', value: 1 },
        { text: '普通', value: 0 },
      ],
      onFilter: (value: any, record: CategoryVO) => record.recommended === value,
      render: (recommended: number) => (
        <Tag color={recommended === 1 ? 'gold' : 'default'}>
          {recommended === 1 ? '推荐' : '普通'}
        </Tag>
      ),
    },
    {
      title: '排序',
      dataIndex: 'sortOrder',
      key: 'sortOrder',
      sorter: (a: CategoryVO, b: CategoryVO) => a.sortOrder - b.sortOrder,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (time: string) => new Date(time).toLocaleDateString(),
      sorter: (a: CategoryVO, b: CategoryVO) => new Date(a.createTime).getTime() - new Date(b.createTime).getTime(),
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right' as const,
      render: (_: any, record: CategoryVO) => (
        <Space size="middle">
          <Button 
            type="link" 
            icon={<EditOutlined />}
            onClick={() => openEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm 
            title="确定要删除这个分类吗？" 
            onConfirm={() => handleDelete(record.id)}
            okText="确定" 
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
      }}
    >
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
        {/* 页面头部 */}
        <Card>
          <Flex justify="space-between" align="center" wrap="wrap" gap="middle">
            <div>
              <Title level={3} style={{ margin: 0 }}>分类管理</Title>
              <Text type="secondary">现代化界面 — Ant Design 风格</Text>
            </div>

            <Space>
              {hasSearch && (
                <Tag 
                  color="blue" 
                  closable 
                  onClose={resetSearch}
                >
                  匹配 {total} 条
                </Tag>
              )}

              {selectedRowKeys.length > 0 && (
                <Tag 
                  color="processing" 
                  closable 
                  onClose={() => setSelectedRowKeys([])}
                >
                  已选 {selectedRowKeys.length} 项
                </Tag>
              )}

              <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>
                新增
              </Button>

              <Button 
                icon={<ReloadOutlined />} 
                onClick={loadData} 
                loading={loading}
              >
                刷新
              </Button>
            </Space>
          </Flex>
        </Card>

        {/* 搜索区域 */}
        <Card>
          <Form form={form} layout="vertical">
            <Row gutter={16}>
              <Col xs={24} sm={12} md={6}>
                <Form.Item label="关键词">
                  <Input
                    placeholder="名称 / 编码"
                    value={search.q ?? ''}
                    onChange={(e) => handleSearchChange('q', e.target.value)}
                    onPressEnter={applySearch}
                    suffix={
                      <Space style={{ pointerEvents: 'auto' }}>
                        {(search.q && search.q.length > 0) && (
                          <Button 
                            type="text" 
                            icon={<ClearOutlined />} 
                            onClick={() => {
                              handleSearchChange('q', '');
                              form.setFieldsValue({ q: '' });
                            }}
                          />
                        )}
                        <Button 
                          type="primary" 
                          icon={<SearchOutlined />} 
                          onClick={applySearch}
                        />
                      </Space>
                    }
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={6}>
                <Form.Item label="状态">
                  <Select
                    allowClear
                    placeholder="全部状态"
                    value={search.status ?? undefined}
                    onChange={(value) => handleSearchChange('status', value)}
                    options={[
                      { label: '启用', value: 0 },
                      { label: '禁用', value: 1 }
                    ]}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={6}>
                <Form.Item label="推荐">
                  <Select
                    allowClear
                    placeholder="全部推荐"
                    value={search.recommended ?? undefined}
                    onChange={(value) => handleSearchChange('recommended', value)}
                    options={[
                      { label: '推荐', value: 1 },
                      { label: '普通', value: 0 }
                    ]}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={6}>
                <Form.Item label="层级">
                  <Select
                    allowClear
                    placeholder="全部层级"
                    value={search.level ?? undefined}
                    onChange={(value) => handleSearchChange('level', value)}
                    options={[
                      { label: '第 1 级', value: 1 },
                      { label: '第 2 级', value: 2 },
                      { label: '第 3 级', value: 3 }
                    ]}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row justify="end">
              <Space>
                <Button onClick={resetSearch} icon={<ClearOutlined />}>
                  重置
                </Button>
                <Button type="primary" icon={<SearchOutlined />} onClick={applySearch}>
                  搜索
                </Button>
              </Space>
            </Row>
          </Form>
        </Card>

        {/* 数据表格 */}
        <Card>
          {selectedRowKeys.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <span style={{ marginLeft: 8 }}>
                已选择 {selectedRowKeys.length} 项
              </span>
              <Button 
                type="primary" 
                danger 
                size="small" 
                style={{ marginLeft: 8 }}
                onClick={() => {
                  // 批量删除操作
                }}
              >
                批量删除
              </Button>
              <Button 
                type="default" 
                size="small" 
                style={{ marginLeft: 8 }}
                onClick={() => {
                  // 批量启用操作
                }}
              >
                批量启用
              </Button>
            </div>
          )}
          
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={rows}
            rowKey="id"
            loading={loading}
            pagination={{
              current: page + 1,
              pageSize: pageSize,
              total: total,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条`,
              onChange: (newPage, newPageSize) => {
                setPage(newPage - 1);
                setPageSize(newPageSize);
              },
              onShowSizeChange: (_, size) => {
                setPageSize(size);
                setPage(0);
              }
            }}
            scroll={{ x: 1200 }}
          />
        </Card>

        {/* 编辑弹窗 */}
        <CategoryDialog 
          open={dialogOpen} 
          initialData={editing} 
          onClose={() => setDialogOpen(false)} 
          onSave={handleSave} 
        />
      </div>
    </ConfigProvider>
  );
};

export default CategoryManagement;
