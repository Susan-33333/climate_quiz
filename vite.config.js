import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/climate_quiz/',
  plugins: [react()]
});
