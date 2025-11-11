import type { TableColumnsType } from "antd";
import type { SysRoleType } from "../../../../../../../api/main/type/SysRoleType";

export const RoleList = [
  {
    label: "角色名称",
    name: "name",
    type: "input",
    rules: {
      required: true,
      message: "请输入角色名称"
    }
  },
  {
    label: "角色权限字符串",
    name: "roleKey",
    type: "input",
    rules: {
      required: true,
      message: "请输入角色编码"
    }
  },
  {
    label: "角色状态",
    name: "status",
    type: "radio",
    options: [
      { label: "启用", value: 0 },
      { label: "禁用", value: 1 }
    ]
  },
  {
    label: "菜单",
    name: "menuIdList", // 修改为 menuIdList
    type: "treeSelect",
  },
  {
    label: "描述",
    name: "remark",
    type: "input",
    rules: {
      required: false,
      message: "请输入描述"
    }
  }
];

export interface DataType extends SysRoleType {
  key: React.Key;
}

export const columns: TableColumnsType<DataType> = [
  { title: "ID", dataIndex: "id", key: "id", width: 80 },
  { title: "角色名称", dataIndex: "name", key: "name", width: 150 },
  { title: "角色编码", dataIndex: "roleKey", key: "roleKey", width: 150 },
  {
    title: "角色状态",
    dataIndex: "status",
    key: "status",
    width: 100,
    render: (value: number) => (value === 0 ? "启用" : "禁用"),
  },
  { title: "描述", dataIndex: "remark", key: "remark", width: 200 },
  { title: "创建时间", dataIndex: "createTime", key: "createTime", width: 180 },
];