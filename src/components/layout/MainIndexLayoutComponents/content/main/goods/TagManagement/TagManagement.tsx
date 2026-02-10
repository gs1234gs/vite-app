import React, { useEffect, useState } from 'react';
import {
  Button,
  Table,
  Modal,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Select,
  Tag,
  Space,
  message,
  Popconfirm,
  Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs, { Dayjs } from 'dayjs';
import useTag from '@/stores/goods/Tag';
import type { TagSaveVO, TagVO } from '@/api/goods/tag/TagType';
import type { PageType } from '@/api/type/PageType';

const { Option } = Select;
const { Text } = Typography;

// 表单内部使用的类型（与 TagSaveVO 类似，但适配控件值）
interface TagFormValues {
  id?: string;
  name?: string;
  code?: string;
  color?: string;
  status?: 0 | 1;
  weight?: number | null; // InputNumber 返回 number | null
  sort?: number | null;
  composition?: string;
  placeOfOrigin?: string;
  productWeight?: number | null;
  productionDate?: Dayjs | null; // DatePicker 返回 Dayjs | null
  shelfLife?: number | null;
  description?: string;
}

const TagManagement: React.FC = () => {
  const {
    findAllTagByApi,
    saveTagApi,
    findTagByIdApi,
    deleteTagByIdApi,
    deleteAllTagByIdApi,
  } = useTag();

  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<TagVO[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchCondition, setSearchCondition] = useState<Partial<TagVO>>({});

  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm<TagFormValues>();

  const [searchForm] = Form.useForm<Partial<TagVO>>();

  const fetchList = async (page: number = 1, size: number = pageSize) => {
    setLoading(true);
    const pageData: PageType<TagVO> = {
      pageNum: page,
      pageSize: size,
      condition: searchCondition as TagVO,
    };
    const res = await findAllTagByApi(pageData);
    if (res?.rows) {
      setDataSource(res.rows);
      setTotal(res.total);
      setCurrentPage(page);
      setPageSize(size);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchList();
  }, []);

  const handleAdd = () => {
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = async (id: string) => {
    const data = await findTagByIdApi(id);
    if (data) {
      // 转换为表单值
      const formData: TagFormValues = {
        ...data,
        weight: data.weight ? parseFloat(data.weight) : undefined,
        productWeight: data.productWeight ? parseFloat(data.productWeight) : undefined,
        productionDate: data.productionDate ? dayjs(data.productionDate) : null,
        sort: data.sort ?? undefined,
        shelfLife: data.shelfLife ?? undefined,
      };
      form.setFieldsValue(formData);
      setModalVisible(true);
    }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      
      // 转换为 TagSaveVO（字符串化数值，ISO 日期）
      const payload: TagSaveVO = {
        id: values.id,
        name: values.name,
        code: values.code,
        color: values.color,
        status: values.status ?? 0,
        weight: values.weight != null ? String(values.weight) : undefined,
        sort: values.sort != null ? Number(values.sort) : undefined,
        composition: values.composition,
        placeOfOrigin: values.placeOfOrigin,
        productWeight:
          values.productWeight != null ? String(values.productWeight) : undefined,
        productionDate: values.productionDate
          ? values.productionDate.format('YYYY-MM-DDTHH:mm:ss')
          : undefined,
        shelfLife: values.shelfLife != null ? Number(values.shelfLife) : undefined,
        description: values.description,
      };

      const result = await saveTagApi(payload);
      if (result !== null) {
        setModalVisible(false);
        fetchList(currentPage, pageSize);
      }
    } catch (err) {
      console.error('Validate Failed:', err);
    }
  };

  const handleDelete = async (id: string) => {
    const result = await deleteTagByIdApi(id);
    if (result !== null) {
      fetchList(currentPage, pageSize);
    }
  };

  const handleBatchDelete = async (selectedRowKeys: React.Key[]) => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要删除的标签');
      return;
    }
    const result = await deleteAllTagByIdApi(selectedRowKeys.map(String));
    if (result !== null) {
      setSelectedRowKeys([]);
      fetchList(currentPage, pageSize);
    }
  };

  const handleSearch = (values: Partial<TagVO>) => {
    setSearchCondition(values);
    fetchList(1, pageSize);
  };

  const handleResetSearch = () => {
    searchForm.resetFields();
    setSearchCondition({});
    fetchList(1, pageSize);
  };

  const columns: ColumnsType<TagVO> = [
    { title: 'ID', dataIndex: 'id', width: 180 },
    { title: '标签名称', dataIndex: 'name' },
    { title: '编码', dataIndex: 'code' },
    {
      title: '颜色',
      dataIndex: 'color',
      render: (color) => (
        <Space>
          <div
            style={{
              width: 20,
              height: 20,
              backgroundColor: color || '#ccc',
              border: '1px solid #ddd',
              borderRadius: 4,
            }}
          />
          <Text copyable>{color}</Text>
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (status: 0 | 1) => (
        <Tag color={status === 0 ? 'green' : 'red'}>
          {status === 0 ? '启用' : '禁用'}
        </Tag>
      ),
    },
    { title: '权重', dataIndex: 'weight' },
    { title: '排序', dataIndex: 'sort' },
    { title: '材料组成', dataIndex: 'composition', ellipsis: true },
    { title: '产地', dataIndex: 'placeOfOrigin', ellipsis: true },
    { title: '重量', dataIndex: 'productWeight' },
    {
      title: '生产日期',
      dataIndex: 'productionDate',
      render: (date: string) => (date ? dayjs(date).format('YYYY-MM-DD HH:mm') : '-'),
    },
    { title: '保质期(天)', dataIndex: 'shelfLife' },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 120,
      render: (_, record) => (
        <Space>
          <Button size="small" onClick={() => handleEdit(record.id)}>
            编辑
          </Button>
          <Popconfirm
            title="确定删除?"
            onConfirm={() => handleDelete(record.id)}
            okText="是"
            cancelText="否"
          >
            <Button size="small" danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* 搜索 */}
      <Form
        form={searchForm}
        layout="inline"
        onFinish={handleSearch}
        style={{ marginBottom: 16 }}
      >
        <Form.Item name="name" label="标签名称">
          <Input placeholder="请输入" allowClear />
        </Form.Item>
        <Form.Item name="code" label="编码">
          <Input placeholder="请输入" allowClear />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button onClick={handleResetSearch}>重置</Button>
          </Space>
        </Form.Item>
      </Form>

      {/* 操作栏 */}
      <div style={{ marginBottom: 16 }}>
        <Space>
          <Button type="primary" onClick={handleAdd}>
            新增标签
          </Button>
          <Popconfirm
            title={`确定删除选中的  $ {selectedRowKeys.length} 项？`}
            onConfirm={() => handleBatchDelete(selectedRowKeys)}
            okText="是"
            cancelText="否"
            disabled={selectedRowKeys.length === 0}
          >
            <Button danger disabled={selectedRowKeys.length === 0}>
              批量删除
            </Button>
          </Popconfirm>
        </Space>
      </div>

      {/* 表格 */}
      <Table
        rowKey="id"
        loading={loading}
        dataSource={dataSource}
        columns={columns}
        pagination={{
          current: currentPage,
          pageSize,
          total,
          showSizeChanger: true,
          onChange: (page, size) => fetchList(page, size),
        }}
        rowSelection={rowSelection}
        scroll={{ x: 1600 }}
      />

      {/* Modal */}
      <Modal
        title={form.getFieldValue('id') ? '编辑标签' : '新增标签'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSave}
        confirmLoading={loading}
        width={700}
        destroyOnClose // 关键：确保每次打开都是干净表单
      >
        <Form<TagFormValues>
          form={form}
          layout="vertical"
          initialValues={{ status: 0 }}
        >
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>

          <Form.Item
            label="标签名称"
            name="name"
            rules={[{ required: true, message: '请输入标签名称' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="编码"
            name="code"
            rules={[{ required: true, message: '请输入编码' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="颜色" name="color">
            <Input placeholder="#FF9900" />
          </Form.Item>

          <Form.Item label="状态" name="status">
            <Select>
              <Option value={0}>启用</Option>
              <Option value={1}>禁用</Option>
            </Select>
          </Form.Item>

          <Form.Item label="权重" name="weight">
            <InputNumber
              style={{ width: '100%' }}
              placeholder="用于排序或推荐"
              precision={6}
              min={0}
            />
          </Form.Item>

          <Form.Item label="排序值" name="sort">
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>

          <Form.Item label="材料组成" name="composition">
            <Input.TextArea rows={2} />
          </Form.Item>

          <Form.Item label="产地" name="placeOfOrigin">
            <Input />
          </Form.Item>

          <Form.Item label="重量" name="productWeight">
            <InputNumber
              style={{ width: '100%' }}
              placeholder="单位由业务约定"
              precision={3}
              min={0}
            />
          </Form.Item>

          <Form.Item label="生产日期" name="productionDate">
            <DatePicker showTime style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item label="保质期（天）" name="shelfLife">
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>

          <Form.Item label="描述" name="description">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TagManagement;