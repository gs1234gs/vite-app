export interface CategorySaveVO{
    /** 分类主键ID */
    id?:number;
     /** 分类名称 */
    name:string;
    /** 分类编码（用于快速检索或编码管理） */
    code?:string;
    /** 排序字段（越小越靠前） */
    sortOrder?:number;
     /** 分类图标（URL） */
     iconUrl?:number;
     /** 状态,是否启用（1=启用，0=禁用） */
     status?:number;
     /** 是否为推荐分类（如首页展示）,(0 = 否，1表示是) */
     recommended?:number
}
//分类视图VO
export interface CategoryVO{
    /** 分类主键ID */
    id?:number;
     /** 分类名称 */
    name:string;
    /** 分类编码（用于快速检索或编码管理） */
    code?:string;
    /** 排序字段（越小越靠前） */
    sortOrder?:number;
     /** 分类图标（URL） */
     iconUrl?:number;
     /** 状态,是否启用（1=启用，0=禁用） */
     status?:number;
     /** 是否为推荐分类（如首页展示）,(0 = 否，1表示是) */
     recommended?:number
}

/**
 * 商品保存视图对象
 */
export interface ProductSaveVO {
  /** 商品id */
  id?: number | null; // Java 中是 BigInteger，TS 中通常用 number 表示；若可能为空，可设为 null 或 undefined

  /** 商品名称 */
  name?: string;

  /** 商品价格 */
  price?: string; // Java 中是 BigDecimal，TS 中一般用 number 表示（注意精度问题）

  /** 商品描述 */
  description?: string;

  /** 商品图片 */
  image?: string;

  /** 视频 */
  video?: string;

  /** 品牌 */
  brand?: string;

  /** 产地 */
  placeOfOrigin?: string;

  /** 商品等级 */
  level?: number; // Java 中是 short，TS 中用 number

  /** 库存 */
  stock?: number | null;

  /** 销量 */
  salesVolume?: number | null;

  /** 商品状态，0=下架，1=上架 */
  status?: number; // Java 中是 short，TS 中用 number

  /** 上架时间 */
  publishTime?: string; // LocalDateTime 通常序列化为 ISO 8601 字符串，如 "2025-11-12T09:30:00"

  /** 下架时间 */
  offlineTime?: string | null;

  /** 仓库id */
  warehouseId?: number[]; // List<BigInteger> → number[]

  /** 分类 id */
  categoryId?: number | null;

  /** 标签 id */
  tagId?: number | null;
}

/**
 * 商品视图对象（ProductVO）
 */
export interface ProductVO {
  /** 商品id */
  id?: number | null;

  /** 商品名称 */
  name?: string;

  /** 商品价格 */
  price?: string; // 建议用 string 避免精度问题（如 "99.99"）

  /** 商品描述 */
  description?: string;

  /** 商品图片 */
  image?: string;

  /** 视频 */
  video?: string;

  /** 品牌 */
  brand?: string;

  /** 产地 */
  placeOfOrigin?: string;

  /** 商品等级 */
  level?: number; // short → number

  /** 库存 */
  stock?: number | null;

  /** 销量 */
  salesVolume?: number | null;

  /** 商品状态，0=下架，1=上架 */
  status?: number; // short → number

  /** 上架时间 */
  publishTime?: string | null; // ISO 8601 格式，如 "2025-11-12T09:30:00"

  /** 下架时间 */
  offlineTime?: string | null;

  /** 仓库id */
  warehouseId?: number | null;

  /** 分类 id */
  categoryId?: number | null;

  /** 标签 id */
  tagId?: number | null;

  /** 创建开始时间 */
  startTime?: string | null;

  /** 创建结束时间 */
  endTime?: string | null;

  /** 创建时间 */
  createTime?: string;

  /** 更新时间 */
  updateTime?: string;

  /** 创建人 */
  creator?: number | null;

  /** 更新人 */
  updater?: number | null;
}

/**
 * 面向客户的商品视图对象（ProductCustomerVO）
 */
export interface ProductCustomerVO {
  /** 商品id */
  id?: number | null;

  /** 商品名称 */
  name?: string;

  /** 商品原价 */
  originalPrice?: string; // 建议用 string 避免浮点精度问题，如 "199.99"

  /** 商品优惠后价格 */
  discountPrice?: string; // 同上

  /** 商品描述 */
  description?: string;

  /** 商品图片 */
  image?: string;

  /** 视频 */
  video?: string;

  /** 品牌 */
  brand?: string;

  /** 产地 */
  placeOfOrigin?: string;

  /** 商品等级 */
  level?: number; // Java short → TS number

  /** 库存 */
  stock?: number | null;

  /** 销量 */
  salesVolume?: number | null;

  /** 商品状态，0=下架，1=上架,2=预发布 */
  status?: number; // 0 / 1 / 2

  /** 上架时间 */
  publishTime?: string | null; // ISO 8601 格式，例如 "2025-11-12T09:30:00"

  /** 下架时间 */
  offlineTime?: string | null;

