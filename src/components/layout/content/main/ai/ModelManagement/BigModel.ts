import type { TableColumnsType } from "antd";
import type { BigModelVO } from "@/api/ai/model/ModelType";

export const bigModelFormList = [
    {
        label: "模型名称",
        name: "name",
        type: "input",
        rules: {
            required: true,
            message: "请输入模型名称"
        }
    },
    {
        label: "模型类型",
        name: "type",
        type: "select",
        options: [
            { label: "语言模型", value: 1 },
            { label: "图像模型", value: 2 },
            { label: "语音模型", value: 3 },
            { label: "多模态模型", value: 4 }
        ],
        rules: {
            required: true,
            message: "请选择模型类型"
        }
    },
    {
        label: "模型版本",
        name: "version",
        type: "input",
        rules: {
            required: false,
            message: "请输入模型版本"
        }
    },
    {
        label: "模型描述",
        name: "description",
        type: "input",
        rules: {
            required: false,
            message: "请输入模型描述"
        }
    },
    {
        label: "状态",
        name: "status",
        type: "radio",
        options: [
            { label: "启用", value: 0 },
            { label: "禁用", value: 1 }
        ]
    }
];

export interface DataType extends BigModelVO {
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
    title: '模型名称',
    dataIndex: 'name',
    key: 'name',
    width: 150,
  },
  {
    title: '模型类型',
    dataIndex: 'type',
    key: 'type',
    width: 120,
    render: (value) => {
      const typeMap: Record<number, string> = {
        1: '语言模型',
        2: '图像模型',
        3: '语音模型',
        4: '多模态模型'
      };
      return typeMap[value] || '未知';
    },
  },
  {
    title: '版本',
    dataIndex: 'version',
    key: 'version',
    width: 120,
  },
  {
    title: '描述',
    dataIndex: 'description',
    key: 'description',
    width: 200,
    ellipsis: true,
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
