import React, { useEffect, useState } from 'react';
import { Form, message, Row, Col, Input, Space, Button, Popconfirm } from 'antd';
import { SearchOutlined, ReloadOutlined, PlusOutlined, CheckCircleOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import TableTemplate from '../../system/template/TableTemplate';
import { useSimilarityThresholdStrategyConfiguration } from '@/stores/ai/SimilarityThresholdStrategyConfiguration';
import type { PageType } from '@/api/type/PageType';
import type { SimilarityThresholdStrategyConfigurationPageVO } from '@/api/ai/similarity/SimilarityThresholdStrategyConfigurationType';
import FormModel1 from '../../system/model/FormModel1';
import { columns, similarityFormList } from './SimilarityThresholdStrategyConfigurationConfig';

const SimilarityThresholdStrategyConfiguration: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form] = Form.useForm();
  const [currentRecord, setCurrentRecord] = useState<any>(null);
  const [checkedKeys, setCheckedKeys] = useState<{ checked: React.Key[]; halfChecked: React.Key[] }>({ checked: [], halfChecked: [] });
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [query, setQuery] = useState({ name: '' });

  const pageType: PageType<SimilarityThresholdStrategyConfigurationPageVO> = {
    pageNum: 1,
    pageSize: 10,
    condition: {
      name: '',
    }
  };

  const { findByIdApi, findPageApi, pageData, loading, error, saveApi, deleteByIdApi, enableSimilarityApi } = useSimilarityThresholdStrategyConfiguration();

  useEffect(() => {
    findPageApi(pageType);
  }, [findPageApi]);

  const handleSave = () => {
    setIsEdit(false);
    setIsModalOpen(true);
    form.resetFields();
  };

  const handleDelete = (id: number | string) => {
    deleteByIdApi(id as string).then(() => {
      // 刷新列表
      findPageApi(pageType);
    }).catch((err) => {
      console.error('删除失败:', err);
    });
  };

  const handleEdit = (edit: any) => {
    setIsEdit(true);
    setIsModalOpen(true);
    setCurrentRecord(edit);
    
    // 发起通过 ID 查询的请求，获取配置数据
    findByIdApi(edit.id).then((response) => {
      // 后端返回的是小数（如 0.85），转换为百分比数值（85）供表单显示
      const formData = {
        ...response,
        similarityThreshold: response.similarityThreshold * 100
      };
      form.setFieldsValue(formData);
    });
  };

  const handleEnable = (id: string) => {
    enableSimilarityApi(id).then(() => {
      // 刷新列表
      findPageApi(pageType);
    }).catch((err) => {
      console.error('启用失败:', err);
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
      const { creator, updater, createTime, updateTime, delFlag, ...dataWithoutBasePojo } = dataWithoutKey;
      
      // 将百分比数值（85）转换回小数（0.85）供后端存储
      const dataToSend = {
        ...dataWithoutBasePojo,
        similarityThreshold: dataWithoutBasePojo.similarityThreshold / 100
      };
      
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
                placeholder="配置名称"
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
        // 自定义操作列渲染，添加启用按钮
        actionColumnRender={(record: any) => (
          <Space>
            <Popconfirm
              title="确定要启用此相似度阈值配置吗？"
              description="启用后将作为当前使用的相似度阈值"
              okText="确定"
              cancelText="取消"
              onConfirm={() => handleEnable(record.id)}
            >
              <Button
                type="link"
                icon={<CheckCircleOutlined />}
                style={{ color: '#52c41a' }}
              >
                启用
              </Button>
            </Popconfirm>
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            >
              编辑
            </Button>
            <Popconfirm
              title="确认删除这条记录吗？"
              okText="确认"
              cancelText="取消"
              onConfirm={() => handleDelete(record.id)}
            >
              <Button type="link" danger icon={<DeleteOutlined />}>
                删除
              </Button>
            </Popconfirm>
          </Space>
        )}
      />

      {/* 新增/编辑 弹窗 */}
      <FormModel1
        isEdit={isEdit}
        isModalOpen={isModalOpen}
        handleModalOk={handleModalOk}
        handleModalCancel={handleModalCancel}
        form={form}
        formItem={similarityFormList}
        checkedKeys={checkedKeys}
        setCheckedKeys={setCheckedKeys}
        expandedKeys={expandedKeys}
        setExpandedKeys={setExpandedKeys}
      />
    </>
  );
};

export default SimilarityThresholdStrategyConfiguration;
