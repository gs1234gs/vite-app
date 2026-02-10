import React, { useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  Button,
  Space,
  Upload,
  Avatar,
  Row,
  Col,
  Typography
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import type { CategorySaveVO } from '@/api/goods/category/CategoryType';
import UploadImage from '@/components/upload/UploadFile';

interface CategoryDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: CategorySaveVO) => Promise<void>;
  initialData: CategorySaveVO | null;
}

type CategoryFormValues = Omit<Required<CategorySaveVO>, 'id' | 'code'>;

const schema = yup.object({
  name: yup.string().required('分类名称不能为空').max(50, '分类名称最多50个字符'),
  level: yup.number().required('请选择分类层级').min(1).max(3),
  description: yup.string().max(200, '描述最多200个字符').default(''),
  sortOrder: yup.number().min(0).default(0),
  iconUrl: yup.string().default(''),
  status: yup.number().oneOf([0, 1]).default(1),
  recommended: yup.number().oneOf([0, 1]).default(0),
});

const CategoryDialog: React.FC<CategoryDialogProps> = ({
  open,
  onClose,
  onSave,
  initialData,
}) => {
  const [form] = Form.useForm();
  
  useEffect(() => {
    if (initialData) {
      form.setFieldsValue({
        ...initialData,
        status: initialData.status === 0,
        recommended: initialData.recommended === 1
      });
    } else {
      form.resetFields();
      form.setFieldsValue({
        level: 1,
        description: '',
        sortOrder: 0,
        iconUrl: '',
        status: true,
        recommended: false
      });
    }
  }, [initialData, open, form]);

  const generateCode = (name: string | undefined): string => {
    if (!name) return '';
    return name
      .split('')
      .map((char) => char.charCodeAt(0))
      .join('')
      .substring(0, 20);
  };

  const handleSubmit = async (values: any) => {
    const submitData: CategorySaveVO = {
      ...values,
      status: values.status ? 0 : 1,
      recommended: values.recommended ? 1 : 0,
      id: initialData?.id,
      code: initialData?.code || generateCode(values.name),
    };

    await onSave(submitData);
    form.resetFields();
    onClose();
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      open={open}
      title={initialData ? '编辑分类' : '新增分类'}
      onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel}>
          取消
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          form="categoryForm"
          htmlType="submit"
        >
          保存
        </Button>,
      ]}
      width={720}
    >
      <Form
        id="categoryForm"
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="分类名称"
              rules={[{ required: true, message: '请输入分类名称' }]}
            >
              <Input placeholder="请输入分类名称" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="level"
              label="分类层级"
              rules={[{ required: true, message: '请选择分类层级' }]}
            >
              <Select placeholder="请选择分类层级">
                <Select.Option value={1}>一级分类</Select.Option>
                <Select.Option value={2}>二级分类</Select.Option>
                <Select.Option value={3}>三级分类</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="sortOrder"
              label="排序"
            >
              <InputNumber 
                placeholder="请输入排序" 
                min={0}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="iconUrl"
              label="分类图标"
            >
              <UploadImage
                value={form.getFieldValue('iconUrl') || ''}
                onChange={(url: any) => form.setFieldsValue({ iconUrl: url })}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="description"
              label="分类描述"
            >
              <Input.TextArea 
                rows={4} 
                placeholder="请输入分类描述" 
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="status"
              label="启用分类"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="recommended"
              label="设为推荐"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Col>
        </Row>
        
        {form.getFieldValue('iconUrl') && (
          <div style={{ marginTop: 16 }}>
            <Typography.Text strong>当前图标：</Typography.Text>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 8 }}>
              <Avatar 
                src={form.getFieldValue('iconUrl')} 
                size="large" 
                shape="square"
              />
              <Typography.Text 
                ellipsis 
                style={{ maxWidth: 'calc(100% - 80px)' }}
              >
                {form.getFieldValue('iconUrl')}
              </Typography.Text>
            </div>
          </div>
        )}
      </Form>
    </Modal>
  );
};

export default CategoryDialog;
