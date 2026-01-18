import React, { useEffect, useState } from 'react';
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  DatePicker,
  Row,
  Col,
  Upload,
  Button,
  message,
  Space,
  Divider
} from 'antd';
import {
  UploadOutlined,
  DeleteOutlined,
  PlusOutlined,
  MinusCircleOutlined
} from '@ant-design/icons';
import type { ProductVO, ProductSaveVO } from '@/api/goods/product/ProductType';
import type { UploadFile } from 'antd';
import useProduct from '@/stores/goods/Product';
import dayjs from 'dayjs';
import UploadsApp from '@/components/upload/UploadsFile';

const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface ProductModalProps {
  visible: boolean;
  type: 'create' | 'edit' | 'view';
  data: ProductVO | null;
  onCancel: () => void;
  onSuccess: () => void;
}

// 模拟数据
const categories = [
  { id: 1, name: '电子产品' },
  { id: 2, name: '服装服饰' },
  { id: 3, name: '家居用品' },
  { id: 4, name: '图书音像' },
  { id: 5, name: '运动户外' },
  { id: 6, name: '美妆个护' },
];

const tags = [
  { id: 1, name: '热销' },
  { id: 2, name: '新品' },
  { id: 3, name: '推荐' },
  { id: 4, name: '特价' },
  { id: 5, name: '限量' },
  { id: 6, name: '爆款' },
];

const warehouses = [
  { id: 1, name: '北京仓库' },
  { id: 2, name: '上海仓库' },
  { id: 3, name: '广州仓库' },
  { id: 4, name: '深圳仓库' },
  { id: 5, name: '成都仓库' },
  { id: 6, name: '西安仓库' },
];

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
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // 初始化表单数据
  useEffect(() => {
    if (data && visible) {
      const formData = {
        ...data,
        timeRange: data.startTime && data.endTime 
          ? [dayjs(data.startTime), dayjs(data.endTime)]
          : null,
        publishTime: data.publishTime ? dayjs(data.publishTime) : null,
        offlineTime: data.offlineTime ? dayjs(data.offlineTime) : null,
        // 将分类、标签和仓库ID数组转换为Select组件所需的格式
        categoryId: data.categoryId || [],
        tagId: data.tagId || [],
        warehouseId: data.warehouseId || [],
        // 将status short转换为boolean
        status: data.status === 1
      };
      form.setFieldsValue(formData);
      
      // 如果有图片，初始化文件列表
      if (data.image) {
        setFileList([{
          uid: '-1',
          name: 'product-image',
          status: 'done',
          url: data.image
        }]);
      }
    } else if (!data && visible) {
      form.resetFields();
      setFileList([]);
    }
  }, [data, visible, form]);

  // 处理提交
  const handleSubmit = async () => {
  try {
    const values = await form.validateFields();

    const submitData: ProductSaveVO = {
      ...values,
      id: type === 'edit' ? data?.id : undefined,
      image: fileList[0]?.url || '',
     publishTime: values.publishTime?.format('YYYY-MM-DDTHH:mm:ss'),  // 使用 'T' 作为分隔符
  offlineTime: values.offlineTime?.format('YYYY-MM-DDTHH:mm:ss'),  // 使用 'T' 作为分隔符
      // 处理分类和标签数组
      categoryId: values.categoryId || [],
      tagId: values.tagId || [],
      warehouseId: values.warehouseId || [],
      // 将布尔值转换为 short (1 或 0)
      status: values.status ? 1 : 0 
    };

    setLoading(true);
    const result = await saveProductApi(submitData);

    if (result) {
      message.success(type === 'create' ? '创建成功' : '更新成功');
      onSuccess();
    }
  } catch (error) {
    console.error('提交失败:', error);
    message.error('提交失败，请检查表单');
  } finally {
    setLoading(false);
  }
};


  // 上传文件变化
  const handleUploadChange = ({ fileList: newFileList }: any) => {
    setFileList(newFileList);
  };

  const modalTitle = {
    create: '新增商品',
    edit: '编辑商品',
    view: '查看商品'
  }[type];

  const isView = type === 'view';

  return (
    <Modal
      title={modalTitle}
      open={visible}
      width={800}
      onCancel={onCancel}
      footer={
        isView ? (
          <Button onClick={onCancel}>关闭</Button>
        ) : (
          <Space>
            <Button onClick={onCancel}>取消</Button>
            <Button 
              type="primary" 
              onClick={handleSubmit}
              loading={loading}
            >
              {type === 'create' ? '创建' : '保存'}
            </Button>
          </Space>
        )
      }
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        disabled={isView}
      >
        <Row gutter={24}>
          {/* 基本信息 */}
          <Col span={24}>
            <Divider>基本信息</Divider>
          </Col>
          
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
            <Form.Item
              label="商品价格"
              name="price"
              rules={[{ required: true, message: '请输入商品价格' }]}
            >
              <InputNumber
                placeholder="请输入价格"
                style={{ width: '100%' }}
                min={0}
                precision={2}
                addonAfter="元"
              />
            </Form.Item>
          </Col>
          
          <Col span={24}>
            <Form.Item
              label="商品描述"
              name="description"
            >
              <TextArea 
                rows={3} 
                placeholder="请输入商品描述" 
                maxLength={500}
                showCount
              />
            </Form.Item>
          </Col>
          
          <Col span={12}>
            <Form.Item
              label="品牌"
              name="brand"
            >
              <Input placeholder="请输入品牌" />
            </Form.Item>
          </Col>
          
          <Col span={12}>
            <Form.Item
              label="产地"
              name="placeOfOrigin"
            >
              <Input placeholder="请输入产地" />
            </Form.Item>
          </Col>

          {/* 库存信息 */}
          <Col span={24}>
            <Divider>库存信息</Divider>
          </Col>
          
          <Col span={8}>
            <Form.Item
              label="库存数量"
              name="stock"
              rules={[{ required: true, message: '请输入库存数量' }]}
            >
              <InputNumber
                placeholder="库存数量"
                style={{ width: '100%' }}
                min={0}
                precision={0}
              />
            </Form.Item>
          </Col>
          
          <Col span={8}>
            <Form.Item
              label="商品等级"
              name="level"
            >
              <Select placeholder="请选择等级">
                <Option value={1}>普通</Option>
                <Option value={2}>优质</Option>
                <Option value={3}>精品</Option>
              </Select>
            </Form.Item>
          </Col>
          
          <Col span={8}>
            <Form.Item
              label="商品状态"
              name="status"
              valuePropName="checked"
            >
              <Switch
                checkedChildren="上架"
                unCheckedChildren="下架"
              />
            </Form.Item>
          </Col>

          {/* 时间信息 */}
          <Col span={24}>
            <Divider>时间信息</Divider>
          </Col>
          
          <Col span={12}>
            <Form.Item
              label="上架时间"
              name="publishTime"
            >
              <DatePicker
                showTime
                style={{ width: '100%' }}
                placeholder="请选择上架时间"
              />
            </Form.Item>
          </Col>
          
          <Col span={12}>
            <Form.Item
              label="下架时间"
              name="offlineTime"
            >
              <DatePicker
                showTime
                style={{ width: '100%' }}
                placeholder="请选择下架时间"
              />
            </Form.Item>
          </Col>

          {/* 图片上传 */}
          <Col span={24}>
            <Divider>图片上传</Divider>
            <Form.Item
              label="商品主图"
              name="image"
            >
              <UploadsApp />
            </Form.Item>
          </Col>

          {/* 分类和标签 */}
          <Col span={24}>
            <Divider>分类与标签</Divider>
          </Col>
          
          <Col span={8}>
            <Form.Item
              label="商品分类"
              name="categoryId"
            >
              <Select
                mode="multiple"
                placeholder="请选择商品分类"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label as string).toLowerCase().includes(input.toLowerCase())
                }
                options={categories.map(cat => ({
                  value: cat.id,
                  label: cat.name
                }))}
                disabled={isView}
              />
            </Form.Item>
          </Col>
          
          <Col span={8}>
            <Form.Item
              label="商品标签"
              name="tagId"
            >
              <Select
                mode="multiple"
                placeholder="请选择商品标签"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label as string).toLowerCase().includes(input.toLowerCase())
                }
                options={tags.map(tag => ({
                  value: tag.id,
                  label: tag.name
                }))}
                disabled={isView}
              />
            </Form.Item>
          </Col>
          
          <Col span={8}>
            <Form.Item
              label="所属仓库"
              name="warehouseId"
            >
              <Select
                mode="multiple"
                placeholder="请选择所属仓库"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label as string).toLowerCase().includes(input.toLowerCase())
                }
                options={warehouses.map(wh => ({
                  value: wh.id,
                  label: wh.name
                }))}
                disabled={isView}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default ProductModal;