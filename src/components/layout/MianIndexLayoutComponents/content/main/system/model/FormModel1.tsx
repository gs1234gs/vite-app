import { Form, Input, Modal, Select, Radio, type TreeProps, Tree } from "antd";
import UploadImage from "../../../../../../upload/Upload";
import { useEffect, useState, useMemo } from "react";

interface Methods {
  isEdit: boolean;
  isModalOpen: boolean;
  handleModalOk: () => void;
  handleModalCancel: () => void;
  form: any;
  formItem: any,
  treeData?: any,
  checkedKeys: { checked: React.Key[]; halfChecked: React.Key[] };
  setCheckedKeys: (keys: { checked: React.Key[]; halfChecked: React.Key[] }) => void;
  expandedKeys: React.Key[];
  setExpandedKeys: (keys: React.Key[]) => void;
  menuIds?: number[];
}

const FormModel1 = ({
  isEdit,
  isModalOpen,
  handleModalOk,
  handleModalCancel,
  form,
  formItem,
  treeData,
  checkedKeys,
  setCheckedKeys,
  expandedKeys,
  setExpandedKeys,
  menuIds = [],
}: Methods) => {
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);

  // // 递归函数：获取所有子节点的key
  // const getAllChildrenKeys = (node: any): string[] => {
  //   let keys: string[] = [];
  //   if (node.children && node.children.length > 0) {
  //     node.children.forEach((child: any) => {
  //       keys.push(String(child.id));
  //       keys = keys.concat(getAllChildrenKeys(child));
  //     });
  //   }
  //   return keys;
  // };

  // 树的展开和选择事件
  const onExpand: TreeProps['onExpand'] = (expandedKeysValue) => {
    setExpandedKeys(expandedKeysValue as React.Key[]);
    setAutoExpandParent(false);
  };

  const onCheck: TreeProps['onCheck'] = (checkedKeysValue, info) => {
    console.log('onCheck - checkedKeysValue:', checkedKeysValue);
    console.log('onCheck - info:', info);
    
    // 在非严格模式下，checkedKeysValue 可能是普通数组
    let newCheckedKeys: { checked: React.Key[]; halfChecked: React.Key[] };
    
    if (Array.isArray(checkedKeysValue)) {
      // 如果是数组格式，转换为对象格式
      newCheckedKeys = {
        checked: checkedKeysValue,
        halfChecked: []
      };
    } else {
      // 已经是对象格式
      newCheckedKeys = checkedKeysValue as { checked: React.Key[]; halfChecked: React.Key[] };
    }
    
    setCheckedKeys(newCheckedKeys);
    
    // 同时更新表单字段值
    const checkedArray = newCheckedKeys.checked.map(key => Number(key));
    console.log('onCheck - 更新表单字段:', checkedArray);
    form.setFieldValue('menuIdList', checkedArray);
  };

  // 使用 useMemo 优化树形数据转换
  const treeNodes = useMemo(() => {
    if (!treeData || !Array.isArray(treeData)) {
      console.log('treeData 为空或不是数组:', treeData);
      return [];
    }
    
    // 递归转换树形数据
    const convertMenuToTreeData = (menus: any[]): any[] => {
      return menus.map(menu => {
        if (!menu || !menu.id) return null;
        
        const node = {
          title: menu.name || `菜单-${menu.id}`,
          key: String(menu.id),
        };
        
        // 如果有子菜单，递归处理
        if (menu.children && menu.children.length > 0) {
          return {
            ...node,
            children: convertMenuToTreeData(menu.children)
          };
        }
        
        return node;
      }).filter(Boolean);
    };
    
    const result = convertMenuToTreeData(treeData);
    return result;
  }, [treeData]);

  // 关键修复：在模态框打开时同步数据
//   useEffect(() => {
//     if (isModalOpen) {
//     //   console.log('FormModel1 - 模态框打开，menuIds:', menuIds);
      
//       // 如果有菜单ID，设置选中状态
//       if (menuIds && menuIds.length > 0) {
//         const stringKeys = menuIds.map(id => String(id));
//         console.log('FormModel1 - 设置checkedKeys:', stringKeys);
//         setCheckedKeys({ 
//           checked: stringKeys, 
//           halfChecked: [] 
//         });
        
//         // 同时更新表单字段
//         form.setFieldValue('menuIdList', menuIds);
//       } else {
//         // 新增情况，清空选中状态
//         setCheckedKeys({ checked: [], halfChecked: [] });
//         form.setFieldValue('menuIdList', []);
//       }
      
//       // 自动展开所有有子节点的节点
//     //   if (expandedKeys.length === 0 && treeData) {
//     //     const getExpandKeys = (menus: any[]): string[] => {
//     //       let keys: string[] = [];
//     //       menus.forEach(menu => {
//     //         if (menu.children && menu.children.length > 0) {
//     //           keys.push(String(menu.id));
//     //           keys = keys.concat(getExpandKeys(menu.children));
//     //         }
//     //       });
//     //       return keys;
//     //     };
        
//     //     const expandKeys = getExpandKeys(treeData);
//     //     setExpandedKeys(expandKeys);
//     //   }
//     }
//   }, [isModalOpen, menuIds, form, setCheckedKeys, treeData, expandedKeys.length, setExpandedKeys]);
useEffect(() => {
  if (isModalOpen) {
    // 使用 setTimeout 让出主线程，避免阻塞 click 事件后续处理（如 message）
    const timer = setTimeout(() => {
      if (menuIds && menuIds.length > 0) {
        const stringKeys = menuIds.map(id => String(id));
        setCheckedKeys({ checked: stringKeys, halfChecked: [] });
        form.setFieldValue('menuIdList', menuIds);
      } else {
        setCheckedKeys({ checked: [], halfChecked: [] });
        form.setFieldValue('menuIdList', []);
      }
    }, 0);

    return () => clearTimeout(timer);
  }
}, [isModalOpen, menuIds, form]);
  return (
    <Modal
      title={isEdit ? "编辑" : "新增"}
      open={isModalOpen}
      onOk={handleModalOk}
      onCancel={handleModalCancel}
      okText="保存"
      cancelText="取消"
      destroyOnHidden={true} //
      forceRender
      width={600}
      afterClose={() => {
        // 模态框完全关闭后重置状态
        setCheckedKeys({ checked: [], halfChecked: [] });
        setExpandedKeys([]);
      }}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ status: 1 }}
      >
        {formItem.map((item: any) => {
          if (item.type === "input") {
            return (
              <Form.Item
                key={item.name}
                label={item.label}
                name={item.name}
                rules={[item.rules]}
              >
                <Input placeholder={`请输入${item.label}`} />
              </Form.Item>
            );
          }

          if (item.type === "select") {
            return (
              <Form.Item
                key={item.name}
                label={item.label}
                name={item.name}
                rules={[item.rules]}
              >
                <Select
                  options={item.options?.map((opt: any) => ({
                    label: opt.label,
                    value: opt.value
                  }))}
                />
              </Form.Item>
            );
          }

          if (item.type === "radio") {
            return (
              <Form.Item
                key={item.name}
                label={item.label}
                name={item.name}
                rules={[item.rules]}
              >
                <Radio.Group>
                  {item.options?.map((opt: any) => (
                    <Radio key={opt.value} value={opt.value}>
                      {opt.label}
                    </Radio>
                  ))}
                </Radio.Group>
              </Form.Item>
            );
          }

          if (item.type === "upload") {
            return (
              <Form.Item
                key={item.name}
                label={item.label}
                name={item.name}
                rules={[item.rules]}
              >
                <UploadImage />
              </Form.Item>
            );
          }

          if (item.type === 'treeSelect') {
            return (
              <Form.Item 
                key={item.name} 
                label={item.label} 
                name={item.name}
                getValueFromEvent={(value) => value}
              >
                <div style={{ 
                  maxHeight: '400px', 
                  overflow: 'auto', 
                  border: '1px solid #d9d9d9', 
                  borderRadius: '6px', 
                  padding: '8px' 
                }}>
                  {treeNodes && treeNodes.length > 0 ? (
                    <Tree
                      checkable
                      checkStrictly={false} // 非严格模式，选中父节点自动选中子节点
                      onExpand={onExpand}
                      expandedKeys={expandedKeys}
                      autoExpandParent={autoExpandParent}
                      onCheck={onCheck}
                      checkedKeys={checkedKeys.checked} // 在非严格模式下，直接传递数组
                      treeData={treeNodes}
                      selectable={false}
                    />
                  ) : (
                    <div>加载菜单数据中...</div>
                  )}
                </div>
              </Form.Item>
            );
          }

          return null;
        })}
      </Form>
    </Modal>
  );
};

export default FormModel1;