  /** 标签 id */
  tagId?: number | null;

  /** sku id */
  skuId?: string | null;
}

/**
 * 标签保存视图对象（对应后端 TagSaveVO），所有字段均为可选
 */
export interface TagSaveVo {
  /** 标签ID */
  id?: number | null;

  /** 标签名称 */
  name?: string | null;

  /** 标签编码（英文或拼音，方便系统使用） */
  code?: string | null;

  /** 标签颜色（用于前端展示，例如 #FF9900） */
  color?: string | null;

  /** 状态（1=启用，0=禁用） */
  status?: number | null;

  /** 标签权重（用于推荐优先级或排序） */
  weight?: string | null;

  /** 排序值 */
  sort?: number | null;

  /** 材料组成 */
  composition?: string | null;

  /** 产地 */
  placeOfOrigin?: string | null;

  /** 重量 */
  productWeight?: string | null;

  /** 生产日期 */
  productionDate?: string | null; // ISO 8601 格式

  /** 保质期，单位：天 */
  shelfLife?: number | null;

  /** 标签描述 */
  description?: string | null;
}
export interface TagVO{
/** 标签ID */
  id?: number | null;

  /** 标签名称 */
  name?: string | null;

  /** 标签编码（英文或拼音，方便系统使用） */
  code?: string | null;

  /** 标签颜色（用于前端展示，例如 #FF9900） */
  color?: string | null;

  /** 状态（1=启用，0=禁用） */
  status?: number | null;

  /** 标签权重（用于推荐优先级或排序） */
  weight?: string | null;

  /** 排序值 */
  sort?: number | null;

  /** 材料组成 */
  composition?: string | null;

  /** 产地 */
  placeOfOrigin?: string | null;

  /** 重量 */
  productWeight?: string | null;

  /** 生产日期 */
  productionDate?: string | null; // ISO 8601 格式

  /** 保质期，单位：天 */
  shelfLife?: number | null;

  /** 标签描述 */
  description?: string | null;
}

/**
 * SKU 查询视图对象（对应后端 SKUFindVO）
 */
export interface SKUFindVo {
  /** SKU ID */
  id?: string | null;

  /** 名称 */
  name?: string | null;

  /** 商品编码（内部唯一编码） */
  skuCode?: string | null;

  /** 销售价 */
  price?: string | null;

  /** 成本价（可选） */
  costPrice?: string | null;

  /** 库存数量 */
  stock?: number | null;

  /** 销售量 */
  salesVolume?: number | null;

  /** 状态（0=下架，1=上架） */
  status?: number | null;

  /** 权重（用于推荐、排序） */
  weight?: string | null; // 建议后端对 weight 也加 @JsonSerialize

  /** 排序值 */
  sort?: number | null;

  /** 上架时间 */
  publishTime?: string | null; // ISO 8601 格式

  /** 下架时间 */
  offlineTime?: string | null; // ISO 8601 格式

  /** 商品详情 */
  detailContent?: string | null;
}

/**
 * SKU 视图对象（对应后端 SKUVO），所有字段均为可选
 */
export interface SKUVO {
  /** SKU ID */
  id?: string | null;

  /** 名称 */
  name?: string | null;

  /** 商品编码（内部唯一编码） */
  skuCode?: string | null;

  /** 销售价 */
  price?: string | null;

  /** 成本价（可选） */
  costPrice?: string | null;

  /** 库存数量 */
  stock?: number | null;

  /** 要添加的库存 */
  addStock?: number | null;

  /** 销售量 */
  salesVolume?: number | null;

  /** 状态（0=下架，1=上架） */
  status?: number | null;

  /** 权重（用于推荐、排序） */
  weight?: string | null;

  /** 排序值 */
  sort?: number | null;

  /** 上架时间 */
  publishTime?: string | null; // ISO 8601 格式，例如 "2025-11-12T10:30:00"

  /** 下架时间 */
  offlineTime?: string | null; // ISO 8601 格式

  /** 商品详情 */
  detailContent?: string | null;
}
//保存，修改
export interface SKUSaveVO {
  /** SKU ID */
  id?: string | null;

  /** 名称 */
  name?: string | null;

  /** 商品编码（内部唯一编码） */
  skuCode?: string | null;

  /** 销售价 */
  price?: string | null;

  /** 成本价（可选） */
  costPrice?: string | null;

  /** 库存数量 */
  stock?: number | null;

  /** 要添加的库存 */
  addStock?: number | null;

  /** 销售量 */
  salesVolume?: number | null;

  /** 状态（0=下架，1=上架） */
  status?: number | null;

  /** 权重（用于推荐、排序） */
  weight?: string | null;

  /** 排序值 */
  sort?: number | null;

  /** 上架时间 */
  publishTime?: string | null; // ISO 8601 格式，例如 "2025-11-12T10:30:00"

  /** 下架时间 */
  offlineTime?: string | null; // ISO 8601 格式

  /** 商品详情 */
  detailContent?: string | null;
}