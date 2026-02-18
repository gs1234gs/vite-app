import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Empty,
  Modal,
  Form,
  Input,
  InputNumber,
  Space,
  Spin,
  Popconfirm,
  Select,
  DatePicker,
  Tree,
} from 'antd';
import type { DataNode } from 'antd/es/tree';
import dayjs from 'dayjs';

import useSku from '@/stores/goods/SKU';
import useProduct from '@/stores/goods/Product';

import type {
  SKUVO,
  SKUSaveVO,
  SKUGroupByProductIdVO,
} from '@/api/goods/sku/SKUType';
import type { ProductVO } from '@/api/goods/product/ProductType';
import type { PageType } from '@/api/type/PageType';
import UploadsApp from '@/components/upload/UploadsFile';

const DEFAULT_PAGE: PageType<any> = {
  pageNum: 1,
  pageSize: 10,
  condition: {},
};

const PRODUCT_PAGE_SIZE = 10;

const SkuManagement = () => {
  const { loading, findSkuPageApi, saveSkuApi, deleteByIdApi } = useSku();
  const { findAllByApi } = useProduct();

  /** ================= SKU 分页 ================= */
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [data, setData] = useState<SKUGroupByProductIdVO[]>([]);
  const [total, setTotal] = useState(0);

  /** ================= 商品 Select 分页 ================= */
  const [productList, setProductList] = useState<ProductVO[]>([]);
  const [productPageNum, setProductPageNum] = useState(1);
  const [productTotal, setProductTotal] = useState(0);
  const [productLoading, setProductLoading] = useState(false);

  /** ================= 弹窗 & 表单 ================= */
  const [open, setOpen] = useState(false);
  const [editingSku, setEditingSku] = useState<SKUSaveVO | null>(null);
  const [picList, setPicList] = useState<string[]>([]);
const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [form] = Form.useForm<SKUSaveVO>();
  const [searchForm] = Form.useForm();

  /** ================= SKU 查询 ================= */
  const loadSkuData = async () => {
    const res = await findSkuPageApi(page);
    if (res) {
      setData(res.rows || []);
      setTotal(res.total || 0);
    }
  };

  useEffect(() => {
    loadSkuData();
  }, [page.pageNum, page.pageSize, page.condition]);

  /** ================= SKU 搜索 ================= */
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

  /** ================= 商品分页加载 ================= */
  const loadProductPage = async (pageNum = 1) => {
    if (productLoading) return;
    setProductLoading(true);
    const res = await findAllByApi({
      pageNum,
      pageSize: PRODUCT_PAGE_SIZE,
      condition: {
        id: '',
        name: '',
        price: '',
        description: '',
        image: '',
        video: '',
        brand: '',
        placeOfOrigin: '',
        level: 0,
        stock: 0,
        salesVolume: 0,
        status: 0,
        publishTime: '',
        offlineTime: '',
        warehouseId: '',
        categoryId: [],
        tagId: [],
        startTime: '',
        endTime: '',
        creator: '',
        updater: '',
        createTime: '',
        updateTime: '',
        delFlag: 0,
        minPrice: '',
        maxPrice: '',
        categoryName: [],
        tagNames: []
      },
    });

    if (res) {
      setProductList((prev) =>
        pageNum === 1 ? res.rows || [] : [...prev, ...(res.rows || [])]
      );
      setProductTotal(res.total || 0);
      setProductPageNum(pageNum);
    }
    setProductLoading(false);
  };

  const initProductSelect = async () => {
    setProductList([]);
    setProductPageNum(1);
    setProductTotal(0);
    await loadProductPage(1);
  };

  const onProductScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const reachBottom =
      target.scrollTop + target.offsetHeight >= target.scrollHeight - 10;
    const hasMore = productList.length < productTotal;

    if (reachBottom && hasMore && !productLoading) {
      loadProductPage(productPageNum + 1);
    }
  };

  /** ================= 新增 / 编辑 ================= */
  const openAdd = async (productId?: string) => {
    setEditingSku(null);
    form.resetFields();
    setPicList([]);
    await initProductSelect();

    if (productId) {
      form.setFieldValue('productId', productId);
    }
    setOpen(true);
  };

  const openEdit = async (sku: SKUVO) => {
    await initProductSelect();

    const skuSaveVO: SKUSaveVO = {
      ...sku,
      publishTime: sku.publishTime ? dayjs(sku.publishTime) : null,
      offlineTime: sku.offlineTime ? dayjs(sku.offlineTime) : null,
      picList: (sku as any).picList ?? [],
    };

    setEditingSku(skuSaveVO);
    setPicList(skuSaveVO.picList || []);
    form.setFieldsValue(skuSaveVO);
    setOpen(true);
  };

  const submit = async () => {
    const values = await form.validateFields();

    const payload: SKUSaveVO = {
      ...values,
      id: editingSku?.id,
      publishTime: values.publishTime
        ? dayjs(values.publishTime).format('YYYY-MM-DDTHH:mm:ss')
        : null,
      offlineTime: values.offlineTime
        ? dayjs(values.offlineTime).format('YYYY-MM-DDTHH:mm:ss')
        : null,
      picList,
    };

    await saveSkuApi(payload);
    setOpen(false);
    loadSkuData();
  };

  /** ================= 转换为 Tree 数据 ================= */
