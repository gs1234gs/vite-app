import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Card, message, Row, Col, Radio, Avatar } from 'antd';
import { UserOutlined, SaveOutlined } from '@ant-design/icons';
import useSysUser from '@/stores/main/SysUser';
import UploadImage from '@/components/upload/UploadFile';

const Material: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { findSignInUserByIdApi, updateSignInUserApi } = useSysUser();

  // 加载当前用户信息
  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        setLoading(true);
        const userInfo = await findSignInUserByIdApi();
        console.log('📋 获取到的用户信息:', userInfo);
        
        if (userInfo) {
          // 只设置表单需要的字段
          const formData = {
            id: userInfo.id,
            username: userInfo.username,
            nickName: userInfo.nickName || '',
            email: userInfo.email || '',
            phoneNumber: userInfo.phoneNumber || '',
            image: userInfo.image || '',
            gender: userInfo.gender ?? 0,
            remark: userInfo.remark || '',
          };
          
          console.log('📝 准备设置的表单数据:', formData);
          form.setFieldsValue(formData);
          console.log('✅ 表单数据设置完成');
        } else {
          console.warn('⚠️ 用户信息为空');
        }
      } catch (error) {
        console.error('❌ 加载用户信息失败:', error);
        message.error('加载用户信息失败');
      } finally {
        setLoading(false);
      }
    };

    loadUserInfo();
  }, [findSignInUserByIdApi, form]);

  // 保存个人资料
  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      
      // 只提交允许修改的字段
      const submitData: any = {
        nickName: values.nickName,
        email: values.email,
        phoneNumber: values.phoneNumber,
        image: values.image,
        gender: values.gender,
        remark: values.remark,
      };

      // 如果填写了密码，则传递密码；否则传递 null 表示不修改
      if (values.password && values.password.trim() !== '') {
        submitData.password = values.password;
      } else {
        submitData.password = null;
      }

      await updateSignInUserApi(submitData);
      message.success('个人资料更新成功');
      
      // 清空密码字段
      form.setFieldsValue({ password: '', confirmPassword: '' });
    } catch (error) {
      message.error('更新失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="个人资料" bordered={false}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        {/* 头像 */}
        <Form.Item label="头像">
          <Row align="middle" gutter={16}>
            <Col>
              <Form.Item name="image" noStyle>
                <UploadImage />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item name="image" noStyle>
                {(field: any) => (
                  <Avatar 
                    size={64} 
                    src={field.value} 
                    icon={<UserOutlined />} 
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            {/* 用户名（只读） */}
            <Form.Item label="用户名" name="username">
              <Input disabled />
            </Form.Item>
          </Col>

          <Col span={12}>
            {/* 昵称 */}
            <Form.Item 
              label="昵称" 
              name="nickName"
              rules={[
                { required: true, message: '请输入昵称' },
                { max: 50, message: '昵称不能超过50个字符' }
              ]}
            >
              <Input placeholder="请输入昵称" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            {/* 邮箱 */}
            <Form.Item 
              label="邮箱" 
              name="email"
              rules={[
                { required: true, message: '请输入邮箱' },
                { type: 'email', message: '请输入有效的邮箱地址' }
              ]}
            >
              <Input placeholder="请输入邮箱" />
            </Form.Item>
          </Col>

          <Col span={12}>
            {/* 手机号 */}
            <Form.Item 
              label="手机号" 
              name="phoneNumber"
              rules={[
                { required: true, message: '请输入手机号' },
                { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' }
              ]}
            >
              <Input placeholder="请输入手机号" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            {/* 性别 */}
            <Form.Item label="性别" name="gender">
              <Radio.Group>
                <Radio value={0}>男</Radio>
                <Radio value={1}>女</Radio>
                <Radio value={2}>未知</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>

          <Col span={12}>
            {/* 备注 */}
            <Form.Item label="备注" name="remark">
              <Input.TextArea 
                placeholder="请输入备注" 
                rows={1}
                maxLength={200}
                showCount
              />
            </Form.Item>
          </Col>
        </Row>

        {/* 密码重置区域 */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item 
              label="重置密码" 
              name="password"
              rules={[
                { min: 6, message: '密码长度不能少于6个字符' },
                { max: 20, message: '密码长度不能超过20个字符' }
              ]}
            >
              <Input.Password 
                placeholder="留空表示不修改密码" 
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item 
              label="确认密码" 
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const password = getFieldValue('password');
                    // 如果两个字段都为空，通过校验
                    if (!password && !value) {
                      return Promise.resolve();
                    }
                    // 如果只填了一个，提示错误
                    if (!password || !value) {
                      return Promise.reject(new Error('请同时填写密码和确认密码'));
                    }
                    // 两次密码不一致
                    if (password !== value) {
                      return Promise.reject(new Error('两次输入的密码不一致'));
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <Input.Password 
                placeholder="请再次输入密码" 
              />
            </Form.Item>
          </Col>
        </Row>

        {/* 提交按钮 */}
        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            icon={<SaveOutlined />}
            loading={loading}
          >
            保存修改
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default Material;
