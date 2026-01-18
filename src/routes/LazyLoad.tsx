// LazyLoad.tsx
import { Spin } from "antd";
import React, { Suspense, lazy } from "react";
const spinnerStyleClass = "spinner-wrapper";
const spinnerStyle = `
  .${spinnerStyleClass} {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100%;
  }
`;

interface LazyLoadProps {
  loader: () => Promise<{ default: React.ComponentType<any> }>;
}
if (!document.getElementById("dynamic-spinner-style")) {
  const style = document.createElement("style");
  style.id = "dynamic-spinner-style";
  style.innerHTML = spinnerStyle;
  document.head.appendChild(style);
}
// 这里通过 `import()` 动态加载路径
const LazyLoad: React.FC<LazyLoadProps> = ({ loader }): React.ReactElement => {
  // 使用懒加载方式返回组件
  // const LazyComponent = lazy(() => import(/* @vite-ignore */ `${modulePath}`));
 const LazyComponent = lazy(loader);
  return (
    <Suspense fallback={  <div className={spinnerStyleClass}>
        <Spin size="large" tip="加载中..." fullscreen={true}/>
      </div>}>
      <LazyComponent />
    </Suspense>
  );
};

export default LazyLoad;