const transformToTreeData = (): DataNode[] => {
  return data.map((group) => {
    const productKey = `product-${group.productId}`;
    const isExpanded = expandedKeys.includes(productKey);

    const skus = group.skuList.map((sku) => ({
      key: `sku-${sku.id}`,
      title: (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <span>
            {sku.name} | 编码: {sku.skuCode} | 售价: ¥{sku.price} | 库存: {sku.stock}
          </span>
          <Space size="small">
            <Button
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                openEdit(sku);
              }}
            >
              编辑
            </Button>
            <Popconfirm
              title="确定删除该 SKU？"
              onConfirm={(e) => {
                e?.stopPropagation();
                deleteByIdApi(sku.id).then(loadSkuData);
              }}
              onCancel={(e) => e?.stopPropagation()}
            >
              <Button size="small" danger>
                删除
              </Button>
            </Popconfirm>
          </Space>
        </div>
      ),
      isLeaf: true,
    }));

    return {
      key: productKey,
      title: (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            padding: '4px 8px',
            borderRadius: '4px',
            background: isExpanded ? '#f9f9f9' : 'transparent',
            boxShadow: isExpanded ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
            transition: 'box-shadow 0.2s, background 0.2s',
          }}
        >
          <strong>{group.productName}</strong>
          <Button
            size="small"
            type="link"
            onClick={(e) => {
              e.stopPropagation();
              openAdd(group.productId);
            }}
          >
            + 添加 SKU
          </Button>
        </div>
      ),
      children: skus.length > 0 ? skus : [
        {
          key: `empty-${group.productId}`,
          title: <span style={{ color: '#999', paddingLeft: '8px' }}>暂无 SKU</span>,
          isLeaf: true,
          disabled: true,
        },
      ],
    };
  });
};

  return (
    <Spin spinning={loading}>
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        {/* ===== 搜索 + 新增 ===== */}
        <Card>
          <Form form={searchForm} layout="inline">
            <Form.Item name="name" label="SKU名称">
              <Input allowClear />
            </Form.Item>
            <Form.Item name="skuCode" label="SKU编码">
              <Input allowClear />
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

        {/* ===== 树形列表 ===== */}
        {data.length === 0 ? (
          <Empty description="暂无 SKU 数据" />
        ) : (
          <Card>
           <Tree
            treeData={transformToTreeData()}
            expandedKeys={expandedKeys}
            onExpand={(keys) => setExpandedKeys(keys as React.Key[])}
            showIcon={false}
            selectable={false}
                />
          </Card>
        )}

        {/* ===== 分页 ===== */}
        <Card>
          <Space>
            <Button
              disabled={page.pageNum <= 1}
              onClick={() => setPage({ ...page, pageNum: page.pageNum - 1 })}
            >
              上一页
            </Button>
            <span>
              第 {page.pageNum} 页 / 共{' '}
              {Math.max(1, Math.ceil(total / page.pageSize))} 页
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

      {/* ===== 新增 / 编辑弹窗 ===== */}
      <Modal
        title={editingSku ? '编辑 SKU' : '新增 SKU'}
        open={open}
        onOk={submit}
        onCancel={() => setOpen(false)}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="productId"
            label="所属商品"
            rules={[{ required: true, message: '请选择商品' }]}
          >
            <Select
              placeholder="请选择商品"
              disabled={!!editingSku}
              loading={productLoading}
              onPopupScroll={onProductScroll}
              notFoundContent={productLoading ? '加载中...' : '暂无商品'}
              options={productList.map((item) => ({
                label: item.name,
                value: item.id,
              }))}
            />
          </Form.Item>

          <Form.Item name="name" label="SKU 名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          {/* <Form.Item name="skuCode" label="SKU 编码" rules={[{ required: true }]}>
            <Input />
          </Form.Item> */}

          <Form.Item name="price" label="售价" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="costPrice" label="成本价">
            <Input />
          </Form.Item>

          <Form.Item name="weight" label="权重">
            <Input />
          </Form.Item>

          <Form.Item name="stock" label="库存">
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="addStock" label="新增库存">
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="salesVolume" label="销售量">
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="sort" label="排序">
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="status" label="状态" initialValue={0}>
            <Select>
              <Select.Option value={0}>上架</Select.Option>
              <Select.Option value={1}>下架</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="publishTime" label="上架时间">
            <DatePicker
              showTime
              style={{ width: '100%' }}
              format="YYYY-MM-DD HH:mm:ss"
            />
          </Form.Item>

          <Form.Item name="offlineTime" label="下架时间">
            <DatePicker
              showTime
              style={{ width: '100%' }}
              format="YYYY-MM-DD HH:mm:ss"
            />
          </Form.Item>

          <Form.Item name="detailContent" label="商品详情">
            <Input.TextArea rows={4} />
          </Form.Item>

          {/* 图片上传 */}
          <Form.Item label="SKU 图片">
            <UploadsApp value={picList} onChange={setPicList} />
          </Form.Item>
        </Form>
      </Modal>
    </Spin>
  );
};

export default SkuManagement;