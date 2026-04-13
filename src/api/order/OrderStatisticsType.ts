import type { BasePojo } from "../../type/BasePojo";

// 订单统计概览VO
export interface OrderStatisticsVO {
  // 总销量
  totalSales: number;
  // 总营收
  totalRevenue: string;
  // 总订单数
  totalOrders: number;

  // 时间维度统计
  last7Days?: OrderTimeStatisticsVO;
  last30Days?: OrderTimeStatisticsVO;
  last365Days?: OrderTimeStatisticsVO;

  // 趋势数据
  dailyTrends?: OrderDailyTrendVO[];
}

// 订单时间维度统计VO
export interface OrderTimeStatisticsVO {
  sales: number;
  revenue: string;
  orders: number;
}

// 订单每日趋势VO
export interface OrderDailyTrendVO {
  date: string;
  sales: number;
  revenue: string;
  orders: number;
}

// 近7天订单统计VO（水波图专用）
export interface OrderStatistics7DaysVO {
  totalSales: number;
  totalRevenue: string;
  totalOrders: number;
  dailyTrends: Order7DaysDailyTrendVO[];
}

export interface Order7DaysDailyTrendVO {
  date: string;
  sales: number;
  revenue: string;
  orders: number;
}

// 近30天订单统计VO（水波图专用）
export interface OrderStatistics30DaysVO {
  totalSales: number;
  totalRevenue: string;
  totalOrders: number;
  dailyTrends: Order30DaysDailyTrendVO[];
}

export interface Order30DaysDailyTrendVO {
  date: string;
  sales: number;
  revenue: string;
  orders: number;
}

// 近12个月订单统计VO（水波图专用）
export interface OrderStatistics12MonthsVO {
  totalSales: number;
  totalRevenue: string;
  totalOrders: number;
  monthlyTrends: Order12MonthsMonthlyTrendVO[];
}

export interface Order12MonthsMonthlyTrendVO {
  month: string; // 格式为 "YYYY-MM"
  sales: number;
  revenue: string;
  orders: number;
}

// 下单趋势热力图VO
export interface HourlyHeatmapVO {
  rangeType: string; // 范围类型: 1d, 7d, 30d, 12m
  unit: string;      // 数据单位: "hour", "day", "month"
  data: TimeData[];
}

export interface TimeData {
  timeKey: string;  // 键：可能是 "0-23", "2023-10-01", 或 "10" (月)
  count: number;    // 数量
}
