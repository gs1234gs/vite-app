// src/pages/carousel/CarouselList.tsx

import React, { useState, useEffect } from 'react';
import { Button, Table, Space, Modal, message, Popconfirm, Checkbox, Row, Col, Input } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import useProductCarousal from '@/stores/goods/ProductCarousel';
import type { ProductCarousalSaveVO, ProductCarousalVO } from '@/api/goods/carousel/ProductCarouselType';
import CarouselFormModal from './CarouselFormModal';
import { SyncOutlined } from '@ant-design/icons';


const CarouselManagement = () => {
  const {
    loading,
    error,
    saveProductCarousalApi,
    findAllProductCarousalsApi,
    deleteProductCarousalByIdApi,
    deleteProductCarousalBatchApi,
  } = useProductCarousal();

  const [list, setList] = useState<ProductCarousalVO[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ProductCarousalVO | null>(null);
const [searchTitle, setSearchTitle] = useState<string>('');
const [filteredData, setFilteredData] = useState<ProductCarousalVO[]>(list);
  // 加载列表
  useEffect(() => {
    const load = async () => {
      const data = await findAllProductCarousalsApi();
      if (data) setList(data);
    };
    load();
  }, [findAllProductCarousalsApi]);
useEffect(() => {
  if (!searchTitle.trim()) {
    setFilteredData(list);
  } else {
    const keyword = searchTitle.trim().toLowerCase();
    setFilteredData(
      list.filter(item =>
        item.title?.toLowerCase().includes(keyword)
      )
    );
  }
}, [list, searchTitle]);
  // 表格列定义
  const columns: ColumnsType<ProductCarousalVO> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 120,
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '图片',
      dataIndex: 'image',
      key: 'image',
      render: (url: string) => (
        <img
          src={url}
          alt="轮播图"
          style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }}
        />
      ),
    },
    {
      title: '链接',
      dataIndex: 'link',
      key: 'link',
      ellipsis: true,
    },
    {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
      width: 80,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: 0 | 1) => (
        <span className={status === 1 ? 'text-green-600' : 'text-gray-500'}>
          {status === 1 ? '显示' : '隐藏'}
        </span>
      ),
    },
    {
      title: '操作',
      key: 'actions',
      width: 160,
      render: (_: any, record: ProductCarousalVO) => (
        <Space size="small">
          <Button
            size="small"
            type="link"
            onClick={() => {
              setEditingItem(record);
              setIsModalOpen(true);
            }}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定删除？"
            onConfirm={() => handleDelete(record.id)}
            okText="是"
            cancelText="否"
          >
            <Button size="small" type="link" danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  //  删除单个
  const handleDelete = async (id: string) => {
    const res = await deleteProductCarousalByIdApi(id);
    if (res !== null) {
      setList(prev => prev.filter(item => item.id !== id));
      // message.success('删除成功');
    }
  };

  // 批量删除
  const handleBatchDelete = async () => {
    if (selectedRowKeys.length === 0) return;
    const res = await deleteProductCarousalBatchApi(selectedRowKeys);
    if (res !== null) {
      setList(prev => prev.filter(item => !selectedRowKeys.includes(item.id)));
      setSelectedRowKeys([]);
      // message.success(`成功删除 ${selectedRowKeys.length} 条`);
    }
  };

  // 保存回调（新增 or 编辑）
  const handleSave = async (values: ProductCarousalSaveVO) => {
    const res = await saveProductCarousalApi(values);
    if (res) {
      if (editingItem) {
        // 编辑：更新列表中对应项
        setList(prev =>
          prev.map(item => (item.id === res.id ? res : item)
          )
        );
      } else {
        // 新增：追加到列表头部（按 sort 排序可后续优化）
        setList(prev => [res, ...prev]);
      }
      setIsModalOpen(false);
      setEditingItem(null);
      // message.success(editingItem ? '更新成功' : '新增成功');
    }
  };

  // 重置编辑态
  const handleCancelEdit = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <Row justify="space-between" align="middle" className="mb-4">
  {/* <Col>
    <h2 className="text-xl font-bold">轮播图管理</h2>
  </Col> */}
  <Col>
    <Space>
      {/* 搜索框 + 按钮 */}
      <Input
        placeholder="按标题搜索..."
        value={searchTitle}
        onChange={(e) => setSearchTitle(e.target.value)}
        style={{ width: 200 }}
        allowClear
        onPressEnter={() => {}} // 回车自动触发（无需额外逻辑，useEffect 已监听）
      />
      <Button
        type="default"
        onClick={() => setSearchTitle('')}
      >
        重置
      </Button>

      <Button
        type="primary"
        onClick={() => {
          setEditingItem(null);
          setIsModalOpen(true);
        }}
      >
        + 新增轮播图
      </Button>

      <Button
  type="default"
  icon={<SyncOutlined />}
  onClick={async () => {
    try {
      const data = await findAllProductCarousalsApi();
      if (data) setList(data);
    } catch (err) {
      message.error('刷新失败，请检查网络');
    }
  }}
  loading={loading} // ✅ 保留这个！用于 UI 显示加载态（它只是读取 loading 值）
  title="刷新列表"
>
  刷新
</Button>

      <Popconfirm
        title={`确定批量删除 ${selectedRowKeys.length} 条？`}
        disabled={selectedRowKeys.length === 0}
        onConfirm={handleBatchDelete}
        okText="是"
        cancelText="否"
      >
        <Button type="default" danger disabled={selectedRowKeys.length === 0}>
          批量删除
        </Button>
      </Popconfirm>
    </Space>
  </Col>
</Row>

      {/* 表格 */}
      <Table
        rowKey="id"
        columns={columns}
        dataSource={list}
        loading={loading}
        pagination={{ pageSize: 10 }}
        rowSelection={{
          selectedRowKeys,
          onChange: (keys) => setSelectedRowKeys(keys as string[]),
        }}
      />

      {/* 新增/编辑弹窗 */}
      <CarouselFormModal
        open={isModalOpen}
        onCancel={handleCancelEdit}
        onSave={handleSave}
        initialValues={editingItem || undefined}
      />
    </div>
  );
};

export default CarouselManagement;