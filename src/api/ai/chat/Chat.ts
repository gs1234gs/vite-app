import { SIGN_IN_CONST_TOKEN } from "@/const/SignInConst";
import sendRequest from "../../axios";
import { AI_API_PREFIX } from "../../prefix/PrefixApi";
import { DELETE_METHOD, GET_METHOD, POST_METHOD, PUT_METHOD } from "../../type/ConstRequestMethods";
import type { PageType } from "../../type/PageType";
import type { PageResult, ResultT } from "../../type/ResultType";
import type { AllReqChat, ChatRecordVO, ReqChat } from "./ChatType";
import { cacheSession } from "@/utils/cache";

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

    const response = await fetch(` ${CHAT_PREFIX}/fluxChat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer  ${token}` : "", // ⚠️ 修复：去掉多余空格
      },
      body: JSON.stringify(data),
    });

    const convId = response.headers.get("X-Conversation-ID");
    if (convId && onConversationId) {
      onConversationId(convId);
    }

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`HTTP  ${response.status}:  ${response.statusText} -  ${text}`);
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

        // 处理所有完整的事件（以 \n\n 结尾）
        let position;
        while ((position = buffer.indexOf("\n\n")) !== -1) {
          const eventChunk = buffer.slice(0, position);
          buffer = buffer.slice(position + 2); // +2 跳过 \n\n

          if (!eventChunk.trim()) continue;

          let eventType = "message";
          const dataLines: string[] = [];

          for (const line of eventChunk.split("\n")) {
            if (line.startsWith("event: ")) {
              eventType = line.slice(7).trim();
            } else if (line.startsWith("data:")) {
              dataLines.push(line.slice(6));
            }
            // 忽略其他字段如 id:、retry: 等
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
  data: any // RequestCursorPage<ChatRecord>
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
/**
 * 商品推荐流式对话（调用 /recommendChat）
 */
// const recommendChat = async (
//   data: ReqChat,
//   onMessage: (chunk: string) => void,
//   onError?: (err: any) => void,
//   onComplete?: () => void,
//   onConversationId?: (id: string) => void,        // 👈 用于设置会话 ID
//   onProductIds?: (ids: string[]) => void          // 👈 用于设置商品 ID
// ) => {
//   try {
//     const token = cacheSession.getCache(SIGN_IN_CONST_TOKEN);

//     const response = await fetch(`${CHAT_PREFIX}/recommendChat`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: token ? `Bearer ${token}` : "",
//       },
//       body: JSON.stringify(data),
//     });

//     if (!response.ok) {
//       const text = await response.text();
//       throw new Error(`HTTP ${response.status}: ${response.statusText} - ${text}`);
//     }

//     if (!response.body) {
//       throw new Error("当前浏览器不支持流式读取");
//     }

//     const reader = response.body.getReader();
//     const decoder = new TextDecoder("utf-8");
//     let buffer = "";

//     try {
//       while (true) {
//         const { value, done } = await reader.read();
//         if (done) break;

//         buffer += decoder.decode(value, { stream: true });

//         let position;
//         while ((position = buffer.indexOf("\n\n")) !== -1) {
//           const eventChunk = buffer.slice(0, position);
//           buffer = buffer.slice(position + 2);

//           if (!eventChunk.trim()) continue;

//           let eventType = "message";
//           const dataLines: string[] = [];

//           for (const line of eventChunk.split("\n")) {
//             if (line.startsWith("event:")) {
//               eventType = line.substring(6).trim();
//             } else if (line.startsWith("data:")) {
//                dataLines.push(line.substring(5).trim());
//             }
//           }

//           const dataStr = dataLines.join("\n");

//           switch (eventType) {
//             case "error":
//               try {
//                 const errorObj = JSON.parse(dataStr);
//                 onError?.(new Error(errorObj.msg || "推荐对话失败"));
//               } catch {
//                 onError?.(new Error(dataStr || "推荐对话发生错误"));
//               }
//               return;

//             case "meta":
//               // ✅ 会话 ID
//               onConversationId?.(dataStr);
//               break;

//             case "recommend":
//               // ✅ 推荐商品 ID 列表
//               if (onProductIds) {
//                 try {
//                   const ids = JSON.parse(dataStr);
//                   if (Array.isArray(ids)) {
//                     onProductIds(ids);
//                   }
//                 } catch (e) {
//                   console.warn("Failed to parse recommend data:", dataStr, e);
//                 }
//               }
//               break;

//             case "message":
//             default:
//               // ✅ 普通 token
//               onMessage(dataStr);
//               break;
//           }
//         }
//       }

//       onComplete?.();
//     } finally {
//       reader.releaseLock();
//     }
//   } catch (err) {
//     console.error("Recommend chat stream error:", err);
//     onError?.(err);
//   }
// };
// 替换原来的 recommendChat 流式函数
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
  recommendChat
};
