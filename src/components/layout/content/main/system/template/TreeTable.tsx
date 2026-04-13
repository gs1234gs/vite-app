// src/pages/system/template/TreeTable.tsx
import React, { useState } from 'react';
import {
  Table,
  type TableColumnsType,
  Space,
  Button,
  Input,
  ConfigProvider,
  theme,
} from 'antd';
import type { ColumnType, ColumnGroupType } from 'antd/es/table/interface';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import './style/TreeTable.css';

export interface TreeTableData {
  key: string | number;
  name: string;
  level?: number;
  children?: TreeTableData[];
  [key: string]: any;
}

export interface TreeTableProps {
  data: TreeTableData[];
  loading?: boolean;
  columns: TableColumnsType<TreeTableData>;
  onSearch?: (keyword: string) => void;
  mapData?: (data: any[]) => TreeTableData[];
  onAddTop?: () => void;
}

// 🔑 类型守卫：判断是否为普通列
function isColumnType<T>(
  column: ColumnType<T> | ColumnGroupType<T>
): column is ColumnType<T> {
  return !('children' in column);
}

const TreeTable: React.FC<TreeTableProps> = ({
  data,
  columns,
  onSearch,
  loading = false,
  mapData = (d) => d as TreeTableData[],
  onAddTop,
}) => {
  const [searchKeyword, setSearchKeyword] = useState('');

  const handleSearch = () => {
    onSearch?.(searchKeyword.trim());
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  if (loading) return <div style={{ padding: '20px' }}>加载中...</div>;

const enhancedColumns: TableColumnsType<TreeTableData> = columns.map(col => {
  if (isColumnType(col)) {
    // ✅ 此时 col 是 ColumnType<TreeTableData>，有 dataIndex
    if (col.dataIndex === 'name' || col.key === 'name') {
      return {
        ...col,
        render: (text: string, record: TreeTableData) => (
          <div style={{ paddingLeft: `${(record.level ?? 0) * 24}px` }}>
            {text}
          </div>
        ),
      };
    }
    return col;
  } else {
    // ✅ 此时 col 是 ColumnGroupType<TreeTableData>，处理 children
    return {
      ...col,
      children: col.children?.map(child => {
        // 使用类型守卫确保 child 是 ColumnType
        if (isColumnType(child)) {
          if (child.dataIndex === 'name' || child.key === 'name') {
            return {
              ...child,
              render: (text: string, record: TreeTableData) => (
                <div style={{ paddingLeft: `${(record.level ?? 0) * 24}px` }}>
                  {text}
                </div>
              ),
            };
          }
        }
        return child;
      }) || col.children,
    };
  }
});

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#1677ff',
          borderRadius: 8,
          colorBgContainer: '#ffffff',
          colorText: '#1f2937',
          colorBorder: '#e5e7eb',
        },
      }}
    >
      <div className="modern-tree-table-container">
        <div className="modern-tree-search-bar">
          <Space size={12}>
            <Input
              placeholder="请输入名称"
              prefix={<SearchOutlined />}
              value={searchKeyword}
              onChange={handleSearchChange}
              onKeyDown={handleKeyPress}
              style={{ width: 220 }}
              allowClear
            />
            <Button onClick={handleSearch}>查询</Button>
          </Space>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={onAddTop}
            size="middle"
          >
            新增
          </Button>
        </div>

        <div className="modern-tree-table-wrapper">
          <Table<TreeTableData>
            columns={enhancedColumns}
            dataSource={mapData(data)}
            pagination={false}
            expandable={{
              defaultExpandAllRows: false,
              expandRowByClick: false,
              indentSize: 24,
            }}
            rowClassName={(record) => `tree-row-level-${record.level ?? 0}`}
            className="modern-tree-table"
          />
        </div>
      </div>
    </ConfigProvider>
  );
};

export default TreeTable;