// src/pages/system/menu/MenuManagement.tsx
import React, { useEffect, useState } from 'react';
import TreeTable from '../template/TreeTable';
import {
  menuFormFields,
  createMenuColumns,
  mapMenuData,
} from './MenuConfig';
import type { TreeTableData } from '../template/TreeTable';
import type { FormField } from '../model/FormModal';
import useSysMenu from '../../../../../../../stores/main/SysMenu';
import FormModal from '../model/FormModal';
import { message } from 'antd';

const MenuManagement: React.FC = () => {
  const {
    findAllApi,
    allSysMenu,
    deleteByIdApi,
    findByIdApi,
    findByIdMenu,
    saveApi,
    menuId,
    loading,
    error,
  } = useSysMenu();

  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [editingRecord, setEditingRecord] = useState<TreeTableData | undefined>();
const [editingId, setEditingId] = useState<number | null>(null); // 新增
  // 初始化加载菜单
  useEffect(() => {
    findAllApi();
  }, [findAllApi]);
useEffect(() => {
  // console.log('🔍 useEffect 触发:', { editingId, findByIdMenu });
  if (editingId !== null && findByIdMenu) {
    // console.log('🔍 比较 ID:', findByIdMenu.id, 'vs', editingId);
    if (findByIdMenu.id === editingId) {
      // console.log('✅ 匹配成功，打开编辑弹窗');
      setModalTitle('编辑菜单');
      setEditingRecord(findByIdMenu);
      setModalVisible(true);
      setEditingId(null);
    }
  }
}, [findByIdMenu, editingId]);

useEffect(() => {
  if (editingId !== null && error) {
    message.error('加载菜单失败');
    setEditingId(null);
  }
}, [error, editingId]);
  // 获取表单字段（动态插入“上级菜单”只读字段）
  const getFormFields = (): FormField[] => {
    const fields = [...menuFormFields];

    if (editingRecord) {

      fields.unshift({
        label: '上级菜单',
        name: 'parentNameDisplay',
        type: 'input',
        disabled: true,
      });
    }

    return fields;
  };
// 新增一个函数：计算完整的 initialValues
const getInitialValues = () => {
  // 只有在“编辑菜单”时，才使用 editingRecord 的字段值
  const isEditing = modalTitle === '编辑菜单';

  if (isEditing && editingRecord) {
    // 编辑：使用完整记录
    let parentName = '顶级菜单';
    if ('parentId' in editingRecord && editingRecord.parentId) {
      const parent = allSysMenu?.find((menu: any) => menu.id === editingRecord.parentId);
      parentName = parent?.name || '未知父级';
    }

    return {
      ...editingRecord,
      parentNameDisplay: parentName,
    };
  } else {
    // 新增（顶级或子级）：只设置 parentNameDisplay，其他字段留空
    let parentName = '顶级菜单';

    if (editingRecord && !('parentId' in editingRecord)) {
      // 新增子菜单：editingRecord 是父级
      parentName = editingRecord.name;
    }
    // 如果 editingRecord 是 undefined，则 parentName 保持“顶级菜单”

    return {
      parentNameDisplay: parentName,
      // 其他字段不预填！
    };
  }
};
  // 顶级新增
  const handleAddTop = () => {
    setModalTitle('新增菜单');
    setEditingRecord(undefined); // 无父级
    setModalVisible(true);
  };

  // 子级新增
const handleAddChild = (record?: TreeTableData) => {
  if (!record) return;
  setModalTitle('新增子菜单');
  // 只保留必要信息，避免误用
  setEditingRecord({
    id: record.id,
    name: record.name,
    key: record.key,
  } as TreeTableData); // 类型断言确保兼容
  setModalVisible(true);
};

  // 关闭 Modal 并刷新
  const handleCloseModal = () => {
    setModalVisible(false);
    findAllApi(); // 刷新确保数据一致
  };

  // 编辑菜单
  const handleEdit = async (record: TreeTableData) => {
    try {
      const menuId = Number(record.key);
       setEditingId(menuId);
      await findByIdApi(menuId);

      // const fullMenu = findByIdMenu;
      // if (!fullMenu) {
      //   message.error('未获取到菜单详情');
      //   return;
      // }
      // console.log(findByIdMenu)
      setModalTitle('编辑菜单');
      setEditingRecord(findByIdMenu); // fullMenu 包含 parentId 等完整字段
      setModalVisible(true);
    } catch (err) {
      console.error('加载菜单详情失败:', err);
      message.error('加载菜单失败');
    }
  };

  // 删除菜单
  const handleDelete = async (id: string | number) => {
    try {
      await deleteByIdApi(Number(id));
      console.log('11',id)
      findAllApi();
    } catch (err) {
      message.error('删除失败');
    }
  };

  // 切换状态（暂未实现 API）
  const handleToggleStatus = (record: TreeTableData, enabled: boolean) => {
    console.log('切换状态:', record, enabled);
    if(record.status === '正常'){
      record.status = 0
    }
    console.log('切换状态:', record, enabled);
    // TODO: 调用 updateStatusApi
  };

  // 提交表单
  const handleSubmit = async (values: Record<string, any>) => {
    const { _parentNameDisplay, ...submitValues } = values; //  正确剔除只读字段

    try {
      if (modalTitle === '编辑菜单') {
        // 编辑
        const id = editingRecord!.id;
        // console.log('【编辑】提交:', { id, ...submitValues });
          await saveApi({ id, ...submitValues })
        // TODO: await updateMenuApi(id, submitValues);
        // await findByIdApi(saveId)
      } else if (editingRecord) {
        // 新增子菜单
        const parentId = editingRecord.id;
        // console.log('【子级新增】提交:', { ...submitValues, parentId });
       await saveApi({ ...submitValues, parentId })
        // TODO: await createMenuApi({ ...submitValues, parentId });
        // message.success('新增子菜单成功');
      } else {
        // 顶级新增
        // console.log('【顶级新增】提交:', submitValues);
        await  saveApi(submitValues)
        // TODO: await createMenuApi(submitValues);
        // message.success('新增顶级菜单成功');
      }

      setModalVisible(false);
      findAllApi(); // 提交后刷新
    } catch (err) {
      console.error('提交失败:', err);
      message.error('操作失败');
    }
  };

  // 错误处理
  if (error) {
    return <div style={{ color: 'red', padding: '16px' }}>{error.message}</div>;
  }

  // 操作列回调
  const columnHandlers = {
    onAdd: handleAddChild,
    onEdit: handleEdit,
    onDelete: handleDelete,
    onToggleStatus: handleToggleStatus,
  };

  const columns = createMenuColumns(columnHandlers);
  const resolvedFormFields = getFormFields();

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
       key={modalTitle + (editingRecord?.id ?? 'new')}
        visible={modalVisible}
        title={modalTitle}
        fields={resolvedFormFields}
         initialValues={getInitialValues()}
        onOk={handleSubmit}
        onCancel={handleCloseModal}
      />
    </>
  );
};

export default MenuManagement;