// src/env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PORT: string
  readonly VITE_APP_BASE_API: string
  // 添加其他你使用的环境变量
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}