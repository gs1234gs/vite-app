import React, { useState } from "react";
import { Tree, Button, Input, Space, Empty } from "antd";
import { PlusOutlined, ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import type { DataNode } from "antd/es/tree";
import styles from "./style/TreeManagementLayout.module.css";

interface TreeManagementLayoutProps<T> {
  title: string;
  treeData: DataNode[];
  selectedKey?: React.Key;
  onSelect?: (key: React.Key, node: any) => void;
  onAdd?: () => void;
  onRefresh?: () => void;
  rightContent?: React.ReactNode;
}

export function TreeManagementLayout<T = any>({
  title,
  treeData,
  selectedKey,
  onSelect,
  onAdd,
  onRefresh,
  rightContent,
}: TreeManagementLayoutProps<T>) {
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [searchValue, setSearchValue] = useState("");

  const filteredTree = treeData
    .map((node) => filterTree(node, searchValue))
    .filter(Boolean) as DataNode[];

  return (
    <div className={styles.layout}>
      {/* 左侧树 */}
      <div className={styles.sider}>
        <div className={styles.siderHeader}>
          <div className={styles.title}>{title}</div>
          <Space>
            {onAdd && (
              <Button
                type="primary"
                size="small"
                icon={<PlusOutlined />}
                onClick={onAdd}
              />
            )}
            {onRefresh && (
              <Button
                size="small"
                icon={<ReloadOutlined />}
                onClick={onRefresh}
              />
            )}
          </Space>
        </div>

        <Input
          size="small"
          placeholder="搜索节点..."
          prefix={<SearchOutlined />}
          allowClear
          className={styles.searchBox}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />

        <div className={styles.treeContainer}>
          {filteredTree.length > 0 ? (
            <Tree
              showLine={{ showLeafIcon: false }}
              blockNode
              defaultExpandAll
              selectedKeys={selectedKey ? [selectedKey] : []}
              expandedKeys={expandedKeys}
              onExpand={(keys) => setExpandedKeys(keys)}
              treeData={filteredTree}
              onSelect={(keys, info) => onSelect?.(keys[0], info.node)}
            />
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据" />
          )}
        </div>
      </div>

      {/* 右侧内容 */}
      <div className={styles.content}>
        {rightContent || <Empty description="请选择左侧节点查看详情" />}
      </div>
    </div>
  );
}

/** 辅助函数：树结构过滤 */
function filterTree(node: DataNode, keyword: string): DataNode | null {
  if (!keyword) return node;
  const match = (node.title as string).includes(keyword);
  if (match) return node;
  if (node.children) {
    const filteredChildren = node.children
      .map((child) => filterTree(child, keyword))
      .filter(Boolean) as DataNode[];
    if (filteredChildren.length > 0) {
      return { ...node, children: filteredChildren };
    }
  }
  return null;
}
