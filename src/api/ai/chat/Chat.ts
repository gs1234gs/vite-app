import { SIGN_IN_CONST_TOKEN } from "@/const/SignInConst";
import sendRequest from "../../axios";
import { AI_API_PREFIX } from "../../prefix/PrefixApi";
import { DELETE_METHOD, GET_METHOD, POST_METHOD, PUT_METHOD } from "../../type/ConstRequestMethods";
import type { PageType } from "../../type/PageType";
import type { PageResult, ResultT } from "../../type/ResultType";
import type { AllReqChat, ChatRecordVO, ReqChat } from "./ChatType";
import { cacheSession } from "@/utils/cache";
import type { ProductCustomerVO } from "@/api/goods/product/RecommendProductType";

/**
 * /chat 接口前缀
 */
const CHAT_PREFIX = `${AI_API_PREFIX}/chat`;

/**
 * 一次性对话
 */
const chatAll = (data: ReqChat): Promise<ResultT<string>> => {
  return sendRequest<ResultT<string>>({
    url: `${CHAT_PREFIX}/chatAll`,
    method: POST_METHOD,
    data,
  })
    .then(res => res.data)
    .catch(err => {
      throw err;
    });
};

/**
 * 真 · 流式对话（SSE 版）
 */
const fluxChat = async (
  data: ReqChat,
  onMessage: (chunk: string) => void,
  onError?: (err: any) => void,
  onComplete?: () => void,
  onConversationId?: (id: string) => void
) => {
  try {
    const token = cacheSession.getCache(SIGN_IN_CONST_TOKEN);

    // 修复：去掉 URL 中多余的空格
    const response = await fetch(`${CHAT_PREFIX}/fluxChat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify(data),
    });

    const convId = response.headers.get("X-Conversation-ID");
    if (convId && onConversationId) {
      onConversationId(convId);
    }

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`HTTP ${response.status}: ${response.statusText} - ${text}`);
    }

    if (!response.body) {
      throw new Error("当前浏览器不支持流式读取");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";

    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        let position;
        while ((position = buffer.indexOf("\n\n")) !== -1) {
          const eventChunk = buffer.slice(0, position);
          buffer = buffer.slice(position + 2);

          if (!eventChunk.trim()) continue;

          let eventType = "message";
          const dataLines: string[] = [];

          for (const line of eventChunk.split("\n")) {
            if (line.startsWith("event: ")) {
              eventType = line.slice(7).trim();
            } else if (line.startsWith("data:")) {
              // 兼容 data: 和 data: 
              dataLines.push(line.slice(5).replace(/^\s/, '')); 
            }
          }

          const data = dataLines.join("\n");

          if (eventType === "error") {
            try {
              const errorObj = JSON.parse(data);
              onError?.(new Error(errorObj.msg || "未知错误"));
            } catch {
              onError?.(new Error(data || "流式对话失败"));
            }
            return;
          } else if (eventType === "message") {
            onMessage(data);
          }
        }
      }

      onComplete?.();
    } finally {
      reader.releaseLock();
    }
  } catch (err) {
    console.error("Stream processing error:", err);
    onError?.(err);
  }
};

/**
 * 删除对话
 */
const deleteChatById = (id: string): Promise<ResultT<number>> => {
  return sendRequest<ResultT<number>>({
    url: `${CHAT_PREFIX}/deleteById/${id}`,
    method: DELETE_METHOD,
  })
    .then(res => res.data)
    .catch(err => {
      throw err;
    });
};

/**
 * 分页查询聊天记录
 */
const findChatPage = (
  data: PageType<ChatRecordVO>
): Promise<ResultT<PageResult<ChatRecordVO>>> => {
  return sendRequest<ResultT<PageResult<ChatRecordVO>>>({
    url: `${CHAT_PREFIX}/findChat`,
    method: POST_METHOD,
    data,
  })
    .then(res => res.data)
    .catch(err => {
      throw err;
    });
};

/**
 * 修改 / 保存聊天标题
 */
const saveChat = (data: ChatRecordVO): Promise<ResultT<string>> => {
  return sendRequest<ResultT<string>>({
    url: `${CHAT_PREFIX}/saveChat`,
    method: PUT_METHOD,
    data,
  })
    .then(res => res.data)
    .catch(err => {
      throw err;
    });
};

/**
 * 游标分页查询聊天记录
 */
const findCursorChat = (
  data: any
): Promise<ResultT<ChatRecordVO[]>> => {
  return sendRequest<ResultT<ChatRecordVO[]>>({
    url: `${CHAT_PREFIX}/findCursorChat`,
    method: POST_METHOD,
    data,
  })
    .then(res => res.data)
    .catch(err => {
      throw err;
    });
};

export interface StreamCallbacks {
  onMessage: (text: string) => void;
  onProduct: (product: ProductCustomerVO) => void;
  onError?: (err: any) => void;
  onComplete?: () => void;
  onConversationId?: (id: string) => void;
}

/**
 * 🌟 终极鲁棒版：商品推荐流式对话
 * 
 * 【核心修复】
 * 1. 彻底解耦 SSE 协议层与业务逻辑层。
 * 2. 维护一个全局的 pureTextBuffer，将所有 SSE data 内容无缝拼接。
 * 3. 无论后端把 <!--PRODUCT_START--> 切得多么碎（甚至每个字母一个包），
 *    只要顺序正确，这里都能还原并正确提取 JSON。
 */
const fluxChatWithProducts = async (
  data: ReqChat,
  callbacks: StreamCallbacks
) => {
  const { onMessage, onProduct, onError, onComplete, onConversationId } = callbacks;

  const PRODUCT_START = "<!--PRODUCT_START-->";
  const PRODUCT_END = "<!--PRODUCT_END-->";

  // --- 状态变量 ---
  let sseRawBuffer = "";       // 原始字节缓冲，用于处理 SSE \n\n 分割
  let pureTextBuffer = "";     // 【核心】纯净的业务文本流缓冲（已去除 SSE 头）
  let isCollectingJson = false; // 是否正在收集商品 JSON

  try {
    const token = cacheSession.getCache(SIGN_IN_CONST_TOKEN);
    
    // 修复：确保 URL 没有多余空格
    const response = await fetch(`${CHAT_PREFIX}/recommendFluxChat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`HTTP ${response.status}: ${text}`);
    }

    if (!response.body) {
      throw new Error("浏览器不支持流式读取");
    }

    const headerConvId = response.headers.get("X-Conversation-ID");
    if (headerConvId && onConversationId) {
      onConversationId(headerConvId);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");

    // --- 辅助函数 ---

    const tryParseAndEmitProduct = (jsonStr: string): boolean => {
      try {
        const cleanJson = jsonStr.trim();
        if (!cleanJson) return false;

        const productObj = JSON.parse(cleanJson);
        
        // 简单校验
        if (productObj && (productObj.id || productObj.name)) {
          onProduct(productObj);
          return true;
        }
        return false;
      } catch (e) {
        // 解析失败通常意味着数据还没收完，静默返回 false
        return false;
      }
    };

    const emitText = (text: string) => {
      if (text) {
        onMessage(text);
      }
    };

    /**
     * 核心处理器：扫描 pureTextBuffer
     * 策略：不断循环检查 buffer 头部，直到无法处理为止
     */
    const processBuffer = () => {
      while (pureTextBuffer.length > 0) {
        if (isCollectingJson) {
          // --- 模式 A: 正在收集 JSON ---
          const endIndex = pureTextBuffer.indexOf(PRODUCT_END);
          
          if (endIndex === -1) {
            // 结束标记还没出现，停止处理，等待下一个 chunk
            break;
          }

          // 提取 JSON 内容
          const jsonContent = pureTextBuffer.substring(0, endIndex);
          
          // 尝试解析
          const success = tryParseAndEmitProduct(jsonContent);
          
          if (!success) {
            // 如果解析失败（可能是脏数据或协议错乱），降级处理：
            // 将标记和内容当作普通文本输出，防止卡死
            console.warn("商品 JSON 解析失败，降级为文本输出");
            emitText(PRODUCT_START + jsonContent + PRODUCT_END);
          }

          // 移动指针：切除已处理的 JSON + END 标记
          pureTextBuffer = pureTextBuffer.substring(endIndex + PRODUCT_END.length);
          isCollectingJson = false;
          
          // 继续循环，检查后面是否还有文本或新的商品
          continue;
        } else {
          // --- 模式 B: 普通文本模式 ---
          const startIndex = pureTextBuffer.indexOf(PRODUCT_START);

          if (startIndex === -1) {
            // 没找到开始标记，说明当前 buffer 全是普通文本
            // 全部输出并清空
            emitText(pureTextBuffer);
            pureTextBuffer = "";
            break; // 处理完毕，退出循环
          }

          // 找到了开始标记
          // 1. 输出标记前的普通文本
          const textBefore = pureTextBuffer.substring(0, startIndex);
          emitText(textBefore);

          // 2. 切除已输出的文本 和 开始标记
          pureTextBuffer = pureTextBuffer.substring(startIndex + PRODUCT_START.length);
          
          // 3. 切换到 JSON 收集模式
          isCollectingJson = true;
          
          // 继续循环，立即尝试寻找结束标记
          continue;
        }
      }
    };

    // --- 流式读取主循环 ---
    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        sseRawBuffer += chunk;

        // 1. 按 SSE 协议分割事件 (\n\n)
        let eventEndIndex;
        while ((eventEndIndex = sseRawBuffer.indexOf("\n\n")) !== -1) {
          const eventBlock = sseRawBuffer.substring(0, eventEndIndex);
          sseRawBuffer = sseRawBuffer.substring(eventEndIndex + 2); // 移除已处理部分

          if (!eventBlock.trim()) continue;

          let eventType = "message";
          const dataLines: string[] = [];

          // 解析 event: 和 data:
          const lines = eventBlock.split("\n");
          for (const line of lines) {
            if (line.startsWith("event: ")) {
              eventType = line.slice(7).trim();
            } else if (line.startsWith("data: ")) {
              dataLines.push(line.slice(6));
            } else if (line.startsWith("data:")) {
              // 兼容 data: 后紧跟内容的情况
              dataLines.push(line.slice(5));
            }
          }

          // 特殊事件处理
          if (eventType === "meta") {
            try {
              const meta = JSON.parse(dataLines.join(""));
              if (meta.conversationId && onConversationId) {
                onConversationId(meta.conversationId);
              }
            } catch (e) {}
            continue;
          }

          if (eventType === "error") {
            try {
              const errObj = JSON.parse(dataLines.join(""));
              onError?.(new Error(errObj.msg || "Server Error"));
            } catch {
              onError?.(new Error(dataLines.join("")));
            }
            return; // 遇到错误直接终止
          }

          // ✅ 正常消息处理：将 data 内容拼接到纯文本流
          // 【关键点】：这里使用 join("") 而不是 join("\n")
          // 因为 SSE 的换行是传输层的，业务层的 JSON 或文本应该是连续的。
          // 如果后端在 JSON 中间换了行，join("") 能把它重新拼回去。
          if (eventType === "message" || eventType === "") {
            const content = dataLines.join(""); 
            if (content) {
              pureTextBuffer += content;
              // 每次有新内容加入，都尝试处理
              processBuffer();
            }
          }
        }
      }

      // --- 流结束后的收尾 ---
      // 如果缓冲区还有残留
      if (pureTextBuffer) {
        if (isCollectingJson) {
          console.warn("流结束但商品标签未闭合，尝试强制解析残留数据...");
          // 尝试清理可能残留的半个标签
          const cleanContent = pureTextBuffer.replace(/<!--.*?-->/g, '').trim();
          if (cleanContent) {
            tryParseAndEmitProduct(cleanContent);
          }
        } else {
          emitText(pureTextBuffer);
        }
      }

      onComplete?.();
    } finally {
      reader.releaseLock();
    }
  } catch (err) {
    console.error("流式请求异常:", err);
    onError?.(err);
  }
};

//  recommendChat
const recommendChat = (data: ReqChat): Promise<ResultT<AllReqChat>> => {
  return sendRequest<ResultT<AllReqChat>>({
    url: `${CHAT_PREFIX}/recommendChat`,
    method: POST_METHOD,
    data,
    timeout: 300000, 
  }).then(res => res.data);
};


export {
  chatAll,
  fluxChat,
  deleteChatById,
  findChatPage,
  saveChat,
  findCursorChat,
  recommendChat,
  fluxChatWithProducts
};