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

export { searchProduct, recommend, like, detail , findAllProductsByIds};