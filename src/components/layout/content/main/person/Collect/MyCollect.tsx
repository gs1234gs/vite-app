import React, { useEffect, useState } from "react";
import useUserCollect from "@/stores/behavior/UseUserCollect";
import type { UserCollectVO } from "@/api/behavior/collect/CollectType";
import {
  List,
  Card,
  Button,
  Typography,
  Tag,
  Space,
  Empty,
  Spin,
  message,
  Image,
  Divider,
  Popconfirm,
  Badge,
  Tooltip,
} from "antd";
import {
  DeleteOutlined,
  ShopOutlined,
  ClockCircleOutlined,
  TagOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import type { CSSProperties } from "react";

const { Text, Title, Paragraph } = Typography;

// --- 辅助函数：从 SKU 列表提取图片和价格 ---
const getProductImage = (item: any) => {
  if (item.skuList && item.skuList.length > 0 && item.skuList[0].picList?.length > 0) {
    return item.skuList[0].picList[0];
  }
  return item.product?.image || "https://via.placeholder.com/300x220?text=No+Image";
};

const getProductPrice = (item: UserCollectVO) => {
  if (!item.skuList || item.skuList.length === 0) {
    return item.product?.price || "0";
  }
  const prices = item.skuList.map((sku) => parseFloat(sku.price || "0")).filter((p) => p > 0);
  if (prices.length === 0) return "0";
  return Math.min(...prices).toString();
};

const getSkuCount = (item: UserCollectVO) => {
  return item.skuList?.length || 0;
};

const formatPrice = (priceStr: string) => {
  const price = parseFloat(priceStr);
  if (isNaN(price)) return "¥ 0.00";
  return `¥ ${price.toFixed(2)}`;
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const MyCollect: React.FC = () => {
  const { loading, error, findCollectsByPage, deleteCollectById } = useUserCollect();

  const [collectList, setCollectList] = useState<UserCollectVO[]>([]);
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadCollects(pageNum, pageSize);
  }, []);

  const loadCollects = async (page: number, size: number) => {
    const res = await findCollectsByPage({ pageNum: page, pageSize: size });
    if (res) {
      setCollectList(res.rows);
      setTotal(res.total);
      setPageNum(res.pageNum);
      setPageSize(res.pageSize);
    }
  };

  const handleDelete = async (id: string, productName: string) => {
    const success = await deleteCollectById(id);
    if (success) {
      // message.success(`已取消收藏：${productName}`);
      if (collectList.length === 1 && pageNum > 1) {
        loadCollects(pageNum - 1, pageSize);
      } else {
        loadCollects(pageNum, pageSize);
      }
    }
  };

  // 定义悬停按钮的样式对象
  const deleteBtnStyle: CSSProperties = {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 2,
    background: "rgba(255, 255, 255, 0.95)",
    color: "#ff4d4f",
    border: "none",
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
    opacity: 0,
    transform: "translateY(-5px)",
    transition: "all 0.3s ease",
  };

  const renderItem = (item: UserCollectVO) => {
    const { id, product, collectTime, categoryList, tagList, skuList } = item;

    const displayImage = getProductImage(item);
    const displayPrice = getProductPrice(item);
    const skuCount = getSkuCount(item);

    return (
      <>
        {/* 
          注意：在 React 中处理 hover 效果最安全的方式是使用 CSS 类。
          这里为了单文件演示，我们注入一个全局样式块，但放在组件外部或 useEffect 中更好。
          为了修复你的报错，我们将 style 标签移到 render 之外，或者使用内联事件监听。
          下面采用最简单的方案：在 List 渲染时注入一次样式。
        */}
        
        <Card
          hoverable
          className="collect-card-item" // 添加类名用于 CSS 钩子
          style={{
            borderRadius: "12px",
            overflow: "hidden",
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
          cover={
            <div className="img-wrapper" style={{ position: "relative", height: 220, background: "#f9f9f9" }}>
              <Popconfirm
                title={`确定取消收藏 "${product.name}" 吗？`}
                onConfirm={() => handleDelete(id, product.name)}
                okText="确定"
                cancelText="取消"
                placement="topRight"
              >
                <Button
                  icon={<DeleteOutlined />}
                  className="delete-hover-btn"
                  style={deleteBtnStyle}
                  onClick={(e) => e.stopPropagation()}
                />
              </Popconfirm>

              {skuCount > 1 && (
                <Badge
                  count={`${skuCount}种规格`}
                  style={{
                    position: "absolute",
                    top: 10,
                    left: 10,
                    backgroundColor: "#1890ff",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                    fontSize: "12px",
                  }}
                />
              )}

              <Image
                src={displayImage}
                alt={product.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                preview={false}
                fallback="https://via.placeholder.com/300x220?text=Image+Error"
              />
            </div>
          }
        >
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <Title
              level={5}
              ellipsis={{ rows: 2 }}
              style={{ margin: "0 0 8px 0", fontWeight: 600, color: "#333", minHeight: "44px" }}
            >
              {product.name}
            </Title>

            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12 }}>
              <Text style={{ fontSize: 20, fontWeight: "bold", color: "#ff4d4f" }}>
                {formatPrice(displayPrice)}
              </Text>
              <Tooltip title="收藏时间">
                <Text type="secondary" style={{ fontSize: 12 }}>
                  <ClockCircleOutlined style={{ marginRight: 4 }} />
                  {formatDate(collectTime)}
                </Text>
              </Tooltip>
            </div>

            {(categoryList?.length > 0 || tagList?.length > 0) && (
              <div style={{ marginBottom: 12, minHeight: 32 }}>
                <Space wrap size={[4, 6]}>
                  {categoryList?.slice(0, 2).map((cat) => (
                    <Tag key={cat.id} icon={<ShopOutlined />} color="blue" style={{ borderRadius: 4 }}>
                      {cat.name}
                    </Tag>
                  ))}
                  {tagList?.slice(0, 2).map((tag) => (
                    <Tag
                      key={tag.id}
                      color={tag.color || "orange"}
                      icon={<ThunderboltOutlined />}
                      style={{ borderRadius: 4, fontSize: 12 }}
                    >
                      {tag.name}
                    </Tag>
                  ))}
                  {((categoryList?.length || 0) + (tagList?.length || 0)) > 4 && (
                    <Tag style={{ borderRadius: 4 }}>...</Tag>
                  )}
                </Space>
              </div>
            )}

            <Divider style={{ margin: "8px 0" }} />

            <Paragraph
              ellipsis={{ rows: 2 }}
              style={{ color: "#666", fontSize: 13, lineHeight: 1.6, marginBottom: 0, flex: 1 }}
            >
              {product.description ||
                (skuCount > 1 ? `包含 ${skuCount} 种不同规格配置，点击查看详情。` : "暂无详细描述")}
            </Paragraph>
          </div>
        </Card>
      </>
    );
  };

  return (
    <div style={{ padding: "24px 32px", minHeight: "100vh", background: "#f0f2f5" }}>
      {/* 注入 CSS 样式以支持 Hover 效果，避免 TS 报错 */}
      <style>{`
        .img-wrapper:hover .delete-hover-btn {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        .collect-card-item {
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }
        .collect-card-item:hover {
          box-shadow: 0 4px 12px rgba(0,0,0,0.12);
        }
      `}</style>

      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0 }}>
          我的收藏
          <Text type="secondary" style={{ fontSize: 16, marginLeft: 12, fontWeight: "normal" }}>
            共 {total} 件商品
          </Text>
        </Title>
      </div>

      {loading && collectList.length === 0 ? (
        <div style={{ textAlign: "center", padding: "100px 0", background: "#fff", borderRadius: 12 }}>
          <Spin size="large" tip="正在加载您的收藏..." />
        </div>
      ) : error ? (
        <Empty description={`加载失败：${error}`} style={{ background: "#fff", padding: 40, borderRadius: 12 }}>
          <Button type="primary" onClick={() => loadCollects(pageNum, pageSize)}>
            重新加载
          </Button>
        </Empty>
      ) : collectList.length === 0 ? (
        <Empty description="您还没有收藏任何商品" style={{ background: "#fff", padding: 60, borderRadius: 12 }}>
          <Button type="primary" href="/main/home">去浏览商品</Button>
        </Empty>
      ) : (
        <List
          grid={{
            gutter: [16, 24],
            xs: 1,
            sm: 2,
            md: 3,
            lg: 3,
            xl: 4,
            xxl: 5,
          }}
          dataSource={collectList}
          renderItem={(item) => <List.Item>{renderItem(item)}</List.Item>}
          pagination={{
            current: pageNum,
            pageSize: pageSize,
            total: Number(total),
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (t) => `共 ${t} 条`,
            onChange: (page, size) => {
              window.scrollTo({ top: 0, behavior: "smooth" });
              setPageNum(page);
              setPageSize(size);
              loadCollects(page, size);
            },
            style: { marginTop: 24, textAlign: "right" } as CSSProperties, // 修复 style 类型
          }}
        />
      )}
    </div>
  );
};

export default MyCollect;