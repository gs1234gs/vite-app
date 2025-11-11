// src/pages/system/menu/menuConfig.tsx
import type { TableColumnsType } from 'antd';
import { Space, Switch, Tag, Button, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { TreeTableData } from '../template/TreeTable';
import type { FormField } from '../model/FormModal';

// src/pages/system/menu/menuConfig.tsx

export const menuFormFields: FormField[] = [
  { label: '菜单名称', name: 'name', type: 'input', required: true },
  { label: '图标', name: 'icon', type: 'input', required: false },
  { label: '路由路径', name: 'path', type: 'input', required: true }, // 菜单必须有 path
  {
    label: '组件路径',
    name: 'component',
    type: 'input',
    required: false,
    placeholder: 'views/system/user/index.vue',
  },
  {
    label: '权限标识',
    name: 'perms',
    type: 'input',
    required: false,
    placeholder: 'system:user:list',
  },
  {
    label: '类型',
    name: 'type',
    type: 'select',
    required: true,
    options: [
      { label: '目录', value: 'M' },
      { label: '菜单', value: 'C' },
      { label: '按钮', value: 'F' },
    ],
  },
  {
    label: '状态',
    name: 'status',
    type: 'select',
    required: true,
    options: [
      { label: '正常', value: 0 },
      { label: '停用', value: 1 },
    ],
  },
  {
    label: '显示状态',
    name: 'visible',
    type: 'select',
    required: true,
    options: [
      { label: '显示', value: 0 },
      { label: '隐藏', value: 1 },
    ],
  },
  {
    label: '排序',
    name: 'sort',
    type: 'input',
    required: false,
    placeholder: '数字越小越靠前',
  },
];

interface MenuColumnHandlers {
  onAdd: (record?: TreeTableData) => void;
  onEdit: (record: TreeTableData) => void;
  onDelete?: (key: string | number) => void;
  onToggleStatus: (record: TreeTableData, checked: boolean) => void;
}

export const createMenuColumns = (
  handlers: MenuColumnHandlers
): TableColumnsType<TreeTableData> => [
  { title: '名称', dataIndex: 'name', key: 'name' },
  { title: '路径', dataIndex: 'path', key: 'path' },
  {
    title: '类型',
    dataIndex: 'type',
    key: 'type',
    render: (text) => <Tag color="blue">{text}</Tag>,
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (text, record) => (
      <Switch
        checked={text === '正常'}
        size="small"
        onChange={(checked) => handlers.onToggleStatus(record, checked)}
      />
    ),
  },
  {
    title: '显示',
    dataIndex: 'visible',
    key: 'visible',
    render: (text) => <Tag color={text === '显示' ? 'cyan' : 'default'}>{text}</Tag>,
  },
  {
    title: '操作',
    key: 'action',
    render: (_, record) => (
      <Space>
        <Button
          size="small"
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => handlers.onAdd(record)}
        />
        <Button
          size="small"
          icon={<EditOutlined />}
          onClick={() => handlers.onEdit(record)}
        />
        {handlers.onDelete && (
          <Popconfirm
            title={`确定删除【${record.name}】吗？`}
            onConfirm={() => handlers.onDelete?.(record.key)}
          >
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        )}
      </Space>
    ),
  },
];

export const mapMenuData = (nodes: any[], level = 0): TreeTableData[] =>
  nodes.map((node) => ({
    id: node.id, // 👈 显式保留数字类型的 id
    key: node.id?.toString() ?? node.key,
    name: node.name,
    path: node.path || '',
    component: node.component || '',
    perms: node.perms || '',
    sort: node.sort ?? 999,
    type: node.type === 'M' ? '目录' : node.type === 'C' ? '菜单' : '按钮',
    status: node.status === 0 ? '正常' : '停用',
    visible: node.visible === 0 ? '显示' : '隐藏',
    icon: node.icon,
    level,
    children: node.children ? mapMenuData(node.children, level + 1) : undefined,
  }));