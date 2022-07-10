const {defineConfig} = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  publicPath: './',
  pages: {
    index: {
      entry: 'src/render/main.ts'
    }
  },
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      disableMainProcessTypescript: true,
      mainProcessTypeChecking: false,
      builderOptions: {
        "productName": "Frank",
        "appId": "com.frank.app",
        "copyright": "Copyright © 2022 Java_S",
        extraResources: [
          {from:'./resources',to:'./resources'}],
        win: {
          "icon": "./resources/app-icon.png"
        },
        "nsis": {
          "runAfterFinish":false,

        },
      },
    },
  },
  // configureWebpack: {
  //   module: {
  //     rules: [
  //       {
  //         test: /\.ts?$/,
  //         loader: 'ts-loader',
  //         exclude: /node_modules/,
  //         options: {
  //           appendTsSuffixTo: [/\.vue$/],
  //         }
  //       }
  //     ]
  //   }
  // },
})
