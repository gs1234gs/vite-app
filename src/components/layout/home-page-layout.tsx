// 布局组件，上中下格式布局

import { Flex, Layout } from "antd";


const { Header, Footer, Content } = Layout;
//  样式
interface StyleLatout{
  homeContainer?: any;
  headerStyle?: any;
  contentStyle?: any;
  footerStyle?:any;
  layoutStyle?: any;
}

//定义接收接口，提高代码可读性，也可使用any
interface HomePageLayoutProps {
  HeaderTop?: React.ReactNode;
  ContentCenter?: React.ReactNode;
  FooterBootom?: React.ReactNode;
  styles?: StyleLatout;
}
const HomePageLayout = ({ HeaderTop, ContentCenter, FooterBootom ,styles={}}:HomePageLayoutProps) => {
  return (
    <div className={styles.homeContainer}>
        <Flex gap="middle" wrap>
    <Layout className={styles.layoutStyle}>
      {/* 传入头部组件，就会渲染，否则不渲染，其他组件同理 */}
    {HeaderTop && <Header className={styles.headerStyle}>
            {HeaderTop || 'Header'}
          </Header>}
          {ContentCenter && <Content className={styles.contentStyle}>
            {ContentCenter || 'Content'}
            </Content>}
            {FooterBootom && <Footer className={styles.footerStyle}>
            {FooterBootom || 'Footer'}
          </Footer>}
    </Layout>
    </Flex>
    </div>
  );
};

export default HomePageLayout;