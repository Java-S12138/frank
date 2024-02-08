import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import * as path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'src/main/index.html'),
        background: path.resolve(__dirname, 'src/background/index.html'),
        queryMatch: path.resolve(__dirname, 'src/queryMatch/index.html'),
        recentMatch: path.resolve(__dirname, 'src/recentMatch/index.html'),
        matchAnalysis: path.resolve(__dirname, 'src/matchAnalysis/index.html'),
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve('./src') // @代替src
    }
  }
});
