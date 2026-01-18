import { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Empty,
  Modal,
  Form,
  Input,
  InputNumber,
  Table,
  Space,
  Spin,
  Popconfirm,
  Row,
  Col,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import useSku from '@/stores/goods/SKU';
import type { SKUVO, SKUSaveVO, SKUGroupByProductIdVO } from '@/api/goods/sku/SKUType';
import type { PageType } from '@/api/type/PageType';

const DEFAULT_PAGE: PageType<any> = {
  pageNum: 1,
  pageSize: 5,
  condition: {},
};

const SkuManagement = () => {
  const { loading, findSkuPageApi, saveSkuApi, deleteByIdApi } = useSku();

  const [page, setPage] = useState(DEFAULT_PAGE);
  const [data, setData] = useState<SKUGroupByProductIdVO[]>([]);
  const [total, setTotal] = useState(0);

  const [open, setOpen] = useState(false);
  const [editingSku, setEditingSku] = useState<SKUVO | null>(null);

  const [form] = Form.useForm<SKUSaveVO>();
  const [searchForm] = Form.useForm();

  // ============================
  // 查询
  // ============================
  const loadData = async () => {
    const res = await findSkuPageApi(page);
    if (res) {
      setData(res.rows || []);
      setTotal(res.total || 0);
    }
  };

  useEffect(() => {
    loadData();
  }, [page.pageNum, page.pageSize]);

  // ============================
  // 搜索
  // ============================
  const onSearch = () => {
    const values = searchForm.getFieldsValue();
    setPage({
      ...page,
      pageNum: 1,
      condition: values,
    });
  };

  const onReset = () => {
    searchForm.resetFields();
    setPage({
      ...page,
      pageNum: 1,
      condition: {},
    });
  };

  // ============================
  // 新增 / 编辑
  // ============================
  const openAdd = (productId?: string) => {
    setEditingSku(null);
    form.resetFields();
    if (productId) {
      form.setFieldValue('productId', productId);
    }
    setOpen(true);
  };

  const openEdit = (sku: SKUVO) => {
    setEditingSku(sku);
    form.setFieldsValue(sku);
    setOpen(true);
  };

  const submit = async () => {
    const values = await form.validateFields();
    await saveSkuApi({
      ...values,
      id: editingSku?.id, // 新增无 id，编辑有 id
    });
    setOpen(false);
    loadData();
  };

  // ============================
  // 表格列
  // ============================
  const columns: ColumnsType<SKUVO> = [
    { title: 'SKU名称', dataIndex: 'name' },
    { title: '编码', dataIndex: 'skuCode' },
    { title: '售价', dataIndex: 'price' },
    { title: '库存', dataIndex: 'stock' },
    {
      title: '操作',
      width: 140,
      render: (_, record) => (
        <Space>
          <Button size="small" onClick={() => openEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确定删除该 SKU？"
            onConfirm={() => deleteByIdApi(record.id).then(loadData)}
          >
            <Button danger size="small">
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Spin spinning={loading}>
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        {/* ================= 顶部操作栏 ================= */}
        <Card>
          <Form form={searchForm} layout="inline">
            <Form.Item name="name" label="SKU名称">
              <Input placeholder="请输入 SKU 名称" allowClear />
            </Form.Item>
            <Form.Item name="skuCode" label="SKU编码">
              <Input placeholder="请输入 SKU 编码" allowClear />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type="primary" onClick={onSearch}>
                  查询
                </Button>
                <Button onClick={onReset}>重置</Button>
                <Button type="primary" onClick={() => openAdd()}>
                  新增 SKU
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>

        {/* ================= 列表 ================= */}
        {data.length === 0 ? (
          <Empty description="暂无 SKU 数据" />
        ) : (
          data.map((group) => (
            <Card
              key={group.productId}
              title={group.productName}
              extra={
                <Button size="small" onClick={() => openAdd(group.productId)}>
                  添加 SKU
                </Button>
              }
            >
              <Table
                rowKey="id"
                columns={columns}
                dataSource={group.skuList}
                pagination={false}
                locale={{ emptyText: '暂无 SKU' }}
              />
            </Card>
          ))
        )}

        {/* ================= 分页 ================= */}
        <Card>
          <Space>
            <Button
              disabled={page.pageNum <= 1}
              onClick={() => setPage({ ...page, pageNum: page.pageNum - 1 })}
            >
              上一页
            </Button>
            <span>
              第 {page.pageNum} 页 / 共 {Math.ceil(total / page.pageSize) || 1} 页
            </span>
            <Button
              disabled={page.pageNum >= Math.ceil(total / page.pageSize)}
              onClick={() => setPage({ ...page, pageNum: page.pageNum + 1 })}
            >
              下一页
            </Button>
          </Space>
        </Card>
      </Space>

      {/* ================= 新增 / 编辑弹窗 ================= */}
      <Modal
        title={editingSku ? '编辑 SKU' : '新增 SKU'}
        open={open}
        onOk={submit}
        onCancel={() => setOpen(false)}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="productId" label="商品ID" rules={[{ required: true }]}>
            <Input disabled={!!editingSku} />
          </Form.Item>
          <Form.Item name="name" label="SKU 名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="skuCode" label="SKU 编码" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="price" label="售价" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="stock" label="库存">
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </Spin>
  );
};

export default SkuManagement;
