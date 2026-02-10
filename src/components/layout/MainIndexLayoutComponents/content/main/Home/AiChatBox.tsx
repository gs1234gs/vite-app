import React, { useState, useRef, useEffect } from "react";
import styles from "./AiChatBox.module.css";
import { message } from "antd";

import useChat from "@/stores/ai/ChatApi";
import useRecommendProduct from "@/stores/goods/RecommendProduct";
import type { ProductCustomerVO } from "@/api/goods/product/RecommendProductType";

interface ChatMessage {
  id: number;
  text: string;
  isUser: boolean;
}

const quickQuestions = [
  "推荐一款性价比高的手机",
  "618有什么优惠活动？",
  "帮我找笔记本电脑",
  "物流配送时间多久？",
  "哪个品牌的洗衣机好？",
];

const AiChatBox: React.FC = () => {
  const { recommendChatApi, conversationId, resetConversation } = useChat();
  const { findAllProductRecommendByIdsApi } = useRecommendProduct();
const [isSending, setIsSending] = useState(false); // 👈 新增
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      text: "您好！我是京东AI助手，可以帮您推荐商品、查询优惠、解答购物问题。",
      isUser: false,
    },
  ]);
  const [input, setInput] = useState("");
  const [recommendedProducts, setRecommendedProducts] = useState<ProductCustomerVO[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const messagesRef = useRef<HTMLDivElement | null>(null);

  // 自动滚动到底部
  useEffect(() => {
    const box = messagesRef.current;
    if (!box) return;
    box.scrollTop = box.scrollHeight;
  }, [messages]);

//   const handleSend = () => {
//   if (!input.trim()) return;

//   const userMsg: ChatMessage = { id: Date.now(), text: input, isUser: true };
//   const aiMsg: ChatMessage = { id: Date.now() + Math.random(), text: "", isUser: false };

//   setMessages((prev) => [...prev, userMsg, aiMsg]);
//   setInput("");
//   setRecommendedProducts([]);
//   setLoadingProducts(false);

//   recommendChatApi(
//     input,
//     (chunk: string) => {
//       // 用最新的 AI 消息 ID 更新
//       setMessages((prev) => {
//         const lastMsg = prev[prev.length - 1];
//         if (lastMsg && !lastMsg.isUser) {
//           return prev.map((msg, index) =>
//             index === prev.length - 1 ? { ...msg, text: msg.text + chunk } : msg
//           );
//         }
//         return prev;
//       });
//     },
//     () => {
//       console.log("✅ 推荐完成");
//     },
//     (err: any) => {
//       message.error("推荐失败：" + (err.message || "请重试"));
//     },
//     async (productIds: string[]) => {
//       if (productIds.length > 0) {
//         setLoadingProducts(true);
//         try {
//           const products = await findAllProductRecommendByIdsApi(productIds);
//           if (Array.isArray(products)) setRecommendedProducts(products);
//         } catch (error) {
//           console.error("加载推荐商品失败", error);
//         } finally {
//           setLoadingProducts(false);
//         }
//       }
//     }
//   );
// };

// AiChatBox.tsx

const handleSend = async () => {
  if (!input.trim() || isSending) return; // 👈 防止重复触发

  setIsSending(true); // 🔒 锁定
  const userMsg: ChatMessage = { id: Date.now(), text: input, isUser: true };
  setMessages((prev) => [...prev, userMsg]);
  setInput("");
  setRecommendedProducts([]);
  setLoadingProducts(true);

  try {
    const res = await recommendChatApi({
      conversationId: conversationId || null,
      content: input,
    });

    if (res?.content) {
      let formattedContent = res.content;
      const jsonMatch = formattedContent.match(/({.*?})/s);
      if (jsonMatch) {
        try {
          const jsonStr = jsonMatch[1];
          const jsonObj = JSON.parse(jsonStr);
          if (Array.isArray(jsonObj.recommend_products)) {
            const productIds = jsonObj.recommend_products;
            const productNames = productIds.map((id: any) => `商品ID: ${id}`).join(", ");
            formattedContent = formattedContent.replace(jsonStr, `推荐商品：${productNames}`);
          }
        } catch (e) {
          console.warn("无法解析 JSON:", e);
        }
      }

      const aiMsg: ChatMessage = { id: Date.now(), text: formattedContent, isUser: false };
      setMessages((prev) => [...prev, aiMsg]);
        const products = await findAllProductRecommendByIdsApi(res.productIdList);
      console.log("product",products)
        if (Array.isArray(products)) {
          setRecommendedProducts(products);
        }
    }
  } catch (err: any) {
    message.error("推荐失败：" + (err.message || "请稍后重试"));
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), text: "抱歉，当前无法为您生成推荐。", isUser: false },
    ]);
  } finally {
    setIsSending(false); // 🔓 解锁
    setLoadingProducts(false);
  }
};

  const startNewChat = () => {
    resetConversation();
    setMessages([
      {
        id: 1,
        text: "您好！我是京东AI助手，可以帮您推荐商品、查询优惠、解答购物问题。",
        isUser: false,
      },
    ]);
    setRecommendedProducts([]);
    setLoadingProducts(false);
  };

  return (
    <div className={styles.containerWrapper}>
      <div className={styles.aiChatContainer}>
        {/* 头部 */}
        <div className={styles.aiHeader}>
          <div className={styles.aiAvatar}>AI</div>
          <div className={styles.aiInfo}>
            <div className={styles.aiName}>京东AI购物助手</div>
            <div className={styles.aiStatus}>实时在线</div>
          </div>
          {conversationId && (
            <button className={styles.newChatBtn} onClick={startNewChat}>
              新对话
            </button>
          )}
        </div>

        {/* 消息区 */}
        <div className={styles.aiMessages} ref={messagesRef}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`${styles.message} ${
                msg.isUser ? styles.userMessage : styles.aiMessage
              }`}
            >
              {!msg.isUser && <div className={styles.messageAvatar}>AI</div>}
              <div className={styles.messageContent}>
                <div className={styles.messageText}>{msg.text}</div>
              </div>
            </div>
          ))}
        </div>

        {/* 快速提问 */}
        <div className={styles.quickQuestions}>
          <div className={styles.questionsTitle}>快速提问：</div>
          <div className={styles.questionsGrid}>
            {quickQuestions.map((q, i) => (
              <button key={i} className={styles.questionBtn} onClick={() => setInput(q)}>
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* 输入框 */}
        <div className={styles.aiInputArea}>
          <input
            className={styles.aiInput}
            value={input}
            placeholder="输入您的问题，例如：推荐一款手机"
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button className={styles.aiSendBtn} disabled={!input.trim()} onClick={handleSend}>
            发送
          </button>
        </div>

        {/* 推荐商品区域 */}
        <div className={styles.aiProductRecommendations}>
          <div className={styles.aiRecommendationsTitle}>
            <span>🔥</span> AI为您推荐
          </div>

          {loadingProducts ? (
            <div className={styles.loading}>正在加载推荐商品...</div>
          ) : recommendedProducts.length > 0 ? (
            <div className={styles.aiRecommendationsGrid}>
              {recommendedProducts.map((product) => (
                <div key={product.id} className={styles.aiRecommendationCard}>
                  <div className={styles.aiRecommendationImage}>
                    <img src={product.image} alt={product.name} />
                  </div>
                  <div className={styles.aiRecommendationName}>{product.name}</div>
                  <div className={styles.aiRecommendationPrice}>
                    ¥{product.discountPrice}
                    {product.originalPrice && (
                      <span className={styles.aiRecommendationOriginalPrice}>
                        ¥{product.originalPrice}
                      </span>
                    )}
                  </div>
                  <div className={styles.aiRecommendationBadge}>AI推荐</div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.noRecommend}>暂无推荐商品</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiChatBox;
