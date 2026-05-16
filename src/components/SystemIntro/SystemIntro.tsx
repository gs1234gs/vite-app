// SystemIntro.tsx
import React from 'react';
import { Card, Typography, Divider, Row, Col } from 'antd';
import { motion } from 'framer-motion';
import styles from './SystemIntro.module.scss';

// Icons
import { JavaOutlined, SlackOutlined } from '@ant-design/icons';
import {
  SiSpring,
  SiSpringsecurity,
  SiMysql,
  SiRedis,
  SiElasticsearch,
  SiApachekafka,
  SiReact,
  SiTypescript,
  SiMui,
  SiRabbitmq,
  SiMacos, // 临时用作 Nacos 图标
  SiOllama,
  SiOpenai,
  SiAntdesign,
  SiVite,
} from 'react-icons/si';

const { Title, Paragraph, Text } = Typography;
const iconColors: Record<string, string> = {
  Java: '#ED8B00', // 官方 Java 橙红
  Spring: '#6DB33F',
  'Spring Security': '#6DB33F',
  MySQL: '#4479A1',
  Redis: '#DC382D',
  Elasticsearch: '#005571',
  Kafka: '#231F20',
  React: '#61DAFB',
  TypeScript: '#3178C6',
  MUI: '#0081CB',
  RabbitMQ: '#FF6600',
  Nacos: '#2489F7',
  Ollama: '#7B58FF',
  GPT: '#000000',
  Qwen3: '#7B58FF',
  'Ant Design': '#1890FF',
  Vite: '#646CFF',
};

const getBrandColor = (name: string): string => {
  if (name.includes('Spring')) return iconColors.Spring;
  return iconColors[name] || '#000000';
};

const renderIcon = (icon: React.ReactNode, size: number = 40, color?: string) => (
  <div
    style={{
      width: size,
      height: size,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: size * 0.5,
      marginBottom: 16,
      color: color,
    }}
  >
    {icon}
  </div>
);

