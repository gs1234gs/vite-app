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
  HeartOutlined,
  ShareAltOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';

// 类型定义
import type { ProductCustomerDetailVO } from '@/api/goods/product/RecommendProductType';
import type { SKUVO } from '@/api/goods/sku/SKUType';
import type { UserCollectSaveVO } from '@/api/behavior/collect/CollectType';

// Store/Hook
import useRecommendProduct from '@/stores/goods/RecommendProduct';
import useUserCollect from '@/stores/behavior/UseUserCollect';
import PaymentModal from '../PayModel/PaymentModal';
import styles from './ProductEditModal.module.css';

const { Text, Title } = Typography;

interface ProductEditModalProps {
  visible: boolean;
  productId: string | null;
  onClose: () => void;
  onFavoriteChange?: () => void; // 收藏状态改变时的回调
}

// --- 工具函数 ---
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

const ProductEditModal: React.FC<ProductEditModalProps> = ({ visible, productId, onClose, onFavoriteChange }) => {
  const { detailApi, loading: productLoading } = useRecommendProduct();
  const { saveCollect, findCollectsByRows } = useUserCollect();

  const [product, setProduct] = useState<ProductCustomerDetailVO | null>(null);
  const [selectedSku, setSelectedSku] = useState<SKUVO | null>(null);
  const [paymentVisible, setPaymentVisible] = useState(false);
  // 操作加载状态 (防止重复点击)
  const [actionLoading, setActionLoading] = useState(false);

  // 模拟购物车 API (请替换为真实逻辑)
  const cartApi = {
    addCart: async (skuId: string, count: number) => {
      console.log('加入购物车:', skuId, count);
      return Promise.resolve();
    },
  };

  // --- 初始化数据 ---
  useEffect(() => {
    if (visible && productId) {
      setActionLoading(true);

      // 只需要加载商品详情，不再需要检查收藏状态来改变 UI
      detailApi(productId)
        .then((data) => {
          if (data) {
            setProduct(data);
            setSelectedSku(data.skuList?.[0] || null);
          }
        })
        .catch((err) => {
          console.error('加载失败', err);
          message.error('加载商品信息失败');
        })
        .finally(() => {
          setActionLoading(false);
        });
    } else {
      // 关闭弹窗时重置状态
      setProduct(null);
      setSelectedSku(null);
    }
  }, [visible, productId, detailApi]);

  // --- 业务逻辑 ---
  const handleAddToCart = async () => {
    if (!selectedSku) {
      message.warning('请选择商品规格');
      return;
    }
    if ((selectedSku.stock || 0) <= 0) {
      message.warning('库存不足');
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
    setPaymentVisible(true);
  };

  // --- 🌟 核心修改：处理“添加收藏” ---
  // 需求：只提示成功，按钮状态不改变（始终保持“加入收藏”样式）
  const handleAddFavorite = async () => {
    if (!productId || !product) return;

    // 如果正在加载中，防止重复点击
    if (actionLoading) return;
   
    setActionLoading(true);
    try {
      // 构造保存数据
      const saveData: UserCollectSaveVO = {
        product: product as any,
        collectTime: new Date().toISOString(),
      };

      const result = await saveCollect(saveData);
        // 2. 通知父组件状态已变更
        if (onFavoriteChange) {
          onFavoriteChange();
        }
  
    } catch (err) {
      console.error('收藏失败:', err);
      message.error('收藏失败，请重试');
    } finally {
      setActionLoading(false);
    }
  };

  const handleShare = () => {
    if (!productId) return;
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

  // --- 渲染部分 ---
  // 全局 Loading
  if (productLoading && !product) {
    return (
      <Modal open={visible} footer={null} onCancel={onClose} width={1200} closable={false}>
        <div style={{ textAlign: 'center', padding: '60px' }}><Spin size="large" /></div>
      </Modal>
    );
  }

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
      {product ? (
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
                      style={{ width: '100%', height: '100%', objectFit: 'contain', backgroundColor: '#000' }}
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
                  <Image src="/default-product.png" preview={false} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
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
                {/* 
                  🌟 修改点：
                  1. 移除了 isFavorited 状态判断。
                  2. 图标始终为 HeartOutlined (空心)。
                  3. 文案始终为 "加入收藏"。
                  4. 按钮始终可用 (除非正在请求中)。
                  5. type 始终为 primary (或根据设计需求固定)，danger 属性固定。
                */}
                <Button
                  icon={<HeartOutlined />}
                  onClick={handleAddFavorite}
                  type="primary"
                  danger
                  loading={actionLoading}
                  disabled={actionLoading} 
                >
                  加入收藏
                </Button>

                <Button icon={<ShareAltOutlined />} onClick={handleShare}>
                  分享
                </Button>
              </Space>

              {/* SKU 选择区域 */}
              <div className={styles.skuSection}>
                <Text strong>商品规格：</Text>
                <div style={{ marginTop: 12 }}>
                  {product.skuList?.map((sku) => {
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

              {/* 服务信息 */}
              <div className={styles.serviceInfo}>
                <Text type="secondary">服务</Text>
                <div className={styles.serviceText}>
                  <Text>买贵双倍赔 · 7天价保 · 闪电退款 · 极速审核</Text>
                  <br />
                  <Text>店铺发货&售后服务</Text>
                  <br />
                  <Text>助力环保，传递知识，旧书换新 ·</Text>
                  <br />
                  <Text>支持 7 天无理由退货</Text>
                </div>
              </div>

              {/* 购买按钮组 */}
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

          {/* Tab 区域 */}
          <div style={{ marginTop: 24 }}>
            <Tabs
              items={[
                {
                  key: 'review',
                  label: '大家评',
                  children: (
                    <div style={{ padding: '16px 0' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {['印刷超清晰', '讲解超详细', '纸张很厚实'].map((tag, i) => (
                          <Tag key={i} color="orange" style={{ fontSize: 12 }}>{tag}</Tag>
                        ))}
                      </div>
                    </div>
                  ),
                },
                { key: 'shop', label: '店铺', children: <Text>店铺信息</Text> },
                { key: 'detail', label: '商品详情', children: <Text>商品详情内容...</Text> },
                { key: 'service', label: '售后保障', children: <Text>7 天无理由退换</Text> },
              ]}
            />
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
          未找到商品信息
        </div>
      )}
      <PaymentModal
        visible={paymentVisible}
        sku={selectedSku}
        productId={productId!}
        onClose={() => setPaymentVisible(false)}
        onPurchaseSuccess={onClose}
      />
    </Modal>
  );
};

export default ProductEditModal;