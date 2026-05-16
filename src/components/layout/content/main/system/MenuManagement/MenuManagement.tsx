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

    // ✅ 只要有 editingRecord（无论是新增子菜单还是编辑），都显示上级菜单字段
    if (editingRecord) {
      fields.unshift({
        label: '上级菜单',
        name: 'parentNameDisplay',
        type: 'input',
        disabled: true,
        required: false,
        placeholder: '请输入上级菜单', // 添加默认占位符
      });
    }

    return fields;
  }, [editingRecord]);

  const getInitialValues = () => {
    // 新增菜单（顶级或子级）
    if (!editingRecord || !(editingRecord as any).id) {
      // 如果有 parentId，说明是新增子菜单，需要显示父级菜单名称
      const parentId = (editingRecord as any)?.parentId;
      let parentName = '顶级菜单';
      
      if (parentId !== undefined && parentId !== null) {
        // ✅ 使用 Number() 确保类型一致进行比较
        const parent = allSysMenu?.find((m: any) => Number(m.id) === Number(parentId));
        if (parent) {
          parentName = parent.name || '未知父级';
          console.log('找到父级菜单:', parentName, 'parentId:', parentId);
        } else {
          console.warn('未找到父级菜单，parentId:', parentId, 'allSysMenu:', allSysMenu);
        }
      }
      
      console.log('getInitialValues - 新增模式返回值:', { parentNameDisplay: parentName });
      return { parentNameDisplay: parentName };
    }

    // 编辑菜单
    let parentName = '顶级菜单';
    if ((editingRecord as any).parentId) {
      const parentId = (editingRecord as any).parentId;
      // ✅ 使用 Number() 确保类型一致进行比较
      const parent = allSysMenu?.find((m: any) => Number(m.id) === Number(parentId));
      if (parent) {
        parentName = parent.name || '未知父级';
      }
    }

    console.log('getInitialValues - 编辑模式返回值:', { ...editingRecord, parentNameDisplay: parentName });
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
    // ✅ 修复：只保存父级菜单的 id，不包含 name 等其他字段
    // 这样 getInitialValues 在合并时不会把父级的 name 覆盖到表单的 name 字段
    setEditingRecord({
      parentId: record.id,  // ✅ 只保存 parentId
    } as any);
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
        // 编辑模式：使用 editingRecord 的 id
        const id = (editingRecord as any)!.id;
        await saveApi({ id, ...submitValues });
      } else if (editingRecord && (editingRecord as any).parentId !== undefined) {
        // 新增子菜单模式：使用 editingRecord 中的 parentId
        const parentId = (editingRecord as any).parentId;
        console.log('新增子菜单 - parentId:', parentId, 'submitValues:', submitValues);
        await saveApi({ ...submitValues, parentId });
      } else {
        // 新增顶级菜单模式：不传 parentId 或传 null
        console.log('新增顶级菜单 - submitValues:', submitValues);
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
