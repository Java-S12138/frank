// import '../main/utils/subscribe.ts'
// import '../main/utils/config.ts'
import '../main/utils/tray.ts'

cube.extensions.on('launch-triggered', (s) => {
  if (!s.gamein){
    cube.windows.obtainDeclaredWindow('main')
  }
})



