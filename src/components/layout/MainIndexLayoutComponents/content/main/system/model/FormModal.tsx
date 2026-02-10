// src/pages/system/model/FormModal.tsx
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Modal, Form, Input, Select, Switch } from 'antd';
import type { Rule } from 'antd/es/form';

export interface FormField {
  label: string;
  name: string;
  type: 'input' | 'select' | 'switch';
  options?: { label: string; value: any }[];
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  rules?: Rule[];
  switchConfig?: {
    checkedChildren?: React.ReactNode;
    unCheckedChildren?: React.ReactNode;
  };
}

export interface FormModalProps {
  visible: boolean;
  title: string;
  fields: FormField[];
  initialValues?: Record<string, any>;
  onOk: (values: any) => Promise<void> | void;
  onCancel: () => void;
  okText?: string;
  cancelText?: string;
  width?: number | string;
}

export interface FormModalRef {
  resetForm: () => void;
  setFieldsValue: (values: Record<string, any>) => void;
}

const renderInput = (field: FormField) => {
  const commonProps = {
    placeholder: field.placeholder || `请输入${field.label}`,
    disabled: field.disabled,
  };

  switch (field.type) {
    case 'input':
      return <Input {...commonProps} />;
    case 'select':
      return (
        <Select
          placeholder={field.placeholder || `请选择${field.label}`}
          disabled={field.disabled}
          options={field.options}
        />
      );
    case 'switch':
      return (
        <Switch
          disabled={field.disabled}
          checkedChildren={field.switchConfig?.checkedChildren || '开'}
          unCheckedChildren={field.switchConfig?.unCheckedChildren || '关'}
        />
      );
    default:
      return <Input {...commonProps} />;
  }
};

const FormModal = forwardRef<FormModalRef, FormModalProps>((props, ref) => {
  const {
    visible,
    title,
    fields,
    initialValues,
    onOk,
    onCancel,
    okText = '保存',
    cancelText = '取消',
    width = 520,
  } = props;

  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);

  // ✅ 每次打开 / 初始值变化：先 reset 再 set
  useEffect(() => {
    if (visible) {
      form.resetFields();
      if (initialValues) {
        form.setFieldsValue(initialValues);
      }
    }
  }, [visible, initialValues, form]);

  useImperativeHandle(ref, () => ({
    resetForm: () => form.resetFields(),
    setFieldsValue: (values: Record<string, any>) => form.setFieldsValue(values),
  }));

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setConfirmLoading(true);
      await onOk(values);
      form.resetFields();
    } catch (error) {
      console.warn('表单验证或提交失败:', error);
    } finally {
      setConfirmLoading(false);
    }
  };

  const formItems = fields.map((field) => {
    const rules: Rule[] = [...(field.rules || [])];
    if (field.required !== false) {
      const hasRequiredRule = rules.some(rule => 'required' in rule && rule.required);
      if (!hasRequiredRule) {
        rules.unshift({ required: true, message: `请输入${field.label}` });
      }
    }

    return (
      <Form.Item
        key={field.name}
        name={field.name}
        label={field.label}
        rules={rules}
      >
        {renderInput(field)}
      </Form.Item>
    );
  });

  return (
    <Modal
      open={visible}
      title={title}
      okText={okText}
      cancelText={cancelText}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={confirmLoading}
      destroyOnClose // ✅ 关键：关闭就销毁
      width={width}
    >
      <Form form={form} layout="vertical" preserve={false}>
        {formItems}
      </Form>
    </Modal>
  );
});

export default FormModal;
