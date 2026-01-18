// src/pages/system/template/TreeTable.tsx
import React, { useState } from 'react';
import {
  Table,
  type TableColumnsType,
  Space,
  Button,
  Typography,
  Input,
  ConfigProvider,
  theme,
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
  onAddTop?: () => void; // 仅用于顶部"新增"按钮
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

  // 纯样式定义 - 不改变任何逻辑
  const customStyles = `
    .beautiful-tree-table {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.3);
    }
    
    .beautiful-tree-table .ant-table {
      background: transparent;
      border-radius: 12px;
      overflow: hidden;
    }
    
    .beautiful-tree-table .ant-table-thead > tr > th {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
      color: white !important;
      font-weight: 600;
      border: none;
      padding: 16px 12px;
    }
    
    .beautiful-tree-table .ant-table-tbody > tr > td {
      border-bottom: 1px solid rgba(0, 0, 0, 0.06);
      padding: 14px 12px;
      transition: all 0.3s ease;
    }
    
    .beautiful-tree-table .ant-table-tbody > tr:hover > td {
      background: rgba(102, 126, 234, 0.08) !important;
    }
    
    .tree-table-level-0 { 
      background-color: rgba(255, 255, 255, 0.9);
    }
    
    .tree-table-level-1 { 
      background-color: rgba(245, 248, 252, 0.9);
    }
    
    .tree-table-level-2 { 
      background-color: rgba(237, 243, 250, 0.9);
    }
    
    .beautiful-search-section {
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 12px;
      padding: 16px 20px;
      margin-bottom: 20px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }
    
    .beautiful-search-section .ant-input-affix-wrapper {
      background: rgba(255, 255, 255, 0.9);
      border: 1px solid rgba(0, 0, 0, 0.1);
      border-radius: 8px;
      transition: all 0.3s ease;
    }
    
    .beautiful-search-section .ant-input-affix-wrapper:hover,
    .beautiful-search-section .ant-input-affix-wrapper-focused {
      border-color: #667eea;
      box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
    }
    
    .gradient-button {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      border-radius: 8px;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
      font-weight: 600;
      transition: all 0.3s ease;
    }
    
    .gradient-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
      background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
    }
  `;

  if (loading) return <Typography.Text>加载中...</Typography.Text>;

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#667eea',
          borderRadius: 8,
        },
      }}
    >
      <style>{customStyles}</style>
      
      <div className="beautiful-tree-table">
        {/* 搜索区域 - 完全保持原有逻辑，只添加样式类名 */}
        <div className="beautiful-search-section">
          <Space align="center" style={{ marginBottom: 0, width: '100%' }}>
            <Input
              placeholder="请输入名称"
              prefix={<SearchOutlined />}
              value={searchKeyword}
              onChange={handleSearchChange}
              onKeyDown={handleKeyPress}
              style={{ width: 240 }}
            />
            <Button type="default" onClick={handleSearch}>
              查询
            </Button>
            <div style={{ flex: 1 }} />
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={onAddTop}
              className="gradient-button"
            >
              新增
            </Button>
          </Space>
        </div>

        {/* 表格区域 - 完全保持原有逻辑，只添加样式类名 */}
        <Table<TreeTableData>
          columns={columns}
          dataSource={mapData(data)}
          pagination={false}
          expandable={{ defaultExpandAllRows: false }}
          rowClassName={(record) => `tree-table-level-${record.level ?? 0}`}
        />
      </div>
    </ConfigProvider>
  );
};

export default TreeTable;