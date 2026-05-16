import React, { useEffect, useState } from 'react';
import { Avatar, Form, message, Row, Col, Input, Space, Button } from 'antd';
import { SearchOutlined, ReloadOutlined, PlusOutlined } from '@ant-design/icons';
import TableTemplate from '../template/TableTemplate';
import useSysUser from '@/stores/main/SysUser';
import useSysRole from '@/stores/main/SysRole';
import useTenant from '@/stores/main/Tenant';
import type { PageType } from '@/api/type/PageType';
import type { SysUserType } from '@/api/main/type/SysUserType';
import FormModel1 from '../model/FormModel1';
import { columns, UserList } from './SysUser';

const UserManagement: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form] = Form.useForm();
  const [currentRecord, setCurrentRecord] = useState<any>(null);
  const [checkedKeys, setCheckedKeys] = useState<{ checked: React.Key[]; halfChecked: React.Key[] }>({ checked: [], halfChecked: [] });
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [query, setQuery] = useState({ username: '', nickName: '' });
  const [roleOptions, setRoleOptions] = useState<Array<{ label: string; value: number }>>([]);
  const [tenantOptions, setTenantOptions] = useState<Array<{ label: string; value: string }>>([]);
  
  // 使用 useState 管理分页状态
  const [pagination, setPagination] = useState({ pageNum: 1, pageSize: 10 });

// pageType 动态引用 pagination 状态
const pageType: PageType<SysUserType> = {
  pageNum: pagination.pageNum,
  pageSize: pagination.pageSize,
  condition: {
    username: query.username,
    nickName: query.nickName,
    status: 0,
  }
}

   const  {findByIdApi,findPageApi,sysUserList,loading,error,saveApi,deleteByIdApi} = useSysUser();
   const { findPageApi: findRolePageApi, sysUserList: roleList } = useSysRole();
   const { findPageApi: findTenantPageApi, tenantList } = useTenant();
   
     // 获取用户列表 - 组件挂载时执行
     useEffect(() => {
       findPageApi({
         pageNum: 1,
         pageSize: 10,
         condition: {
           username: '',
           nickName: '',
           status: 0,
         }
       });
     }, [findPageApi]);
     
     // 获取角色列表 - 仅在弹窗打开时执行
     useEffect(() => {
       if (!isModalOpen) return; // 弹窗未打开时不执行
       
       findRolePageApi({
         pageNum: 1,
         pageSize: 100,
         condition: {}
       });
     }, [isModalOpen, findRolePageApi]); // 依赖 isModalOpen，仅在弹窗打开时触发
     
     // 获取租户列表 - 仅在弹窗打开时执行
     useEffect(() => {
       if (!isModalOpen) return; // 弹窗未打开时不执行
       
       findTenantPageApi({
         pageNum: 1,
         pageSize: 100,
         condition: {}
       });
     }, [isModalOpen, findTenantPageApi]); // 依赖 isModalOpen，仅在弹窗打开时触发
     
     // 当角色列表加载完成后，转换为 Select 选项格式
     useEffect(() => {
       if (roleList?.rows) {
         const options = roleList.rows.map((role: any) => ({
           label: role.roleName || role.name,
           value: role.id
         }));
         setRoleOptions(options);
       }
     }, [roleList]);
     
     // 当租户列表加载完成后，转换为 Select 选项格式
     useEffect(() => {
       if (tenantList?.rows) {
         const options = tenantList.rows.map((tenant: any) => ({
           label: tenant.name,
           value: tenant.id
         }));
         setTenantOptions(options);
       }
     }, [tenantList]);

 const handleSave = () => {
    setIsEdit(false);
    setIsModalOpen(true);
    form.resetFields();
    console.log("save")
  };
  const handleDelete = async (id: number) => {
    try {
      await deleteByIdApi(id);
      message.success('删除成功');
      // 刷新列表
      findPageApi(pageType);
    } catch (error) {
      message.error('删除失败');
    }
  }
  const handleEdit =(edit:any)=>{
    setIsEdit(true);
    setIsModalOpen(true);
    setCurrentRecord(edit);
    
    // 发起通过 ID 查询的请求，获取用户数据
    findByIdApi(edit.id).then((response) => {
      // 将后端返回的 roles 数组转换为 roleIdList（角色ID数组）
      const roleIdList = response.roles?.map((role: any) => role.id) || [];
      
      // 将后端返回的 tenant 对象转换为 tenantId（单个租户ID）
      // 后端 SysUserVO 返回格式：{ tenant: { id: "1", name: "租户名称", ... } }
      const tenantId = response.tenant?.id;
      
      // 设置表单值，包含转换后的角色ID列表和租户ID
      // 注意：密码字段不回显，显式设置为空字符串
      form.setFieldsValue({
        ...response,
        roleIdList,
        tenantId,
        password: '',
        confirmPassword: ''
      });
    });
    
    console.log("edit")
  }

