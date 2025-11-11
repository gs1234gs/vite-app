// src/pages/system/model/FormModal.tsx
import React, { forwardRef, useEffect, useImperativeHandle } from 'react';
import { Modal, Form, Input, Select, Switch } from 'antd';

export interface FormField {
  label: string;
  name: string;
  type: 'input' | 'select' | 'switch';
  options?: { label: string; value: any }[];
  disabled?: boolean;
  required?: boolean; // 建议加上这个字段，用于动态控制必填
   placeholder?: string;
}

export interface FormModalProps {
  visible: boolean;
  title: string;
  fields: FormField[];
  initialValues?: Record<string, any>;
  onOk: (values: any) => void;
  onCancel: () => void;
}
export interface FormModalRef {
  resetForm: () => void;
}
const renderInput = (field: FormField) => {
  switch (field.type) {
    case 'input':
      return (
        <Input
          placeholder={`请输入${field.label}`}
          disabled={field.disabled}
        />
      );
    case 'select':
      return (
        <Select
          placeholder={`请选择${field.label}`}
          disabled={field.disabled}
        >
          {field.options?.map((opt) => (
            <Select.Option key={opt.value} value={opt.value}>
              {opt.label}
            </Select.Option>
          ))}
        </Select>
      );
    case 'switch':
      return <Switch disabled={field.disabled} />;
    default:
      return <Input />;
  }
};

const FormModal = forwardRef<FormModalRef, FormModalProps>((props, ref) => {
  const [form] = Form.useForm();
 const { visible, title, fields, initialValues, onOk, onCancel } = props;
  // 每次 visible 变为 true 时重置表单并设置初始值
  useEffect(() => {
    if (visible) {
      form.setFieldsValue(initialValues || {});
    }
  }, [visible, initialValues, form]);
   useImperativeHandle(ref, () => ({
    resetForm: () => {
      form.resetFields(); // 清空所有字段
    },
  }));

    const handleCancel = () => {
    form.resetFields(); //  关闭时立即清空
    onCancel();
  };
  //  Modal 的 onOk 触发表单验证和提交
  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        onOk(values);
      })
      .catch((err) => {
        console.log('表单校验失败:', err);
        // Ant Design 会自动显示错误提示，无需额外处理
      });
  };

  return (
    <Modal
    
      open={visible}
      title={title}
      okText="保存"
      cancelText="取消"
      onOk={handleOk} // 关键：绑定 handleOk
      onCancel={handleCancel}
      destroyOnHidden = {true}
    >
      <Form form={form} layout="vertical">
        {fields.map((field) => (
          <Form.Item
            key={field.name}
            name={field.name}
            label={field.label}
            rules={
              field.required !== false
                ? [{ required: true, message: `请输入${field.label}` }]
                : []
            }
          >
            {renderInput(field)}
          </Form.Item>
        ))}
      </Form>
    </Modal>
  );
});

export default FormModal;