import React, { useState, useEffect, useRef } from "react";
import styles from "./AiChatBox.module.css";
import { message } from "antd";
import MarkdownIt from "markdown-it";

import useChat, { type ChatMessageItem } from "@/stores/ai/ChatApi"; 
import type { ProductCustomerVO } from "@/api/goods/product/RecommendProductType";

const md = new MarkdownIt();

interface AiChatBoxProps {
  onClose?: () => void;
  onProductClick?: (productId: string) => void;
}

const quickQuestions = [
  "推荐一款性价比高的手机",
  "618有什么优惠活动？",
  "帮我找笔记本电脑",
  "物流配送时间多久？",
  "哪个品牌的洗衣机好？",
];

const PRODUCT_START_TAG = "<!--PRODUCT_START-->";
const PRODUCT_END_TAG = "<!--PRODUCT_END-->";

// 🌟 关键：为每个片段生成稳定的唯一 ID，防止 React 错误地复用或销毁组件
type ParsedFragment = 
  | { type: 'text', content: string, stableKey: string } 
  | { type: 'product', data: ProductCustomerVO, stableKey: string } 
  | { type: 'product-loading', stableKey: string }; 

const AiChatBox: React.FC<AiChatBoxProps> = ({ onClose, onProductClick }) => {
  const { 
    fluxRecommendChatApi, 
    conversationId, 
    resetConversation, 
    streamMessages,
    loading 
  } = useChat();

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [streamMessages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userText = input;
    setInput("");
    
    fluxRecommendChatApi(
      userText,
      () => {},
      () => {},
      (err) => {
        message.error("生成失败：" + err.message);
      }
    );
  };

  const startNewChat = () => {
    resetConversation();
  };

  /**
   * 🌟 核心修复：增强的解析逻辑
   * 策略：只要检测到 START_TAG 但未检测到 END_TAG，就强制返回一个带有“固定 Key”的 Loading 组件。
   * 这个 Key 基于 START_TAG 在字符串中的位置索引，确保在流式更新过程中，React 认为它是同一个组件。
   */
  const parseMixedContent = (content: string): ParsedFragment[] => {
    const fragments: ParsedFragment[] = [];
    let remainingText = content;
    
    while (remainingText.length > 0) {
      const startIndex = remainingText.indexOf(PRODUCT_START_TAG);
      
      // 情况 1: 没有更多标签了，剩余的全部作为文本
      if (startIndex === -1) {
        if (remainingText.trim()) {
          fragments.push({ 
            type: 'text', 
            content: md.render(remainingText), 
            stableKey: `text-${content.length}` // 使用内容长度作为简单指纹
          });
        }
        break;
      }

      // 情况 2: 处理标签前的文本
      const textBefore = remainingText.substring(0, startIndex);
      if (textBefore.trim()) {
        fragments.push({ 
          type: 'text', 
          content: md.render(textBefore), 
          stableKey: `text-before-${startIndex}` 
        });
      }

      // 寻找结束标签
      const endIndex = remainingText.indexOf(PRODUCT_END_TAG, startIndex + PRODUCT_START_TAG.length);
      
      // 🚨 关键修复点：如果找到了开始标签，但还没找到结束标签（流式传输中）
      if (endIndex === -1) {
        // 强制插入一个 Loading 卡片
        // Key 使用 startIndex，确保只要起始位置不变，React 就认为这是同一个 Loading 组件，不会销毁它
        fragments.push({ 
          type: 'product-loading', 
          stableKey: `loading-pending-${startIndex}` 
        });
        
        // 重要：停止解析后续内容，因为 JSON 不完整，后面的内容可能是截断的 JSON 碎片，渲染出来会乱码
        // 等待下一个 stream chunk 到来时，整个字符串会被重新解析
        break; 
      }

      // 情况 3: 完整的商品块 (Start ... End 都存在)
      const jsonStr = remainingText.substring(startIndex + PRODUCT_START_TAG.length, endIndex);
      
      try {
        const rawJson = jsonStr.trim();
        if (!rawJson) throw new Error("Empty JSON");
        
        const parsedJson = JSON.parse(rawJson);
        const productData: ProductCustomerVO = (parsedJson as any).product ? (parsedJson as any).product : parsedJson;
        
        if (productData && (productData.id || productData.name)) {
          // 解析成功，渲染真实商品
          // Key 使用产品 ID，确保即使位置微调，只要产品 ID 不变，组件状态保持
          fragments.push({ 
            type: 'product', 
            data: productData, 
            stableKey: `product-${productData.id || startIndex}` 
          });
        } else {
          // 数据无效，降级为 Loading
          fragments.push({ 
            type: 'product-loading', 
            stableKey: `product-invalid-${startIndex}` 
          });
        }
      } catch (e) {
        // JSON 解析失败（通常是截断的 JSON），显示 Loading
        // Key 依然绑定 startIndex，保证稳定性
        fragments.push({ 
          type: 'product-loading', 
          stableKey: `product-parse-error-${startIndex}` 
        });
      }

      // 移动指针到结束标签之后，继续循环解析后面的内容
      remainingText = remainingText.substring(endIndex + PRODUCT_END_TAG.length);
    }
    
    return fragments;
  };

  const ProductLoadingCard = () => (
    <div className={styles.productCardWrapper}>
      {/* 注意：这里加上了 loadingState 类名，触发 CSS 中的骨架屏动画 */}
      <div className={`${styles.productCard} ${styles.loadingState}`}>
        <div className={styles.productImageWrapper}>
          <div className={styles.skeletonImage} />
          <div className={styles.skeletonTag} />
        </div>
        <div className={styles.productInfo}>
          <div className={styles.skeletonTitleLine} />
          <div className={styles.skeletonTitleLine} style={{ width: '85%' }} />
          <div className={styles.skeletonDescLine} />
          <div className={styles.skeletonPriceGroup}>
            <div className={styles.skeletonPriceMain} />
            <div className={styles.skeletonPriceOrig} />
          </div>
          <div className={styles.skeletonButton} />
        </div>
      </div>
    </div>
  );

  const renderProductCard = (product: ProductCustomerVO) => {
    if (!product || !product.name || !product.image) {
      return <ProductLoadingCard />;
    }

    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onProductClick && product.id) {
        onProductClick(product.id);
      }
    };

    return (
      <div 
        className={styles.productCardWrapper} 
        onClick={handleClick}
        style={{ cursor: onProductClick ? 'pointer' : 'default' }}
      >
        <div className={styles.productCard}>
          <div className={styles.productImageWrapper}>
            <img 
              src={product.image} 
              alt={product.name} 
              className={styles.productImage} 
              onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/100?text=No+Image')} 
            />
            {product.tagName && (
              <span className={styles.productTag}>{product.tagName}</span>
            )}
          </div>
          <div className={styles.productInfo}>
            <h4 className={styles.productName}>{product.name}</h4>
            {product.description && <p className={styles.productDesc}>{product.description}</p>}
            <div className={styles.productPriceRow}>
              <span className={styles.currentPrice}>¥{product.discountPrice || product.minPrice}</span>
              {product.originalPrice && (
                <span className={styles.originalPrice}>¥{product.originalPrice}</span>
              )}
            </div>
            <button 
              className={styles.buyBtn} 
              onClick={(e) => {
                e.stopPropagation();
                if (onProductClick && product.id) {
                  onProductClick(product.id);
                }
              }}
            >
              查看详情
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderMessageContent = (msg: ChatMessageItem) => {
    const isUser = msg.role === 'user';
    
    if (isUser) {
      return <div className={styles.messageText}>{msg.content}</div>;
    }
    
    const content = msg.content || "";
    
    // 如果内容为空且正在加载，显示思考状态
    if (!content && loading) {
       return <span className={styles.typingIndicator}>正在思考...</span>;
    }

    // 🌟 核心修复：始终尝试解析混合内容，不依赖 msg.type
    if (content.includes(PRODUCT_START_TAG)) {
      const fragments = parseMixedContent(content);
      
      return (
        <>
          {fragments.map((fragment) => {
            // 使用 fragment.stableKey 作为 React key，确保组件复用
            if (fragment.type === 'text') {
              return <div key={fragment.stableKey} className={styles.messageText} dangerouslySetInnerHTML={{ __html: fragment.content }} />;
            }
            if (fragment.type === 'product') {
              return <div key={fragment.stableKey}>{renderProductCard(fragment.data)}</div>;
            }
            if (fragment.type === 'product-loading') {
              return <div key={fragment.stableKey}><ProductLoadingCard /></div>;
            }
            return null;
          })}
        </>
      );
    }

    // 普通文本消息
    return <div className={styles.messageText} dangerouslySetInnerHTML={{ __html: md.render(content) }} />;
  };

  const displayMessages: ChatMessageItem[] = [];
  
  if (streamMessages.length === 0 && !loading) {
     displayMessages.push({
       id: 'welcome',
       type: 'text',
       content: "您好！我是小西 AI 助手，可以帮您推荐商品、查询优惠、解答购物问题。",
       role: 'assistant',
       timestamp: Date.now()
     });
  } else {
     displayMessages.push(...streamMessages);
  }

  return (
    <div className={styles.containerWrapper}>
      {onClose && (
        <button className={styles.closeDrawerBtn} onClick={onClose} title="关闭对话框">✕</button>
      )}
      
      <div className={styles.aiChatContainer}>
        <div className={styles.aiHeader}>
          <div className={styles.headerLeft}>
            <div className={styles.aiAvatar}>AI</div>
            <div className={styles.aiInfo}>
              <div className={styles.aiName}>小西 AI 购物助手</div>
              <div className={styles.aiStatus}>{loading ? "生成中..." : "实时在线"}</div>
            </div>
            {(conversationId || streamMessages.length > 0) && (
              <button className={styles.newChatBtn} onClick={startNewChat} title="开始新对话">
                <span className={styles.btnIcon}>↻</span>
                新对话
              </button>
            )}
          </div>
        </div>

        <div className={styles.aiMessages}>
          {displayMessages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`${styles.message} ${
                  isUser ? styles.userMessage : styles.aiMessage
                }`}
              >
                {!isUser && <div className={styles.messageAvatar}>AI</div>}
                <div className={styles.messageContent}>
                  {renderMessageContent(msg)}
                </div>
              </div>
            );
          })}
          
          {loading && streamMessages.length === 0 && (
             <div className={`${styles.message} ${styles.aiMessage}`}>
               <div className={styles.messageAvatar}>AI</div>
               <div className={styles.messageContent}>
                 <span className={styles.typingIndicator}>正在思考...</span>
               </div>
             </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {!loading && streamMessages.length === 0 && (
          <div className={styles.quickQuestions}>
            <div className={styles.questionsTitle}>快速提问：</div>
            <div className={styles.questionsGrid}>
              {quickQuestions.map((q, i) => (
                <button 
                  key={i} 
                  className={styles.questionBtn} 
                  onClick={() => setInput(q)}
                  disabled={loading}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className={styles.aiInputArea}>
          <input
            className={styles.aiInput}
            value={input}
            placeholder="输入您的问题，例如：推荐一款手机"
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={loading}
          />
          <button 
            className={styles.aiSendBtn} 
            disabled={!input.trim() || loading} 
            onClick={handleSend}
          >
            {loading ? "生成中..." : "发送"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiChatBox;