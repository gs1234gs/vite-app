import { Modal, Form, Input, InputNumber, Select, Upload, message, Button } from 'antd';
import type { UploadProps } from 'antd';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import type { ProductCarousalSaveVO, ProductCarousalVO } from '@/api/goods/carousel/ProductCarouselType';
import { uploadApi } from '@/api/upload/Upload';
import { useState, useEffect } from 'react';  // ✅ 修复：移除 use，添加 useEffect
import useProductCarousal from '@/stores/goods/ProductCarousel';

interface CarouselFormModalProps {
  open: boolean;
  onCancel: () => void;
  onSave: (values: ProductCarousalSaveVO) => Promise<void>;
  initialValues?: ProductCarousalVO;
}

const CarouselFormModal = ({
  open,
  onCancel,
  onSave,
  initialValues,
}: CarouselFormModalProps) => {
  const [form] = Form.useForm<ProductCarousalSaveVO>();
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);  // ✅ 新增：加载状态
  const [imageUrl, setImageUrl] = useState<string>('');  // ✅ 新增：单独管理图片URL
  
  // 根据id获取详细信息
  const { findProductCarousalByIdApi } = useProductCarousal();

  //  判断是否为编辑模式
  const isEdit = !!initialValues?.id;

  // 编辑模式下，根据id获取详细信息并回显
  useEffect(() => {
    if (open && isEdit && initialValues?.id) {
      const fetchDetail = async () => {
        try {
          setLoading(true);
          const res = await findProductCarousalByIdApi(initialValues.id);
          if (res) {
            const detail = res;
            //  设置表单值（使用 setFieldsValue 而不是 initialValues）
            form.setFieldsValue({
              id: detail.id,
              type: detail.type ?? 1,
              title: detail.title,
              image: detail.image,
              link: detail.link,
              sort: detail.sort ?? 0,
              status: detail.status ?? 1,
              description: detail.description,
            });
            //  设置图片URL用于预览
            setImageUrl(detail.image || '');
          }
        } catch (err) {
          message.error('获取轮播图详情失败');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchDetail();
    }
  }, [open, isEdit, initialValues?.id, findProductCarousalByIdApi, form]);

  // 关闭时重置表单和图片
  useEffect(() => {
    if (!open) {
      form.resetFields();
      setImageUrl('');
    }
  }, [open, form]);

  // 上传配置（调用真实上传接口）
  const uploadProps: UploadProps = {
    name: 'file',
    maxCount: 1,
    accept: 'image/*',
    showUploadList: false,
    customRequest: async ({ file, onSuccess, onError }) => {
      try {
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file as File);

        const result = await uploadApi(formData);
        if (result.data && result.data.length > 0) {
          const imageUrl = result.data[0];
          form.setFieldValue('image', imageUrl);  // ✅ 设置表单字段
          setImageUrl(imageUrl);  // ✅ 同时更新预览图片
          onSuccess!(imageUrl);
          // message.success('图片上传成功');
        } else {
          throw new Error('上传返回数据为空');
        }
      } catch (err) {
        message.error('图片上传失败');
        onError!(err instanceof Error ? err : new Error('图片上传失败') as any);
      } finally {
        setUploading(false);
      }
    },
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload: ProductCarousalSaveVO = {
        ...values,
        id: values.id || undefined,
        sort: values.sort ?? 0,
        status: values.status ?? 1,
        type: values.type ?? 1,
      };
      await onSave(payload);
      form.resetFields();
      setImageUrl('');
      onCancel();
    } catch (err) {
      message.error('请检查表单填写');
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setImageUrl('');
    onCancel();
  };

  // ✅ 删除图片
  const handleRemoveImage = () => {
    form.setFieldValue('image', undefined);
    setImageUrl('');
  };

  return (
    <Modal
      title={isEdit ? '编辑轮播图' : '新增轮播图'}
      open={open}
      onOk={handleSubmit}
      onCancel={handleCancel}
      width={600}
      confirmLoading={loading || uploading}  // ✅ 添加加载状态
    >
      <Form
        form={form}
        layout="vertical"
        //  新增模式使用 initialValues，编辑模式使用 setFieldsValue
        initialValues={!isEdit ? {
          status: 1,
          sort: 0,
          type: 1,
        } : undefined}
      >
        {/* ID 字段完全隐藏 */}
        <Form.Item name="id" noStyle>
          <Input type="hidden" />
        </Form.Item>

        {/* 类型 - 必填 */}
        <Form.Item 
          label="轮播图类型" 
          name="type" 
          rules={[{ required: true, message: '请选择轮播图类型' }]}
        >
          <Select
            options={[
              { value: 1, label: '登录页轮播图' },
              { value: 2, label: '商品详情轮播图' },
            ]}
            placeholder="请选择类型"
            disabled={loading}
          />
        </Form.Item>

        {/* 标题 - 必填 */}
        <Form.Item 
          label="轮播标题" 
          name="title"
          rules={[{ required: true, message: '请输入轮播标题' }]}
        >
          <Input placeholder="例如：年终大促 全场5折起" disabled={loading} />
        </Form.Item>

        {/* 图片 - 必填 */}
        <Form.Item
          label="图片"
          name="image"
          rules={[{ required: true, message: '请上传图片' }]}
        >
          <Upload {...uploadProps}>
            <Button icon={uploading ? <LoadingOutlined /> : <PlusOutlined />} disabled={uploading || loading}>
              {uploading ? '上传中...' : '点击上传图片'}
            </Button>
          </Upload>
          
          {/* 图片预览 */}
          {imageUrl && (
            <div className="mt-2">
              <img
                src={imageUrl}
                alt="预览"
                style={{ 
                  maxHeight: 150, 
                  maxWidth: '100%', 
                  objectFit: 'contain',
                  border: '1px solid #d9d9d9',
                  borderRadius: '4px'
                }}
              />
              <Button 
                type="link" 
                danger 
                size="small"
                onClick={handleRemoveImage}
                style={{ marginTop: 8 }}
                disabled={loading}
              >
                删除图片
              </Button>
            </div>
          )}
        </Form.Item>

        {/* 跳转链接 - 必填 */}
        <Form.Item 
          label="跳转链接" 
          name="link"
          rules={[{ required: true, message: '请输入跳转链接' }]}
        >
          <Input placeholder="https://..." disabled={loading} />
        </Form.Item>

        {/* 排序 - 必填 */}
        <Form.Item 
          label="排序（数字越小越靠前）" 
          name="sort"
          rules={[{ required: true, message: '请输入排序值' }]}
        >
          <InputNumber min={0} style={{ width: '100%' }} placeholder="默认0" disabled={loading} />
        </Form.Item>

        {/* 状态 - 必填 */}
        <Form.Item 
          label="状态" 
          name="status"
          rules={[{ required: true, message: '请选择状态' }]}
        >
          <Select
            options={[
              { value: 1, label: '显示' },
              { value: 0, label: '隐藏' },
            ]}
            placeholder="请选择状态"
            disabled={loading}
          />
        </Form.Item>

        {/* 描述 - 非必填 */}
        <Form.Item label="描述" name="description">
          <Input.TextArea placeholder="可选描述" rows={2} disabled={loading} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CarouselFormModal;