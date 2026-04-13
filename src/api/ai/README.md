# AI 模块 API 使用指南

本目录包含两个子模块的 API 接口和 Store 层实现：

## 1. 相似度阈值策略配置模块 (similarity)

### 文件结构
```
src/api/ai/similarity/
├── SimilarityThresholdStrategyConfigurationType.ts  # 类型定义
└── SimilarityThresholdStrategyConfiguration.ts      # API 接口

src/stores/ai/
└── SimilarityThresholdStrategyConfiguration.ts      # Store 层 (Custom Hook)
```

### 类型定义

#### SimilarityThresholdStrategyConfigurationVO
```typescript
interface SimilarityThresholdStrategyConfigurationVO extends BasePojo {
  id: string;                              // 主键 ID
  similarityThreshold: number;             // 相似度阈值
  creator: string;                         // 创建者
  updater: string;                         // 更新者
  createTime: string;                      // 创建时间
  updateTime: string;                      // 更新时间
  delFlag: number;                         // 删除标记
}
```

#### SimilarityThresholdStrategyConfigurationSaveVO
```typescript
interface SimilarityThresholdStrategyConfigurationSaveVO {
  id?: string;                             // 主键 ID（新增时可选）
  similarityThreshold: number;             // 相似度阈值
}
```

#### SimilarityThresholdStrategyConfigurationPageVO
```typescript
interface SimilarityThresholdStrategyConfigurationPageVO {
  name?: string;                           // 名称（模糊查询）
}
```

### API 接口

```typescript
import {
  saveSimilarityThresholdStrategyConfiguration,
  findSimilarityThresholdStrategyConfigurationById,
  findSimilarityThresholdStrategyConfigurationPage,
  deleteSimilarityThresholdStrategyConfigurationById,
  enableSimilarityThresholdStrategy,
} from "@/api/ai/similarity/SimilarityThresholdStrategyConfiguration";
```

#### 接口列表
- `saveSimilarityThresholdStrategyConfiguration(data)` - 保存配置
- `findSimilarityThresholdStrategyConfigurationById(id)` - 根据 ID 查询
- `findSimilarityThresholdStrategyConfigurationPage(data)` - 分页查询
- `deleteSimilarityThresholdStrategyConfigurationById(id)` - 删除配置
- `enableSimilarityThresholdStrategy(id)` - 启用相似度阈值策略

### Store 层使用示例

```typescript
import { useSimilarityThresholdStrategyConfiguration } from "@/stores/ai/SimilarityThresholdStrategyConfiguration";
import type { PageType } from "@/api/type/PageType";

function MyComponent() {
  const {
    loading,
    error,
    pageData,
    detailData,
    saveApi,
    findByIdApi,
    findPageApi,
    deleteByIdApi,
    enableSimilarityApi,
  } = useSimilarityThresholdStrategyConfiguration();

  // 分页查询
  const handleSearch = async () => {
    const pageData: PageType<SimilarityThresholdStrategyConfigurationPageVO> = {
      pageNum: 1,
      pageSize: 10,
      condition: {
        name: "测试",
      },
    };
    await findPageApi(pageData);
  };

  // 保存
  const handleSave = async () => {
    await saveApi({
      similarityThreshold: 0.85,
    });
  };

  // 删除
  const handleDelete = async (id: string) => {
    await deleteByIdApi(id);
  };

  // 启用
  const handleEnable = async (id: string) => {
    await enableSimilarityApi(id);
  };

  return <div>...</div>;
}
```

---

## 2. 大模型管理模块 (model)

### 文件结构
```
src/api/ai/model/
├── ModelType.ts  # 类型定义
└── Model.ts      # API 接口

src/stores/ai/
└── Model.ts      # Store 层 (Custom Hook)
```

### 类型定义

#### BigModelVO
```typescript
interface BigModelVO extends BasePojo {
  id: string;                          // 大模型 ID
  name: string;                        // 大模型名称
  type: number;                        // 大模型类型
  status: number;                      // 状态：0=启用，1=禁用
  description?: string;                // 大模型描述
  version?: string;                    // 大模型版本
  creator: string;                     // 创建者
  updater: string;                     // 更新者
  createTime: string;                  // 创建时间
  updateTime: string;                  // 更新时间
  delFlag: number;                     // 删除标记
}
```

#### BigModelSaveVO
```typescript
interface BigModelSaveVO {
  id?: string;                         // 大模型 ID（编辑时必填）
  name: string;                        // 大模型名称
  type: number;                        // 大模型类型
  status?: number;                     // 状态：0=启用，1=禁用
  description?: string;                // 大模型描述
  version?: string;                    // 大模型版本
}
```

#### BigModelPageVO
```typescript
interface BigModelPageVO {
  name?: string;                       // 名称（模糊查询）
  type?: number;                       // 类型
  status?: number;                     // 状态
}
```

### API 接口

```typescript
import {
  saveBigModel,
  deleteBigModelById,
  findBigModelPage,
  findBigModelById,
} from "@/api/ai/model/Model";
```

#### 接口列表
- `saveBigModel(data)` - 保存大模型（新增或编辑）
- `deleteBigModelById(id)` - 删除大模型
- `findBigModelPage(data)` - 分页查询
- `findBigModelById(id)` - 根据 ID 查询详情

### Store 层使用示例

```typescript
import { useBigModel } from "@/stores/ai/Model";
import type { PageType } from "@/api/type/PageType";

function BigModelManagement() {
  const {
    loading,
    error,
    pageData,
    detailData,
    saveApi,
    deleteByIdApi,
    findPageApi,
    findByIdApi,
  } = useBigModel();

  // 分页查询
  const handleSearch = async () => {
    const pageData: PageType<BigModelPageVO> = {
      pageNum: 1,
      pageSize: 10,
      condition: {
        name: "GPT",
        type: 1,
        status: 0,
      },
    };
    await findPageApi(pageData);
  };

  // 保存
  const handleSave = async () => {
    await saveApi({
      name: "GPT-4",
      type: 1,
      status: 0,
      description: "OpenAI GPT-4 模型",
      version: "4.0",
    });
  };

  // 删除
  const handleDelete = async (id: string) => {
    await deleteByIdApi(id);
  };

  // 查询详情
  const handleViewDetail = async (id: string) => {
    const detail = await findByIdApi(id);
    console.log(detail);
  };

  return <div>...</div>;
}
```

---

## 注意事项

1. **ID 类型**：后端使用 `Long` 类型，前端统一使用 `string` 类型以避免精度丢失
2. **响应结构**：所有接口返回 `ResultT<T>` 结构，包含 `code`、`msg`、`data` 字段
3. **错误处理**：Store 层已集成统一的错误处理和消息提示
4. **Loading 状态**：所有 API 调用都会自动管理 loading 状态
5. **BasePojo 字段**：VO 对象继承 BasePojo，包含审计字段（creator、updater、createTime、updateTime、delFlag）
