import React, { useEffect, useState, useCallback } from 'react';
import { Form, message, Row, Col, Input, Space, Button } from 'antd';
import { SearchOutlined, ReloadOutlined, PlusOutlined } from '@ant-design/icons';
import TableTemplate from '../../system/template/TableTemplate';
import useOrderAddress from '@/stores/order/OrderAddress';
import type { PageType } from '@/api/type/PageType';
import type { OrderAddressVO } from '@/api/order/address/OrderAddressType';
import FormModel1 from '../../system/model/FormModel1';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';

// 表单字段配置
const addressFormFields = [
  { label: '联系人姓名', name: 'name', type: 'input', required: true },
  { label: '联系电话', name: 'phone', type: 'input', required: true },
  { label: '详细地址', name: 'address', type: 'input', required: true },
  { label: '描述', name: 'description', type: 'input', required: false, placeholder: '请输入地址描述（可选）' },
];

// 表格列配置
const columns = [
  {
    title: '联系人',
    dataIndex: 'name',
    key: 'name',
    width: 120,
  },
  {
    title: '联系电话',
    dataIndex: 'phone',
    key: 'phone',
    width: 150,
  },
  {
    title: '详细地址',
    dataIndex: 'address',
    key: 'address',
    ellipsis: true,
  },
  {
    title: '描述',
    dataIndex: 'description',
    key: 'description',
    ellipsis: true,
    render: (text: any) => text || '-',
  },
];

const Address: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form] = Form.useForm();
  const [currentRecord, setCurrentRecord] = useState<any>(null);
  const [query, setQuery] = useState<{ name?: string; phone?: string }>({});
  
  // 使用 useState 管理分页状态
  const [pagination, setPagination] = useState({ pageNum: 1, pageSize: 10 });

  const { findPage, addressList, loading, error, save, deleteById, findById } = useOrderAddress();

  // 获取地址列表 - 组件挂载时执行
  useEffect(() => {
    findPage({
      pageNum: 1,
      pageSize: 10,
      condition: {} as OrderAddressVO
    });
  }, [findPage]);

  const handleSaveClick = () => {
    setIsEdit(false);
    setIsModalOpen(true);
    form.resetFields();
    setCurrentRecord(null);
  };

  const handleDelete = async (id: number) => {
    const success = await deleteById(id);
    if (success) {
      findPage({
        pageNum: pagination.pageNum,
        pageSize: pagination.pageSize,
        condition: {} as OrderAddressVO
      });
    }
  };

  // 使用 useCallback 优化，避免不必要的重渲染
  const handleEdit = useCallback(async (record: any) => {
    setIsEdit(true);
    setIsModalOpen(true);
    setCurrentRecord(record);

    try {
      // 获取地址完整信息
      const addressData = await findById(record.id);
      
      if (addressData) {
        // 设置表单数据
        form.setFieldsValue(addressData);
      }
    } catch (err) {
      console.error('获取地址数据失败:', err);
      message.error('获取地址数据失败');
    }
  }, [findById, form]);

  const handleFind = ({
    pageNum,
    pageSize,
    query: searchQuery,
  }: {
    pageNum: number;
    pageSize: number;
    query?: any;
  }) => {
    // 更新分页状态
    setPagination({ pageNum, pageSize });
    
    findPage({
      pageNum,
      pageSize,
      condition: {
        ...(searchQuery || {}),
      } as OrderAddressVO
    });
  };

  const handleSearch = () => {
    setPagination({ pageNum: 1, pageSize: 10 });
    findPage({
      pageNum: 1,
      pageSize: 10,
      condition: query as OrderAddressVO
    });
  };

  const handleReset = () => {
    setQuery({});
    setPagination({ pageNum: 1, pageSize: 10 });
    findPage({
      pageNum: 1,
      pageSize: 10,
      condition: {} as OrderAddressVO
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      // 根据编辑模式处理ID字段
      let submitData: any;
      if (isEdit && currentRecord?.id) {
        // 编辑模式：保留ID字段
        submitData = { ...values, id: currentRecord.id };
        console.log('编辑地址 - 提交数据:', submitData);
      } else {
        // 新增模式：删除ID字段（如果存在）
        const { id, ...newData } = values;
        submitData = newData;
        console.log('新增地址 - 提交数据:', submitData);
      }
      
      const result = await save(submitData);
      if (result !== null && result !== undefined) {
        setIsModalOpen(false);
        form.resetFields();
        setCurrentRecord(null);
        // 刷新列表
        findPage({
          pageNum: pagination.pageNum,
          pageSize: pagination.pageSize,
          condition: {} as OrderAddressVO
        });
      }
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setCurrentRecord(null);
  };

  return (
    <>
      {/* 搜索区域 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Input
            placeholder="请输入联系人姓名"
            value={query.name || ''}
            onChange={(e) => setQuery({ ...query, name: e.target.value })}
            onPressEnter={handleSearch}
          />
        </Col>
        <Col span={6}>
          <Input
            placeholder="请输入联系电话"
            value={query.phone || ''}
            onChange={(e) => setQuery({ ...query, phone: e.target.value })}
            onPressEnter={handleSearch}
          />
        </Col>
        <Col span={12}>
          <Space>
            <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
              搜索
            </Button>
            <Button icon={<ReloadOutlined />} onClick={handleReset}>
              重置
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleSaveClick}>
              新增地址
            </Button>
          </Space>
        </Col>
      </Row>

      {/* 表格区域 */}
      <TableTemplate
        columns={columns}
        dataSource={addressList?.rows || []}
        total={addressList?.total || 0}
        pageNum={pagination.pageNum}
        pageSize={pagination.pageSize}
        handleFind={handleFind}
        handleSave={handleSaveClick}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
        query={query}
      />

      {/* 表单弹窗 */}
      <FormModel1
        isEdit={isEdit}
        isModalOpen={isModalOpen}
        handleModalOk={handleModalOk}
        handleModalCancel={handleModalCancel}
        form={form}
        formItem={addressFormFields}
        checkedKeys={{ checked: [], halfChecked: [] }}
        setCheckedKeys={() => {}}
        expandedKeys={[]}
        setExpandedKeys={() => {}}
      />
    </>
  );
};

export default Address;
