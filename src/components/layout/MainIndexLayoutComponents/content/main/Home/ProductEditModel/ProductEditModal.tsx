import React, { useEffect, useState } from 'react';
import {
  Modal,
  Image,
  Tag,
  Typography,
  Spin,
  Row,
  Col,
  Tabs,
  Button,
  message,
  Space,
} from 'antd';
import {
  HeartFilled,
  ShareAltOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';

// 假设你有这些 API（请根据你的项目替换）
import type { ProductCustomerDetailVO } from '@/api/goods/product/RecommendProductType';
import type { SKUVO } from '@/api/goods/sku/SKUType';
import useRecommendProduct from '@/stores/goods/RecommendProduct';
import PaymentModal from '../PayModel/PaymentModal';

// 引入 CSS 模块
import styles from './ProductEditModal.module.css';

// 模拟购物车和收藏 API
const cartApi = {
  addCart: async (skuId: string, count: number) => {
    console.log('加入购物车:', skuId, count);
    return Promise.resolve();
  },
};

const favoriteApi = {
  toggle: async (productId: string) => {
    console.log('切换收藏:', productId);
    return Promise.resolve();
  },
  isFavorite: async (productId: string): Promise<boolean> => {
    return Math.random() > 0.5;
  },
};

const { Text, Title } = Typography;

interface ProductEditModalProps {
  visible: boolean;
  productId: string | null;
  onClose: () => void;
}

const cleanImageUrl = (url: string | undefined): string => {
  if (!url) return '/default-product.png';
  return url.replace(/^"(.*)"$/, '$1').trim();
};

const isVideoUrl = (url: string): boolean => {
  if (!url) return false;
  return /\.(mp4|webm|ogg|mov|avi|flv|wmv)$/i.test(url);
};

const getVideoPoster = (videoUrl: string): string => {
  return videoUrl.replace(/\.\w+$/, '.jpg');
};

const ProductEditModal: React.FC<ProductEditModalProps> = ({ visible, productId, onClose }) => {
  const { detailApi, loading } = useRecommendProduct();
  const [product, setProduct] = useState<ProductCustomerDetailVO | null>(null);
  const [selectedSku, setSelectedSku] = useState<SKUVO | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
const [paymentVisible, setPaymentVisible] = useState(false);
  useEffect(() => {
    if (visible && productId) {
      Promise.all([
        detailApi(productId),
        favoriteApi.isFavorite(productId),
      ]).then(([data, favorited]) => {
        if (data) {
          setProduct(data);
          setSelectedSku(data.skuList[0]);
        }
        setIsFavorited(favorited);
      });
    } else {
      setProduct(null);
      setSelectedSku(null);
      setIsFavorited(false);
    }
  }, [visible, productId, detailApi]);

  const buyerReviews = [
    { label: '印刷超清晰', count: 6 },
    { label: '讲解超详细', count: 7 },
    { label: '纸张很厚实', count: 4 },
    { label: '通俗易懂', count: 1 },
  ];

  const handleAddToCart = async () => {
    if (!selectedSku) {
      message.warning('请选择商品规格');
      return;
    }
    if ((selectedSku.stock || 0) <= 0) {
      message.error('库存不足');
      return;
    }
    try {
      await cartApi.addCart(selectedSku.id, 1);
      message.success('已加入购物车！');
    } catch (err) {
      message.error('加入失败，请重试');
    }
  };

  const handleBuyNow = () => {
    if (!selectedSku) {
      message.warning('请选择商品规格');
      return;
    }
    if ((selectedSku.stock || 0) <= 0) {
      message.error('库存不足');
      return;
    }
    message.info('正在跳转');
    setPaymentVisible(true);
  };

  const handleToggleFavorite = async () => {
    if (!productId) return;
    try {
      await favoriteApi.toggle(productId);
      setIsFavorited(!isFavorited);
      message.success(isFavorited ? '已取消收藏' : '已收藏');
    } catch (err) {
      message.error('操作失败');
    }
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/product/${productId}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      message.success('链接已复制，快去分享吧！');
    }).catch(() => {
      message.info('请手动复制链接：' + shareUrl);
    });
  };

  const handleSkuClick = (sku: SKUVO) => {
    setSelectedSku(sku);
  };

  return (
    <Modal
      title="商品详情"
      open={visible}
      onCancel={onClose}
      width={1200}
      footer={null}
      destroyOnClose
      maskClosable={true}
      closable={false}
    >
      {loading && !product ? (
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <Spin size="large" />
        </div>
      ) : product ? (
        <div className={styles.modalContent}>
          <Row gutter={[24, 24]}>
            {/* 左侧：主图 */}
            <Col span={12}>
              <div className={styles.mainImageContainer}>
                {selectedSku?.picList?.[0] ? (
                  isVideoUrl(selectedSku.picList[0]) ? (
                    <video
                      src={cleanImageUrl(selectedSku.picList[0])}
                      poster={getVideoPoster(cleanImageUrl(selectedSku.picList[0]))}
                      controls
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        backgroundColor: '#000',
                      }}
                    >
                      您的浏览器不支持视频播放。
                    </video>
                  ) : (
                    <Image
                      src={cleanImageUrl(selectedSku.picList[0])}
                      fallback="/default-product.png"
                      preview={false}
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  )
                ) : (
                  <Image
                    src="/default-product.png"
                    preview={false}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                )}
              </div>
            </Col>

            {/* 右侧：信息 */}
            <Col span={12}>
              <Title level={3} style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>
                {product.name}
              </Title>
              <Text type="secondary" style={{ marginTop: 8 }}>{product.brand || '—'} 著</Text>

              <div style={{ marginTop: 16 }}>
                <Text strong style={{ fontSize: '24px', color: '#cf1322' }}>
                  ¥{selectedSku?.price || '—'}
                </Text>
                <Text type="secondary" style={{ marginLeft: 8 }}>到手价</Text>
              </div>

              <div style={{ marginTop: 16 }}>
                <Text>库存：{selectedSku?.stock ?? '—'} 件</Text>
                <br />
                <Text>累计评价：{product.salesVolume || 0}+</Text>
              </div>

              <Space size="middle" className={styles.actionButtons}>
                <Button
                  icon={<HeartFilled style={{ color: '#ff4d4f' }} />}
                  onClick={handleToggleFavorite}
                  type={isFavorited ? 'primary' : 'default'}
                >
                  {isFavorited ? '已收藏' : '收藏'}
                </Button>
                <Button icon={<ShareAltOutlined />} onClick={handleShare}>
                  分享
                </Button>
              </Space>

              <div className={styles.skuSection}>
                <Text strong>商品规格：</Text>
                <div style={{ marginTop: 12 }}>
                  {product.skuList.map((sku) => {
                    const firstMedia = sku.picList?.[0];
                    const isVideo = firstMedia ? isVideoUrl(firstMedia) : false;
                    const displayUrl = isVideo
                      ? getVideoPoster(cleanImageUrl(firstMedia))
                      : cleanImageUrl(firstMedia);

                    return (
                      <div
                        key={sku.id}
                        onClick={() => handleSkuClick(sku)}
                        className={`${styles.skuItem} ${
                          selectedSku?.id === sku.id ? styles.skuItemSelected : ''
                        }`}
                      >
                        <div className={styles.skuThumbWrapper}>
                          <Image
                            src={displayUrl}
                            width={40}
                            height={40}
                            preview={false}
                            fallback="/default-product.png"
                          />
                          {isVideo && (
                            <div className={styles.videoOverlay}>
                              <span className={styles.videoLabel}>视频</span>
                            </div>
                          )}
                        </div>
                        <div style={{ flex: 1 }}>
                          <Text>{sku.name}</Text>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            ¥{sku.price}
                          </Text>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className={styles.serviceInfo}>
                <Text type="secondary">服务</Text>
                <div className={styles.serviceText}>
                  <Text>买贵双倍赔 · 7天价保 · 闪电退款 · 极速审核</Text>
                  <br />
                  <Text>店铺发货&售后服务</Text>
                  <br />
                  <Text>助力环保，传递知识，旧书换新 ·</Text>
                  <br />
                  <Text>支持7天无理由退货</Text>
                </div>
              </div>

              {/* 京东风格购买按钮 */}
              <div className={styles.buyButtonGroup}>
                <Button
                  icon={<ShoppingCartOutlined />}
                  type="primary"
                  size="large"
                  className={styles.buyButton}
                  onClick={handleAddToCart}
                >
                  加入购物车
                </Button>
                <Button
                  type="primary"
                  danger
                  size="large"
                  className={styles.buyButton}
                  onClick={handleBuyNow}
                >
                  立即购买
                </Button>
              </div>
            </Col>
          </Row>

          <div style={{ marginTop: 24 }}>
            <Tabs
              items={[
                {
                  key: 'review',
                  label: '大家评',
                  children: (
                    <div style={{ padding: '16px 0' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {buyerReviews.map(review => (
                          <Tag key={review.label} color="orange" style={{ fontSize: 12 }}>
                            {review.label} {review.count}
                          </Tag>
                        ))}
                      </div>
                    </div>
                  ),
                },
                { key: 'shop', label: '店铺', children: <Text>店铺信息</Text> },
                { key: 'detail', label: '商品详情', children: <Text>商品详情内容...</Text> },
                { key: 'service', label: '售后保障', children: <Text>7天无理由退换</Text> },
              ]}
            />
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
          未找到商品信息
        </div>
      )}
      // 在 return 最后添加
<PaymentModal
  visible={paymentVisible}
  sku={selectedSku}
  productId={productId!}
  onClose={() => setPaymentVisible(false)}
  onPurchaseSuccess={onClose} // 成功后关闭商品详情弹窗
/>
    </Modal>
  );
};

export default ProductEditModal;