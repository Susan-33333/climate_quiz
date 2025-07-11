// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// 正確設定 base：GitHub Pages 的根目錄（必須與 repo 名稱一致）
export default defineConfig({
  base: '/climate_quiz/',
  plugins: [react()]
});
