// src/pages/SearchResultsPage.tsx
import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Input,
  Button,
  Card,
  Select,
  Space,
  Typography,
  Tag,
  Dropdown,
  type MenuProps,
  Divider,
  Empty,
  Spin,
  message
} from 'antd';
import {
  SearchOutlined,
  DownOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import { useSearchParams, useNavigate } from 'react-router-dom';
import useRecommendProduct from '@/stores/goods/RecommendProduct';
import type { ProductCustomerVO } from '@/api/goods/product/RecommendProductType';

const { Option } = Select;
const { Title, Text } = Typography;

const SearchResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('q') || '';

  const [searchQuery, setSearchQuery] = useState(keyword || '');
  const [products, setProducts] = useState<ProductCustomerVO[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastId, setLastId] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);

  const { searchProductApi } = useRecommendProduct();

  useEffect(() => {
    if (!keyword.trim()) {
      message.warning('请输入搜索关键词');
      navigate('/');
      return;
    }
    setSearchQuery(keyword);
    setProducts([]);
    setHasMore(true);
    setLastId('');
    setCurrentPage(1);
    loadProducts('', true);
  }, [keyword]);

  const loadProducts = async (nextLastId: string, reset = false) => {
    if (loading || (!reset && !hasMore)) return;
    
    setLoading(true);
    try {
      const res = await searchProductApi({
        lastId: nextLastId,
        pageSize: 20,
        order: 'salesVolume_desc',
        condition: { searchContent: keyword },
      });

      if (res?.rows && res.rows.length > 0) {
        setProducts((prev) => (reset ? res.rows : [...prev, ...res.rows]));
        setLastId(res.rows[res.rows.length - 1]?.id || '');
        setHasMore(res.rows.length === 20);
      } else {
        if (reset) setProducts([]);
        setHasMore(false);
      }
    } catch (err) {
      console.error('搜索失败:', err);
      message.error('搜索失败，请重试');
      if (reset) setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      message.warning('请输入搜索关键词');
      return;
    }
    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      loadProducts(lastId, false);
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleAddToCart = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    message.success('已加入购物车');
    console.log('加入购物车:', productId);
  };

  // 渲染商品卡片
  const renderProductCard = (product: ProductCustomerVO) => {
    const isDiscounted =
      Number(product.originalPrice) > Number(product.discountPrice);
    const saveAmount = isDiscounted
      ? (Number(product.originalPrice) - Number(product.discountPrice)).toFixed(2)
      : null;

    return (
      <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
        <Card
          hoverable
          cover={
            <div style={{ position: 'relative', paddingTop: '100%' }}>
              <img
                alt={product.name}
                src={product.image || 'https://via.placeholder.com/300'}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  backgroundColor: '#f8f8f8'
                }}
                onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/300')}
              />
              {saveAmount && (
                <Tag 
                  color="#e4393c" 
                  style={{ position: 'absolute', top: 8, right: 8, zIndex: 2 }}
                >
                  省¥{saveAmount}
                </Tag>
              )}
            </div>
          }
          onClick={() => console.log('查看商品:', product.id)}
          actions={[
            <Button
              type="text"
              icon={<ShoppingCartOutlined />}
              style={{ color: '#e4393c' }}
              onClick={(e) => handleAddToCart(product.id, e)}
            >
              加入购物车
            </Button>,
          ]}
        >
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              已售{product.salesVolume?.toLocaleString() || 0}+
            </Text>
          </div>
          
          <Typography.Paragraph 
            ellipsis={{ rows: 2, tooltip: product.name }} 
            style={{ margin: '8px 0', height: 40 }}
          >
            {product.name}
          </Typography.Paragraph>
          
          <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>
            {product.brand || '小西自营'}
          </Text>
          
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <Text strong style={{ color: '#e4393c', fontSize: 16 }}>
              ¥{Number(product.discountPrice).toFixed(2)}
            </Text>
            {isDiscounted && (
              <Text delete type="secondary" style={{ fontSize: 12 }}>
                ¥{Number(product.originalPrice).toFixed(2)}
              </Text>
            )}
          </div>
        </Card>
      </Col>
    );
  };

  const menuItems: MenuProps['items'] = [
    { key: '1', label: <a href="#">企业采购</a> },
    { key: '2', label: <a href="#">网站导航</a> },
    { key: '3', label: <a href="#">手机</a> },
    { key: '4', label: <a href="#">网站无障碍</a> },
    { key: '5', label: <a href="#">中国大版块</a> },
    { key: '6', label: <a href="#">jd_kIAyZF...</a> },
    { key: '7', label: <a href="#">切换企业版</a> },
    { key: '8', label: <a href="#">同款降价</a> },
  ];

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* 顶部导航 */}
      <header 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#fff',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          padding: '8px 24px',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          flexWrap: 'wrap',
          gap: 12
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <a href="/" style={{ fontSize: 24, fontWeight: 700, color: '#e4393c' }}>
            小西
          </a>
          <span 
            style={{
              backgroundColor: '#e4393c',
              color: '#fff',
              fontSize: 12,
              padding: '2px 8px',
              borderRadius: 12,
              fontWeight: 500
            }}
          >
            PLUS
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', flex: 1, maxWidth: 640, margin: '0 16px' }}>
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="输入商品名称"
            prefix={<SearchOutlined style={{ color: '#999' }} />}
            onPressEnter={handleSearch}
            style={{ borderRadius: 0, borderRight: 'none', borderColor: '#e4393c' }}
          />
          <Button
            type="primary"
            onClick={handleSearch}
            style={{
              borderRadius: 0,
              height: 40,
              backgroundColor: '#e4393c',
              borderColor: '#e4393c',
              marginLeft: -1
            }}
          >
            搜索
          </Button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 20, fontSize: 14 }}>
          <a href="#" style={{ color: '#333', textDecoration: 'none' }}>购物车</a>
          <a href="#" style={{ color: '#333', textDecoration: 'none' }}>我的订单</a>
          <a href="#" style={{ color: '#333', textDecoration: 'none' }}>我的小西</a>
          <Dropdown menu={{ items: menuItems }} placement="bottomRight">
            <a 
              onClick={(e) => e.preventDefault()}
              style={{ color: '#666', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 2 }}
            >
              更多<DownOutlined style={{ fontSize: 12 }} />
            </a>
          </Dropdown>
        </div>
      </header>

      {/* 主内容 */}
      <main style={{ maxWidth: 1240, margin: '16px auto 0', padding: '0 16px' }}>
        <div style={{ margin: '16px 0 24px' }}>
          <Title level={4} style={{ margin: 0 }}>
            找到<span style={{ color: '#e4393c', fontWeight: 600 }}> “{keyword}” </span>
            相关商品 {products.length} 件
          </Title>
        </div>

        {/* 筛选栏 */}
        <div 
          style={{
            backgroundColor: '#fff',
            borderRadius: 8,
            padding: '16px 20px',
            marginBottom: 24,
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
          }}
        >
          <Row gutter={[16, 16]} align="middle">
            <Col flex="auto">
              <label style={{ color: '#666', marginRight: 12 }}>品牌：</label>
              <Space wrap size={[8, 8]}>
                {['Apple', '联想', '华为', 'ThinkPad', '惠普', '华硕'].map((brand) => (
                  <Tag 
                    key={brand} 
                    style={{
                      padding: '4px 12px',
                      borderRadius: 16,
                      border: '1px solid #f0f0f0',
                      backgroundColor: '#fafafa',
                      fontSize: 13,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#e4393c';
                      e.currentTarget.style.color = '#e4393c';
                      e.currentTarget.style.backgroundColor = '#fff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#f0f0f0';
                      e.currentTarget.style.color = '#333';
                      e.currentTarget.style.backgroundColor = '#fafafa';
                    }}
                  >
                    {brand}
                  </Tag>
                ))}
              </Space>
            </Col>

            <Col flex="0 0 200px">
              <label style={{ color: '#666', marginRight: 12 }}>价格：</label>
              <Select
                defaultValue="all"
                style={{ width: 130, borderRadius: 16 }}
                dropdownStyle={{ borderRadius: '8px' }}
              >
                <Option value="all">全部</Option>
                <Option value="0-2000">0-2000</Option>
                <Option value="2000-5000">2000-5000</Option>
                <Option value="5000+">5000以上</Option>
              </Select>
            </Col>

            <Col flex="0 0 280px" style={{ textAlign: 'right' }}>
              <Space size={8} wrap>
                <Tag 
                  color="#e4393c" 
                  style={{ borderRadius: 20, cursor: 'pointer' }}
                >
                  综合
                </Tag>
                <Tag 
                  style={{ 
                    borderRadius: 20, 
                    cursor: 'pointer',
                    backgroundColor: '#f5f5f5',
                    border: 'none'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#eee'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                >
                  销量
                </Tag>
                <Tag 
                  style={{ 
                    borderRadius: 20, 
                    cursor: 'pointer',
                    backgroundColor: '#f5f5f5',
                    border: 'none'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#eee'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                >
                  价格
                </Tag>
                <Tag 
                  style={{ 
                    borderRadius: 20, 
                    cursor: 'pointer',
                    backgroundColor: '#f5f5f5',
                    border: 'none'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#eee'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                >
                  小西物流
                </Tag>
                <Tag 
                  style={{ 
                    borderRadius: 20, 
                    cursor: 'pointer',
                    backgroundColor: '#f5f5f5',
                    border: 'none'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#eee'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                >
                  国家补贴
                </Tag>
              </Space>
            </Col>
          </Row>
        </div>

        <Divider style={{ margin: '8px 0 24px' }} />

        {/* 商品列表 */}
        <div style={{ minHeight: 400 }}>
          {loading ? (
            <div style={{ 
              minHeight: '400px', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center' 
            }}>
              <Spin tip="正在加载..." size="large" />
            </div>
          ) : products.length === 0 ? (
            <Empty
              description="暂无相关商品，试试其他关键词吧"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ) : (
            <>
              <Row gutter={[16, 24]}>
                {products.map(renderProductCard)}
              </Row>

              {hasMore && (
                <div style={{ textAlign: 'center', margin: '40px 0' }}>
                  <Button onClick={handleLoadMore} loading={loading}>
                    加载更多商品
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default SearchResultsPage;