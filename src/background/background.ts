// import '../main/utils/subscribe.ts'
import './utils/config'
import './utils/tray'

cube.extensions.on('launch-triggered', (s) => {
  if (!s.gamein){
    cube.windows.obtainDeclaredWindow('main')
  }
})