// ========== 技术栈按类别组织 ==========
const techGroups = [
  {
    title: '后端技术栈（Java / Spring）',
    items: [
      {
        name: 'Java',
        icon: <JavaOutlined />,
        desc: '系统后端基于 Java 21+ 构建，利用其稳定性、高性能与丰富生态支撑高并发电商场景。',
      },
      {
        name: 'Spring Boot',
        icon: <SiSpring color="#6DB33F" />,
        desc: '快速构建独立的、生产级别的 Spring 应用，提供固定的基础功能。',
      },
      {
        name: 'Spring Cloud',
        icon: <SiSpring color="#6DB33F" />,
        desc: '微服务架构工具集，提供服务发现、配置管理、负载均衡等能力。',
      },
      {
        name: 'Spring Gateway',
        icon: <SiSpring color="#6DB33F" />,
        desc: '基于 Spring Framework 的 API 网关，支持路由、过滤与限流。',
      },
      {
        name: 'Spring WebFlux',
        icon: <SiSpring color="#6DB33F" />,
        desc: '响应式编程框架，支持非阻塞 I/O 与高并发场景。',
      },
      {
        name: 'Spring Security',
        icon: <SiSpringsecurity color="#6DB33F" />,
        desc: '强大的认证与授权框架，保障应用安全。',
      },
      {
        name: 'Spring AI',
        icon: <SiSpring color="#6DB33F" />,
        desc: 'Spring 官方 AI 集成框架，简化大模型调用与提示工程，支持多种 LLM 提供商。',
      },
      {
        name: 'R2DBC',
        icon: <SiSpring color="#6DB33F" />,
        desc: '响应式关系型数据库连接，用于非阻塞交互和数据库操作。',
      },
    ],
  },
  {
    title: '服务治理与中间件',
    items: [
      {
        name: 'Nacos',
        icon: <SiMacos color="#2489F7" />,
        desc: '动态服务发现、配置管理和服务治理平台，支持云原生架构。',
      },
    ],
  },
  {
    title: '消息队列',
    items: [
      {
        name: 'RabbitMQ',
        icon: <SiRabbitmq color="#FF6600" />,
        desc: '开源消息代理，实现应用解耦、异步通信与流量削峰。',
      },
      {
        name: 'Kafka',
        icon: <SiApachekafka color="#231F20" />,
        desc: '高吞吐分布式事件流平台，适用于日志收集、流处理与消息队列。',
      },
    ],
  },
  {
    title: '数据存储',
    items: [
      {
        name: 'MySQL',
        icon: <SiMysql color="#4479A1" />,
        desc: '全球流行的开源关系型数据库，稳定可靠，支持高并发读写。',
      },
      {
        name: 'Redis',
        icon: <SiRedis color="#DC382D" />,
        desc: '高性能内存数据库，用于缓存、会话存储与实时数据处理。',
      },
      {
        name: 'Elasticsearch',
        icon: <SiElasticsearch color="#005571" />,
        desc: '分布式搜索与分析引擎，支持全文检索与日志聚合。',
      },
    ],
  },
  {
    title: 'AI 与大模型生态',
    items: [
      {
        name: 'Ollama',
        icon: <SiOllama />,
        desc: '本地大模型运行引擎，支持一键部署和调用开源 LLM（如 Llama、Qwen 等），提供 RESTful API 与 CLI 工具。',
      },
      {
        name: 'GPT',
        icon: <SiOpenai />,
        desc: 'OpenAI 开发的强大闭源语言模型系列，支持多轮对话、代码生成等高级能力。',
      },
      {
        name: 'Qwen3',
        icon: <SlackOutlined />,
        desc: '阿里巴巴通义千问最新版本，支持多语言、长上下文与工具调用，可本地部署或云调用。',
      },
    ],
  },
  {
    title: '前端技术',
    items: [
      {
        name: 'React',
        icon: <SiReact color="#61DAFB" />,
        desc: '用于构建用户界面的声明式 JavaScript 库，组件化开发体验优秀。',
      },
      {
        name: 'TypeScript',
        icon: <SiTypescript color="#3178C6" />,
        desc: 'JavaScript 的超集，提供静态类型检查，提升代码可维护性。',
      },
      {
        name: 'MUI',
        icon: <SiMui color="#0081CB" />,
        desc: '基于 Material Design 的 React UI 组件库，开箱即用，主题灵活。',
      },
      {
        name: 'Ant Design',
        icon: <SiAntdesign />,
        desc: '企业级 UI 设计语言和 React 组件库，提供丰富的企业应用解决方案。',
      },
      {
        name: 'Vite',
        icon: <SiVite />,
        desc: '下一代前端构建工具，极速冷启动与热更新，提升开发体验。',
      },
    ],
  },
];

// 架构亮点（强化后端）
const features = [
  {
    title: '微服务注册与配置',
    desc: 'Nacos 实现服务发现、动态配置管理',
    icon: <SiMacos color="#2489F7" />,
    color: '#2489F7',
  },
  {
    title: '响应式高并发架构',
    desc: 'Spring WebFlux + R2DBC 非阻塞 I/O，支撑高吞吐业务场景',
    icon: <SiSpring color="#6DB33F" />,
    color: '#6DB33F',
  },
  {
    title: '智能搜索推荐',
    desc: 'Elasticsearch + 深度学习召回算法',
    icon: <SiElasticsearch color="#2196F3" />,
    color: '#2196F3',
  },
  {
    title: '异步消息解耦',
    desc: 'RabbitMQ / Kafka 双引擎支持订单、通知等异步处理',
    icon: <SiRabbitmq color="#FF6600" />,
    color: '#FF6600',
  },
  {
    title: '企业级安全体系',
    desc: 'Spring Security + JWT 实现细粒度权限控制与 OAuth2 集成',
    icon: <SiSpringsecurity color="#6DB33F" />,
    color: '#6DB33F',
  },
  {
    title: '标准化 AI 集成',
    desc: 'Spring AI 统一接入 GPT、Qwen3、Ollama，降低大模型使用门槛',
    icon: <SiSpring color="#6DB33F" />,
    color: '#6DB33F',
  },
  {
    title: '集成先进AI模型',
    desc: '通过 GPT、Ollama、Qwen3 实现智能客服、推荐系统等高级功能。',
    icon: <SlackOutlined color="#7B58FF" />,
    color: '#7B58FF',
  },
];

