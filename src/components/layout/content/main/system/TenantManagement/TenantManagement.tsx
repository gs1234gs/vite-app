import React, { useEffect, useState } from 'react';
import { Form, message, Row, Col, Input, Space, Button } from 'antd';
import { SearchOutlined, ReloadOutlined, PlusOutlined } from '@ant-design/icons';
import TableTemplate from '../template/TableTemplate';
import useTenant from '@/stores/main/Tenant';
import type { PageType } from '@/api/type/PageType';
import type { PageTenantCondition } from '@/api/main/type/TenantType';
import FormModel1 from '../model/FormModel1';
import { columns, TenantFormList } from './Tenant';

const TenantManagement: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form] = Form.useForm();
  const [currentRecord, setCurrentRecord] = useState<any>(null);
  const [checkedKeys, setCheckedKeys] = useState<{ checked: React.Key[]; halfChecked: React.Key[] }>({ checked: [], halfChecked: [] });
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [query, setQuery] = useState({ name: '' });

  const pageType: PageType<PageTenantCondition> = {
    pageNum: 1,
    pageSize: 10,
    condition: {
      name: '',
    }
  };

  const { findByIdApi, findPageApi, tenantList, loading, error, saveApi, deleteByIdApi } = useTenant();

  useEffect(() => {
    findPageApi(pageType);
  }, [findPageApi]);

  const handleSave = () => {
    setIsEdit(false);
    setIsModalOpen(true);
    form.resetFields();
  };

  const handleDelete = async (id: number) => {
   await deleteByIdApi(id).then(() => {
      message.success('删除成功');
      // 刷新列表
      findPageApi(pageType);
    }).catch((err) => {
      message.error('删除失败');
      console.error('删除失败:', err);
    });
  };

  const handleEdit = (edit: any) => {
    setIsEdit(true);
    setIsModalOpen(true);
    setCurrentRecord(edit);
    
    // 发起通过 ID 查询的请求，获取租户数据
    findByIdApi(edit.id).then((response) => {
      form.setFieldsValue(response);
    });
  };

  const handleFind = ({
    pageNum,
    pageSize,
    query: searchQuery,
  }: {
    pageNum: number;
    pageSize: number;
    query?: any;
  }) => {
    const newPage = {
      ...pageType,
      pageNum,
      pageSize,
      condition: {
        ...pageType.condition,
        ...searchQuery,
      },
    };
    findPageApi(newPage);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      // 合并表单数据和当前记录（编辑时包含 ID）
      const submitData = isEdit 
        ? { ...currentRecord, ...values }
        : values;
      
      // 删除 key 字段（Ant Design Table 内部使用，不应传给后端）
      const { key, ...dataWithoutKey } = submitData;
      
      // 删除 BasePojo 字段（这些是审计字段，不应由前端传递）
      const { creator, updater, createTime, updateTime, delFlag, ...dataToSend } = dataWithoutKey;
      
      // 调用保存接口（编辑和新增共用同一个接口）
      await saveApi(dataToSend);
      
      // 关闭弹窗并刷新列表
      setIsModalOpen(false);
      findPageApi(pageType);
    } catch (error) {
      console.log('校验失败', error);
    }
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  const dataSource = tenantList?.rows?.map((item: any) => ({
    ...item,
    key: item.id,
  })) ?? [];

  return (
    <>
      <TableTemplate
        columns={columns}
        dataSource={dataSource}
        total={tenantList?.total ?? 0}
        pageNum={pageType.pageNum}
        pageSize={pageType.pageSize}
        handleFind={handleFind}
        handleSave={handleSave}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
        query={query}
        searchForm={
          <Row gutter={12} align="middle">
            <Col>
              <Input
                placeholder="租户名称"
                value={query.name}
                onChange={(e) => setQuery({ ...query, name: e.target.value })}
                style={{ width: 180 }}
              />
            </Col>
            <Col>
              <Space>
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  onClick={() => {
                    const newPage = {
                      ...pageType,
                      pageNum: 1,
                      pageSize: pageType.pageSize,
                      condition: {
                        ...pageType.condition,
                        ...query,
                      },
                    };
                    findPageApi(newPage);
                  }}
                >
                  查询
                </Button>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={() => {
                    setQuery({ name: '' });
                    const newPage = {
                      ...pageType,
                      pageNum: 1,
                      pageSize: pageType.pageSize,
                      condition: {
                        name: '',
                      },
                    };
                    findPageApi(newPage);
                  }}
                >
                  重置
                </Button>
                <Button
                  type="dashed"
                  icon={<PlusOutlined />}
                  onClick={handleSave}
                >
                  新增
                </Button>
              </Space>
            </Col>
          </Row>
        }
      />

      {/* 新增/编辑 弹窗 */}
      <FormModel1
        isEdit={isEdit}
        isModalOpen={isModalOpen}
        handleModalOk={handleModalOk}
        handleModalCancel={handleModalCancel}
        form={form}
        formItem={TenantFormList}
        checkedKeys={checkedKeys}
        setCheckedKeys={setCheckedKeys}
        expandedKeys={expandedKeys}
        setExpandedKeys={setExpandedKeys}
      />
    </>
  );
};

export default TenantManagement;
