import React, { useEffect, useState, useCallback, useRef } from 'react';
import './HomePage.css';
import AiChatBox from './AiChatBox';
import useRecommendProduct from '@/stores/goods/RecommendProduct';
import type { ProductCustomerVO } from '@/api/goods/product/RecommendProductType';
import { message } from 'antd';
import ProductEditModal from './ProductEditModel/ProductEditModal';
import useProductCarousal from '@/stores/goods/ProductCarousel';
import MyOrdersPage from './Order/MyOrdersPage';
import { useNavigate } from 'react-router-dom';
import type { ProductCarousalVO } from '@/api/goods/carousel/ProductCarouselType';

const HomePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  // AI 抽屉状态
  const [showAiDrawer, setShowAiDrawer] = useState(false);

  // 商品状态
  const [subsidyProducts, setSubsidyProducts] = useState<ProductCustomerVO[]>([]);
  const [flashSaleProducts, setFlashSaleProducts] = useState<ProductCustomerVO[]>([]);
  const [recommendType, setRecommendType] = useState<'recommend' | 'like'>('recommend');
  const [currentRecommendProducts, setCurrentRecommendProducts] = useState<ProductCustomerVO[]>([]);

  // 弹窗状态
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // 底部 Tab 切换
  const [activeTab, setActiveTab] = useState<'home' | 'cart' | 'orders' | 'service' | 'profile'>('home');

  // ============ 轮播图状态 ============
  const [carouselList, setCarouselList] = useState<ProductCarousalVO[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const carouselTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const { loading, error, likeApi, searchProductApi, recommendApi } = useRecommendProduct();
  const { findByType } = useProductCarousal();

  // ============ 加载轮播图 ============
  const loadCarousel = useCallback(async () => {
    try {
      const res = await findByType(2);
      if (res?.data && Array.isArray(res.data)) {
        const filtered = res.data
          .filter((item: ProductCarousalVO) => item.status === 1)
          .sort((a: ProductCarousalVO, b: ProductCarousalVO) => a.sort - b.sort);
        setCarouselList(filtered);
        if (filtered.length > 0) {
          setCurrentSlide(0);
        }
      }
    } catch (err) {
      console.error('加载轮播图失败:', err);
      setCarouselList([]);
    }
  }, [findByType]);

  // ============ 轮播图自动切换 ============
  const startAutoPlay = useCallback(() => {
    if (carouselTimerRef.current) {
      clearInterval(carouselTimerRef.current);
    }
    if (!isHovering && carouselList.length > 1) {
      carouselTimerRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % carouselList.length);
      }, 3000);
    }
  }, [isHovering, carouselList.length]);

  const stopAutoPlay = useCallback(() => {
    if (carouselTimerRef.current) {
      clearInterval(carouselTimerRef.current);
      carouselTimerRef.current = null;
    }
  }, []);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  // ============ 加载百亿补贴 & 秒杀 ============
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

  // ============ 加载推荐商品 ============
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

  // ============ 初始加载 ============
  useEffect(() => {
    loadRecommendProducts('recommend');
  }, [loadRecommendProducts]);

  useEffect(() => {
    loadSpecialProducts();
  }, [loadSpecialProducts]);

  useEffect(() => {
    loadCarousel();
  }, [loadCarousel]);

  // ============ 轮播图自动播放控制 ============
  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  }, [currentSlide, isHovering, carouselList.length, startAutoPlay, stopAutoPlay]);

  // 组件卸载时清理定时器
  useEffect(() => {
    return () => {
      if (carouselTimerRef.current) {
        clearInterval(carouselTimerRef.current);
      }
    };
  }, []);

  // ============ 搜索 ============
  const handleSearch = (keyword: string) => {
    if (!keyword.trim()) {
      message.warning('请输入搜索关键词');
      return;
    }
    navigate(`/search?q=${encodeURIComponent(keyword.trim())}`);
  };

  // ============ 登录弹窗 ============
  const closeModal = () => setShowLoginModal(false);

  const openProductDetail = (id: string) => {
    setSelectedProductId(id);
    setIsModalVisible(true);
  };

  const closeProductModal = () => {
    setIsModalVisible(false);
    setSelectedProductId(null);
  };

  // ============ 快速入口 ============
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

  // ============ 渲染 ============
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
                <div className="promo-tag">惠乙会场 冲榜赢 P55</div>
                <div className="promo-tag">品牌联盟 低至 5 折</div>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* 主要内容区域 */}
      <main className="main-content">
        {activeTab === 'home' && (
          <div className="content-wrapper">
            {/* Logo 和搜索栏 */}
            <div className="header-section">
              <div className="logo-area">
                <div className="logo">
                  <span className="logo-text">京东</span>
                </div>
                <div className="location" style={{ position: 'relative', display: 'inline-block' }}>
                  <span className="location-icon">📍</span>
                  <span>云南</span>
                </div>
              </div>

              <div className="search-area">
                <div className="search-container">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSearch(searchQuery);
                    }}
                    className="search-form"
                  >
                    <select className="search-category" aria-label="商品分类">
                      <option value="goods">商品</option>
                      <option value="brand">品牌</option>
                      <option value="store">店铺</option>
                    </select>
                    <input
                      type="text"
                      placeholder="显卡 3060ti"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="search-input"
                    />
                    <button type="submit" className="search-btn">
                      <span className="search-icon">🔍</span>
                      搜索
                    </button>
                  </form>
                  <button 
                    className="ai-search"
                    onClick={() => setShowAiDrawer(true)}
                  >
                    <span className="ai-icon">🤖</span>
                    京言 AI
                  </button>
                </div>
                <div className="search-tags">
                  {[
                    '进口奶粉',
                    '粮油 9.9',
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

            {/* 第一板块：轮播图和快速入口 */}
            <div className="main-layout">
              <div className="content-area" style={{ width: '100%' }}>
                <div className="top-section">
                  {/* ============ 轮播图区域 ============ */}
                  <section className="hero-banner">
                    <div className="banner-main">
                      {carouselList.length > 0 ? (
                        <>
                          <div
                            className="banner-content no-border"
                            onMouseEnter={() => setIsHovering(true)}
                            onMouseLeave={() => setIsHovering(false)}
                          >
                            <div className="banner-image-wrapper">
                              <img
                                src={carouselList[currentSlide]?.image || 'https://via.placeholder.com/800x300'}
                                alt={carouselList[currentSlide]?.title || '促销商品'}
                                onError={(e) =>
                                  (e.currentTarget.src = 'https://via.placeholder.com/800x300')
                                }
                                className="banner-image"
                              />
                              <div className="banner-text-overlay">
                                <h1 className="banner-title-overlay">{carouselList[currentSlide]?.title || '精选好物'}</h1>
                                <h2 className="banner-desc-overlay">{carouselList[currentSlide]?.description || '好物立刻抢购'}</h2>
                                <p className="banner-subtitle-overlay">低价直降 品质保障</p>
                                <button 
                                  className="cta-button-overlay"
                                  onClick={() => {
                                    const link = carouselList[currentSlide]?.link;
                                    if (link) {
                                      window.open(link, '_blank');
                                    }
                                  }}
                                >
                                  立即抢购 →
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="banner-indicators">
                            {carouselList.map((_, index) => (
                              <span
                                key={index}
                                className={`indicator ${index === currentSlide ? 'active' : ''}`}
                                onClick={() => goToSlide(index)}
                                style={{ cursor: 'pointer' }}
                              />
                            ))}
                          </div>
                        </>
                      ) : (
                        <div className="banner-content no-border">
                          <div className="banner-image-wrapper">
                            <img
                              src="https://images.unsplash.com/photo-1553356084-58ef4a67b2a7?w=800&h=300&fit=crop"
                              alt="促销商品"
                              className="banner-image"
                            />
                            <div className="banner-text-overlay">
                              <h1 className="banner-title-overlay">精选好物</h1>
                              <h2 className="banner-desc-overlay">好物立刻抢购</h2>
                              <p className="banner-subtitle-overlay">低价直降 品质保障</p>
                              <button className="cta-button-overlay">立即抢购 →</button>
                            </div>
                          </div>
                        </div>
                      )}
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

            {/* 推荐商品区域 - 优化布局 */}
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
                  <span>🔄</span>
                  {loading ? '刷新中...' : '换一批'}
                </button>
              </div>

              <div className={`product-grid ${currentRecommendProducts.length === 0 ? 'empty-state' : ''}`}>
                {loading ? (
                  <div className="loading-state">
                    <span>⏳</span> 加载中...
                  </div>
                ) : currentRecommendProducts.length > 0 ? (
                  currentRecommendProducts.map((product) => (
                    <div
                      key={product.id}
                      className="product-card"
                      onClick={() => openProductDetail(product.id)}
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
                            : '新品'}
                        </div>
                      </div>
                      <div className="product-info">
                        <div>
                          <h3 className="product-name">{product.name}</h3>
                          <div className="product-rating">
                            <span className="rating-stars">★★★★★</span>
                            <span className="rating-score">4.8</span>
                          </div>
                          <div className="product-sales">
                            {product.salesVolume ? product.salesVolume.toLocaleString() : '0'}+ 人买过
                          </div>
                        </div>
                        <div className="product-price-row">
                          <span className="current-price">¥{product.discountPrice}</span>
                          <span className="original-price">¥{product.originalPrice}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <span>😕</span> 暂无推荐商品
                  </div>
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

      {/* AI 抽屉组件 */}
      {showAiDrawer && (
        <>
          <div 
            className="ai-drawer-overlay"
            onClick={() => setShowAiDrawer(false)}
          />
          <div className={`ai-drawer ${showAiDrawer ? 'ai-drawer-open' : ''}`}>
            <AiChatBox onClose={() => setShowAiDrawer(false)} />
          </div>
        </>
      )}

      {/* 底部菜单 */}
      <div className="bottom-nav">
        <div 
          className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => setActiveTab('home')}
        >
          <div className="nav-icon">🏠</div>
          <div className="nav-label">首页</div>
        </div>
        <div 
          className={`nav-item ${activeTab === 'cart' ? 'active' : ''}`}
          onClick={() => setActiveTab('cart')}
        >
          <div className="nav-icon">🛒</div>
          <div className="nav-label">购物车</div>
        </div>
        <div 
          className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          <div className="nav-icon">📦</div>
          <div className="nav-label">我的订单</div>
        </div>
        <div 
          className={`nav-item ${activeTab === 'service' ? 'active' : ''}`}
          onClick={() => setActiveTab('service')}
        >
          <div className="nav-icon">💬</div>
          <div className="nav-label">客服</div>
        </div>
        <div 
          className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <div className="nav-icon">👤</div>
          <div className="nav-label">我的</div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;