export interface config {
  // 这行段代码, 主要作用是防止Webstorm有的地方不爆红
}

declare global {
  interface Window {
    electron:any,
    appConfig:any,
    lct:any
  }
}
