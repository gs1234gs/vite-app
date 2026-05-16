import type { TableColumnsType } from "antd";
import type { SysUserType } from "@/api/main/type/SysUserType";

export const UserList = [
    {
        label: "用户名",
        name: "username",
        type: "input",
        rules: {
            required: true,
            message: "请输入用户名"
        },
        disabledOnEdit: true // 仅在编辑时禁用用户名修改
    },
    {
        label: "头像",
        name: "image",
        type: "upload",
        rules: {
            required: true,
            message: "请上传头像"
        }
    },
    {
        label: "昵称",
        name: "nickName",
        type: "input",
        rules: {
            required: true,
            message: "请输入昵称"
        }
    },
    {
        label: "手机号",
        name: "phoneNumber",
        type: "input",
        rules: {
            required: true,
            message: "请输入手机号"
        }
    },
    {
        label: "邮箱",
        name: "email",
        type: "input",
        rules: {
            required: true,
            message: "请输入邮箱"
        }
    },
    {
        label: "租户",
        name: "tenantId",
        type: "select",
        rules: {
            required: false,
            message: "请选择租户"
        }
    },
    {
        label: "角色",
        name: "roleIdList",
        type: "select",
        mode: "multiple",
        rules: {
            required: true,
            message: "请选择角色"
        }
    },
    {
        label: "性别",
        name: "gender",
        type: "radio",
        options: [
            { label: "男", value: 0 },
            { label: "女", value: 1 },
            { label: "未知", value: 2 }
        ]
    },
    {
        label: "状态",
        name: "status",
        type: "radio",
        options: [
            { label: "启用", value: 0 },
            { label: "禁用", value: 1 }
        ]
    },
    {
        label: "重置密码",
        name: "password",
        type: "password",
        editOnly: true, // 仅在编辑时显示
        placeholder: "留空表示不修改密码"
    },
    {
        label: "确认密码",
        name: "confirmPassword",
        type: "password",
        editOnly: true, // 仅在编辑时显示
        dependencies: ["password"],
        rules: (form: any) => ({
            validator: (_rule: any, value: any) => {
                const password = form.getFieldValue('password');
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
            }
        })
    }
];
export interface DataType extends SysUserType {
  key: React.Key;
}
export  const columns: TableColumnsType<DataType> = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 120,
  },
  {
    title: '用户名',
    dataIndex: 'username',
    key: 'username',
    width: 120,
  },
  {
  title: '头像',
  dataIndex: 'image',
  key: 'image',
  width: 120,
},
  {
    title: '昵称',
    dataIndex: 'nickName',
    key: 'nickName',
    width: 120,
  },
  {
    title: '手机号',
    dataIndex: 'phoneNumber',
    key: 'phoneNumber',
    width: 150,
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    key: 'email',
    width: 180,
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 80,
    render: (value) => (value === 0 ? '启用' : '禁用'),
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    width: 180,
  }
];
