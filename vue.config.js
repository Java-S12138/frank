const {defineConfig} = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  publicPath: './',
  pages: {
    index: {
      entry: 'src/render/main.js'
    }
  },
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      builderOptions: {
        "productName": "Frank",
        "appId": "com.frank.app",
        "copyright": "Java_S",
        extraResources: [
          {from:'./resources',to:'./resources'}],
        win: {
          "icon": "./resources/app-icon.png",
          "requestedExecutionLevel": "requireAdministrator"
        },
      },
    },
  },
})
