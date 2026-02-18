import React, { useEffect, useState, useCallback } from 'react';
import './HomePage.css';
import AiChatBox from './AiChatBox';
import useRecommendProduct from '@/stores/goods/RecommendProduct';
import type { ProductCustomerVO } from '@/api/goods/product/RecommendProductType';
import { message } from 'antd';
import ProductEditModal from './ProductEditModel/ProductEditModal';

// 👇 导入 MyOrdersPage（请确认路径正确）
import MyOrdersPage from './Order/MyOrdersPage';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [aiMessages, setAiMessages] = useState([
    { id: 1, text: '您好！我是京东AI助手...', isUser: false },
  ]);
  const [aiInput, setAiInput] = useState('');

  // 商品状态
  const [subsidyProducts, setSubsidyProducts] = useState<ProductCustomerVO[]>([]);
  const [flashSaleProducts, setFlashSaleProducts] = useState<ProductCustomerVO[]>([]);
  const [recommendType, setRecommendType] = useState<'recommend' | 'like'>('recommend');
  const [currentRecommendProducts, setCurrentRecommendProducts] = useState<ProductCustomerVO[]>([]);

  // 弹窗状态
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // 👇 控制底部 Tab 切换
  const [activeTab, setActiveTab] = useState<'home' | 'cart' | 'orders' | 'service' | 'profile'>('home');

  const { loading, error, likeApi, searchProductApi, recommendApi } = useRecommendProduct();

  // ================== 加载百亿补贴 & 秒杀 ==================
  const loadSpecialProducts = useCallback(async () => {
    try {
      const subsidyRes = await searchProductApi({
        lastId: '',
        pageSize: 4,
        order: 'salesVolume_desc',
        condition: { searchContent: '' },
      });
      if (subsidyRes?.rows) setSubsidyProducts(subsidyRes.rows);

      const flashRes = await searchProductApi({
        lastId: '',
        pageSize: 4,
        order: 'publishTime_desc',
        condition: { searchContent: '' },
      });
      if (flashRes?.rows) setFlashSaleProducts(flashRes.rows);
    } catch (err) {
      console.error('加载特殊商品失败:', err);
    }
  }, [searchProductApi]);

  // ================== 加载推荐商品 ==================
  const loadRecommendProducts = useCallback(
    async (type: 'recommend' | 'like') => {
      try {
        let data: ProductCustomerVO[] | null = null;
        if (type === 'recommend') {
          data = await recommendApi();
        } else {
          data = await likeApi();
        }
        if (data) {
          setCurrentRecommendProducts(data);
        } else {
          setCurrentRecommendProducts([]);
        }
      } catch (err) {
        console.error('加载推荐商品失败:', err);
        setCurrentRecommendProducts([]);
      }
    },
    [recommendApi, likeApi]
  );

  // ================== 全局刷新函数 ==================
  const handleGlobalRefresh = useCallback(() => {
    loadRecommendProducts(recommendType);
    loadSpecialProducts();
  }, [loadRecommendProducts, loadSpecialProducts, recommendType]);

  // ================== 初始加载 ==================
  useEffect(() => {
    loadRecommendProducts('recommend');
  }, [loadRecommendProducts]);

  useEffect(() => {
    loadSpecialProducts();
  }, [loadSpecialProducts]);

  // ================== 搜索 ==================
