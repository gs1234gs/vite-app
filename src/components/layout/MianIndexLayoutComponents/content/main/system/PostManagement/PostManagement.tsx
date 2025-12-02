import { ManagementLayout } from "../template/ManagementLayout"

const users = [
  { id: 1, username: "Alice", email: "alice@test.com", status: "启用" },
  { id: 2, username: "Bob", email: "bob@test.com", status: "禁用" },
];
const PostManagement =() =>{

  const handleAddUser = () => alert("新增用户");
  const handleEditUser = (user: any) => alert(`编辑 ${user.username}`);
  const handleDeleteUser = (user: any) => alert(`删除 ${user.username}`);
    return <>
      <ManagementLayout
      title="用户管理"
      dataSource={users}
      columns={[
        { title: "用户名", dataIndex: "username" },
        { title: "邮箱", dataIndex: "email" },
        { title: "状态", dataIndex: "status" },
      ]}
      onAdd={handleAddUser}
      onEdit={handleEditUser}
      onDelete={handleDeleteUser}
    />
    </>
}

export default PostManagement