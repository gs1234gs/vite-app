// src/pages/system/template/TreeTable.tsx
import React, { useState } from 'react';
import {
  Table,
  type TableColumnsType,
  Space,
  Button,
  Typography,
  Input,
} from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';

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
  onAddTop?: () => void; // 仅用于顶部“新增”按钮
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

  if (loading) return <Typography.Text>加载中...</Typography.Text>;

  return (
    <>
      <Space align="center" style={{ marginBottom: 16 }}>
        <Input
          placeholder="请输入名称"
          prefix={<SearchOutlined />}
          value={searchKeyword}
          onChange={handleSearchChange}
          onKeyDown={handleKeyPress}
          style={{ width: 240 }}
        />
        <Button type="primary" onClick={handleSearch}>
          查询
        </Button>
        <div style={{ flex: 1 }} />
        <Button type="primary" icon={<PlusOutlined />} onClick={onAddTop}>
          新增
        </Button>
      </Space>

      <Table<TreeTableData>
        columns={columns}
        dataSource={mapData(data)}
        pagination={false}
        expandable={{ defaultExpandAllRows: false }}
        rowClassName={(record) => `tree-table-level-${record.level ?? 0}`}
      />

      <style>{`
        .tree-table-level-0 { background-color: #ffffff; }
        .tree-table-level-1 { background-color: #f5f8fc; }
        .tree-table-level-2 { background-color: #edf3fa; }
        .ant-table-tbody > tr:hover > td { background-color: #e6f7ff !important; }
      `}</style>
    </>
  );
};

export default TreeTable;