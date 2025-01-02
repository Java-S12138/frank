import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
// @ts-ignore
import * as path from "path";

const host = process.env.TAURI_DEV_HOST;

// https://vitejs.dev/config/
// @ts-ignore
export default defineConfig(async () => ({
  plugins: [vue()],

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve('./src') // @代替src
    }
  },
  envPrefix: ['VITE_', 'TAURI_ENV_*'],
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
    // Tauri uses Chromium on Windows and WebKit on macOS and Linux
    target:
      process.env.TAURI_ENV_PLATFORM == 'windows'
        ? 'chrome105'
        : 'safari13',
    // don't minify for debug builds
    minify: !process.env.TAURI_ENV_DEBUG ? 'esbuild' : false,
    // produce sourcemaps for debug builds
    sourcemap: !!process.env.TAURI_ENV_DEBUG,
  },
}));
