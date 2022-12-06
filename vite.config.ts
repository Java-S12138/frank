import { defineConfig,loadEnv  } from 'vite';
import vue from '@vitejs/plugin-vue';
import * as path from 'path';

export default defineConfig(({ command, mode }) => {
  // 根据当前工作目录中的 `mode` 加载 .env 文件
  // 设置第三个参数为 '' 来加载所有环境变量，而不管是否有 `VITE_` 前缀。
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  return {
    // vite 配置
    define: {
      __APP_ENV__: env.ENV
    },
    plugins: [vue()],
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'src/pages/main/index.html'),
          background: path.resolve(__dirname, 'src/pages/background/index.html'),
        },
      },
    },
    server:{
      proxy: {
        // 把key的路径代理到target位置
        // detail: https://cli.vuejs.org/config/#devserver-proxy
        [env.VITE_BASE_API]: { // 需要代理的路径   例如 '/api'
          target: `${env.VITE_BASE_PATH}:${env.VITE_SERVER_PORT}/`, // 代理到 目标路径
          changeOrigin: true,
          rewrite: path => path.replace(new RegExp('^' + env.VITE_BASE_API), ''),
        }
      }
    },
    resolve: {
      alias: {
        '@': path.resolve('./src') // @代替src
      }
    }
  }
})
