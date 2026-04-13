// 模拟数据
export const defaultDiscounts: Discount[] = [
  {
    id: '1',
    name: '春季大促全场8折',
    type: 'percentage',
    value: 20,
    minAmount: 100,
    maxDiscount: 500,
    description: '春季大促活动，全场商品8折优惠',
    targetType: 'all',
    targetIds: [],
    startTime: '2024-03-01 00:00:00',
    endTime: '2024-03-31 23:59:59',
    status: 'active',
    usageLimit: 1000,
    usedCount: 456,
    totalDiscount: 23456,
    createdAt: '2024-02-15'
  },
  {
    id: '2',
    name: '新人专享优惠券',
    type: 'coupon',
    value: 50,
    minAmount: 200,
    description: '新用户注册即可领取的优惠券',
    targetType: 'userGroup',
    targetIds: ['new_users'],
    startTime: '2024-01-01 00:00:00',
    endTime: '2024-12-31 23:59:59',
    status: 'active',
    usageLimit: 5000,
    usedCount: 1234,
    totalDiscount: 61700,
    createdAt: '2024-01-01',
    code: 'WELCOME50'
  },
  {
    id: '3',
    name: '电子产品满减',
    type: 'fixed',
    value: 100,
    minAmount: 1000,
    description: '电子产品满1000减100',
    targetType: 'category',
    targetIds: ['electronics'],
    startTime: '2024-03-15 00:00:00',
    endTime: '2024-04-15 23:59:59',
    status: 'scheduled',
    usageLimit: 500,
    usedCount: 0,
    totalDiscount: 0,
    createdAt: '2024-03-10'
  },
  {
    id: '4',
    name: '买一送一活动',
    type: 'bundle',
    value: 50,
    description: '指定商品买一送一',
    targetType: 'product',
    targetIds: ['product1', 'product2'],
    startTime: '2024-02-01 00:00:00',
    endTime: '2024-02-28 23:59:59',
    status: 'expired',
    usageLimit: 200,
    usedCount: 189,
    totalDiscount: 9450,
    createdAt: '2024-01-25'
  },
  {
    id: '5',
    name: '会员专属9折',
    type: 'percentage',
    value: 10,
    description: '会员专享全场9折优惠',
    targetType: 'userGroup',
    targetIds: ['vip_members'],
    startTime: '2024-03-01 00:00:00',
    endTime: '2024-12-31 23:59:59',
    status: 'active',
    usedCount: 789,
    totalDiscount: 39450,
    createdAt: '2024-02-20'
  },
  {
    id: '6',
    name: '周末特惠',
    type: 'percentage',
    value: 15,
    minAmount: 50,
    description: '周末购物享85折优惠',
    targetType: 'all',
    targetIds: [],
    startTime: '2024-03-23 00:00:00',
    endTime: '2024-03-24 23:59:59',
    status: 'scheduled',
    usageLimit: 1000,
    usedCount: 0,
    totalDiscount: 0,
    createdAt: '2024-03-20'
  },
  {
    id: '7',
    name: '清仓大甩卖',
    type: 'fixed',
    value: 30,
    minAmount: 150,
    description: '清仓商品满150减30',
    targetType: 'category',
    targetIds: ['clearance'],
    startTime: '2024-01-15 00:00:00',
    endTime: '2024-02-15 23:59:59',
    status: 'expired',
    usageLimit: 300,
    usedCount: 267,
    totalDiscount: 8010,
    createdAt: '2024-01-10'
  },
  {
    id: '8',
    name: '生日专属优惠',
    type: 'percentage',
    value: 25,
    description: '生日当月享75折优惠',
    targetType: 'userGroup',
    targetIds: ['birthday_users'],
    startTime: '2024-01-01 00:00:00',
    endTime: '2024-12-31 23:59:59',
    status: 'active',
    usedCount: 345,
    totalDiscount: 17250,
    createdAt: '2024-01-01'
  }
];

// 类型定义
export interface Discount {
  id: string;
  name: string;
  type: 'percentage' | 'fixed' | 'coupon' | 'bundle';
  value: number;
  minAmount?: number;
  maxDiscount?: number;
  description: string;
  targetType: 'all' | 'category' | 'product' | 'userGroup';
  targetIds: string[];
  startTime: string;
  endTime: string;
  status: 'active' | 'inactive' | 'scheduled' | 'expired';
  usageLimit?: number;
  usedCount: number;
  totalDiscount: number;
  createdAt: string;
  code?: string;
}

export interface DiscountDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (discountData: Omit<Discount, 'id' | 'usedCount' | 'totalDiscount' | 'createdAt'>) => void;
  discount: Discount | null;
}

export interface DiscountStats {
  total: number;
  active: number;
  scheduled: number;
  expired: number;
  totalUsage: number;
  totalSavings: number;
}

export interface GlassCardProps {
  children: React.ReactNode;
  sx?: any;
}