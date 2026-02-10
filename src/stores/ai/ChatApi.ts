import { useState, useCallback, useRef, useEffect } from "react";
import { message } from "antd";
import { HttpErrorHelper } from "@/utils/http/HttpErrorHelper";

import {
  chatAll,
  fluxChat,
  deleteChatById,
  findChatPage,
  saveChat,
  findCursorChat,
    recommendChat, 
} from "@/api/ai/chat/Chat";

import type { ReqChat, ChatRecordVO } from "@/api/ai/chat/ChatType";
import type { PageType } from "@/api/type/PageType";

function useChat() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /** 聊天记录分页数据 */
  const [chatPage, setChatPage] = useState<any>(null);

  /** 当前会话 id（保存标题后返回） */
  const [conversationId, setConversationId] = useState<string | null>(null);
const conversationIdRef = useRef<string | null>(null);
useEffect(() => {
  conversationIdRef.current = conversationId;
}, [conversationId]);
  /**
   * 一次性对话
   */
  const chatAllApi = useCallback(async (data: ReqChat) => {
    setLoading(true);
    setError(null);
    try {
      const res = await chatAll(data);

      if (res.code === 200) {
        setLoading(false);
        return res.data;
      } else {
        const msg = HttpErrorHelper.getFriendlyMessage(res.code, res.msg);
        message.warning(msg);
      }
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

   const fluxChatApi = useCallback(
    (
      content: string,
      onMessage: (chunk: string) => void,
      onComplete?: () => void,
      onError?: (err: any) => void
    ) => {
      fluxChat(
        { conversationId, content }, // 👈 自动带上会话ID
        onMessage,
        onError,
        onComplete,
        (newId) => {
          // 首次对话时保存 ID
          if (!conversationId) {
            setConversationId(newId);
          }
        }
      );
    },
    [conversationId] // 依赖会话ID
  );

  // 重置会话（可选）
  const resetConversation = () => {
    setConversationId(null);
  };


  /**
   * 删除对话
   */
  const deleteChatByIdApi = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await deleteChatById(id);

      if (res.code === 200) {
        message.success(res.msg || "删除成功");
        setLoading(false);
      } else {
        message.error(res.msg || "删除失败");
      }
      return res;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 分页查询聊天记录
   */
  const findChatPageApi = useCallback(
    async (data: PageType<ChatRecordVO>) => {
      setLoading(true);
      setError(null);
      try {
        const res = await findChatPage(data);

        if (res.code === 200) {
          setChatPage(res.data);
        } else {
          message.warning(res.msg);
        }
        return res.data;
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * 修改 / 保存聊天标题
   */
  const saveChatApi = useCallback(async (data: ChatRecordVO) => {
    setLoading(true);
    setError(null);
    try {
      const res = await saveChat(data);

      if (res.code === 200) {
        setConversationId(res.data);
        message.success(res.msg || "保存成功");
      } else {
        message.warning(res.msg);
      }
      return res.data;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 游标分页查询
   */
  const findCursorChatApi = useCallback(async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      const res = await findCursorChat(data);

      if (res.code === 200) {
        return res.data;
      } else {
        message.warning(res.msg);
      }
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
 * 商品推荐流式对话（调用 /recommendChat）
 */
// const recommendChatApi = useCallback(
//   (
//     content: string,
//     onMessage: (chunk: string) => void,
//     onComplete?: () => void,
//     onError?: (err: any) => void,
//     onProductIds?: (ids: string[]) => void
//   ) => {
//     recommendChat(
//       { conversationId, content },
//       onMessage,
//       onError,
//       onComplete,
//       (newId) => {
//         // 首次对话时更新会话 ID，保证最新闭包
//         setConversationId((prev) => prev || newId);
//       },
//       onProductIds
//     );
//   },
//   [conversationId]
// );
  /**
   * 商品推荐 - 一次性请求（非流式），直接透传 data
   */
  const recommendChatApi = useCallback(async (data: ReqChat) => {
    setLoading(true);
    setError(null);
    try {
      const res = await recommendChat(data); // 直接传入 data
      if (res.code === 200 && res.data) {
        const { conversationId: newConvId, content, productIdList } = res.data;

        // 如果调用方没传 conversationId（即新对话），且后端返回了新 ID，则保存
        if (!data.conversationId && newConvId) {
          setConversationId(newConvId);
        }

        return { content, productIdList, conversationId: newConvId };
      } else {
        const msg = HttpErrorHelper.getFriendlyMessage(res.code, res.msg);
        message.warning(msg);
        throw new Error(msg);
      }
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []); // 不依赖任何状态
  return {
    loading,
    error,

    chatPage,
    conversationId,

    chatAllApi,
    fluxChatApi,
      recommendChatApi,
    deleteChatByIdApi,
    findChatPageApi,
    saveChatApi,
    findCursorChatApi,
    resetConversation
  };
}

export default useChat;
