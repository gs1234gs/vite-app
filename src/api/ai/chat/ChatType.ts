/**
 * 聊天记录
 */
export interface ChatRecordVO {
  /** 聊天记录 id */
  id: string;

  /** 标题 */
  title: string;

  /** 创建者（SysUser id） */
  creator: string;

  /** 更新者（SysUser id） */
  updater: string;

  /** 创建时间 */
  createTime: string;

  /** 最后更新时间 */
  updateTime: string;

  /** 是否删除：0-未删除，1-已删除 */
  delFlag: number;
}

/**
 * 发送聊天消息请求
 */
export interface ReqChat {
  /** 会话 id */
  conversationId: string | null | '';

  /** 消息内容 */
  content: string;
}
export interface AllReqChat {
  conversationId: string; // 或 number，根据后端实际返回（BigInteger 通常转成 string）
  content: string;
  productIdList: string[]; // 同样，BigInteger 在 JSON 中通常是字符串
}
