// src/pages/goods/product/ProductDialog.tsx

import React, { useEffect, useState } from 'react';
import {
  Modal,
  Form,
  Input,
  Switch,
  DatePicker,
  Row,
  Col,
  message,
  Typography,
  InputNumber,
  Select
} from 'antd';
import type { ProductVO, ProductSaveVO } from '@/api/goods/product/ProductType';
import useProduct from '@/stores/goods/Product';
import useCategory from '@/stores/goods/Category';
import { findById as findProductById } from '@/api/goods/product/Product';
import dayjs from 'dayjs';
import UploadsApp from '@/components/upload/UploadsFile';
import TagSelect from './TagSelect'; // 引入新的标签选择组件
import type { TagVO } from '@/api/goods/tag/TagType';
import useTag from '@/stores/goods/Tag';
const { TextArea } = Input;
const { Text } = Typography;
const { Option } = Select;

interface ProductModalProps {
  visible: boolean;
  type: 'create' | 'edit' | 'view';
  data: ProductVO | null;
  onCancel: () => void;
  onSuccess: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({
  visible,
  type,
  data,
  onCancel,
  onSuccess
}) => {
  const [form] = Form.useForm();
  const useProductApi = useProduct();
  const { saveProductApi } = useProductApi;
  const { findPageApi: findCategories, findByIdApi } = useCategory();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
const [tags, setTags] = useState<TagVO[]>([]);
  // 加载分类
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await findCategories({
          pageNum: 1,
          pageSize: 100,
          condition: {
            id: '',
            name: '',
            level: 0,
            code: '',
            description: '',
            sortOrder: 0,
            iconUrl: '',
            status: 0,
            recommended: 0,
            creator: '',
            updater: '',
            createTime: '',
            updateTime: '',
            delFlag: 0
          }
        });
        if (response?.rows) {
          setCategories(response.rows);
        }
      } catch (error) {
        console.error('获取分类失败:', error);
      }
    };
    fetchCategories();
  }, [findCategories]);
