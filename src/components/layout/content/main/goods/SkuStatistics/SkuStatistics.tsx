import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Select,
  Tabs,
  Table,
  Tag,
  Space,
  Statistic,
  Alert,
  Skeleton,
  Avatar,
} from 'antd';
import {
  RiseOutlined,
  FallOutlined,
  ShoppingOutlined,
  DollarOutlined,
  FileTextOutlined,
  LineChartOutlined,
  DatabaseOutlined,
  WarningOutlined,
  FireOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import useSkuStatistics from '@/stores/goods/SKUStatistics';
import useOrderStatistics from '@/stores/order/OrderStatistics';
import type { SkuStatisticsVO, SKURankingVO } from '@/api/goods/sku/SKUStatisticsType';
import type { 
  OrderStatisticsVO,
  OrderStatistics7DaysVO,
  OrderStatistics30DaysVO,
  OrderStatistics12MonthsVO,
  HourlyHeatmapVO
} from '@/api/order/OrderStatisticsType';

const { Title, Text } = Typography;
const { Option } = Select;

// ==================== SKU 排行榜表格组件 ====================
const SkuRankingTable = ({
  data,
  type,
}: {
  data: SKURankingVO[];
  type: 'top' | 'slow' | 'alert';
}) => {

  if (!data || data.length === 0) {
    return (
      <Alert message="暂无数据" type="info" showIcon style={{ marginTop: 16 }} />
    );
  }

  const columns = [
    {
      title: '排名',
      dataIndex: 'rank',
      key: 'rank',
      width: 80,
      align: 'center' as const,
      render: (_: any, __: any, index: number) => {
        const rank = index + 1;
        let color = '';
        if (rank === 1) color = '#FFD700';
        else if (rank === 2) color = '#C0C0C0';
        else if (rank === 3) color = '#CD7F32';
        
        return (
          <Tag color={color || 'default'} style={{ fontWeight: 'bold', minWidth: 30, textAlign: 'center' }}>
            {rank}
          </Tag>
        );
      },
    },
    {
      title: 'SKU名称',
      dataIndex: 'name',
      key: 'name',
      render: (_: string, record: SKURankingVO) => (
        <Space>
          {record.picList && record.picList.length > 0 && (
            <Avatar src={record.picList[0]} size="small" shape="square" />
          )}
          <div>
            <div>{record.name}</div>
            {record.productName && (
              <Text type="secondary" style={{ fontSize: 12 }}>{record.productName}</Text>
            )}
          </div>
        </Space>
      ),
    },
    {
      title: '编码',
      dataIndex: 'skuCode',
      key: 'skuCode',
      width: 150,
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      width: 120,
      align: 'right' as const,
      render: (price: string) => `¥${parseFloat(price || '0').toFixed(2)}`,
    },
    {
      title: '库存',
      dataIndex: 'stock',
      key: 'stock',
      width: 100,
      align: 'right' as const,
      render: (stock: number) => {
        let color = 'success';
        if (stock <= 10) color = 'error';
        else if (stock <= 50) color = 'warning';
        return <Tag color={color}>{stock}</Tag>;
      },
    },
    {
      title: '销量',
      dataIndex: 'salesVolume',
      key: 'salesVolume',
      width: 120,
      align: 'right' as const,
      render: (volume: number) => volume?.toLocaleString(),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      align: 'center' as const,
      render: (status: number) => (
        <Tag color={status === 0 ? 'success' : 'default'}>
          {status === 0 ? '上架' : '下架'}
        </Tag>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="id"
      pagination={false}
      size="small"
      style={{ marginTop: 16 }}
    />
  );
};

// ==================== ECharts 热力图配置生成函数 ====================
const generateHeatmapOption = (
  heatmapData: HourlyHeatmapVO | null,
  title: string
) => {
  if (!heatmapData || !heatmapData.data || heatmapData.data.length === 0) {
    return {};
  }

  // 根据 unit 字段动态生成配置
  const { unit, data } = heatmapData;

  // 找出最大值用于颜色映射
  const maxValue = Math.max(...data.map((item) => item.count), 1);

  // 准备 xAxis 数据和 series 数据
  let xAxisData: string[] = [];
  let seriesData: number[][] = [];
  let tooltipFormatter: (params: any) => string = () => '';
  let axisLabelInterval: number = 2;

  if (unit === 'hour') {
    // 小时维度：0-23
    xAxisData = Array.from({ length: 24 }, (_, i) => `${i}:00`);
    seriesData = data.map((item) => [parseInt(item.timeKey), 0, item.count]);
    tooltipFormatter = (params: any) => {
      const hour = params.data[0];
      const count = params.data[2];
      return `${hour}:00 - ${hour}:59<br/>订单数: ${count}`;
    };
    axisLabelInterval = 2; // 每2小时显示一个标签
  } else if (unit === 'day') {
    // 天维度：显示日期
    xAxisData = data.map((item) => item.timeKey);
    seriesData = data.map((item, index) => [index, 0, item.count]);
    tooltipFormatter = (params: any) => {
      const date = params.data[0];
      const count = params.data[2];
      return `日期: ${xAxisData[date]}<br/>订单数: ${count}`;
    };
    // 根据数据量调整间隔
    axisLabelInterval = data.length > 15 ? Math.floor(data.length / 10) : 1;
  } else if (unit === 'month') {
    // 月维度：01-12
    const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    xAxisData = data.map((item) => monthNames[parseInt(item.timeKey) - 1] || item.timeKey);
    seriesData = data.map((item, index) => [index, 0, item.count]);
    tooltipFormatter = (params: any) => {
      const monthIndex = params.data[0];
      const count = params.data[2];
      return `月份: ${xAxisData[monthIndex]}<br/>订单数: ${count}`;
    };
    axisLabelInterval = 0; // 显示所有月份
  }

  return {
    tooltip: {
      position: 'top',
      formatter: tooltipFormatter,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: unit === 'day' ? '15%' : '3%',
      top: '15%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: xAxisData,
      splitArea: {
        show: true,
      },
      axisLabel: {
        interval: axisLabelInterval,
        fontSize: 11,
        rotate: unit === 'day' ? 45 : 0, // 日期过长时旋转标签
      },
    },
    yAxis: {
      type: 'category',
      data: ['订单时段'],
      splitArea: {
        show: true,
      },
    },
    visualMap: {
      min: 0,
      max: maxValue,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: unit === 'day' ? '0%' : '0%',
      inRange: {
        color: ['#f0f9ff', '#bae6fd', '#7dd3fc', '#38bdf8', '#0ea5e9', '#0284c7'],
      },
      textStyle: {
        fontSize: 11,
      },
    },
    series: [
      {
        name: '订单热力图',
        type: 'heatmap',
        data: seriesData,
        label: {
          show: true,
          formatter: (params: any) => {
            return params.data[2];
          },
          fontSize: 10,
          color: '#333',
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  };
};

// ==================== 主组件 ====================
const SkuStatistics = () => {
  // SKU 统计 Hooks
  const {
    loading: skuLoading,
    error: skuError,
    getOverviewApi: getSkuOverviewApi,
    getLowStockAlertsApi,
    getTopSellingRankingApi,
    getSlowMovingRankingApi,
  } = useSkuStatistics();

  // 订单统计 Hooks
  const {
    loading: orderLoading,
    error: orderError,
    getOrderOverviewApi,
    getOrderStatistics7DaysApi,
    getOrderStatistics30DaysApi,
    getOrderStatistics12MonthsApi,
    getOrderTrendApi,
  } = useOrderStatistics();

  // 整体 loading 状态
  const loading = skuLoading || orderLoading;

  // Tab 状态
  const [activeTab, setActiveTab] = useState<string>('overview');

  // SKU 统计状态
  const [skuTimeRange, setSkuTimeRange] = useState<string>('all');
  const [skuOverview, setSkuOverview] = useState<SkuStatisticsVO | null>(null);
  const [lowStockAlerts, setLowStockAlerts] = useState<SKURankingVO[]>([]);
  const [topSelling, setTopSelling] = useState<SKURankingVO[]>([]);
  const [slowMoving, setSlowMoving] = useState<SKURankingVO[]>([]);

  // 订单统计状态
  const [orderTimeRange, setOrderTimeRange] = useState<string>('7d');
  const [orderOverview, setOrderOverview] = useState<OrderStatisticsVO | null>(null);
  const [heatmapData, setHeatmapData] = useState<HourlyHeatmapVO | null>(null);
  const [heatmapRangeType, setHeatmapRangeType] = useState<string>('7d');
  const [key, setKey] = useState<number>(0); // 用于触发动画

  // ==================== SKU 数据加载 ====================
  const loadSkuStatistics = useCallback(async () => {
    const [overviewData, alertsData, topData, slowData] = await Promise.all([
      getSkuOverviewApi(skuTimeRange),
      getLowStockAlertsApi(10, 10),
      getTopSellingRankingApi(10),
      getSlowMovingRankingApi(30, 10),
    ]);

    if (overviewData) {
      setSkuOverview(overviewData);
    }
    if (alertsData) setLowStockAlerts(alertsData);
    if (topData) setTopSelling(topData);
    if (slowData) setSlowMoving(slowData);

    setKey((prev) => prev + 1);
  }, [skuTimeRange, getSkuOverviewApi, getLowStockAlertsApi, getTopSellingRankingApi, getSlowMovingRankingApi]);

  // ==================== 订单数据加载 ====================
  const loadOrderStatistics = useCallback(async () => {
    const [overviewData, trendData] = await Promise.all([
      getOrderOverviewApi(orderTimeRange),
      getOrderTrendApi(heatmapRangeType),
    ]);

    if (overviewData) {
      setOrderOverview(overviewData);
      setKey((prev) => prev + 1);
    }
    if (trendData) {
      setHeatmapData(trendData);
    }
  }, [orderTimeRange, heatmapRangeType, getOrderOverviewApi, getOrderTrendApi]);

  // 初始加载和数据刷新
  useEffect(() => {
    // 概览 Tab：同时加载 SKU 和订单数据
    if (activeTab === 'overview') {
      loadSkuStatistics();
      loadOrderStatistics();
    } 
    // SKU Tab：只加载 SKU 数据
    else if (activeTab === 'sku') {
      loadSkuStatistics();
    } 
    // 订单 Tab：只加载订单数据
    else if (activeTab === 'order') {
      loadOrderStatistics();
    }
  }, [activeTab, loadSkuStatistics, loadOrderStatistics]);

  // 自动刷新机制：每 60 秒自动刷新当前 Tab 的数据
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (activeTab === 'overview') {
        loadSkuStatistics();
        loadOrderStatistics();
      } else if (activeTab === 'sku') {
        loadSkuStatistics();
      } else if (activeTab === 'order') {
        loadOrderStatistics();
      }
    }, 60000); // 60 秒

    // 组件卸载时清除定时器
    return () => clearInterval(intervalId);
  }, [activeTab, loadSkuStatistics, loadOrderStatistics]);

  // 处理时间范围变化
  const handleSkuTimeRangeChange = (value: string) => {
    setSkuTimeRange(value);
  };

  const handleOrderTimeRangeChange = (value: string) => {
    setOrderTimeRange(value);
  };

  const handleHeatmapRangeTypeChange = (value: string) => {
    setHeatmapRangeType(value);
  };

  // ==================== ECharts 图表配置 ====================
  // 订单销售趋势图
  const orderTrendChartOption = useMemo(() => {
    const trends = orderOverview?.dailyTrends;
    if (!trends || trends.length === 0) return {};

    const dates = trends.map((item) => item.date);
    const salesData = trends.map((item) => item.sales || 0);
    const revenueData = trends.map((item) => parseFloat(item.revenue || '0'));

    return {
      tooltip: { trigger: 'axis', axisPointer: { type: 'cross' } },
      legend: { data: ['销量', '营收'] },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', boundaryGap: false, data: dates },
      yAxis: [
        { type: 'value', name: '销量' },
        { type: 'value', name: '营收(¥)' },
      ],
      series: [
        { name: '销量', type: 'line', smooth: true, yAxisIndex: 0, data: salesData },
        { name: '营收', type: 'line', smooth: true, yAxisIndex: 1, data: revenueData },
      ],
    };
  }, [orderOverview]);

  // 订单实时流水图
  const orderRealtimeChartOption = useMemo(() => {
    const trends = orderOverview?.dailyTrends;
    if (!trends || trends.length === 0) return {};

    const dates = trends.map((item) => item.date);
    const salesData = trends.map((item) => item.sales || 0);
    const ordersData = trends.map((item) => item.orders || 0);

    return {
      tooltip: { trigger: 'axis', axisPointer: { type: 'cross' } },
      legend: { data: ['销量', '订单数'] },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', boundaryGap: false, data: dates },
      yAxis: [
        { type: 'value', name: '销量' },
        { type: 'value', name: '订单数' },
      ],
      series: [
        { name: '销量', type: 'line', smooth: true, areaStyle: {}, yAxisIndex: 0, data: salesData },
        { name: '订单数', type: 'line', smooth: true, areaStyle: {}, yAxisIndex: 1, data: ordersData },
      ],
    };
  }, [orderOverview]);

  // 下单趋势热力图配置
  const heatmapOption = useMemo(() => {
    return generateHeatmapOption(heatmapData, '下单时段分布');
  }, [heatmapData, heatmapData?.unit]);

  // ==================== 错误处理 ====================
  if (loading && !skuOverview && !orderOverview) {
    return (
      <div style={{ padding: 24 }}>
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    );
  }

  if (skuError || orderError) {
    return (
      <div style={{ padding: 24 }}>
        <Alert 
          message="错误" 
          description={skuError || orderError} 
          type="error" 
          showIcon 
        />
      </div>
    );
  }

  // ==================== 渲染 ====================
  return (
    <div style={{ padding: 24 }}>
      {/* 主 Tab 切换 */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: 'overview',
            label: (
              <span>
                <LineChartOutlined />
                概览
              </span>
            ),
            children: (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <Title level={2} style={{ margin: 0 }}>统计概览</Title>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    <ClockCircleOutlined style={{ marginRight: 4 }} />
                    数据每 60 秒自动刷新
                  </Text>
                </div>
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12}>
                    <Card title="SKU 统计">
                      {skuOverview ? (
                        <Row gutter={[16, 16]}>
                          <Col span={12}>
                            <Statistic
                              key={`sku-sales-${key}`}
                              title="总销量"
                              value={skuOverview.totalSales}
                              prefix={<ShoppingOutlined />}
                            />
                          </Col>
                          <Col span={12}>
                            <Statistic
                              key={`sku-stock-${key}`}
                              title="总库存"
                              value={skuOverview.totalStock}
                              prefix={<DatabaseOutlined />}
                            />
                          </Col>
                          <Col span={12}>
                            <Statistic
                              key={`sku-low-${key}`}
                              title="低库存预警"
                              value={skuOverview.totalLow}
                              prefix={<WarningOutlined />}
                              valueStyle={{ color: '#ff4d4f' }}
                            />
                          </Col>
                          <Col span={12}>
                            <Statistic
                              key={`sku-revenue-${key}`}
                              title="总营收"
                              value={parseFloat(skuOverview.totalRevenue || '0')}
                              precision={2}
                              prefix={<DollarOutlined />}
                            />
                          </Col>
                        </Row>
                      ) : (
                        <Text type="secondary">加载中...</Text>
                      )}
                    </Card>
                  </Col>
                  <Col xs={24} md={12}>
                    <Card title="订单统计">
                      {orderOverview ? (
                        <Row gutter={[16, 16]}>
                          <Col span={12}>
                            <Statistic
                              key={`order-sales-${key}`}
                              title="总销量"
                              value={orderOverview.totalSales}
                              prefix={<ShoppingOutlined />}
                            />
                          </Col>
                          <Col span={12}>
                            <Statistic
                              key={`order-count-${key}`}
                              title="总订单数"
                              value={orderOverview.totalOrders}
                              prefix={<FileTextOutlined />}
                            />
                          </Col>
                          <Col span={24}>
                            <Statistic
                              key={`order-revenue-${key}`}
                              title="总营收"
                              value={parseFloat(orderOverview.totalRevenue || '0')}
                              precision={2}
                              prefix={<DollarOutlined />}
                            />
                          </Col>
                        </Row>
                      ) : (
                        <Text type="secondary">加载中...</Text>
                      )}
                    </Card>
                  </Col>
                </Row>
              </div>
            ),
          },
          {
            key: 'order',
            label: (
              <span>
                <FileTextOutlined />
                订单统计
              </span>
            ),
            children: (
              <div>
                {/* 标题和筛选器 */}
                <div style={{ marginBottom: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                    <div>
                      <Title level={2} style={{ margin: 0 }}>采购订单统计报表</Title>
                      <Text type="secondary">实时监控采购订单销售、营收和订单状况</Text>
                      <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 4 }}>
                        <ClockCircleOutlined style={{ marginRight: 4 }} />
                        数据每 60 秒自动刷新
                      </Text>
                    </div>
                    <Space>
                      <Select
                        value={orderTimeRange}
                        onChange={handleOrderTimeRangeChange}
                        style={{ width: 150 }}
                        placeholder="统计周期"
                        disabled={loading}
                      >
                        <Option value="7d">最近7天</Option>
                        <Option value="30d">最近30天</Option>
                        <Option value="365d">最近365天</Option>
                      </Select>
                      <Select
                        value={heatmapRangeType}
                        onChange={handleHeatmapRangeTypeChange}
                        style={{ width: 150 }}
                        placeholder="热力图周期"
                        disabled={loading}
                      >
                        <Option value="1d">近1天（按小时）</Option>
                        <Option value="7d">近7天（按天）</Option>
                        <Option value="30d">近30天（按天）</Option>
                        <Option value="12m">近12个月（按月）</Option>
                      </Select>
                    </Space>
                  </div>
                </div>

                {/* 下单趋势热力图 */}
                <Card 
                  loading={loading} 
                  title={
                    <Space>
                      <ClockCircleOutlined />
                      <span>
                        下单趋势热力图
                        {heatmapData?.unit && (
                          <Text type="secondary" style={{ marginLeft: 8, fontSize: 12 }}>
                            （按
                            {heatmapData.unit === 'hour' ? '小时' : 
                             heatmapData.unit === 'day' ? '天' : '月'}
                            统计）
                          </Text>
                        )}
                      </span>
                    </Space>
                  }
                  style={{ marginBottom: 24 }}
                >
                  <ReactECharts 
                    option={heatmapOption} 
                    style={{ height: 200 }}
                    opts={{ renderer: 'canvas' }}
                  />
                </Card>

                {/* 统计卡片 */}
                {orderOverview && (
                  <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                    <Col xs={24} sm={12} md={8}>
                      <Card loading={loading}>
                        <Statistic
                          key={`totalSales-${key}`}
                          title="总销量"
                          value={orderOverview.totalSales}
                          prefix={<ShoppingOutlined />}
                          valueStyle={{ transition: 'all 0.3s ease' }}
                          suffix={
                            orderOverview.last7Days && orderOverview.last30Days ? (
                              <span style={{ fontSize: 14, marginLeft: 8 }}>
                                {((orderOverview.last7Days.sales - orderOverview.last30Days.sales) / (orderOverview.last30Days.sales || 1)) * 100 >= 0 ? (
                                  <RiseOutlined style={{ color: '#52c41a' }} />
                                ) : (
                                  <FallOutlined style={{ color: '#ff4d4f' }} />
                                )}
                              </span>
                            ) : null
                          }
                        />
                      </Card>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                      <Card loading={loading}>
                        <Statistic
                          key={`totalOrders-${key}`}
                          title="总订单数"
                          value={orderOverview.totalOrders}
                          prefix={<FileTextOutlined />}
                          valueStyle={{ transition: 'all 0.3s ease' }}
                          suffix={
                            orderOverview.last7Days && orderOverview.last30Days ? (
                              <span style={{ fontSize: 14, marginLeft: 8 }}>
                                {((orderOverview.last7Days.orders - orderOverview.last30Days.orders) / (orderOverview.last30Days.orders || 1)) * 100 >= 0 ? (
                                  <RiseOutlined style={{ color: '#52c41a' }} />
                                ) : (
                                  <FallOutlined style={{ color: '#ff4d4f' }} />
                                )}
                              </span>
                            ) : null
                          }
                        />
                      </Card>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                      <Card loading={loading}>
                        <Statistic
                          key={`totalRevenue-${key}`}
                          title="总营收"
                          value={parseFloat(orderOverview.totalRevenue || '0')}
                          precision={2}
                          prefix={<DollarOutlined />}
                          valueStyle={{ transition: 'all 0.3s ease' }}
                          suffix={
                            orderOverview.last7Days && orderOverview.last30Days ? (
                              <span style={{ fontSize: 14, marginLeft: 8 }}>
                                {((parseFloat(orderOverview.last7Days.revenue) - parseFloat(orderOverview.last30Days.revenue || '0')) / (parseFloat(orderOverview.last30Days.revenue || '1'))) * 100 >= 0 ? (
                                  <RiseOutlined style={{ color: '#52c41a' }} />
                                ) : (
                                  <FallOutlined style={{ color: '#ff4d4f' }} />
                                )}
                              </span>
                            ) : null
                          }
                        />
                      </Card>
                    </Col>
                  </Row>
                )}

                {/* ECharts 图表 */}
                <Card>
                  <Tabs
                    defaultActiveKey="trend"
                    items={[
                      {
                        key: 'trend',
                        label: (
                          <span>
                            <LineChartOutlined />
                            销售趋势
                          </span>
                        ),
                        children: (
                          <div>
                            <Title level={5}>销售趋势分析</Title>
                            <ReactECharts option={orderTrendChartOption} style={{ height: 400 }} />
                          </div>
                        ),
                      },
                      {
                        key: 'realtime',
                        label: (
                          <span>
                            <LineChartOutlined />
                            实时流水
                          </span>
                        ),
                        children: (
                          <div>
                            <Title level={5}>实时流水监控</Title>
                            <ReactECharts option={orderRealtimeChartOption} style={{ height: 400 }} />
                          </div>
                        ),
                      },
                    ]}
                  />
                </Card>
              </div>
            ),
          },
          {
            key: 'sku',
            label: (
              <span>
                <ShoppingOutlined />
                SKU 统计
              </span>
            ),
            children: (
              <div>
                {/* 标题和筛选器 */}
                <div style={{ marginBottom: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                    <div>
                      <Title level={2} style={{ margin: 0 }}>SKU 统计报表</Title>
                      <Text type="secondary">实时监控SKU销售、库存和经营状况（时间维度统计请查看采购订单统计）</Text>
                      <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 4 }}>
                        <ClockCircleOutlined style={{ marginRight: 4 }} />
                        数据每 60 秒自动刷新
                      </Text>
                    </div>
                    <Space>
                      <Select
                        value={skuTimeRange}
                        onChange={handleSkuTimeRangeChange}
                        style={{ width: 150 }}
                        placeholder="时间范围"
                        disabled={loading}
                      >
                        <Option value="all">全部时间</Option>
                        <Option value="7d">最近7天</Option>
                        <Option value="30d">最近30天</Option>
                        <Option value="365d">最近365天</Option>
                      </Select>
                    </Space>
                  </div>
                </div>

                {/* 统计卡片 */}
                {skuOverview && (
                  <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                    <Col xs={24} sm={12} md={6}>
                      <Card loading={loading}>
                        <Statistic
                          key={`totalSales-${key}`}
                          title="总销量"
                          value={skuOverview.totalSales}
                          prefix={<ShoppingOutlined />}
                          valueStyle={{ transition: 'all 0.3s ease' }}
                        />
                      </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                      <Card loading={loading}>
                        <Statistic
                          key={`totalStock-${key}`}
                          title="总库存"
                          value={skuOverview.totalStock}
                          prefix={<DatabaseOutlined />}
                          valueStyle={{ transition: 'all 0.3s ease' }}
                        />
                      </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                      <Card loading={loading}>
                        <Statistic
                          key={`totalLow-${key}`}
                          title="低库存预警"
                          value={skuOverview.totalLow}
                          prefix={<WarningOutlined />}
                          valueStyle={{ color: '#ff4d4f', transition: 'all 0.3s ease' }}
                        />
                      </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                      <Card loading={loading}>
                        <Statistic
                          key={`totalRevenue-${key}`}
                          title="总营收"
                          value={parseFloat(skuOverview.totalRevenue || '0')}
                          precision={2}
                          prefix={<DollarOutlined />}
                          valueStyle={{ transition: 'all 0.3s ease' }}
                        />
                      </Card>
                    </Col>
                  </Row>
                )}

                {/* 排行榜 */}
                <Card>
                  <Tabs
                    defaultActiveKey="top"
                    items={[
                      {
                        key: 'top',
                        label: (
                          <span>
                            <FireOutlined />
                            热销排行
                          </span>
                        ),
                        children: (
                          <div>
                            <Title level={5}>热销商品 TOP 10</Title>
                            <SkuRankingTable data={topSelling} type="top" />
                          </div>
                        ),
                      },
                      {
                        key: 'slow',
                        label: (
                          <span>
                            <FallOutlined />
                            滞销排行
                          </span>
                        ),
                        children: (
                          <div>
                            <Title level={5}>滞销商品 TOP 10（30天无销售）</Title>
                            <SkuRankingTable data={slowMoving} type="slow" />
                          </div>
                        ),
                      },
                      {
                        key: 'alert',
                        label: (
                          <span>
                            <WarningOutlined />
                            库存预警
                          </span>
                        ),
                        children: (
                          <div>
                            <Title level={5}>低库存预警（库存 ≤ 10）</Title>
                            <SkuRankingTable data={lowStockAlerts} type="alert" />
                          </div>
                        ),
                      },
                    ]}
                  />
                </Card>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
};

export default SkuStatistics;
