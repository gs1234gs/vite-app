import React, { useState } from 'react';
import './HomePage.css';

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [aiMessages, setAiMessages] = useState([
    { id: 1, text: '您好！我是京东AI助手，可以帮您推荐商品、查询优惠、解答购物问题。有什么可以帮您的吗？', isUser: false }
  ]);
  const [aiInput, setAiInput] = useState('');

  // 模拟商品数据
  const featuredProducts = [
    {
      id: 1,
      name: '防晒伞 UPF50+专业防晒',
      price: '¥59.9',
      originalPrice: '¥89',
      image: 'https://images.unsplash.com/photo-1553356084-58ef4a67b2a7?w=300&h=300&fit=crop',
      discount: '省¥29.1',
      rating: 4.8,
      sales: '2万+条评价'
    },
    {
      id: 2,
      name: '超能洗衣液 8kg组合装',
      price: '¥39.9',
      originalPrice: '¥59.9',
      image: 'https://images.unsplash.com/photo-1600857062244-5c0fba31bd6f?w=300&h=300&fit=crop',
      discount: '6.7折',
      rating: 4.9,
      sales: '10万+条评价'
    },
    {
      id: 3,
      name: '游戏本 RTX4060 16G',
      price: '¥6499',
      originalPrice: '¥7999',
      image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=300&h=300&fit=crop',
      discount: '省¥1500',
      rating: 4.7,
      sales: '5万+条评价'
    },
    {
      id: 4,
      name: '舒适透气家居拖鞋',
      price: '¥89',
      originalPrice: '¥129',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop',
      discount: '新品上市',
      rating: 4.6,
      sales: '1万+条评价'
    },
    {
      id: 5,
      name: '一贝子纯银手链',
      price: '¥299',
      originalPrice: '¥399',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=300&fit=crop',
      discount: '限时特惠',
      rating: 4.9,
      sales: '5000+条评价'
    },
    {
      id: 6,
      name: '无线蓝牙耳机',
      price: '¥199',
      originalPrice: '¥299',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
      discount: '爆款推荐',
      rating: 4.8,
      sales: '8万+条评价'
    }
  ];

  // AI推荐商品数据
  const aiRecommendProducts = [
    {
      id: 101,
      name: '无线静音鼠标',
      price: '¥89',
      originalPrice: '¥129',
      image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=150&h=150&fit=crop',
      discount: '热销'
    },
    {
      id: 102,
      name: '便携充电宝',
      price: '¥159',
      originalPrice: '¥199',
      image: 'https://images.unsplash.com/photo-1609592810795-4c98871f0033?w=150&h=150&fit=crop',
      discount: '快充'
    },
    {
      id: 103,
      name: '机械键盘',
      price: '¥299',
      originalPrice: '¥399',
      image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=150&h=150&fit=crop',
      discount: '电竞'
    },
    {
      id: 104,
      name: '蓝牙音箱',
      price: '¥199',
      originalPrice: '¥259',
      image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=150&h=150&fit=crop',
      discount: '新品'
    }
  ];

  const quickQuestions = [
    "推荐一款性价比高的手机",
    "618有什么优惠活动？",
    "帮我找笔记本电脑",
    "物流配送时间多久？",
    "哪个品牌的洗衣机好？"
  ];

  const quickLinks = [
    { 
      title: '💰 百亿补贴', 
      subtitle: '国家补贴 × 平台补贴',
      items: [
        { name: '无线鼠标', price: '¥80', originalPrice: '¥16.33', image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=150&h=150&fit=crop' },
        { name: '游戏主机', price: '¥5699', originalPrice: '¥1400', image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=150&h=150&fit=crop' },
        { name: '内存条', price: '¥2327', originalPrice: '¥862', image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=150&h=150&fit=crop' },
        { name: '洗衣液', price: '¥58.41', originalPrice: '¥20.17', image: 'https://images.unsplash.com/photo-1600857062244-5c0fba31bd6f?w=150&h=150&fit=crop' }
      ]
    },
    { 
      title: '⚡ 京东秒杀', 
      subtitle: '限时抢购 低价狂欢',
      items: [
        { name: '纯棉T恤', price: '¥60.7', originalPrice: '¥89', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=150&h=150&fit=crop' },
        { name: '休闲零食', price: '¥9.3', originalPrice: '¥19.9', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=150&h=150&fit=crop' },
        { name: '新鲜菠萝', price: '¥54.9', originalPrice: '¥79', image: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=150&h=150&fit=crop' },
        { name: '时尚卫衣', price: '¥149', originalPrice: '¥299', image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=150&h=150&fit=crop' }
      ]
    }
  ];

  const handleSearch = (e : React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('搜索:', searchQuery);
  };

  const handleLogin = () => {
    setShowLoginModal(true);
  };

  const closeModal = () => {
    setShowLoginModal(false);
  };

  const handleAiSend = () => {
    if (!aiInput.trim()) return;

    const userMessage = {
      id: aiMessages.length + 1,
      text: aiInput,
      isUser: true
    };

    const aiResponse = {
      id: aiMessages.length + 2,
      text: getAiResponse(aiInput),
      isUser: false
    };

    setAiMessages([...aiMessages, userMessage, aiResponse]);
    setAiInput('');
  };

  const handleQuickQuestion = (question : any) => {
    setAiInput(question);
  };

  const getAiResponse = (input : any) => {
    const text = input.toLowerCase();
    if (text.includes('手机')) {
      return '根据您的需求，我为您推荐几款热销手机：\n• iPhone 15 Pro Max：旗舰性能，拍照出色\n• 华为Mate 60 Pro：国产旗舰，信号强劲\n• 小米14 Ultra：徕卡影像，性价比高\n您更关注拍照、性能还是价格呢？';
    } else if (text.includes('电脑') || text.includes('笔记本')) {
      return '笔记本电脑专区正在促销：\n• MacBook Pro：M3芯片，专业创作\n• ThinkPad X1：商务办公，稳定可靠\n• 华为MateBook：轻薄便携，多屏协同\n目前部分机型享24期免息，需要我帮您详细对比吗？';
    } else if (text.includes('优惠') || text.includes('折扣') || text.includes('618')) {
      return '当前618大促活动优惠多多：\n🎯 全场跨店满减：每满299减50\n🎯 百亿补贴：热门商品直降千元\n🎯 限时秒杀：多款商品历史低价\n🎯 新人专享：首单立减100元\n需要我帮您查找特定商品的优惠吗？';
    } else if (text.includes('物流') || text.includes('快递')) {
      return '京东物流配送信息：\n🚚 大部分地区支持次日达\n🚚 211限时达：上午11点前下单，当日送达\n🚚 生鲜商品：专属冷链配送\n🚚 可实时追踪物流信息\n您需要查询具体订单的物流状态吗？';
    } else {
      return '感谢您的咨询！作为京东AI助手，我可以：\n🔍 帮您推荐合适的商品\n💰 查询最新优惠活动\n📦 解答物流配送问题\n🎁 提供购物建议\n请告诉我您具体需要什么帮助？';
    }
  };

  return (
    <div className="jd-homepage">
      {/* 顶部导航栏 */}
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

      {/* 主要内容区域 */}
      <main className="main-content">
        <div className="content-wrapper">
          {/* Logo和搜索栏 */}
          <div className="header-section">
            <div className="logo-area">
              <div className="logo">
                <span className="logo-text">京东</span>
              </div>
              <div className="location">
                <span className="location-icon">📍</span>
                <span>云南</span>
              </div>
            </div>
            
            <div className="search-area">
              <div className="search-container">
                <form onSubmit={handleSearch} className="search-form">
                  <select className="search-category" aria-label='商品分类'>
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
                {['进口奶粉', '粮油9.9', '桌面加湿器', '银饰', '羽绒服', '保暖内衣', '手套', '暖手宝'].map((tag, index) => (
                  <span key={index} className="search-tag">{tag}</span>
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
            {/* 左侧AI对话框 */}
            <aside className="ai-sidebar">
              <div className="ai-chat-container">
                <div className="ai-header">
                  <div className="ai-avatar">AI</div>
                  <div className="ai-info">
                    <div className="ai-name">京东AI购物助手</div>
                    <div className="ai-status">在线实时为您服务</div>
                  </div>
                </div>
                
                <div className="ai-messages">
                  {aiMessages.map((message) => (
                    <div key={message.id} className={`message ${message.isUser ? 'user-message' : 'ai-message'}`}>
                      {!message.isUser && <div className="message-avatar">AI</div>}
                      <div className="message-content">
                        <div className="message-text">{message.text}</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="quick-questions">
                  <div className="questions-title">快速提问：</div>
                  <div className="questions-grid">
                    {quickQuestions.map((question, index) => (
                      <button 
                        key={index}
                        className="question-btn"
                        onClick={() => handleQuickQuestion(question)}
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="ai-input-area">
                  <input
                    type="text"
                    placeholder="输入您的问题，例如：推荐一款手机..."
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAiSend()}
                    className="ai-input"
                  />
                  <button 
                    onClick={handleAiSend}
                    disabled={!aiInput.trim()}
                    className="ai-send-btn"
                  >
                    发送
                  </button>
                </div>
                
                {/* AI推荐商品区域 */}
                <div className="ai-product-recommendations">
                  <div className="ai-recommendations-title">
                    <span>🔥</span>
                    AI为您推荐
                  </div>
                  <div className="ai-recommendations-grid">
                    {aiRecommendProducts.map((product) => (
                      <div key={product.id} className="ai-recommendation-card">
                        <div className="ai-recommendation-image">
                          <img src={product.image} alt={product.name} />
                        </div>
                        <div className="ai-recommendation-name">{product.name}</div>
                        <div className="ai-recommendation-price">
                          {product.price}
                          {product.originalPrice && (
                            <span className="ai-recommendation-original-price">{product.originalPrice}</span>
                          )}
                        </div>
                        <div className="ai-recommendation-badge">{product.discount}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* 右侧内容区域 */}
            <div className="content-area">
              <div className="top-section">
                {/* 轮播横幅 */}
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
                        <img src="https://images.unsplash.com/photo-1553356084-58ef4a67b2a7?w=400&h=250&fit=crop" alt="促销商品" />
                      </div>
                    </div>
                    <div className="banner-indicators">
                      {[1, 2, 3, 4, 5].map((_, index) => (
                        <span key={index} className={`indicator ${index === 0 ? 'active' : ''}`}></span>
                      ))}
                    </div>
                  </div>
                </section>

                {/* 快速入口 */}
                <section className="quick-links-section">
                  {quickLinks.map((link, index) => (
                    <div key={index} className="link-group">
                      <div className="group-header">
                        <h3 className="group-title">{link.title}</h3>
                        <span className="group-subtitle">{link.subtitle}</span>
                        <button className="group-more">更多 ›</button>
                      </div>
                      <div className="items-grid">
                        {link.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="item-card">
                            <div className="item-image">
                              <img src={item.image} alt={item.name} />
                            </div>
                            <div className="item-info">
                              <div className="item-name">{item.name}</div>
                              <div className="item-price-row">
                                <span className="item-price">{item.price}</span>
                                {item.originalPrice && (
                                  <span className="item-original-price">{item.originalPrice}</span>
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

          {/* 第二板块：推荐商品 */}
          <section className="recommendation-section">
            <div className="section-header">
              <div className="header-left">
                <div className="heart-icon">❤️</div>
                <h2 className="section-title">为你推荐</h2>
              </div>
              <button className="refresh-btn">换一批</button>
            </div>
            
            <div className="product-grid">
              {featuredProducts.map((product) => (
                <div key={product.id} className="product-card">
                  <div className="product-image">
                    <img src={product.image} alt={product.name} />
                    <div className="product-badge">{product.discount}</div>
                  </div>
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <div className="product-rating">
                      <span className="rating-stars">★★★★★</span>
                      <span className="rating-score">{product.rating}</span>
                    </div>
                    <div className="product-sales">{product.sales}</div>
                    <div className="product-price-row">
                      <span className="current-price">{product.price}</span>
                      <span className="original-price">{product.originalPrice}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* 登录弹窗 */}
      {showLoginModal && (
        <div className="modal-overlay">
          <div className="login-modal">
            <div className="modal-header">
              <h2>京东登录</h2>
              <button className="close-btn" onClick={closeModal}>×</button>
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
                  <a href="#" className="forgot-password">忘记密码？</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 底部固定菜单 */}
      {/* <div className="bottom-nav">
        <div className="nav-item active">
          <div className="nav-icon">🏠</div>
          <div className="nav-label">首页</div>
        </div>
        <div className="nav-item">
          <div className="nav-icon">🛒</div>
          <div className="nav-label">购物车</div>
        </div>
        <div className="nav-item">
          <div className="nav-icon">👤</div>
          <div className="nav-label">我的</div>
        </div>
        <div className="nav-item">
          <div className="nav-icon">💬</div>
          <div className="nav-label">客服</div>
        </div>
      </div> */}
    </div>
  );
};

export default HomePage;