useEffect(() => {
  const fetchTags = async () => {
    try {
      const res = await useTag().findAllTagByApi({
        pageNum: 1,
        pageSize: 1000, // 一次性加载全部（如果不多）
        condition: {} as TagVO,
      });
      if (res?.rows) {
        setTags(res.rows);
      }
    } catch (err) {
      console.error('获取标签失败', err);
    }
  };
  fetchTags();
}, []);
  // 回显商品数据
  useEffect(() => {
    if (type === 'create') {
      setTimeout(() => form.resetFields(), 0);
    } else if (data && visible && type === 'view') {
      // 查看模式下直接使用传入的数据
      setTimeout(() => form.setFieldsValue({
        ...data,
        id: data.id, // 确保传递商品ID用于编辑
        publishTime: data.publishTime ? dayjs(data.publishTime) : null,
        offlineTime: data.offlineTime ? dayjs(data.offlineTime) : null,
        categoryId: Array.isArray(data.categoryId) ? data.categoryId : [],
        tagId: Array.isArray(data.tagId) ? data.tagId : [],
        warehouseId: data.warehouseId ? [data.warehouseId] : [],
        status: data.status === 1,
        image: data.image ? [data.image] : [],
        video: data.video ? [data.video] : [],
      }), 0);
    } else if (type === 'edit' && data?.id && visible) {
      // 编辑模式下，通过ID获取最新数据
      const fetchLatestData = async () => {
        setLoading(true);
        try {
          const response = await findProductById(data.id);
          if (response?.code === 200 && response?.data) {
            const latestData = response.data;
            setTimeout(() => form.setFieldsValue({
              ...latestData,
              id: latestData.id,
              publishTime: latestData.publishTime ? dayjs(latestData.publishTime) : null,
              offlineTime: latestData.offlineTime ? dayjs(latestData.offlineTime) : null,
              categoryId: Array.isArray(latestData.categoryId) ? latestData.categoryId : [],
              tagId: Array.isArray(latestData.tagId) ? latestData.tagId : [],
              warehouseId: latestData.warehouseId ? [latestData.warehouseId] : [],
              status: latestData.status === 1,
              image: latestData.image ? [latestData.image] : [],
              video: latestData.video ? [latestData.video] : [],
            }), 0);
          }
        } catch (error) {
          console.error('获取商品详情失败:', error);
          message.error('获取商品详情失败');
        } finally {
          setLoading(false);
        }
      };
      
      fetchLatestData();
    }
  }, [data, visible, type, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const submitData: ProductSaveVO = {
        id: values.id, // 包含商品ID用于编辑
        name: values.name,
        description: values.description,
        image: values.image?.[0] || '',
        video: values.video?.[0] || '',
        brand: values.brand,
        placeOfOrigin: values.placeOfOrigin,
        level: values.level,
        salesVolume: values.salesVolume,
        status: values.status ? 1 : 0,
        publishTime: values.publishTime?.format('YYYY-MM-DDTHH:mm:ss'),
        offlineTime: values.offlineTime?.format('YYYY-MM-DDTHH:mm:ss'),
        categoryId: values.categoryId || [],
        tagId: values.tagId || [],
      };

      const result = await saveProductApi(submitData);
      if (result) {
        message.success(type === 'edit' ? '更新成功' : '创建成功');
        onSuccess();
      } else {
        message.error('操作失败');
      }
    } catch (error: any) {
      console.error('保存失败:', error);
      message.error('请检查输入数据');
    }
  };

  const isView = type === 'view';

  return (
    <Modal
      open={visible}
      title={type === 'create' ? '新增商品' : type === 'edit' ? '编辑商品' : '查看商品'}
      okText="确认"
      cancelText="取消"
      onCancel={onCancel}
      onOk={handleSubmit}
      width={800}
      destroyOnHidden
      maskClosable={false}
      okButtonProps={{ hidden: isView }}
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical" disabled={isView}>
         {/* 👇 添加这一行：隐藏的 id 字段 */}
  <Form.Item name="id" noStyle>
    <Input type="hidden" />
  </Form.Item>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="商品名称"
              name="name"
              rules={[{ required: true, message: '请输入商品名称' }]}
            >
              <Input placeholder="请输入商品名称" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="品牌" name="brand">
              <Input placeholder="请输入品牌" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="产地" name="placeOfOrigin">
              <Input placeholder="请输入产地" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="商品等级" name="level">
              <Input placeholder="请输入等级" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="分类" name="categoryId">
              <Select mode="multiple" placeholder="请选择分类" allowClear>
                {categories.map(cat => (
                  <Option key={cat.id} value={cat.id}>{cat.name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          {type !== 'create' && data?.categoryName && (
            <Col span={12}>
              <Form.Item label="当前分类">
                <div>{data.categoryName.join(', ')}</div>
              </Form.Item>
            </Col>
          )}
  <Col span={12}>
    <Form.Item label="标签" name="tagId">
      <TagSelect placeholder="请选择标签" />
    </Form.Item>
  </Col>
  {type !== 'create' && data?.tagNames && (
    <Col span={12}>
      <Form.Item label="当前标签">
        <div>{data.tagNames.join('，')}</div>
      </Form.Item>
    </Col>
  )}
        </Row>

        <Row gutter={16}>
          {/* <Col span={12}>
            <Form.Item label="销量" name="salesVolume">
              <InputNumber style={{ width: '100%' }} min={0} placeholder="销量" />
            </Form.Item>
          </Col> */}
          <Col span={12}>
            <Form.Item label="发布状态" name="status" valuePropName="checked">
              <Switch checkedChildren="上架" unCheckedChildren="下架" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="发布时间" name="publishTime">
              <DatePicker showTime style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="下架时间" name="offlineTime">
              <DatePicker showTime style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="商品描述" name="description">
          <TextArea rows={4} placeholder="请输入商品描述" />
        </Form.Item>

        <Form.Item label="商品图片" name="image">
          <UploadsApp maxCount={1} />
        </Form.Item>

        <Form.Item label="商品视频" name="video">
          <UploadsApp maxCount={1} accept="video/*" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProductModal;