import sendRequest from "@/api/axios";
import { GOODS_API_PREFIX } from "@/api/prefix/PrefixApi";
import { GET_METHOD, POST_METHOD } from "@/api/type/ConstRequestMethods";
import type { RequestCursorPage } from "@/api/type/PageType";
import type { ResultT, CursorPageResult } from "@/api/type/ResultType";
import type {
  ProductSearchSaveVO,
  ProductCustomerVO,
  ProductCustomerDetailVO
} from "./RecommendProductType";

// 推荐商品 API 前缀
const RECOMMEND_PRODUCT_PREFIX = `${GOODS_API_PREFIX}/recommendProduct`;

/**
 * 搜索商品（游标分页）
 */
const searchProduct = (
  data: RequestCursorPage<ProductSearchSaveVO>
): Promise<ResultT<CursorPageResult<ProductCustomerVO>>> => {
  return sendRequest<ResultT<CursorPageResult<ProductCustomerVO>>>({
    url: `${RECOMMEND_PRODUCT_PREFIX}/search`,
    method: POST_METHOD,
    data
  })
    .then(res => res.data)
    .catch(err => {
      throw err;
    });
};

/**
 * 推荐商品列表（首页推荐）
 */
const recommend = (): Promise<ResultT<ProductCustomerVO[]>> => {
  return sendRequest<ResultT<ProductCustomerVO[]>>({
    url: `${RECOMMEND_PRODUCT_PREFIX}/recommend`,
    method: GET_METHOD
  })
    .then(res => res.data)
    .catch(err => {
      throw err;
    });
};

/**
 * 猜你喜欢
 */
const like = (): Promise<ResultT<ProductCustomerVO[]>> => {
  return sendRequest<ResultT<ProductCustomerVO[]>>({
    url: `${RECOMMEND_PRODUCT_PREFIX}/like`,
    method: GET_METHOD
  })
    .then(res => res.data)
    .catch(err => {
      throw err;
    });
};

/**
 * 获取商品详情
 */
const detail = (id: string): Promise<ResultT<ProductCustomerDetailVO>> => {
  return sendRequest<ResultT<ProductCustomerDetailVO>>({
    url: `${RECOMMEND_PRODUCT_PREFIX}/detail/${id}`,
    method: GET_METHOD
  })
    .then(res => res.data)
    .catch(err => {
      throw err;
    });
};

const findAllProductsByIds = (ids: string[]): Promise<ResultT<ProductCustomerVO[]>> => {
  return sendRequest<ResultT<ProductCustomerVO[]>>({
    url: `${RECOMMEND_PRODUCT_PREFIX}/recommendByIds`,
    method: GET_METHOD,
    params:{
      ids:ids
    }
  })
    .then(res => res.data)
    .catch(err => {
      throw err;
    });
};


/**
 * 【新增】推荐商品滚动加载（基于 Redis 候选池）
 * 对应后端: /recommendScroll?pageSize=20&refresh=false
 */
const recommendScroll = (
  pageSize: number = 20,
  refresh: boolean = false
): Promise<ResultT<CursorPageResult<ProductCustomerVO>>> => {
  return sendRequest<ResultT<CursorPageResult<ProductCustomerVO>>>({
    url: `${RECOMMEND_PRODUCT_PREFIX}/recommendScroll`,
    method: GET_METHOD,
    params: {
      pageSize,
      refresh
    }
  })
    .then(res => res.data)
    .catch(err => {
      throw err;
    });
};

/**
 * 【新增】热门商品列表
 * 对应后端: /hot
 */
const getHotProducts = (): Promise<ResultT<ProductCustomerVO[]>> => {
  return sendRequest<ResultT<ProductCustomerVO[]>>({
    url: `${RECOMMEND_PRODUCT_PREFIX}/hot`,
    method: GET_METHOD
  })
    .then(res => res.data)
    .catch(err => {
      throw err;
    });
};

/**
 * 【新增】最新上架商品列表
 * 对应后端: /mostNew
 */
const getMostNewProducts = (): Promise<ResultT<ProductCustomerVO[]>> => {
  return sendRequest<ResultT<ProductCustomerVO[]>>({
    url: `${RECOMMEND_PRODUCT_PREFIX}/mostNew`,
    method: GET_METHOD
  })
    .then(res => res.data)
    .catch(err => {
      throw err;
    });
};

/**
 * 【新增】通用游标分页查询
 * 对应后端: /findCursorEnd (POST)
 * 适用于需要自定义复杂条件排序的分页场景
 */
const findCursor = (
  data: RequestCursorPage<ProductCustomerVO>
): Promise<ResultT<CursorPageResult<ProductCustomerVO>>> => {
  return sendRequest<ResultT<CursorPageResult<ProductCustomerVO>>>({
    url: `${RECOMMEND_PRODUCT_PREFIX}/findCursorEnd`,
    method: POST_METHOD,
    data
  })
    .then(res => res.data)
    .catch(err => {
      throw err;
    });
};

/**
 * 【新增】猜你喜欢滚动加载（基于 Redis 候选池）
 * 对应后端: /likeScroll?offset=0&pageSize=10&refresh=false
 */
const likeScroll = (
  offset: number = 0,
  pageSize: number = 10,
  refresh: boolean = false
): Promise<ResultT<ProductCustomerVO[]>> => {
  return sendRequest<ResultT<ProductCustomerVO[]>>({
    url: `${RECOMMEND_PRODUCT_PREFIX}/likeScroll`,
    method: GET_METHOD,
    params: {
      offset,
      pageSize,
      refresh
    }
  })
    .then(res => res.data)
    .catch(err => {
      throw err;
    });
};


export { 
  searchProduct, 
  recommend, 
  like, 
  detail, 
  findAllProductsByIds,
  recommendScroll,      // 导出推荐滚动
  getHotProducts,       // 导出热门
  getMostNewProducts,   // 导出最新
  findCursor,           // 导出通用游标分页
  likeScroll            // 导出猜你喜欢滚动
};