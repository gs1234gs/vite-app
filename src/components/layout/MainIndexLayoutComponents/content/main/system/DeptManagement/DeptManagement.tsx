import { useState } from "react";
import { TreeManagementLayout } from "../template/TreeManagementLayout";
import { ManagementLayout } from "../template/ManagementLayout";

const deptTree = [
  {
    title: "总公司",
    key: "root",
    children: [
      { title: "人事部", key: "hr" },
      { title: "技术部", key: "tech", children: [{ title: "后端组", key: "backend" }] },
    ],
  },
];

const DeptManagement = () => { 
    const [selectedKey, setSelectedKey] = useState<React.Key>("");
    return (
         <TreeManagementLayout
      title="部门管理"
      treeData={deptTree}
      selectedKey={selectedKey}
      onSelect={(key) => setSelectedKey(key)}
      onAdd={() => alert("新增部门")}
      onRefresh={() => alert("刷新部门树")}
      rightContent={
        <ManagementLayout
          title="部门成员"
          dataSource={[
            { id: 1, username: "张三", email: "zhangsan@test.com", status: "在职" },
            { id: 2, username: "李四", email: "lisi@test.com", status: "试用期" },
          ]}
          columns={[
            { title: "姓名", dataIndex: "username" },
            { title: "邮箱", dataIndex: "email" },
            { title: "状态", dataIndex: "status" },
          ]}
          onAdd={() => alert("新增成员")}
          onEdit={(item) => alert(`编辑 ${item.username}`)}
          onDelete={(item) => alert(`删除 ${item.username}`)}
        />
      }
    />
  );
};

export default DeptManagement;