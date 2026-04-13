import { theme } from "antd";
import { Content } from "antd/es/layout/layout";
import { Outlet } from "react-router-dom";



const ContentIndex = () => { 
    const {
        token: { colorBgContainer, borderRadiusLG },
      } = theme.useToken();
    return(
        <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
        <div
          style={{
            padding: 24,
            textAlign: 'center',
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </div>
      </Content>
    )
};

export default ContentIndex;