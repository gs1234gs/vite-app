export interface ProductApiVO {
  id: string;                     // 对应 BigInteger，通常转为字符串
  name: string;                   // 商品名称
  price: string;                  // BigDecimal 转为字符串（因使用 ToStringSerializer）
  description: string;            // 商品描述
  image: string;                  // 商品图片 URL
  video: string;                  // 视频 URL
  brand: string;                  // 品牌
  placeOfOrigin: string;          // 产地
  level: number;                  // short → number
  stock: number | null;           // Integer 可能为 null
  salesVolume: number | null;     // 销量，可能为 null
  status: number;                 // 1=下架，0=上架
  publishTime: string;            // LocalDateTime → ISO 字符串
  offlineTime: string | null;     // 可能为空
  startTime: string | null;       // 创建开始时间
  endTime: string | null;         // 创建结束时间
}

export interface CategoryApiVO {
    id: string;           // 对应 BigInteger，通常转为字符串表示
    name: string;         // 分类名称
    level: number;        // 分类层级（如 1=一级分类，2=二级分类）
    code: string;         // 分类编码
    description: string;  // 分类描述
    sortOrder: number;    // 排序字段，数值越小排序越靠前
    iconUrl: string;      // 分类图标URL
    status: number;       // 状态,是否禁用（0=启用，1=禁用）
    recommended: number;  // 是否为推荐分类（0 = 否，1表示是）
}


  export interface SKUApiVO {
  id: string;                // BigInteger → string
  name: string;              // 名称
  skuCode: string;           // 商品编码（内部唯一）
  price: string;             // 销售价（BigDecimal → string）
  costPrice: string | null;  // 成本价（可选，可能为 null）
  stock: number | null;      // 库存数量
  addStock: number | null;   // 要添加的库存（通常用于请求体，非响应）
  salesVolume: number | null; // 销售量
  status: number;            // 状态（0=上架，1=下架）
  weight: string | null;     // 权重（BigDecimal → string，可选）
  sort: number | null;       // 排序值
  publishTime: string | null; // 上架时间（ISO 8601 字符串）
  offlineTime: string | null; // 下架时间
  detailContent: string;     // 商品详情（HTML 或文本）
  productId: string;         // 商品ID（BigInteger → string）
}


export interface TagApiVO {
  id: string;                     // BigInteger → string（推荐）
  name: string;                   // 标签名称
  code: string;                   // 标签编码（英文/拼音）
  color: string;                  // 颜色，如 "#FF9900"
  status: number;                 // 状态：0=启用，1=禁用
  weight: number | null;          // 权重（若后端用 ToStringSerializer，则改为 string | null）
  sort: number | null;            // 排序值
  composition: string;            // 材料组成
  placeOfOrigin: string;          // 产地
  productWeight: number | null;   // 重量（单位需约定，如克）；若高精度需求，建议 string
  productionDate: string | null;  // 生产日期，ISO 8601 格式字符串
  shelfLife: number | null;       // 保质期（单位：天）
  description: string;            // 标签描述
}