# SKU 统计报表模块（整合版）

## 概述

SKU 统计报表模块已整合订单统计功能，提供一站式的数据分析视图。通过主 Tab 切换，用户可以快速查看概览、订单详细统计和 SKU 详细统计。

## 功能特性

### 📊 三大核心模块

#### 1. **概览 Tab**（默认加载）
- **自动加载**：页面打开时同时加载 SKU 和订单数据
- SKU 核心指标卡片（总销量、总库存、低库存预警、总营收）
- 订单核心指标卡片（总销量、总订单数、总营收）
- 快速对比两个业务维度的关键数据
- **自动刷新**：每 60 秒自动更新数据

#### 2. **订单统计 Tab**
- **自动刷新**：每 60 秒自动更新数据
- **下单趋势热力图**（支持多种时间维度）
  - **近1天**：按小时统计（0-23小时）
  - **近7天**：按天统计（显示日期）
  - **近30天**：按天统计（显示日期）
  - **近12个月**：按月统计（1月-12月）
  - 颜色深浅表示订单数量
  - 智能标签旋转（日期过长时自动旋转）
  - 动态显示统计单位
- **统计卡片**
  - 总销量（带趋势对比）
  - 总订单数（带趋势对比）
  - 总营收（带趋势对比）
- **ECharts 图表**
  - 销售趋势图（双轴折线图）
  - 实时流水图（双轴面积图）

#### 3. **SKU 统计 Tab**
- **自动刷新**：每 60 秒自动更新数据
- **统计卡片**
  - 总销量
  - 总库存
  - 低库存预警
  - 总营收
- **排行榜表格**
  - 🔥 热销商品 TOP 10
  - ❄️ 滞销商品 TOP 10
  - ⚠️ 低库存预警列表

### 🔄 自动刷新机制

- **刷新间隔**：60 秒
- **刷新范围**：仅刷新当前激活的 Tab
- **概览 Tab**：同时刷新 SKU 和订单数据
- **组件卸载**：自动清除定时器，避免内存泄漏

### 🎨 UI/UX 特性

- **Ant Design 原生组件**：Card、Statistic、Table、Tabs
- **简洁设计**：无自定义样式，使用 Ant Design 默认主题
- **响应式布局**：Grid 系统适配各种屏幕尺寸
- **动态加载**：每次切换时间范围或 Tab 时，数字动态变化
- **并行请求**：优化数据加载速度
- **实时提示**：显示自动刷新状态提示

## 文件结构

```
src/
├── components/layout/content/main/goods/SkuStatistics/
│   ├── SkuStatistics.tsx         # 统一统计组件（整合SKU+订单）
│   └── README.md                 # 本文档
├── routes/main/goods/SkuStatistics/
│   └── SkuStatistics.tsx         # 路由配置
├── api/goods/sku/                # SKU API
├── api/order/                    # 订单 API
├── stores/goods/                 # SKU Store
└── stores/order/                 # 订单 Store
```

## 技术栈

- **图表库**: ECharts + echarts-for-react
- **UI 框架**: Ant Design v6
- **状态管理**: React Hooks (useState, useCallback, useEffect, useMemo)
- **HTTP 客户端**: Axios (通过 sendRequest 封装)
- **图标库**: @ant-design/icons

## 使用方法

### 1. 路由配置

在后台管理系统菜单中添加菜单项，路径设置为：
```
goods/sku-statistics
```

系统会自动加载对应的路由组件。

### 2. Tab 切换

组件提供三个主 Tab：
- 📊 **概览**：快速查看 SKU 和订单的核心指标
- 📝 **订单统计**：详细的订单数据分析（进度环 + 趋势图）
- 🛒 **SKU 统计**：详细的 SKU 数据分析（排行榜 + 预警）

### 3. 时间范围筛选

每个统计模块都有独立的时间范围选择器：
- **SKU 统计**：全部时间 / 7天 / 30天 / 365天
- **订单统计**：7天 / 30天 / 365天

## 数据流程

```
用户切换 Tab / 时间范围
         ↓
触发对应的 loadStatistics()
         ↓
Promise.all 并行请求多个 API
         ↓
更新 state 并触发动画 (key++)
         ↓
React 重新渲染组件
         ↓
数字平滑过渡到新值 ✨
```

## 组件特点

### 统一的 Loading 管理

```typescript
const loading = skuLoading || orderLoading;
```

任何一个模块在加载时，整个页面都会显示 Loading 状态，确保用户体验一致。

### 独立的错误处理

```typescript
if (skuError || orderError) {
  return <Alert message="错误" description={skuError || orderError} />;
}
```

### 智能数据加载

```typescript
useEffect(() => {
  if (activeTab === 'sku') {
    loadSkuStatistics();  // 只在 SKU Tab 加载 SKU 数据
  } else if (activeTab === 'order') {
    loadOrderStatistics(); // 只在订单 Tab 加载订单数据
  }
}, [activeTab, ...]);
```

避免不必要的数据请求，提升性能。

### ECharts 图表配置

1. **进度环**（订单统计）
   ```typescript
   {
     series: [{
       type: 'gauge',
       startAngle: 90,
       endAngle: -270,
       progress: { show: true, roundCap: true },
       data: [{ value: 75.5, detail: { formatter: '{a|75.5%}' } }]
     }]
   }
   ```

2. **销售趋势图**
   ```typescript
   {
     tooltip: { trigger: 'axis' },
     legend: { data: ['销量', '营收'] },
     yAxis: [{ name: '销量' }, { name: '营收(¥)' }],
     series: [
       { name: '销量', type: 'line', smooth: true, yAxisIndex: 0 },
       { name: '营收', type: 'line', smooth: true, yAxisIndex: 1 }
     ]
   }
   ```

3. **实时流水图**
   ```typescript
   {
     legend: { data: ['销量', '订单数'] },
     series: [
       { name: '销量', type: 'line', areaStyle: {}, yAxisIndex: 0 },
       { name: '订单数', type: 'line', areaStyle: {}, yAxisIndex: 1 }
     ]
   }
   ```

## 注意事项

1. **依赖安装**：确保已安装 `echarts` 和 `echarts-for-react`
   ```bash
   pnpm add echarts echarts-for-react
   ```

2. **API 接口**：需要后端提供以下接口
   - SKU: `/sku/statistics/overview`, `/alerts/low-stock`, `/rankings/*`
   - 订单: `/purchaseStatistics/overview`, `/7days`, `/30days`, `/12months`

3. **性能优化**：
   - 使用 `useMemo` 缓存 ECharts 配置
   - 使用 `useCallback` 缓存数据加载函数
   - 按需加载数据（根据 activeTab）

4. **样式规范**：
   - 不使用自定义 CSS
   - 完全依赖 Ant Design 默认主题
   - 仅使用内联样式处理必要的布局

## 扩展建议

1. **导出功能**：添加 Excel/PDF 导出按钮
2. **定时刷新**：自动刷新最新数据
3. **更多图表**：饼图、柱状图、雷达图等
4. **数据下钻**：从统计卡片点击进入详细列表
5. **对比分析**：多时间段对比
6. **自定义目标值**：允许用户设置进度环的目标值
7. **权限控制**：根据不同角色显示不同的统计模块

## 维护者

- 开发时间：2026-04-13
- 技术栈版本：
  - React: v19.2.3
  - Ant Design: v6.1.1
  - ECharts: latest
  - TypeScript: v5.8.3