// HomePage.tsx 中的 handleSearch
const handleSearch = (keyword: string) => {
  if (!keyword.trim()) {
    message.warning('请输入搜索关键词');
    return;
  }
  navigate(`/search?q=${encodeURIComponent(keyword.trim())}`);
};

  // ================== AI 助手 ==================
  const handleAiSend = () => {
    if (!aiInput.trim()) return;
    const userMessage = { id: aiMessages.length + 1, text: aiInput, isUser: true };
    const aiResponse = { id: aiMessages.length + 2, text: getAiResponse(aiInput), isUser: false };
    setAiMessages([...aiMessages, userMessage, aiResponse]);
    setAiInput('');
  };

  const getAiResponse = (input: string) => {
    const text = input.toLowerCase();
    if (text.includes('手机')) return '根据您的需求，我为您推荐几款热销手机...';
    if (text.includes('电脑') || text.includes('笔记本')) return '笔记本电脑专区正在促销...';
    if (text.includes('优惠') || text.includes('折扣')) return '当前大促活动优惠多多...';
    if (text.includes('物流') || text.includes('快递')) return '京东物流配送信息...';
    return '感谢您的咨询！作为京东AI助手，我可以...';
  };

  // ================== 登录弹窗 ==================
  const closeModal = () => setShowLoginModal(false);

  const openProductDetail = (id: string) => {
    setSelectedProductId(id);
    setIsModalVisible(true);
  };

  const closeProductModal = () => {
    setIsModalVisible(false);
    setSelectedProductId(null);
  };

  // ================== 快速入口 ==================
  const quickLinks = [
    {
      title: '💰 百亿补贴',
      subtitle: '国家补贴 × 平台补贴',
      items: subsidyProducts.map((item) => ({
        id: item.id,
        name: item.name,
        price: `¥${item.discountPrice}`,
        originalPrice: `¥${item.originalPrice}`,
        image: item.image || 'https://via.placeholder.com/150',
      })),
    },
    {
      title: '⚡ 京东秒杀',
      subtitle: '限时抢购 低价狂欢',
      items: flashSaleProducts.map((item) => ({
        id: item.id,
        name: item.name,
        price: `¥${item.discountPrice}`,
        originalPrice: `¥${item.originalPrice}`,
        image: item.image || 'https://via.placeholder.com/150',
      })),
    },
  ];

  // ================== 渲染 ==================
  return (
    <div className="jd-homepage">
      {/* 顶部导航栏 - 仅首页显示 */}
      {activeTab === 'home' && (
        <header className="top-navbar">
          <div className="top-banner">
            <div className="banner-content">
              <div className="banner-left">
                <div className="banner-badge">11.11</div>
                <div className="banner-text">
                  <span className="banner-title">时尚换新日</span>
                  <span className="banner-desc">整点送明星亲签好礼</span>
                </div>
                <button className="banner-btn">立即抢购</button>
              </div>
              <div className="banner-right">
                <div className="promo-tag">惠乙会场 冲榜赢P55</div>
                <div className="promo-tag">品牌联盟 低至5折</div>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* 主要内容区域 */}
      <main className="main-content">
        {activeTab === 'home' && (
          <div className="content-wrapper">
            {/* Logo和搜索栏 */}
            <div className="header-section">
              <div className="logo-area">
                <div className="logo">
                  <span className="logo-text">京东</span>
                </div>
                <div className="location" style={{ position: 'relative', display: 'inline-block' }}>
                  <div
                    onClick={handleGlobalRefresh}
                    style={{
                      position: 'absolute',
                      top: '-20px',
                      right: '0',
                      fontSize: '18px',
                      cursor: 'pointer',
                      color: '#e40000',
                      zIndex: 2,
                    }}
                    title="刷新全部商品数据"
                  >
                    🔄
                  </div>
                  <span className="location-icon">📍</span>
                  <span>云南</span>
                </div>
              </div>

              <div className="search-area">
                <div className="search-container">
                  <form 
                   onSubmit={(e) => {
                            e.preventDefault(); // 阻止表单默认提交（页面刷新）
                            handleSearch(searchQuery); // 传入当前 state 中的搜索词
                          }}
                  className="search-form">
                    <select className="search-category" aria-label="商品分类">
                      <option value="goods">商品</option>
                      <option value="brand">品牌</option>
                      <option value="store">店铺</option>
                    </select>
                    <input
                      type="text"
                      placeholder="显卡3060ti"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="search-input"
                    />
                    <button type="submit" className="search-btn">
                      <span className="search-icon">🔍</span>
                      搜索
                    </button>
                  </form>
                  <button className="ai-search">
                    <span className="ai-icon">🤖</span>
                    京言AI
                  </button>
                </div>
                <div className="search-tags">
                  {[
                    '进口奶粉',
                    '粮油9.9',
                    '桌面加湿器',
                    '银饰',
                    '羽绒服',
                    '保暖内衣',
                    '手套',
                    '暖手宝',
                  ].map((tag, index) => (
                    <span key={index} className="search-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="ad-area">
                <div className="ad-banner">
                  <div className="ad-content">
                    <div className="ad-title">大促来袭</div>
                    <div className="ad-desc">福利加码 限时抢购</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 第一板块：AI对话框 + 轮播图 + 快速入口 */}
            <div className="main-layout">
              <aside className="ai-sidebar">
                <AiChatBox />
              </aside>
              <div className="content-area">
                <div className="top-section">
                  <section className="hero-banner">
                    <div className="banner-main">
                      <div className="banner-content">
                        <div className="banner-text">
                          <h1>精选好物</h1>
                          <h2>好物立刻抢购</h2>
                          <p>低价直降 品质保障</p>
                          <button className="cta-button">立即抢购 →</button>
                        </div>
                        <div className="banner-visual">
                          <img
                            src="https://images.unsplash.com/photo-1553356084-58ef4a67b2a7?w=400&h=250&fit=crop"
                            alt="促销商品"
                          />
                        </div>
                      </div>
                      <div className="banner-indicators">
                        {[1, 2, 3, 4, 5].map((_, index) => (
                          <span key={index} className={`indicator ${index === 0 ? 'active' : ''}`}></span>
                        ))}
                      </div>
                    </div>
                  </section>

                  <section className="quick-links-section">
                    {quickLinks.map((link, index) => (
                      <div key={index} className="link-group">
                        <div className="group-header">
                          <h3 className="group-title">{link.title}</h3>
                          <span className="group-subtitle">{link.subtitle}</span>
                          <button className="group-more">更多 ›</button>
                        </div>
                        <div className="compact-items-grid">
                          {link.items.map((item) => (
                            <div
                              key={item.id}
                              className="compact-product-card"
                              onClick={() => openProductDetail(item.id)}
                              style={{ cursor: 'pointer' }}
                            >
                              <div className="compact-product-image">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  onError={(e) =>
                                    (e.currentTarget.src = 'https://via.placeholder.com/150')
                                  }
                                />
                                <div className="compact-product-badge">
                                  {link.title.includes('补贴') ? '补贴' : '秒杀'}
                                </div>
                              </div>
                              <div className="compact-product-info">
                                <h3 className="compact-product-name">{item.name}</h3>
                                <div className="compact-product-sales">热销</div>
                                <div className="compact-product-price-row">
                                  <span className="compact-current-price">{item.price}</span>
                                  {item.originalPrice && (
                                    <span className="compact-original-price">{item.originalPrice}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </section>
                </div>
              </div>
            </div>

            {/* 推荐商品区域 */}
            <section className="recommendation-section">
              <div className="section-header">
                <div className="header-left">
                  <div className="recommend-tabs">
                    <button
                      className={`tab-btn ${recommendType === 'recommend' ? 'active' : ''}`}
                      onClick={() => {
                        setRecommendType('recommend');
                        loadRecommendProducts('recommend');
                      }}
                    >
                      为你推荐
                    </button>
                    <button
                      className={`tab-btn ${recommendType === 'like' ? 'active' : ''}`}
                      onClick={() => {
                        setRecommendType('like');
                        loadRecommendProducts('like');
                      }}
                    >
                      猜你喜欢
                    </button>
                  </div>
                </div>
                <button
                  className="refresh-btn"
                  onClick={() => loadRecommendProducts(recommendType)}
                  disabled={loading}
                >
                  {loading ? '刷新中...' : '换一批'}
                </button>
              </div>

              <div className="product-grid">
                {currentRecommendProducts.length > 0 ? (
                  currentRecommendProducts.map((product) => (
                    <div
                      key={product.id}
                      className="product-card"
                      onClick={() => openProductDetail(product.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="product-image">
                        <img
                          src={product.image || 'https://via.placeholder.com/300'}
                          alt={product.name}
                          onError={(e) =>
                            (e.currentTarget.src = 'https://via.placeholder.com/300')
                          }
                        />
                        <div className="product-badge">
                          {Number(product.originalPrice) > Number(product.discountPrice)
                            ? `省¥${(Number(product.originalPrice) - Number(product.discountPrice)).toFixed(2)}`
                            : '新品推荐'}
                        </div>
                      </div>
                      <div className="product-info">
                        <h3 className="product-name">{product.name}</h3>
                        <div className="product-rating">
                          <span className="rating-stars">★★★★★</span>
                          <span className="rating-score">4.8</span>
                        </div>
                        <div className="product-sales">
                          {product.salesVolume ? product.salesVolume.toLocaleString() : '0'}+人买过
                        </div>
                        <div className="product-price-row">
                          <span className="current-price">¥{product.discountPrice}</span>
                          <span className="original-price">¥{product.originalPrice}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : loading ? (
                  <div>加载中...</div>
                ) : (
                  <div>暂无推荐商品</div>
                )}
              </div>
            </section>
          </div>
        )}

        {/* 我的订单页面 */}
        {activeTab === 'orders' && <MyOrdersPage />}

        {/* 其他页面占位 */}
        {activeTab === 'cart' && (
          <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
            🛒 购物车功能开发中...
          </div>
        )}
        {activeTab === 'service' && (
          <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
            💬 客服中心功能开发中...
          </div>
        )}
        {activeTab === 'profile' && (
          <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
            👤 个人中心功能开发中...
          </div>
        )}
      </main>

      {/* 登录弹窗 */}
      {showLoginModal && (
        <div className="modal-overlay">
          <div className="login-modal">
            <div className="modal-header">
              <h2>京东登录</h2>
              <button className="close-btn" onClick={closeModal}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="login-form">
                <input type="text" placeholder="手机号/用户名/邮箱" />
                <input type="password" placeholder="密码" />
                <button className="submit-btn">登录</button>
                <div className="form-options">
                  <label className="remember-me">
                    <input type="checkbox" /> 记住密码
                  </label>
                  <a href="#" className="forgot-password">
                    忘记密码？
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 商品详情弹窗 */}
      <ProductEditModal
        visible={isModalVisible}
        productId={selectedProductId}
        onClose={closeProductModal}
      />

      {/* 底部菜单 */}
      <div className="bottom-nav">
        <div className="nav-item" onClick={() => setActiveTab('home')}>
          <div className="nav-icon">🏠</div>
          <div className="nav-label">首页</div>
        </div>
        <div className="nav-item" onClick={() => setActiveTab('cart')}>
          <div className="nav-icon">🛒</div>
          <div className="nav-label">购物车</div>
        </div>
        <div className="nav-item" onClick={() => setActiveTab('orders')}>
          <div className="nav-icon">📦</div>
          <div className="nav-label">我的订单</div>
        </div>
        <div className="nav-item" onClick={() => setActiveTab('service')}>
          <div className="nav-icon">💬</div>
          <div className="nav-label">客服</div>
        </div>
        <div className="nav-item" onClick={() => setActiveTab('profile')}>
          <div className="nav-icon">👤</div>
          <div className="nav-label">我的</div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;