import { Form, Input, Modal, Select, Radio, type TreeProps, Tree, InputNumber } from "antd";
// import UploadImage from "../../../../../../upload/UploadFile";
import UploadImage from "@/components/upload/UploadFile";
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
  roleOptions?: Array<{ label: string; value: number }>;
  tenantOptions?: Array<{ label: string; value: string }>;
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
  roleOptions = [],
  tenantOptions = [],
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
// useEffect(() => {
//   if (isModalOpen) {
//     // 使用 setTimeout 让出主线程，避免阻塞 click 事件后续处理（如 message）
//     const timer = setTimeout(() => {
//          const currentFieldValue = form.getFieldValue('menuIdList');
//       if (menuIds && menuIds.length > 0) {
//         const stringKeys = menuIds.map(id => String(id));
//         setCheckedKeys({ checked: stringKeys, halfChecked: [] });
//         form.setFieldValue('menuIdList', menuIds);
//       } else {
//         setCheckedKeys({ checked: [], halfChecked: [] });
//         form.setFieldValue('menuIdList', []);
//       }
//     }, 0);

//     return () => clearTimeout(timer);
//   }
// }, [isModalOpen, menuIds, form]);
useEffect(() => {
  if (isModalOpen) {
    const timer = setTimeout(() => {
      // 🔥 关键修复：只有当表单中 menuIdList 为空（或未设置）时才初始化
      const currentFieldValue = form.getFieldValue('menuIdList');
      if (currentFieldValue === undefined || currentFieldValue === null || currentFieldValue.length === 0) {
        if (menuIds && menuIds.length > 0) {
          const stringKeys = menuIds.map(id => String(id));
          setCheckedKeys({ checked: stringKeys, halfChecked: [] });
          form.setFieldValue('menuIdList', menuIds);
        } else {
          setCheckedKeys({ checked: [], halfChecked: [] });
          form.setFieldValue('menuIdList', []);
        }
      }
      // 如果表单已经有值（比如 handleEdit 已设置），就不覆盖！
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
          // 如果字段仅在编辑时显示，且当前不是编辑模式，则跳过
          if (item.editOnly && !isEdit) {
            return null;
          }

          if (item.type === "input") {
            return (
              <Form.Item
                key={item.name}
                label={item.label}
                name={item.name}
                rules={[item.rules]}
              >
                <Input 
                  placeholder={item.placeholder || `请输入${item.label}`}
                  addonAfter={item.addonAfter}
                  type={item.inputType || "text"}
                  min={item.min}
                  max={item.max}
                  step={item.step}
                  disabled={item.disabled}
                />
              </Form.Item>
            );
          }

          if (item.type === "password") {
            return (
              <Form.Item
                key={item.name}
                label={item.label}
                name={item.name}
                rules={
                  item.dependencies 
                    ? [item.rules(form)]
                    : [item.rules]
                }
              >
                <Input.Password 
                  placeholder={item.placeholder || `请输入${item.label}`}
                  disabled={item.disabled}
                />
              </Form.Item>
            );
          }

          if (item.type === "inputNumber") {
            return (
              <Form.Item
                key={item.name}
                label={item.label}
                name={item.name}
                rules={[item.rules]}
              >
                <InputNumber
                  placeholder={`请输入${item.label}`}
                  style={{ width: '100%' }}
                  addonAfter={item.addonAfter}
                  min={item.min !== undefined ? item.min : 0}
                  max={item.max}
                  step={item.step || 1}
                  precision={item.precision}
                />
              </Form.Item>
            );
          }

          if (item.type === "select") {
            // 根据字段名判断使用哪个选项数据源
            let selectOptions = [];
            if (item.options) {
              // 如果字段配置中有 options，优先使用
              selectOptions = item.options.map((opt: any) => ({
                label: opt.label,
                value: opt.value
              }));
            } else if (item.name === 'roleIdList') {
              // 角色字段使用 roleOptions
              selectOptions = roleOptions;
            } else if (item.name === 'tenantId') {
              // 租户字段使用 tenantOptions
              selectOptions = tenantOptions;
            }
            
            return (
              <Form.Item
                key={item.name}
                label={item.label}
                name={item.name}
                rules={[item.rules]}
              >
                <Select
                  mode={item.mode}
                  options={selectOptions}
                  placeholder={`请选择${item.label}`}
                  allowClear
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
                      checkStrictly={true} // 非严格模式，选中父节点自动选中子节点
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