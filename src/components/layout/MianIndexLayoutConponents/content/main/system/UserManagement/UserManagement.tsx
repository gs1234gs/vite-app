import React, { useEffect, useState } from 'react';
import { Form, message } from 'antd';
import TableTemplate from '../template/TableTemplate';
import useSysUser from '../../../../../../../stores/main/SysUser';
import type { PageType } from '../../../../../../../api/type/PageType';
import type { SysUserType } from '../../../../../../../api/main/type/SysUserType';
import FormModel1 from '../model/FormModel1';
import { columns, UserList } from './SysUser';


const UserManagement: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form] = Form.useForm();
  const [currentRecord, setCurrentRecord] = useState<any>(null);
  const [checkedKeys, setCheckedKeys] = useState<{ checked: React.Key[]; halfChecked: React.Key[] }>({ checked: [], halfChecked: [] });
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);

const pageType: PageType<SysUserType> = {
 pageNum: 1,
  pageSize: 10,
  condition: {
    // 根据 SysUserType 的字段填写默认空条件
    username: '',
    nickName: '',
    status: 1,
    // ... 其他字段设为初始值或 undefined
  }
  }

   const  {findByIdApi,findPageApi,sysUserList,loading,error} = useSysUser();
     useEffect(() => {
       findPageApi(pageType);
     }, [findPageApi]);
    //  console.log(sysUserList)
 const handleSave = () => {
    setIsEdit(false);
    setIsModalOpen(true);
    form.resetFields();
    console.log("save")
  };
  const handleDelete =(id:number)=>{
console.log("del")
 message.success(`删除成功：${id}`);
  }
  const handleEdit =(edit:any)=>{
    setIsEdit(true);
    setIsModalOpen(true);
    setCurrentRecord(edit);
       // 发起通过 ID 查询的请求，获取用户数据
        findByIdApi(edit.id).then((response) => {
            form.setFieldsValue(response); // 假设返回的数据已经包含字段与 form 对应
        });
console.log("edit")
  }

const handleFind = ({
  pageNum,
  pageSize,
  query,
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
      ...query, // 把查询条件合并到 condition
    },
  };
  findPageApi(newPage);
};
  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (isEdit) {
        message.success('编辑成功');
        console.log('编辑数据：', { ...currentRecord, ...values });
      } else {
        message.success('新增成功');
        console.log('新增数据：', values);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.log('校验失败', error);
    }
  };
    const handleModalCancel = () => {
    setIsModalOpen(false);
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
  pageNum={pageType.pageNum}
  pageSize={pageType.pageSize}
  handleFind={handleFind}
  handleSave={handleSave}
  handleDelete={handleDelete}
  handleEdit={handleEdit}
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
     />
</>
);

};

export default UserManagement;