const TechCard: React.FC<{ item: (typeof techGroups)[0]['items'][0]; index: number }> = ({ item, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05, duration: 0.4 }}
    whileHover={{ y: -8 }}
  >
    <Card
      hoverable
      style={{
        borderRadius: 16,
        height: '100%',
        textAlign: 'center',
        border: '1px solid #e6f0ff',
        boxShadow: '0 4px 12px rgba(0, 102, 255, 0.05)',
        transition: 'all 0.3s ease',
        padding: '20px 16px',
        minHeight: 180,
      }}
    >
      {renderIcon(item.icon, 40, getBrandColor(item.name))}
      <Text strong style={{ fontSize: '0.95rem', color: '#2d3748', display: 'block' }}>
        {item.name}
      </Text>
      <Paragraph
        style={{
          fontSize: '0.8rem',
          color: '#718096',
          marginTop: 8,
          marginBottom: 0,
          lineHeight: 1.4,
        }}
        ellipsis={{ rows: 2 }}
      >
        {item.desc}
      </Paragraph>
    </Card>
  </motion.div>
);

const FeatureCard: React.FC<{ item: typeof features[0]; index: number }> = ({ item, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 + index * 0.07, duration: 0.4 }}
    whileHover={{ y: -6 }}
  >
    <Card
      hoverable
      style={{
        borderRadius: 18,
        borderLeft: `4px solid ${item.color}`,
        padding: '20px',
        height: '100%',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
      }}
    >
      <div style={{ display: 'flex', gap: 16 }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            backgroundColor: `${item.color}20`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: item.color,
            fontSize: 24,
          }}
        >
          {item.icon}
        </div>
        <div>
          <Title level={5} style={{ margin: '0 0 8px', color: '#1a202c' }}>
            {item.title}
          </Title>
          <Paragraph style={{ fontSize: '0.95rem', color: '#4a5568', margin: 0 }}>
            {item.desc}
          </Paragraph>
        </div>
      </div>
    </Card>
  </motion.div>
);

const SystemIntro: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.cardWrapper}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Title className={styles.title}>智能电商管理平台</Title>

          <Divider className={styles.divider} />

          {/* ✅ 使用 Typography.Text，不再导入 AntdText */}
          <Paragraph className={styles.paragraph}>
            基于 <Text strong>Java 21 + Spring Cloud 微服务架构</Text> 与深度学习推荐算法的现代化电商平台，
            后端采用响应式编程（WebFlux + R2DBC）提升吞吐量，集成商品管理、订单支付、库存调度、
            用户画像与智能推荐等核心功能，为企业提供高并发、高可用、高扩展的一站式电商解决方案。
          </Paragraph>

          <Title level={4} className={styles.subtitle}>
            核心技术栈
          </Title>

          {/* 按类别渲染技术栈 */}
          {techGroups.map((group, groupIndex) => (
            <div key={group.title} style={{ marginBottom: 32 }}>
              <Title level={5} style={{ marginTop: 24, marginBottom: 16, color: '#1a365d' }}>
                {group.title}
              </Title>
              <Row gutter={[24, 24]} className={styles.techGrid}>
                {group.items.map((tech, idx) => (
                  <Col xs={12} sm={8} md={6} key={tech.name}>
                    <TechCard item={tech} index={groupIndex * 10 + idx} />
                  </Col>
                ))}
              </Row>
            </div>
          ))}

          <Title level={4} className={styles.subtitle}>
            架构亮点
          </Title>
          <Row gutter={[24, 24]} className={styles.featureGrid}>
            {features.map((feature, index) => (
              <Col xs={24} md={12} lg={8} key={index}>
                <FeatureCard item={feature} index={index} />
              </Col>
            ))}
          </Row>

          <div className={styles.highlightBox}>
            <Paragraph className={styles.highlightText}>
              <span className={styles.highlightIcon}>🚀</span>
              系统支持高并发订单处理与实时推荐，通过 Nacos 服务治理、RabbitMQ/Kafka
              异步解耦、Redis 多级缓存，实现毫秒级响应体验与精准个性化推荐。
            </Paragraph>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SystemIntro;