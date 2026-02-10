// src/pages/MyOrdersPage.tsx
import React, { useEffect, useState } from 'react';
import { Table, Spin, Button, Pagination, Form, Input, Select, Space } from 'antd';
import type { PurchaseOrderSearchVO, PurChaseOrderVO } from '@/api/order/order/OrderType';
import usePurChaseOrder from '@/stores/order/PurchaseOrder';
import type { PageType } from '@/api/type/PageType';

const { Option } = Select;

const MyOrdersPage: React.FC = () => {
  const { findByUserIdPageApi, loading, deletedByIdApi } = usePurChaseOrder();
  const [orders, setOrders] = useState<PurChaseOrderVO[]>([]);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(1);
  const pageSize = 10;

  // 搜索条件状态
  const [searchForm] = Form.useForm();
  const [searchParams, setSearchParams] = useState<Partial<PurChaseOrderVO>>({});

  const fetchOrders = async (page: number = 1) => {
    const pageData: PageType<Partial<PurchaseOrderSearchVO>> = {
      pageNum: page,
      pageSize: pageSize,
      condition:  searchParams, // 👈 使用搜索参数
    };

    const res = await findByUserIdPageApi(pageData);
    if (res) {
      setOrders(res.rows || []);
      setTotal(res.total || 0);
      setCurrent(page);
    }
  };

  useEffect(() => {
    fetchOrders(1);
  }, []);

  const handleSearch = (values: any) => {
    // 过滤掉空值（null, undefined, 空字符串）
    const filteredValues = Object.fromEntries(
      Object.entries(values).filter(([_, v]) => v !== undefined && v !== null && v !== '')
    );
    setSearchParams(filteredValues);
    setCurrent(1);
    fetchOrders(1); // 搜索时回到第一页
  };

  const handleReset = () => {
    searchForm.resetFields();
    setSearchParams({});
    fetchOrders(1);
  };

  const handleDelete = async (id: string) => {
    await deletedByIdApi(id);
    fetchOrders(current); // 刷新当前页
  };

  const handlePageChange = (page: number) => {
    fetchOrders(page);
  };

  const statusOptions = [
    { value: 1, label: '待付款' },
    { value: 2, label: '待发货' },
    { value: 3, label: '待收货' },
    { value: 4, label: '待评价' },
    { value: 5, label: '已完成' },
    { value: 6, label: '已取消' },
  ];

  const columns = [
     {
    title: '商品图片',
    dataIndex: 'image',
    key: 'image',
  render: (url: string) => {
  let cleanUrl = '';
  try {
    // 如果 url 是一个 JSON 字符串（如 '"https://..."'），就 parse 它
    if (typeof url === 'string' && url.startsWith('"') && url.endsWith('"')) {
      cleanUrl = JSON.parse(url);
    } else {
      cleanUrl = url || '';
    }
  } catch (e) {
    console.warn('Failed to parse image URL:', url, e);
    cleanUrl = '';
  }

  return <img 
    src={cleanUrl} 
    alt="商品" 
    style={{ width: '50px', height: '50px', objectFit: 'cover' }} 
    onError={(e) => {
      (e.target as HTMLImageElement).src = '/images/placeholder.png'; // 可选：默认图
    }}
  />;
}
  },
    {
      title: '订单编号',
      dataIndex: 'orderNo',
      key: 'orderNo',
    },
    {
      title: '商品名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '总金额',
      dataIndex: 'amount',
      key: 'amount',
      render: (text: string) => `¥${text}`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: number) => {
        const map: Record<number, string> = {
          1: '待付款',
          2: '待发货',
          3: '待收货',
          4: '待评价',
          5: '已完成',
          6: '已取消',
        };
        return map[status] || '未知';
      },
    },
    {
      title: '下单时间',
      dataIndex: 'orderPlacementTime',
      key: 'orderPlacementTime',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: PurChaseOrderVO) => (
        <Button size="small" danger onClick={() => handleDelete(record.id)}>
          删除
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <h2>我的订单</h2>

      {/* 搜索表单 */}
      <Form form={searchForm} layout="inline" onFinish={handleSearch} style={{ marginBottom: '16px' }}>
        <Form.Item name="orderNo" label="订单编号">
          <Input placeholder="请输入订单号" allowClear />
        </Form.Item>
        <Form.Item name="name" label="商品名称">
          <Input placeholder="请输入商品名" allowClear />
        </Form.Item>
        <Form.Item name="status" label="订单状态">
          <Select placeholder="请选择状态" allowClear style={{ width: 140 }}>
            {statusOptions.map((opt) => (
              <Option key={opt.value} value={opt.value}>
                {opt.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button htmlType="button" onClick={handleReset}>
              重置
            </Button>
          </Space>
        </Form.Item>
      </Form>

      {loading ? (
        <Spin tip="加载中..." />
      ) : (
        <>
          <Table
            dataSource={orders}
            columns={columns}
            rowKey="id"
            pagination={false}
            style={{ marginBottom: '16px' }}
          />
          <Pagination
            current={current}
            total={total}
            pageSize={pageSize}
            onChange={handlePageChange}
            showSizeChanger={false}
            showQuickJumper
          />
        </>
      )}
    </div>
  );
};

export default MyOrdersPage;