import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { fileURLToPath } from 'url';
// import styleImport from 'vite-plugin-style-import'
// 获取当前模块的文件路径（兼容 ESM）
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  // console.log('Loaded environment variables:', env); // 调试信息
  return {
    plugins: [
      react(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'), // 设置路径别名
        'antd': path.resolve(__dirname, 'node_modules/antd'),
      },
      extensions: ['.tsx', '.ts', '.js', '.jsx'], // 支持的文件扩展名
    },
    server: {
      host: '0.0.0.0', // 允许外部访问
      port: Number(env.VITE_APP_PORT),      // 开发服务器端口
      open: true,      // 自动打开浏览器
      cors: true,      // 启用 CORS
      proxy: {
        '/api': {
          target: env.VITE_APP_BASE_API, // 代理目标地址
          changeOrigin: true,              // 修改请求头中的 Origin
          rewrite: (path) => {
            // console.log('Rewriting path:', path); // 调试输出
            return path.replace(/^\/api/, '');
          },
        },
      },
    },
  };
});
