import type { TableColumnsType } from "antd";
import type { TenantType } from "@/api/main/type/TenantType";

export const TenantFormList = [
    {
        label: "租户名称",
        name: "name",
        type: "input",
        rules: {
            required: true,
            message: "请输入租户名称"
        }
    },
    {
        label: "描述",
        name: "description",
        type: "input",
        rules: {
            required: false,
            message: "请输入描述"
        }
    }
];

export interface DataType extends TenantType {
  key: React.Key;
}

export const columns: TableColumnsType<DataType> = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 120,
  },
  {
    title: '租户名称',
    dataIndex: 'name',
    key: 'name',
    width: 200,
  },
  {
    title: '描述',
    dataIndex: 'description',
    key: 'description',
    width: 300,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    width: 180,
  }
];
