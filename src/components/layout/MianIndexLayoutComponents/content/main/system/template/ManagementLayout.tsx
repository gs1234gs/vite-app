import React from "react";
import { Card, Table, Button, Space } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import styles from "./style/ManagementLayout.module.css";

interface ManagementLayoutProps<T> {
  title: string;
  dataSource: T[];
  columns: any[]; // AntD Table columns
  onAdd?: () => void;
  onEdit?: (record: T) => void;
  onDelete?: (record: T) => void;
  extraActions?: React.ReactNode;
}

export function ManagementLayout<T = any>({
  title,
  dataSource,
  columns,
  onAdd,
  onEdit,
  onDelete,
  extraActions,
}: ManagementLayoutProps<T>){
  const tableColumns = [
    ...columns,
    (onEdit || onDelete) && {
      title: "操作",
      key: "action",
      align: "center",
      render: (_: any, record: T) => (
        <Space size="middle">
          {onEdit && <Button icon={<EditOutlined />} type="link" onClick={() => onEdit(record)}>编辑</Button>}
          {onDelete && <Button icon={<DeleteOutlined />} type="link" danger onClick={() => onDelete(record)}>删除</Button>}
        </Space>
      ),
    },
  ].filter(Boolean);

  return (
    <Card
      title={<span style={{ fontWeight: 600, fontSize: 18 }}>{title}</span>}
      extra={
        <Space>
          {onAdd && <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>新增</Button>}
          {extraActions}
        </Space>
      }
      className={styles.card}
    >
      <Table
        dataSource={dataSource}
        columns={tableColumns}
        rowKey={(record: any) => record.id || record.key}
        pagination={{ pageSize: 10 }}
        bordered={false}
        size="middle"
        rowClassName={(record, index) =>
          `${index % 2 === 0 ? styles.tableRowLight : ""} ${styles.tableHover}`
        }
        className={styles.tableHead}
      />
    </Card>
  );
}
