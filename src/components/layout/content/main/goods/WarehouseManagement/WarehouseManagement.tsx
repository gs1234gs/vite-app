// WarehouseManagement.tsx （仅关键部分修正，其余不变）
import React, { useEffect, useState } from 'react';
import {
  Button,
  Table,
  Space,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  message,
  Popconfirm,
  Tag,
  Card,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import useWarehouse from '@/stores/goods/Warehouse';
import type { WarehouseVO, WarehouseSaveVO } from '@/api/goods/warehouse/WarehouseType';

const { Option } = Select;
const { TextArea } = Input;

const WarehouseManagement: React.FC = () => {
  const {
    loading,
    saveWarehouseApi,
    findWarehouseByIdApi,
    deleteWarehouseByIdApi,
    deleteAllWarehouseByIdApi,
    findWarehousePageApi,
  } = useWarehouse();

  const [form] = Form.useForm<WarehouseSaveVO>();
  const [searchForm] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<WarehouseVO[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchParams, setSearchParams] = useState<Partial<WarehouseVO>>({
    name: '',
    address: '',
    status: undefined,
  });

  // 加载分页数据 —— ✅ 修正：使用传入的 params 构造 condition
  const loadPage = async (pageNum: number, pageSize: number, params: Partial<WarehouseVO> = {}) => {
    const condition = {
      name: params.name ?? '',
      address: params.address ?? '',
      capacity: 0,
      status: params.status ?? 0, // 注意：API 可能要求 number，undefined 会出错，所以默认 0
      creator: '',
      updater: '',
      createTime: '',
      updateTime: '',
      delFlag: 0,
    };

    const pageData = await findWarehousePageApi({
      pageNum,
      pageSize,
      condition,
    });

    if (pageData) {
      setDataSource(pageData.rows || []);
      setPagination({
        current: pageData.pageNum,
        pageSize: pageData.pageSize,
        total: pageData.total,
      });
    }
  };

  useEffect(() => {
    loadPage(1, 10, searchParams);
  }, []);

  const handleTableChange = (paginationConfig: any) => {
    const { current = 1, pageSize = 10 } = paginationConfig;
    setPagination((prev) => ({ ...prev, current, pageSize }));
    loadPage(current, pageSize, searchParams);
  };

  const handleSearch = (values: any) => {
    const params = {
      name: values.name?.trim() || '',
      address: values.address?.trim() || '',
      status: values.status !== undefined ? Number(values.status) : undefined,
    };
    setSearchParams(params);
    loadPage(1, pagination.pageSize, params);
  };

  const handleReset = () => {
    searchForm.resetFields();
    const params = { name: '', address: '', status: undefined };
    setSearchParams(params);
    loadPage(1, pagination.pageSize, params);
  };

  const showModal = async (record?: WarehouseVO) => {
    if (record) {
      const detail = await findWarehouseByIdApi(record.id!);
      if (detail) {
        form.setFieldsValue(detail);
        setEditId(record.id!);
      }
    } else {
      form.resetFields();
      setEditId(null);
    }
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
    form.resetFields();
  };

  const onFinish = async (values: WarehouseSaveVO) => {
    const payload: WarehouseSaveVO = { ...values };
    if (editId) {
      payload.id = editId;
    }

    const id = await saveWarehouseApi(payload);
    if (id !== null) {
      // message.success(editId ? '编辑成功' : '新增成功');
      handleCancel();
      loadPage(pagination.current, pagination.pageSize, searchParams);
    }
  };

  const handleDelete = async (id: string) => {
    const result = await deleteWarehouseByIdApi(id);
    if (result !== null) {
      // message.success('删除成功');
      loadPage(pagination.current, pagination.pageSize, searchParams);
    }
  };

  const handleBatchDelete = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要删除的仓库');
      return;
    }
    const ids = selectedRowKeys.map(String);
    const result = await deleteAllWarehouseByIdApi(ids);
    if (result !== null) {
      // message.success('批量删除成功');
      setSelectedRowKeys([]);
      loadPage(pagination.current, pagination.pageSize, searchParams);
    }
  };

  const columns: ColumnsType<WarehouseVO> = [
    { title: '仓库名称', dataIndex: 'name', key: 'name' },
    { title: '地址', dataIndex: 'address', key: 'address' },
    { title: '容量', dataIndex: 'capacity', key: 'capacity' },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: number) => {
        let color = 'default';
        let text = '未知';
        if (status === 0) { // ✅ 0 是启用
          color = 'green';
          text = '启用';
        } else if (status === 1) { // ✅ 1 是禁用
          color = 'red';
          text = '禁用';
        }
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => showModal(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确定删除该仓库？"
            onConfirm={() => handleDelete(record.id!)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* 搜索区域 */}
      <Card style={{ marginBottom: 16 }}>
        <Form form={searchForm} layout="inline" onFinish={handleSearch}>
          <Form.Item name="name" label="仓库名称">
            <Input placeholder="请输入仓库名称" allowClear />
          </Form.Item>
          <Form.Item name="address" label="地址">
            <Input placeholder="请输入地址" allowClear />
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Select placeholder="全部" allowClear style={{ width: 120 }}>
              {/* ✅ 修正：0 = 启用，1 = 禁用 */}
              <Option value={0}>启用</Option>
              <Option value={1}>禁用</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button onClick={handleReset}>重置</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      {/* 操作按钮 */}
      <div style={{ marginBottom: 16, textAlign: 'right' }}>
        <Space>
          <Button type="primary" onClick={() => showModal()}>
            新增仓库
          </Button>
          <Button
            danger
            onClick={handleBatchDelete}
            disabled={selectedRowKeys.length === 0}
          >
            批量删除 ({selectedRowKeys.length})
          </Button>
        </Space>
      </div>

      {/* 数据表格 */}
      <Table
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条`,
        }}
        onChange={handleTableChange}
        rowSelection={rowSelection}
      />

      {/* 新增/编辑弹窗 */}
      <Modal
        title={editId ? '编辑仓库' : '新增仓库'}
        open={visible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ status: 0 }} // ✅ 默认启用（0）
        >
          <Form.Item
            name="name"
            label="仓库名称"
            rules={[{ required: true, message: '请输入仓库名称' }]}
          >
            <Input placeholder="例如：上海中心仓" />
          </Form.Item>

          <Form.Item
            name="address"
            label="地址"
            rules={[{ required: true, message: '请输入仓库地址' }]}
          >
            <TextArea placeholder="详细地址" rows={2} />
          </Form.Item>

          <Form.Item
            name="capacity"
            label="容量（件）"
            rules={[{ required: true, message: '请输入容量' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select placeholder="请选择仓库状态">
              {/* ✅ 修正：0 = 启用，1 = 禁用 */}
              <Option value={0}>启用</Option>
              <Option value={1}>禁用</Option>
            </Select>
          </Form.Item>

          <Form.Item name="adminId" label="管理员ID（可选）">
            <Input placeholder="SysUser 的 ID，留空则无管理员" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                保存
              </Button>
              <Button onClick={handleCancel}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default WarehouseManagement;