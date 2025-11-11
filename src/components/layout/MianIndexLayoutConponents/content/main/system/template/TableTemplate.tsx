import React from 'react';
import { Table, Space, Button, Input, Row, Col, Card, Popconfirm, message } from 'antd';
import type { TableColumnsType } from 'antd';
import { createStyles } from 'antd-style';
import { SearchOutlined, ReloadOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

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
  handleDelete?: (id: number) => void;
  handleEdit?: (data: any) => void;
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
}) => {
  const { styles } = useStyle();
  const [query, setQuery] = React.useState({ username: '', nickName: '' });

  // 处理搜索
  const onSearch = () => {
    handleFind({ pageNum: 1, pageSize, query });
  };

  // 重置
  const onReset = () => {
    setQuery({ username: '', nickName: '' });
    handleFind({ pageNum: 1, pageSize, query: {} });
  };

  // 加上操作列
  const actionColumn = {
    title: '操作',
    key: 'action',
    fixed: 'right' as const,
    width: 160,
    render: (_: any, record: any) => (
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
    ),
  };

  const mergedColumns = [...columns, actionColumn];

  return (
    <div className={styles.container}>
      {/* 顶部查询栏 */}
      <div className={styles.header}>
        <Row gutter={12} align="middle">
          <Col>
            <Input
              placeholder="用户名"
              value={query.username}
              onChange={(e) => setQuery({ ...query, username: e.target.value })}
              style={{ width: 180 }}
            />
          </Col>
          <Col>
            <Input
              placeholder="昵称"
              value={query.nickName}
              onChange={(e) => setQuery({ ...query, nickName: e.target.value })}
              style={{ width: 180 }}
            />
          </Col>
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

      {/* 表格部分 */}
      <Card className={styles.tableWrapper} variant={"filled" as "borderless"} >
        <Table<any>
          columns={mergedColumns}
          dataSource={dataSource}
          rowKey="id"
          pagination={{
            current: pageNum,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
            onChange: (page, size) =>
              handleFind({ pageNum: page, pageSize: size, query }),
          }}
          scroll={{ x: 'max-content', y: 'calc(100vh - 280px)' }}
        />
      </Card>
    </div>
  );
};

export default TableTemplate;
