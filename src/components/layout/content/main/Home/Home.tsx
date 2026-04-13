import React, { useEffect, useState, useCallback, useRef } from 'react';
import './HomePage.css';
import AiChatBox from './AiChatBox';
import useRecommendProduct from '@/stores/goods/RecommendProduct';
import type { ProductCustomerVO } from '@/api/goods/product/RecommendProductType';
import { message } from 'antd';
import ProductEditModal from './ProductEditModel/ProductEditModal';
import useProductCarousal from '@/stores/goods/ProductCarousel';
import MyOrdersPage from '../person/Order/MyOrdersPage';
import { useNavigate } from 'react-router-dom';
import type { ProductCarousalVO } from '@/api/goods/carousel/ProductCarouselType';
import useUserBrowse from '@/stores/behavior/UseUserBrowse';
import type { UserBrowseSaveVO } from '@/api/behavior/browse/BrowseType';
import type { ProductApiVO } from "@/api/goods/typeapi/ProductApiType";

const HomePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAiDrawer, setShowAiDrawer] = useState(false);

  // ============ 商品状态 ============
  const [hotProducts, setHotProducts] = useState<ProductCustomerVO[]>([]);
  const [newProducts, setNewProducts] = useState<ProductCustomerVO[]>([]);
  const [recommendType, setRecommendType] = useState<'scroll' | 'like'>('scroll');
  const [currentRecommendProducts, setCurrentRecommendProducts] = useState<ProductCustomerVO[]>([]);

  const [scrollPage, setScrollPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isFallbackMode, setIsFallbackMode] = useState(false);
  const [fallbackCursor, setFallbackCursor] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'cart' | 'orders' | 'service' | 'profile'>('home');

  // ============ 轮播图状态 ============
  const [carouselList, setCarouselList] = useState<ProductCarousalVO[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const carouselTimerRef = useRef<NodeJS.Timeout | null>(null);

  const {
    loading,
    likeApi,
    likeScrollApi,
    recommendScrollApi,
    hotProductsApi,
    mostNewProductsApi,
    findCursorApi
  } = useRecommendProduct();

  const { findByType } = useProductCarousal();
  const { saveBrowses } = useUserBrowse();

  // ============ 浏览记录相关 Refs ============
  const recordedProductsRef = useRef<Set<string>>(new Set());
  const timerMapRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const pendingRecordsRef = useRef<UserBrowseSaveVO[]>([]);
  const flushTimerRef = useRef<NodeJS.Timeout | null>(null);
  const productRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());
  const observerRef = useRef<IntersectionObserver | null>(null);

  const DWELL_TIME_THRESHOLD = 4000;
  const FLUSH_INTERVAL = 10000;
  const FLUSH_COUNT_THRESHOLD = 5;

  // ============ Refs 用于解决闭包陷阱 ============
  const hasMoreRef = useRef(hasMore);
  const loadingMoreRef = useRef(loadingMore);
  const activeTabRef = useRef(activeTab);
  const isFallbackModeRef = useRef(isFallbackMode);
  const fallbackCursorRef = useRef(fallbackCursor);

  useEffect(() => { hasMoreRef.current = hasMore; }, [hasMore]);
  useEffect(() => { loadingMoreRef.current = loadingMore; }, [loadingMore]);
  useEffect(() => { activeTabRef.current = activeTab; }, [activeTab]);
  useEffect(() => { isFallbackModeRef.current = isFallbackMode; }, [isFallbackMode]);
  useEffect(() => { fallbackCursorRef.current = fallbackCursor; }, [fallbackCursor]);

  // ============ 浏览记录核心逻辑 ============

  const flushRecords = useCallback(async () => {
    if (pendingRecordsRef.current.length === 0) return;

    const recordsToSend = [...pendingRecordsRef.current];
    pendingRecordsRef.current = [];

    console.log(`[浏览记录] 正在上报 ${recordsToSend.length} 条记录...`);
    saveBrowses(recordsToSend).then(() => {
      console.log('[浏览记录] 上报成功');
    }).catch(e => console.error('[浏览记录] 上报失败', e));
  }, [saveBrowses]);

  useEffect(() => {
    if (flushTimerRef.current) clearInterval(flushTimerRef.current);
    flushTimerRef.current = setInterval(flushRecords, FLUSH_INTERVAL);
    return () => {
      if (flushTimerRef.current) clearInterval(flushTimerRef.current);
      flushRecords();
    };
  }, [flushRecords]);

  const startDwellTimer = useCallback((product: ProductCustomerVO) => {
    const productId = product.id;

    if (recordedProductsRef.current.has(productId)) {
      return;
    }
    if (timerMapRef.current.has(productId)) {
      return;
    }

    console.log(`[浏览记录] 商品 ${productId} 进入视口，开始计时 ${DWELL_TIME_THRESHOLD}ms`);

    const timer = setTimeout(() => {
      const now = new Date().toISOString();
      const record: UserBrowseSaveVO = {
        product: product as unknown as ProductApiVO,
        browseStartTime: now,
        browseEndTime: null,
        ipAddress: '',
        deviceType: /Mobi/i.test(navigator.userAgent) ? 'mobile' : 'pc',
        browseDuration: String(DWELL_TIME_THRESHOLD),
      };

      pendingRecordsRef.current.push(record);
      recordedProductsRef.current.add(productId);
      timerMapRef.current.delete(productId);

      console.log(`[浏览记录] 商品 ${productId} 停留达标，已加入队列。当前队列长度: ${pendingRecordsRef.current.length}`);

      if (pendingRecordsRef.current.length >= FLUSH_COUNT_THRESHOLD) {
        flushRecords();
      }
    }, DWELL_TIME_THRESHOLD);

    timerMapRef.current.set(productId, timer);
  }, [flushRecords]);

  const cancelDwellTimer = useCallback((productId: string) => {
    if (recordedProductsRef.current.has(productId)) return;

    const timer = timerMapRef.current.get(productId);
    if (timer) {
      clearTimeout(timer);
      timerMapRef.current.delete(productId);
      console.log(`[浏览记录] 商品 ${productId} 离开视口，计时取消`);
    }
  }, []);

  useEffect(() => {
    if (activeTab !== 'home') return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5
    };

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach(entry => {
        const productId = entry.target.getAttribute('data-product-id');
        if (!productId) return;

        if (entry.isIntersecting) {
          const product = allProductsMap.current.get(productId);
          if (product) {
            startDwellTimer(product);
          }
        } else {
          cancelDwellTimer(productId);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    observerRef.current = observer;

    productRefs.current.forEach((el, id) => {
      if (el) {
        observer.observe(el);
      }
    });

    return () => {
      observer.disconnect();
      observerRef.current = null;
    };
  }, [
    activeTab,
    currentRecommendProducts.length,
    hotProducts.length,
    newProducts.length,
    startDwellTimer,
    cancelDwellTimer
  ]);

  const allProductsMap = useRef<Map<string, ProductCustomerVO>>(new Map());
  useEffect(() => {
    allProductsMap.current.clear();
    const all = [...hotProducts, ...newProducts, ...currentRecommendProducts];
    all.forEach(p => {
      allProductsMap.current.set(p.id, p);
    });
  }, [hotProducts, newProducts, currentRecommendProducts]);

  // ============ 业务逻辑函数 ============
  const loadCarousel = useCallback(async () => {
    try {
      const res = await findByType(2);
      if (res?.data && Array.isArray(res.data)) {
        const filtered = res.data.filter((item: ProductCarousalVO) => item.status === 1).sort((a, b) => a.sort - b.sort);
        setCarouselList(filtered);
        if (filtered.length > 0) setCurrentSlide(0);
      }
    } catch (err) { console.error('加载轮播图失败:', err); }
  }, [findByType]);

  const loadHotProducts = useCallback(async () => {
    try { const data = await hotProductsApi(); if (data) setHotProducts(data); }
    catch (err) { console.error('加载热门商品失败:', err); }
  }, [hotProductsApi]);

  const loadNewProducts = useCallback(async () => {
    try { const data = await mostNewProductsApi(); if (data) setNewProducts(data); }
    catch (err) { console.error('加载最新商品失败:', err); }
  }, [mostNewProductsApi]);

  const loadMoreRecommendations = useCallback(async (isRefresh = false) => {
    if (loadingMoreRef.current || (!hasMoreRef.current && !isRefresh)) return;
    setLoadingMore(true);
    try {
      let data: ProductCustomerVO[] | null = null;
      let nextHasMore = true;
      let shouldFallback = isFallbackModeRef.current;
      
      // 如果是"猜你喜欢"模式，调用 likeScrollApi
      if (recommendType === 'like') {
        // 计算 offset：刷新时从 0 开始，否则根据当前已加载的数量计算
        const offset = isRefresh ? 0 : currentRecommendProducts.length;
        const res = await likeScrollApi(offset, 10, isRefresh);
        
        if (res && res.length > 0) {
          // 如果返回的数据少于 pageSize，说明没有更多数据了
          const nextHasMore = res.length >= 10;
          
          if (isRefresh) {
            setCurrentRecommendProducts(res);
          } else {
            setCurrentRecommendProducts(prev => [...prev, ...res]);
          }
          setHasMore(nextHasMore);
        } else {
          setHasMore(false);
        }
        return;
      }
      
      // "为你推荐"模式的原有逻辑
      if (isRefresh) {
        setIsFallbackMode(false); setFallbackCursor(null); setScrollPage(0); shouldFallback = false;
      }
      if (!shouldFallback) {
        const res = await recommendScrollApi(10, isRefresh);
        if (res?.rows && res.rows.length > 0) { data = res.rows; nextHasMore = res.hasNext; }
        else {
          shouldFallback = true; setIsFallbackMode(true);
          const fallbackRes = await findCursorApi({ lastId: isRefresh ? null : fallbackCursorRef.current, pageSize: 10, order: 'DESC', condition: {} as any });
          if (fallbackRes?.rows && fallbackRes.rows.length > 0) {
            data = fallbackRes.rows; nextHasMore = fallbackRes.hasNext;
            setFallbackCursor(fallbackRes.cursor ? String(fallbackRes.cursor) : null);
          } else { nextHasMore = false; }
        }
      } else {
        const res = await findCursorApi({ lastId: isRefresh ? null : fallbackCursorRef.current, pageSize: 10, order: 'DESC', condition: {} as any });
        if (res?.rows && res.rows.length > 0) {
          data = res.rows; nextHasMore = res.hasNext;
          setFallbackCursor(res.cursor ? String(res.cursor) : null);
        } else { nextHasMore = false; }
      }
      if (data) {
        if (isRefresh) setCurrentRecommendProducts(data);
        else setCurrentRecommendProducts(prev => [...prev, ...(data || [])]);
        setHasMore(nextHasMore);
      } else { setHasMore(false); }
      if (!isRefresh) setScrollPage(prev => prev + 1);
    } catch (err) { console.error('加载推荐流失败:', err); message.error('加载失败，请重试'); }
    finally { setLoadingMore(false); }
  }, [recommendScrollApi, findCursorApi, likeScrollApi, recommendType, currentRecommendProducts.length]);

  useEffect(() => {
    loadCarousel(); loadHotProducts(); loadNewProducts(); loadMoreRecommendations(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startAutoPlay = useCallback(() => {
    if (carouselTimerRef.current) clearInterval(carouselTimerRef.current);
    if (!isHovering && carouselList.length > 1) {
      carouselTimerRef.current = setInterval(() => setCurrentSlide((prev) => (prev + 1) % carouselList.length), 3000);
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

  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  }, [currentSlide, isHovering, carouselList.length, startAutoPlay, stopAutoPlay]);

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout | null = null;
    const handleScroll = () => {
      if (scrollTimeout) return;
      scrollTimeout = setTimeout(() => {
        scrollTimeout = null;
        if (activeTabRef.current === 'home' && hasMoreRef.current && !loadingMoreRef.current) {
          const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
          const scrollTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
          const clientHeight = window.innerHeight;
          if (scrollTop + clientHeight >= scrollHeight - 200) loadMoreRecommendations(false);
        }
      }, 200);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => { window.removeEventListener('scroll', handleScroll); if (scrollTimeout) clearTimeout(scrollTimeout); };
  }, [loadMoreRecommendations]);

  const handleSearch = (keyword: string) => {
    if (!keyword.trim()) { message.warning('请输入搜索关键词'); return; }
    navigate(`/search?q=${encodeURIComponent(keyword.trim())}`);
  };
  
  const openProductDetail = (id: string) => { 
    setSelectedProductId(id); 
    setIsModalVisible(true); 
  };
  
  const closeProductModal = () => { setIsModalVisible(false); setSelectedProductId(null); };
  const closeModal = () => setShowLoginModal(false);

  const quickLinks = [
    { title: '🔥 热门推荐', subtitle: '销量爆款 品质优选', items: hotProducts.map(item => ({ id: item.id, name: item.name, price: `¥${item.discountPrice}`, originalPrice: `¥${item.originalPrice}`, image: item.image || 'https://via.placeholder.com/150' })) },
    { title: '🆕 最新上架', subtitle: '新鲜好物 抢先体验', items: newProducts.map(item => ({ id: item.id, name: item.name, price: `¥${item.discountPrice}`, originalPrice: `¥${item.originalPrice}`, image: item.image || 'https://via.placeholder.com/150' })) },
  ];

  const renderProductCard = (product: ProductCustomerVO, isCompact = false) => {
    const cardClass = isCompact ? 'compact-product-card' : 'product-card';
    const imageClass = isCompact ? 'compact-product-image' : 'product-image';
    const infoClass = isCompact ? 'compact-product-info' : 'product-info';
    const nameClass = isCompact ? 'compact-product-name' : 'product-name';
    const priceRowClass = isCompact ? 'compact-product-price-row' : 'product-price-row';
    const currentPriceClass = isCompact ? 'compact-current-price' : 'current-price';
    const originalPriceClass = isCompact ? 'compact-original-price' : 'original-price';
    const badgeText = isCompact ? (hotProducts.some(h => h.id === product.id) ? '热销' : '新品') : (Number(product.originalPrice) > Number(product.discountPrice) ? `省¥${(Number(product.originalPrice) - Number(product.discountPrice)).toFixed(2)}` : '推荐');

    return (
      <div
        key={product.id}
        ref={(el) => {
          productRefs.current.set(product.id, el);
        }}
        data-product-id={product.id}
        className={cardClass}
        onClick={() => openProductDetail(product.id)}
        style={{ cursor: 'pointer' }}
      >
        <div className={imageClass}>
          <img src={product.image || 'https://via.placeholder.com/300'} alt={product.name} onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/300')} />
          <div className={`${isCompact ? 'compact-product-badge' : 'product-badge'}`}>{badgeText}</div>
        </div>
        <div className={infoClass}>
          {!isCompact && (
            <div>
              <h3 className={nameClass}>{product.name}</h3>
              <div className="product-rating"><span className="rating-stars">★★★★★</span><span className="rating-score">4.8</span></div>
              <div className="product-sales">{product.salesVolume ? product.salesVolume.toLocaleString() : '0'}+ 人买过</div>
            </div>
          )}
          {isCompact && <h3 className={nameClass}>{product.name}</h3>}
          {isCompact && <div className="compact-product-sales">热销</div>}
          <div className={priceRowClass}>
            <span className={currentPriceClass}>¥{product.discountPrice}</span>
            {product.originalPrice && <span className={originalPriceClass}>¥{product.originalPrice}</span>}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="jd-homepage">
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

      <main className="main-content">
        {activeTab === 'home' && (
          <div className="content-wrapper">
            <div className="header-section">
              <div className="logo-area">
                <div className="logo"><span className="logo-text">小西</span></div>
                <div className="location" style={{ position: 'relative', display: 'inline-block' }}>
                  <span className="location-icon">📍</span><span>云南</span>
                </div>
              </div>
              <div className="search-area">
                <div className="search-container">
                  <form onSubmit={(e) => { e.preventDefault(); handleSearch(searchQuery); }} className="search-form">
                    <select className="search-category" aria-label="商品分类" title="商品分类">
                      <option value="goods">商品</option>
                      <option value="brand">品牌</option>
                      <option value="store">店铺</option>
                    </select>
                    <input type="text" placeholder="显卡 3060ti" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="search-input" aria-label="搜索关键词" />
                    <button type="submit" className="search-btn" aria-label="搜索"><span className="search-icon">🔍</span>搜索</button>
                  </form>
                  <button className="ai-search" onClick={() => setShowAiDrawer(true)}><span className="ai-icon">🤖</span>小西 AI</button>
                </div>
                <div className="search-tags">
                  {['进口奶粉', '粮油 9.9', '桌面加湿器', '银饰', '羽绒服', '保暖内衣', '手套', '暖手宝'].map((tag, index) => (<span key={index} className="search-tag">{tag}</span>))}
                </div>
              </div>
              <div className="ad-area"><div className="ad-banner"><div className="ad-content"><div className="ad-title">大促来袭</div><div className="ad-desc">福利加码 限时抢购</div></div></div></div>
            </div>

            <div className="main-layout">
              <div className="content-area" style={{ width: '100%' }}>
                <div className="top-section">
                  
                  {/* ============ 修改后的轮播图 + 国补区域 ============ */}
                  <section className="hero-banner">
                    <div className="banner-main">
                      <div className="banner-flex-container">
                        
                        {/* 左侧：轮播图 (70%) */}
                        <div className="banner-left-carousel">
                          {carouselList.length > 0 ? (
                            <>
                              <div className="banner-content no-border" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
                                <div className="banner-image-wrapper">
                                  <img src={carouselList[currentSlide]?.image || 'https://via.placeholder.com/800x300'} alt="banner" onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/800x300')} className="banner-image" />
                                  <div className="banner-text-overlay">
                                    <h1 className="banner-title-overlay">{carouselList[currentSlide]?.title || '精选好物'}</h1>
                                    <button className="cta-button-overlay" onClick={() => { const link = carouselList[currentSlide]?.link; if (link) window.open(link, '_blank'); }}>立即抢购 →</button>
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
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        goToSlide(index);
                                      }
                                    }}
                                  />
                                ))}
                              </div>
                            </>
                          ) : (
                            <div className="banner-content no-border">
                              <div className="banner-image-wrapper">
                                <img src="https://images.unsplash.com/photo-1553356084-58ef4a67b2a7?w=800&h=300&fit=crop" alt="banner" className="banner-image" />
                                <div className="banner-text-overlay"><h1>精选好物</h1><button>立即抢购 →</button></div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* 右侧：国补广告 (30%) */}
                        <div className="banner-right-promo">
                          {/* 国补主图 */}
                          <div className="promo-card national-subsidy">
                            <img 
                              src="https://img14.360buyimg.com/imagetools/jfs/t1/228559/30/15688/48390/67665f6aF22302222/3222222222222222.jpg" 
                              alt="国家补贴" 
                              className="promo-image"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                const parent = e.currentTarget.parentElement;
                                if(parent) {
                                  parent.innerHTML = `
                                    <div style="height:100%; display:flex; flex-direction:column; justify-content:center; align-items:center; background: linear-gradient(135deg, #00c6fb 0%, #005bea 100%); color:white; border-radius:12px; padding:15px; text-align:center;">
                                      <h3 style="margin:0; font-size:18px; font-weight:bold;">🇨🇳 国家补贴</h3>
                                      <p style="margin:8px 0 0; font-size:13px; opacity:0.9;">最高立减 20%</p>
                                      <button style="margin-top:12px; padding:5px 14px; background:white; color:#005bea; border:none; border-radius:16px; font-weight:bold; font-size:12px; cursor:pointer;">立即领取</button>
                                    </div>
                                  `;
                                }
                              }}
                            />
                          </div>
                          
                          {/* 下方副广告位 */}
                          <div className="promo-card secondary-promo">
                             <img src="https://via.placeholder.com/400x200/e1251b/ffffff?text=PLUS+会员" alt="PLUS会员" className="promo-image" />
                          </div>
                        </div>

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
                          {link.items.map((item) => {
                            const fullProduct = [...hotProducts, ...newProducts].find(p => p.id === item.id);
                            return fullProduct ? renderProductCard(fullProduct, true) : null;
                          })}
                        </div>
                      </div>
                    ))}
                  </section>
                </div>
              </div>
            </div>

            <section className="recommendation-section">
              <div className="section-header">
                <div className="header-left">
                  <div className="recommend-tabs">
                    <button className={`tab-btn ${recommendType === 'scroll' ? 'active' : ''}`} onClick={() => { if (recommendType !== 'scroll') { setRecommendType('scroll'); loadMoreRecommendations(true); } }}>为你推荐</button>
                    <button className={`tab-btn ${recommendType === 'like' ? 'active' : ''}`} onClick={() => { if (recommendType !== 'like') { setRecommendType('like'); setLoadingMore(true); likeApi().then(data => { if (data) { setCurrentRecommendProducts(data); setHasMore(false); setIsFallbackMode(false); } setLoadingMore(false); }); } }}>猜你喜欢</button>
                  </div>
                </div>
                <button className="refresh-btn" onClick={() => loadMoreRecommendations(true)} disabled={loadingMore}><span>🔄</span>{loadingMore ? '加载中...' : '换一批'}</button>
              </div>

              <div className={`product-grid ${currentRecommendProducts.length === 0 ? 'empty-state' : ''}`}>
                {(loading && currentRecommendProducts.length === 0) || (loadingMore && scrollPage === 0 && currentRecommendProducts.length === 0) ? (
                  <div className="loading-state"><span>⏳</span> 加载中...</div>
                ) : currentRecommendProducts.length > 0 ? (
                  currentRecommendProducts.map((product) => renderProductCard(product, false))
                ) : (
                  <div className="empty-state"><span>😕</span> 暂无推荐商品</div>
                )}
              </div>

              {currentRecommendProducts.length > 0 && (
                <div className="load-more-trigger" style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                  {loadingMore ? <span>加载中...</span> : hasMore ? <span>上滑加载更多</span> : <span>—— 已经到底了 ——</span>}
                </div>
              )}
            </section>
          </div>
        )}

        {activeTab === 'orders' && <MyOrdersPage />}
        {activeTab === 'cart' && <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>🛒 购物车功能开发中...</div>}
        {activeTab === 'service' && <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>💬 客服中心功能开发中...</div>}
        {activeTab === 'profile' && <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>👤 个人中心功能开发中...</div>}
      </main>

      {showLoginModal && (<div className="modal-overlay"><div className="login-modal"><div className="modal-header"><h2>小西登录</h2><button className="close-btn" onClick={closeModal}>×</button></div><div className="modal-body"><div className="login-form"><input type="text" placeholder="手机号/用户名/邮箱" /><input type="password" placeholder="密码" /><button className="submit-btn">登录</button></div></div></div></div>)}
      
      <ProductEditModal 
        visible={isModalVisible} 
        productId={selectedProductId} 
        onClose={closeProductModal} 
      />
      
      {showAiDrawer && (
        <>
          <div className="ai-drawer-overlay" onClick={() => setShowAiDrawer(false)} />
          <div className={`ai-drawer ${showAiDrawer ? 'ai-drawer-open' : ''}`}>
            <AiChatBox 
              onClose={() => setShowAiDrawer(false)} 
              onProductClick={openProductDetail} 
            />
          </div>
        </>
      )}
    </div>
  );
};

export default HomePage;