import React, { useEffect, useState } from 'react';
import { Form, message, Row, Col, Input, Space, Button, Select } from 'antd';
import { SearchOutlined, ReloadOutlined, PlusOutlined } from '@ant-design/icons';
import TableTemplate from '../../system/template/TableTemplate';
import { useBigModel } from '@/stores/ai/Model';
import type { PageType } from '@/api/type/PageType';
import type { BigModelPageVO } from '@/api/ai/model/ModelType';
import FormModel1 from '../../system/model/FormModel1';
import { columns, bigModelFormList } from './BigModel';

const ModelManagement: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form] = Form.useForm();
  const [currentRecord, setCurrentRecord] = useState<any>(null);
  const [checkedKeys, setCheckedKeys] = useState<{ checked: React.Key[]; halfChecked: React.Key[] }>({ checked: [], halfChecked: [] });
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [query, setQuery] = useState({ name: '', type: undefined, status: undefined });
  const [hasLoaded, setHasLoaded] = useState(false); // 标记是否已加载过数据

  const pageType: PageType<BigModelPageVO> = {
    pageNum: 1,
    pageSize: 10,
    condition: {
      name: '',
      type: undefined,
      status: undefined,
    }
  };

  const { findByIdApi, findPageApi, pageData, loading, error, saveApi, deleteByIdApi } = useBigModel();

  useEffect(() => {
    // 只在组件首次挂载时加载数据
    if (!hasLoaded) {
     findPageApi(pageType).then(() => {
        setHasLoaded(true);
      });
    }
  }, []);

  const handleSave = () => {
    setIsEdit(false);
    setIsModalOpen(true);
    form.resetFields();
  };

  const handleDelete =async (id: number | string) => {
    await deleteByIdApi(id as string).then(async () => {
      // 刷新列表
    await findPageApi(pageType);
    }).catch((err) => {
      console.error('删除失败:', err);
    });
  };

  const handleEdit = async (edit: any) => {
    setIsEdit(true);
    setIsModalOpen(true);
    setCurrentRecord(edit);
    
    // 发起通过 ID 查询的请求，获取大模型数据
   await findByIdApi(edit.id).then((response) => {
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

  const dataSource = pageData?.rows?.map((item: any) => ({
    ...item,
    key: item.id,
  })) ?? [];

  return (
    <>
      <TableTemplate
        columns={columns}
        dataSource={dataSource}
        total={pageData?.total ?? 0}
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
                placeholder="模型名称"
                value={query.name}
                onChange={(e) => setQuery({ ...query, name: e.target.value })}
                style={{ width: 180 }}
              />
            </Col>
            <Col>
              <Select
                placeholder="模型类型"
                value={query.type}
                onChange={(value) => setQuery({ ...query, type: value })}
                style={{ width: 150 }}
                allowClear
                options={[
                  { label: 'GPT', value: 1 },
                  { label: 'Claude', value: 2 },
                  { label: '文心一言', value: 3 },
                  { label: '通义千问', value: 4 },
                ]}
              />
            </Col>
            <Col>
              <Select
                placeholder="状态"
                value={query.status}
                onChange={(value) => setQuery({ ...query, status: value })}
                style={{ width: 120 }}
                allowClear
                options={[
                  { label: '启用', value: 0 },
                  { label: '禁用', value: 1 },
                ]}
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
                    setQuery({ name: '', type: undefined, status: undefined });
                    const newPage = {
                      ...pageType,
                      pageNum: 1,
                      pageSize: pageType.pageSize,
                      condition: {
                        name: '',
                        type: undefined,
                        status: undefined,
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
        formItem={bigModelFormList}
        checkedKeys={checkedKeys}
        setCheckedKeys={setCheckedKeys}
        expandedKeys={expandedKeys}
        setExpandedKeys={setExpandedKeys}
      />
    </>
  );
};

export default ModelManagement;