const handleFind = ({
  pageNum,
  pageSize,
  query: searchQuery,
}: {
  pageNum: number;
  pageSize: number;
  query?: any;
}) => {
  // 更新分页状态
  setPagination({ pageNum, pageSize });
  
  const newPage = {
    pageNum,
    pageSize,
    condition: {
      username: searchQuery?.username ?? query.username,
      nickName: searchQuery?.nickName ?? query.nickName,
      status: 0,
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
      
      // 删除 key 和 confirmPassword 字段（不应传给后端）
      const { key, confirmPassword, ...dataToSend } = submitData;
      
      // 如果是编辑模式且密码为空，则传递 null 表示不修改密码
      if (isEdit && (!dataToSend.password || dataToSend.password.trim() === '')) {
        dataToSend.password = null;
      }
      
      // 调用保存接口（编辑和新增共用同一个接口）
      await saveApi(dataToSend);
      
      // 关闭弹窗并刷新列表
      setIsModalOpen(false);
      
      // 清空密码字段
      form.setFieldsValue({ password: '', confirmPassword: '' });
      
      findPageApi(pageType);
    } catch (error) {
      console.log('校验失败', error);
    }
  };
    const handleModalCancel = () => {
    setIsModalOpen(false);
    
    // 清空密码字段
    form.setFieldsValue({ password: '', confirmPassword: '' });
  };

 const dataSource = sysUserList?.rows?.map((item: any) => ({
  ...item,
  key: item.id,
})) ?? [];

  return (
    <>
  <TableTemplate
  columns={columns}
  dataSource={dataSource}
  total={sysUserList?.total ?? 0}
  pageNum={pagination.pageNum}
  pageSize={pagination.pageSize}
  handleFind={handleFind}
  handleSave={handleSave}
  handleDelete={handleDelete}
  handleEdit={handleEdit}
  query={query}
  searchForm={
    <Row gutter={12} align="middle">
      <Col>
        <Input
          placeholder="用户名"
          value={query.username}
          onChange={(e) => setQuery({ ...query, username: e.target.value })}
          style={{ width: 180 }}
        />
      </Col>
      <Col>
        <Input
          placeholder="昵称"
          value={query.nickName}
          onChange={(e) => setQuery({ ...query, nickName: e.target.value })}
          style={{ width: 180 }}
        />
      </Col>
      <Col>
        <Space>
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={() => {
              // 查询时重置到第一页，但保持当前每页大小
              setPagination({ pageNum: 1, pageSize: pagination.pageSize });
              const newPage = {
                pageNum: 1,
                pageSize: pagination.pageSize,
                condition: {
                  username: query.username,
                  nickName: query.nickName,
                  status: 0,
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
              setQuery({ username: '', nickName: '' });
              // 重置时回到初始状态（第一页，10条/页）
              setPagination({ pageNum: 1, pageSize: 10 });
              const newPage = {
                pageNum: 1,
                pageSize: 10,
                condition: {
                  username: '',
                  nickName: '',
                  status: 0,
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
     formItem={UserList}
     checkedKeys={checkedKeys}
     setCheckedKeys={setCheckedKeys}
     expandedKeys={expandedKeys}
     setExpandedKeys={setExpandedKeys}
     roleOptions={roleOptions}
     tenantOptions={tenantOptions}
     />
</>
);

};

export default UserManagement