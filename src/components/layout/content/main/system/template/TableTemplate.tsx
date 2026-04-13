import React from 'react';
import { Table, Space, Button, Input, Row, Col, Card, Popconfirm, message } from 'antd';
import type { TableColumnsType } from 'antd';
import { createStyles } from 'antd-style';
import { SearchOutlined, ReloadOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import type { ColumnGroupType, ColumnType } from 'antd/es/table';

const useStyle = createStyles(({ css }) => {
  return {
    container: css`
      display: flex;
      flex-direction: column;
      height: 80vh;
      .ant-card {
        flex: 1;
        display: flex;
        flex-direction: column;
      }
    `,
    header: css`
      margin-bottom: 12px;
      background: #fafafa;
      padding: 12px;
      border-radius: 8px;
    `,
    tableWrapper: css`
      flex: 1;
      overflow: auto;
      .ant-table {
        height: 100%;
      }
    `,
  };
});

interface TableTemplateProps {
  columns: TableColumnsType<any>;
  dataSource: any[];
  total: number;
  pageNum: number;
  pageSize: number;
  handleFind: (page: { pageNum: number; pageSize: number; query?: any }) => void;
  handleSave?: (data?: any) => void;
  handleDelete?: (id: number | any) => void;
  handleEdit?: (data: any) => void;
  searchForm?: React.ReactNode; // 自定义搜索表单
  query?: any; // 查询条件对象
  actionColumnRender?: (record: any) => React.ReactNode; // 自定义操作列渲染
}

const TableTemplate: React.FC<TableTemplateProps> = ({
  columns,
  dataSource,
  total,
  pageNum,
  pageSize,
  handleFind,
  handleSave,
  handleDelete,
  handleEdit,
  searchForm,
  query = {},
  actionColumnRender,
}) => {

  const { styles } = useStyle();

  // 处理搜索
  const onSearch = () => {
    handleFind({ pageNum: 1, pageSize, query });
  };

  // 重置
  const onReset = () => {
    handleFind({ pageNum: 1, pageSize, query: {} });
  };
  
  // 类型守卫：判断是否为普通列
function isColumnType<T>(col: ColumnType<T> | ColumnGroupType<T>): col is ColumnType<T> {
  return !('children' in col);
}
const enhanceColumns = (cols: TableColumnsType<any>): TableColumnsType<any> => {
  return cols.map(col => {
    if (isColumnType(col)) {
      // 现在 col 肯定是 ColumnType，有 dataIndex
      if (col.dataIndex === 'image' && !col.render) {
        return {
          ...col,
          render: (url: string) => (
            <Avatar size="large" src={url} icon={<UserOutlined />} />
          ),
        };
      }
    }
    // 如果是 ColumnGroupType，递归处理 children
    if ('children' in col && Array.isArray(col.children)) {
      return {
        ...col,
        children: enhanceColumns(col.children),
      };
    }
    return col;
  });
};
  // 加上操作列
  const actionColumn = {
    title: '操作',
    key: 'action',
    fixed: 'right' as const,
    width: actionColumnRender ? 240 : 160,
    render: (_: any, record: any) => {
      // 如果提供了自定义操作列渲染，使用自定义的
      if (actionColumnRender) {
        return actionColumnRender(record);
      }
      
      // 否则使用默认的编辑和删除按钮
      return (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit && handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确认删除这条记录吗？"
            okText="确认"
            cancelText="取消"
            onConfirm={() => {
              if (handleDelete) handleDelete(record.id);
              else message.warning('未定义删除方法');
            }}
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      );
    },
  };
  return (
    <div className={styles.container}>
      {/* 顶部查询栏 - 如果传入了 searchForm 则使用自定义的，否则显示默认的简单搜索 */}
      {searchForm ? (
        <div className={styles.header}>
          {searchForm}
        </div>
      ) : (
        <div className={styles.header}>
          <Row gutter={12} align="middle">
            <Col>
              <Space>
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  onClick={onSearch}
                >
                  查询
                </Button>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={onReset}
                >
                  重置
                </Button>
                <Button
                  type="dashed"
                  icon={<PlusOutlined />}
                  onClick={() => handleSave && handleSave()}
                >
                  新增
                </Button>
              </Space>
            </Col>
          </Row>
        </div>
      )}
      <Card className={styles.tableWrapper}>
        <Table
          columns={enhanceColumns([...columns, actionColumn])}
          dataSource={dataSource}
          pagination={{
            total,
            current: pageNum,
            pageSize,
            onChange: (page, pageSize) => handleFind({ pageNum: page, pageSize, query }),
          }}
          scroll={{ x: 'max-content' }}
        />
      </Card>
    </div>
  );
};

export default TableTemplate;
