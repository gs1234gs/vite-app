// src/pages/system/menu/MenuManagement.tsx
import React, { useEffect, useMemo, useState } from 'react';
import TreeTable from '../template/TreeTable';
import {
  menuFormFields,
  createMenuColumns,
  mapMenuData,
} from './MenuConfig';
import type { TreeTableData } from '../template/TreeTable';
import type { FormField } from '../model/FormModal';
import useSysMenu from '@/stores/main/SysMenu';
import FormModal from '../model/FormModal';
import { message } from 'antd';

const MenuManagement: React.FC = () => {
  const {
    findAllApi,
    allSysMenu,
    deleteByIdApi,
    findByIdApi,
    saveApi,
    loading,
    error,
  } = useSysMenu();

  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [editingRecord, setEditingRecord] = useState<TreeTableData | undefined>();

  // 初始化加载
  useEffect(() => {
    findAllApi();
  }, [findAllApi]);

  // 动态表单字段
  const resolvedFormFields: FormField[] = useMemo(() => {
    const fields = [...menuFormFields];

    if (editingRecord) {
      fields.unshift({
        label: '上级菜单',
        name: 'parentNameDisplay',
        type: 'input',
        disabled: true,
        required: false,
      });
    }

    return fields;
  }, [editingRecord]);

  const getInitialValues = () => {
    if (!editingRecord) {
      return { parentNameDisplay: '顶级菜单' };
    }

    let parentName = '顶级菜单';
    if ((editingRecord as any).parentId) {
      const parent = allSysMenu?.find((m: any) => m.id === (editingRecord as any).parentId);
      parentName = parent?.name || '未知父级';
    }

    return {
      ...editingRecord,
      parentNameDisplay: parentName,
    };
  };

  // 顶级新增
  const handleAddTop = () => {
    setModalTitle('新增菜单');
    setEditingRecord(undefined);
    setModalVisible(true);
  };

  // 子级新增
  const handleAddChild = (record?: TreeTableData) => {
    if (!record) return;
    setModalTitle('新增子菜单');
    setEditingRecord({
      id: record.id,
      name: record.name,
      key: record.key,
    } as TreeTableData);
    setModalVisible(true);
  };

  // 编辑
  const handleEdit = async (record: TreeTableData) => {
    try {
      const id = Number(record.key);
      const fullMenu = await findByIdApi(id);

      if (!fullMenu) {
        // message.error('未获取到菜单详情');
        return;
      }

      setModalTitle('编辑菜单');
      setEditingRecord(fullMenu as any);
      setModalVisible(true);
    } catch (err) {
      console.error(err);
      message.error('加载菜单失败');
    }
  };

  // 删除
  const handleDelete = async (id: string | number) => {
    try {
      await deleteByIdApi(Number(id));
      findAllApi();
    } catch (err) {
      message.error('删除失败');
    }
  };

  // 提交
  const handleSubmit = async (values: Record<string, any>) => {
    const { parentNameDisplay, ...submitValues } = values;

    try {
      if (modalTitle === '编辑菜单') {
        const id = (editingRecord as any)!.id;
        await saveApi({ id, ...submitValues });
      } else if (editingRecord) {
        const parentId = (editingRecord as any).id;
        await saveApi({ ...submitValues, parentId });
      } else {
        await saveApi(submitValues);
      }

      setModalVisible(false);
      setEditingRecord(undefined);
      findAllApi();
    } catch (err) {
      console.error(err);
      message.error('操作失败');
    }
  };

  if (error) {
    return <div style={{ color: 'red', padding: 16 }}>{error.message}</div>;
  }

  const columnHandlers = {
    onAdd: handleAddChild,
    onEdit: handleEdit,
    onDelete: handleDelete,
    onToggleStatus: () => {},
  };

  const columns = createMenuColumns(columnHandlers);

  return (
    <>
      <TreeTable
        data={allSysMenu || []}
        columns={columns}
        mapData={mapMenuData}
        loading={loading}
        onSearch={(keyword) => {
          console.log('搜索关键词:', keyword);
        }}
        onAddTop={handleAddTop}
      />

      <FormModal
        key={`${modalTitle}-${editingRecord?.id ?? 'new'}`} // ✅ 强制重建
        visible={modalVisible}
        title={modalTitle}
        fields={resolvedFormFields}
        initialValues={getInitialValues()}
        onOk={handleSubmit}
        onCancel={() => {
          setModalVisible(false);
          setEditingRecord(undefined);
        }}
      />
    </>
  );
};

export default MenuManagement;
