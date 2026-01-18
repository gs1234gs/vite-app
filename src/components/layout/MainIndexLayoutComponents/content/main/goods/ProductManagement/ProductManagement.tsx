import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Input,
  Form,
  Select,
  DatePicker,
  Tag,
  message,
  Row,
  Col,
  Typography,
  Popconfirm,
  Tooltip,
} from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UploadOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { ProductVO } from '@/api/goods/product/ProductType';
import type { PageType } from '@/api/type/PageType';
import useProduct from '@/stores/goods/Product';
import dayjs from 'dayjs';
import ProductModal from './ProductDialog';

const { Title } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

// 商品管理主组件
const ProductManagement: React.FC = () => {
  const [form] = Form.useForm();
  const useProductApi = useProduct();
  const { loading, findAllByApi, deleteByIdApi, deleteAllByIdApi } = useProductApi;
  
  // 状态管理
  const [data, setData] = useState<ProductVO[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState<ProductVO | null>(null);
  const [modalType, setModalType] = useState<'create' | 'edit' | 'view'>('create');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total: number) => `共 ${total} 条记录`
  });

  // 获取商品列表
  const fetchProductList = useCallback(async (pageNum = 1) => {
    try {
      const values = await form.validateFields();
      const condition = {
        ...values,
        startTime: values.timeRange?.[0]?.format('YYYY-MM-DD HH:mm:ss'),
        endTime: values.timeRange?.[1]?.format('YYYY-MM-DD HH:mm:ss'),
        timeRange: undefined
      };

      const test: PageType<ProductVO> = {
        pageNum,
        pageSize: pagination.pageSize,
        condition
      };

      const res = await findAllByApi(test);
      if (res) {
        setData(res.rows || []);
        setPagination(prev => ({
          ...prev,
          current: res.pageNum || pageNum,
          total: res.total || 0
        }));
      }
    } catch (error) {
      console.error('查询失败:', error);
    }
  }, [form, findAllByApi, pagination.pageSize]);

  // 初始加载
  useEffect(() => {
    fetchProductList();
  }, [fetchProductList]);

  // 表格列定义
  const columns: ColumnsType<ProductVO> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      fixed: 'left'
    },
    {
      title: '商品名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (text, record) => (
        <Space>
          <img 
            src={record.image || 'https://via.placeholder.com/40'}
            alt="商品图片"
            style={{ width: 40, height: 40, borderRadius: 4, objectFit: 'cover' }}
          />
          <span>{text}</span>
        </Space>
      )
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      width: 100,
      render: (text) => `¥${text}`
    },
    {
      title: '库存',
      dataIndex: 'stock',
      key: 'stock',
      width: 100,
      render: (stock) => (
        <Tag color={stock > 100 ? 'green' : stock > 10 ? 'orange' : 'red'}>
          {stock}
        </Tag>
      )
    },
    {
      title: '销量',
      dataIndex: 'salesVolume',
      key: 'salesVolume',
      width: 100,
      render: (volume) => (
        <Tag color="blue">{volume}</Tag>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={status === 1 ? 'success' : 'error'}>
          {status === 1 ? '上架' : '下架'}
        </Tag>
      )
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
      render: (time) => time ? dayjs(time).format('YYYY-MM-DD HH:mm') : '-'
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="查看">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleView(record)}
            />
          </Tooltip>
          <Tooltip title="编辑">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="删除">
            <Popconfirm
              title="确定要删除这个商品吗？"
              onConfirm={() => handleDelete(record.id)}
              okText="确定"
              cancelText="取消"
            >
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      )
    }
  ];

  // 处理查看
  const handleView = (record: ProductVO) => {
    setModalData(record);
    setModalType('view');
    setModalVisible(true);
  };

  // 处理编辑
  const handleEdit = (record: ProductVO) => {
    setModalData(record);
    setModalType('edit');
    setModalVisible(true);
  };

  // 处理删除
  const handleDelete = async (id: string) => {
    try {
      await deleteByIdApi(id);
      message.success('删除成功');
      fetchProductList(pagination.current);
    } catch (error) {
      message.error('删除失败');
    }
  };

  // 批量删除
  const handleBatchDelete = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要删除的商品');
      return;
    }

    try {
      await deleteAllByIdApi(selectedRowKeys);
      message.success('批量删除成功');
      setSelectedRowKeys([]);
      fetchProductList(pagination.current);
    } catch (error) {
      message.error('批量删除失败');
    }
  };

  // 重置搜索
  const handleReset = () => {
    form.resetFields();
    fetchProductList(1);
  };

  // 表格选择变化
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  // 分页变化
  const handleTableChange = (newPagination: any) => {
    setPagination(newPagination);
    fetchProductList(newPagination.current);
  };

  // 行选择配置
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
    <div style={{ padding: 24 }}>
      <Card bordered={false} style={{ marginBottom: 24 }}>
        <Title level={4} style={{ marginBottom: 24 }}>
          商品管理
        </Title>
        
        {/* 搜索表单 */}
        <Form
          form={form}
          layout="vertical"
          onFinish={() => fetchProductList(1)}
        >
          <Row gutter={24}>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="商品名称" name="name">
                <Input placeholder="请输入商品名称" allowClear />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="品牌" name="brand">
                <Input placeholder="请输入品牌" allowClear />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="商品状态" name="status">
                <Select placeholder="请选择状态" allowClear>
                  <Option value={1}>上架</Option>
                  <Option value={0}>下架</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="创建时间" name="timeRange">
                <RangePicker
                  style={{ width: '100%' }}
                  showTime
                  format="YYYY-MM-DD HH:mm"
                />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16} justify="end">
            <Col>
              <Button onClick={handleReset} icon={<ReloadOutlined />}>
                重置
              </Button>
            </Col>
            <Col>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                搜索
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* 操作栏 */}
      <Card bordered={false} style={{ marginBottom: 24 }}>
        <Space style={{ marginBottom: 16 }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setModalData(null);
              setModalType('create');
              setModalVisible(true);
            }}
          >
            新增商品
          </Button>
          
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={handleBatchDelete}
            disabled={selectedRowKeys.length === 0}
          >
            批量删除 ({selectedRowKeys.length})
          </Button>
          
          <Button
            icon={<UploadOutlined />}
            onClick={() => message.info('导出功能开发中')}
          >
            导出数据
          </Button>
        </Space>

        {/* 商品表格 */}
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={loading}
          rowSelection={rowSelection}
          pagination={pagination}
          onChange={handleTableChange}
          scroll={{ x: 1300 }}
          bordered
          size="middle"
        />
      </Card>

      {/* 商品弹窗 */}
      <ProductModal
        visible={modalVisible}
        type={modalType}
        data={modalData}
        onCancel={() => setModalVisible(false)}
        onSuccess={() => {
          setModalVisible(false);
          fetchProductList(pagination.current);
        }}
      />
    </div>
  );
};

export default ProductManagement;