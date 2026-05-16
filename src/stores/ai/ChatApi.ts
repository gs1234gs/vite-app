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
  fluxChatWithProducts,
  type StreamCallbacks,
} from "@/api/ai/chat/Chat";

import type { ReqChat, ChatRecordVO } from "@/api/ai/chat/ChatType";
import type { PageType } from "@/api/type/PageType";
import type { ProductCustomerVO } from "@/api/goods/product/RecommendProductType";

// 定义消息单元类型
export interface ChatMessageItem {
  id: string;
  type: 'text' | 'product';
  content: string; 
  data?: any; 
  role: 'user' | 'assistant' | 'system';
  timestamp: number;
}

const STORAGE_KEY_MESSAGES = 'ai_chat_session_messages';
const STORAGE_KEY_CONV_ID = 'ai_chat_session_conv_id';

function useChat() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [chatPage, setChatPage] = useState<any>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const conversationIdRef = useRef<string | null>(null);

  const [streamMessages, setStreamMessages] = useState<ChatMessageItem[]>(() => {
    try {
      const savedMsgs = sessionStorage.getItem(STORAGE_KEY_MESSAGES);
      const savedConvId = sessionStorage.getItem(STORAGE_KEY_CONV_ID);
      if (savedConvId) {
        conversationIdRef.current = savedConvId;
      }
      if (savedMsgs) {
        return JSON.parse(savedMsgs);
      }
    } catch (e) {
      console.error("Failed to load chat history from sessionStorage", e);
    }
    return [];
  });
  
  const streamMessagesRef = useRef<ChatMessageItem[]>(streamMessages);

  useEffect(() => {
    conversationIdRef.current = conversationId;
    if (conversationId) {
      sessionStorage.setItem(STORAGE_KEY_CONV_ID, conversationId);
    }
  }, [conversationId]);

  useEffect(() => {
    streamMessagesRef.current = streamMessages;
    if (streamMessages.length > 0) {
       try {
         sessionStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(streamMessages));
       } catch (e) {
         console.warn("Storage full or serialization error", e);
       }
    }
  }, [streamMessages]);

  const chatAllApi = useCallback(async (data: ReqChat) => {
    setLoading(true);
    setError(null);
    try {
      const res = await chatAll(data);
      if (res.code === 200) return res.data;
      else {
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
  }, []);

  const fluxChatApi = useCallback(
    (content: string, onMessage: (chunk: string) => void, onComplete?: () => void, onError?: (err: any) => void) => {
      setLoading(true);
      fluxChat(
        { conversationId: conversationIdRef.current, content },
        onMessage,
        (err) => { onError?.(err); setLoading(false); },
        () => { onComplete?.(); setLoading(false); },
        (newId) => {
          if (!conversationIdRef.current && newId) setConversationId(newId);
        }
      );
    },
    []
  );

  /**
   * 🌟 修正版：支持 N 个商品 + 混合文本流 + 数据完整性校验
   */
  const fluxRecommendChatApi = useCallback(
    (
      content: string,
      onStreamUpdate: (messages: ChatMessageItem[]) => void,
      onFinish?: (finalMessages: ChatMessageItem[]) => void,
      onError?: (err: any) => void
    ) => {
      setLoading(true);
      setError(null);
      
      const initialUserMsg: ChatMessageItem = {
        id: `user-${Date.now()}`,
        type: 'text',
        content: content,
        role: 'user',
        timestamp: Date.now(),
      };
      
      const initialAiMsg: ChatMessageItem = {
        id: `ai-${Date.now()}`,
        type: 'text',
        content: '',
        role: 'assistant',
        timestamp: Date.now(),
      };

      let currentMessages = [...streamMessagesRef.current, initialUserMsg, initialAiMsg];
      
      streamMessagesRef.current = currentMessages;
      setStreamMessages(currentMessages);
      onStreamUpdate(currentMessages);

      fluxChatWithProducts(
        { conversationId: conversationIdRef.current, content },
        {
          onConversationId: (newId) => {
            if (!conversationIdRef.current && newId) {
              setConversationId(newId);
            }
          },
          /**
           * 处理普通文本片段
           * 逻辑：永远尝试追加到“最后一条文本消息”中。
           */
          onMessage: (chunk) => {
            const msgs = [...streamMessagesRef.current];
            let lastMsg = msgs[msgs.length - 1];

            if (!lastMsg) {
              const newTextMsg: ChatMessageItem = {
                id: `ai-text-${Date.now()}`,
                type: 'text',
                content: chunk,
                role: 'assistant',
                timestamp: Date.now(),
              };
              msgs.push(newTextMsg);
            } 
            else if (lastMsg.role === 'assistant' && lastMsg.type === 'text') {
              lastMsg.content += chunk;
            } 
            else if (lastMsg.role === 'assistant' && lastMsg.type === 'product') {
              const newTextMsg: ChatMessageItem = {
                id: `ai-text-${Date.now()}`,
                type: 'text',
                content: chunk,
                role: 'assistant',
                timestamp: Date.now(),
              };
              msgs.push(newTextMsg);
            } 
            else {
               const newTextMsg: ChatMessageItem = {
                id: `ai-text-${Date.now()}`,
                type: 'text',
                content: chunk,
                role: 'assistant',
                timestamp: Date.now(),
              };
              msgs.push(newTextMsg);
            }

            streamMessagesRef.current = msgs;
            setStreamMessages(msgs);
            onStreamUpdate(msgs);
          },
          
          /**
           * 处理商品对象 - 🛡️ 增加完整性校验
           */
          onProduct: (productData: ProductCustomerVO) => {
            const msgs = [...streamMessagesRef.current];
            
             if (!productData || !productData.id) {
               console.error("收到无效商品对象:", productData);
               // 即使出错，也尝试作为一个文本消息显示，而不是直接丢弃
               const errorTextMsg: ChatMessageItem = {
                id: `ai-text-${Date.now()}-error`,
                type: 'text',
                content: `\n[系统提示: 商品数据格式异常]`,
                role: 'assistant',
                timestamp: Date.now(),
              };
              msgs.push(errorTextMsg);
            } else {
              // ✅ 正常添加商品消息
              const productMsg: ChatMessageItem = {
                id: `prod-${Date.now()}-${productData.id}`,
                type: 'product',
                content: JSON.stringify(productData),
                data: productData,
                role: 'assistant',
                timestamp: Date.now(),
              };
              msgs.push(productMsg);
            }

            streamMessagesRef.current = msgs;
            setStreamMessages(msgs);
            onStreamUpdate(msgs);
          },
          
          onComplete: () => {
            setLoading(false);
            onFinish?.(streamMessagesRef.current);
            
            const msgs = streamMessagesRef.current;
            if (msgs.length > 0) {
              const last = msgs[msgs.length - 1];
              if (last.type === 'text' && !last.content.trim() && msgs.length > 1) {
                 // 可选：清理末尾空文本
              }
            }
          },
          
          onError: (err) => {
            setLoading(false);
            setError(err);
            onError?.(err);
            const errorMsg: ChatMessageItem = {
              id: `err-${Date.now()}`,
              type: 'text',
              content: `\n[⚠️ 生成失败: ${err.message}]`,
              role: 'system',
              timestamp: Date.now(),
            };
            const msgs = [...streamMessagesRef.current, errorMsg];
            streamMessagesRef.current = msgs;
            setStreamMessages(msgs);
            onStreamUpdate(msgs);
          }
        }
      );
    },
    [] 
  );

  const deleteChatByIdApi = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await deleteChatById(id);
      if (res.code === 200) {
        // message.success(res.msg || "删除成功");
        return res;
      } else {
        // message.error(res.msg || "删除失败");
        throw new Error(res.msg);
      }
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const findChatPageApi = useCallback(async (data: PageType<ChatRecordVO>) => {
    setLoading(true);
    setError(null);
    try {
      const res = await findChatPage(data);
      if (res.code === 200) {
        setChatPage(res.data);
        return res.data;
      } else {
        // message.warning(res.msg);
        throw new Error(res.msg);
      }
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const saveChatApi = useCallback(async (data: ChatRecordVO) => {
    setLoading(true);
    setError(null);
    try {
      const res = await saveChat(data);
      if (res.code === 200) {
        if (res.data) setConversationId(res.data);
        // message.success(res.msg || "保存成功");
        return res.data;
      } else {
        // message.warning(res.msg);
        throw new Error(res.msg);
      }
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const findCursorChatApi = useCallback(async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      const res = await findCursorChat(data);
      if (res.code === 200) return res.data;
      else {
        // message.warning(res.msg);
        throw new Error(res.msg);
      }
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const recommendChatApi = useCallback(async (data: ReqChat) => {
    setLoading(true);
    setError(null);
    try {
      const res = await recommendChat(data);
      if (res.code === 200 && res.data) {
        const { conversationId: newConvId, content, productIdList } = res.data;
        if (!data.conversationId && newConvId) setConversationId(newConvId);
        return { content, productIdList, conversationId: newConvId };
      } else {
        throw new Error(HttpErrorHelper.getFriendlyMessage(res.code, res.msg));
      }
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const resetStream = useCallback(() => {}, []);
  
  const resetConversation = useCallback(() => {
    setConversationId(null);
    setStreamMessages([]);
    streamMessagesRef.current = [];
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(STORAGE_KEY_MESSAGES);
      sessionStorage.removeItem(STORAGE_KEY_CONV_ID);
    }
  }, []);

  return {
    loading,
    error,
    chatPage,
    conversationId,
    streamMessages,
    chatAllApi,
    fluxChatApi,
    fluxRecommendChatApi,
    recommendChatApi,
    deleteChatByIdApi,
    findChatPageApi,
    saveChatApi,
    findCursorChatApi,
    resetConversation,
    resetStream,
  };
}

export default useChat;