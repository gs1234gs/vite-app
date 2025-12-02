import type React from "react";
import { useEffect, useState, useCallback } from "react";
import type { SysRoleType } from "../../../../../../../api/main/type/SysRoleType";
import type { PageType } from "../../../../../../../api/type/PageType";
import { Form, message } from 'antd';
import useSysRole from "../../../../../../../stores/main/SysRole";
import TableTemplate from "../template/TableTemplate";
import { columns, RoleList } from "./SysRole";
import FormModel1 from "../model/FormModel1";
import useSysMenu from "../../../../../../../stores/main/SysMenu";

const RoleManagement: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form] = Form.useForm();
  const [currentRecord, setCurrentRecord] = useState<any>(null);
  const [checkedKeys, setCheckedKeys] = useState<{ checked: React.Key[]; halfChecked: React.Key[] }>({
    checked: [],
    halfChecked: []
  });
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [menuIds, setMenuIds] = useState<number[]>([]); // 存储当前角色的菜单ID

  const pageType: PageType<SysRoleType> = {
    pageNum: 1,
    pageSize: 10,
    condition: {
      name: '',
      status: 1,
    }
  }

  const { findAllApi, allSysMenu, findAllByRoleIdApi } = useSysMenu();
  const { findRoleByIdApi, findPageApi, sysUserList, saveApi } = useSysRole();

  useEffect(() => {
    findPageApi(pageType);
  }, [findPageApi]);

  // 初始化时加载所有菜单
  useEffect(() => {
    findAllApi();
  }, [findAllApi]);

  const handleSave = () => {
    setIsEdit(false);
    setIsModalOpen(true);
    form.resetFields();
    setCheckedKeys({ checked: [], halfChecked: [] });
    setExpandedKeys([]);
    setCurrentRecord(null);
    setMenuIds([]);
  };

  const handleDelete = (id: number) => {
    // console.log("del")
    message.success(`删除成功：${id}`);
  }

  // 使用 useCallback 优化，避免不必要的重渲染
  const handleEdit = useCallback(async (edit: any) => {
    setIsEdit(true);
    setIsModalOpen(true);
    setCurrentRecord(edit);
    const id = edit.id;

    try {
      // 确保菜单数据已加载
      if (!allSysMenu || allSysMenu.length === 0) {
        await findAllApi();
      }

      // 获取角色基本信息
      const roleData = await findRoleByIdApi(id);
      
      // 获取角色已拥有的菜单
      const roleMenus = await findAllByRoleIdApi(id);
      
      // 从树形菜单数据中提取所有菜单ID（包括子菜单）
      const getAllMenuIds = (menus: any[]): number[] => {
        let ids: number[] = [];
        if (!menus || !Array.isArray(menus)) return ids;
        
        menus.forEach(menu => {
          if (menu && menu.id) {
            ids.push(menu.id);
            if (menu.children && menu.children.length > 0) {
              ids = ids.concat(getAllMenuIds(menu.children));
            }
          }
        });
        return ids;
      };
      
      const extractedMenuIds = roleMenus ? getAllMenuIds(roleMenus) : [];
      
      // console.log('原始菜单ID:', extractedMenuIds);
      // console.log('菜单数据结构:', roleMenus);

      // 保存菜单ID
      setMenuIds(extractedMenuIds);

      // 设置表单数据
      form.setFieldsValue({
        ...roleData,
        menuIdList: extractedMenuIds
      });

      // 直接设置树形控件选中状态
      const checkedKeysValue = extractedMenuIds.map(id => String(id));
      setCheckedKeys({ 
        checked: checkedKeysValue, 
        halfChecked: [] 
      });

      // 设置展开的节点 - 自动展开所有有子节点的节点
      const getExpandKeys = (menus: any[]): string[] => {
        let keys: string[] = [];
        if (!menus || !Array.isArray(menus)) return keys;
        
        menus.forEach(menu => {
          if (menu.children && menu.children.length > 0) {
            keys.push(String(menu.id));
            keys = keys.concat(getExpandKeys(menu.children));
          }
        });
        return keys;
      };
      
      // const expandKeys = allSysMenu ? getExpandKeys(allSysMenu) : [];
      // setExpandedKeys(expandKeys);
      setExpandedKeys([]);

    } catch (error) {
      console.error('获取角色数据失败:', error);
      message.error('获取角色数据失败');
    }
  }, [allSysMenu, findAllApi, findRoleByIdApi, findAllByRoleIdApi, form]);

  const handleFind = ({
    pageNum,
    pageSize,
    query,
  }: {
    pageNum: number;
    pageSize: number;
    query?: any;
  }) => {
    const newPage = {
      ...pageType,
      pageNum,
      pageSize,
      condition: {
        ...pageType.condition,
        ...query,
      },
    };
    findPageApi(newPage);
  };

  const handleModalOk = async () => {
  try {
    const values = await form.validateFields();
    
    // 关键修复：直接从表单中获取 menuIdList，而不是从 checkedKeys
    // 因为表单字段已经在 onCheck 事件中正确更新了
    const finalMenuIds = values.menuIdList || [];
    
    // 准备提交的数据
    const submitData = {
      ...(isEdit ? currentRecord : {}),
      ...values,
      menuIdList: finalMenuIds
    };

    // console.log('提交数据：', submitData);
    // console.log('最终菜单ID：', finalMenuIds);

    if (isEdit) {
      await saveApi(submitData)
      // message.success('编辑成功');
    } else {
      await saveApi(submitData)
      // message.success('新增成功');
    }
    
    setIsModalOpen(false);
    
    // 重新加载数据
    findPageApi(pageType);
    
  } catch (error) {
    message.error("校验失败")
    console.log('校验失败', error);
  }
};

  const handleModalCancel = () => {
    setIsModalOpen(false);
    // 重置状态
    setTimeout(() => {
      setCheckedKeys({ checked: [], halfChecked: [] });
      setExpandedKeys([]);
    }, 300);
  };

  const dataSource = sysUserList?.rows?.map((item: any) => ({
    ...item,
    key: item.id,
  })) ?? [];

  return (
    <>
      <TableTemplate
        columns={columns}
        dataSource={dataSource}
        total={sysUserList?.total ?? 0}
        pageNum={pageType.pageNum}
        pageSize={pageType.pageSize}
        handleFind={handleFind}
        handleSave={handleSave}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
      />

      <FormModel1
        isEdit={isEdit}
        isModalOpen={isModalOpen}
        handleModalOk={handleModalOk}
        handleModalCancel={handleModalCancel}
        form={form}
        formItem={RoleList}
        treeData={allSysMenu}
        checkedKeys={checkedKeys}
        setCheckedKeys={setCheckedKeys}
        expandedKeys={expandedKeys}
        setExpandedKeys={setExpandedKeys}
        menuIds={menuIds} // 传递菜单ID
      />
    </>
  )
}

export default RoleManagement;