import { createApp } from 'vue';
import '../../style.css';
import App from './Main.vue';
import './lcu';
import './ws';
import router from './router'

createApp(App)
  .use(router)
  .mount('#app');

// cube.windows.getMainWindow().then((v) => {
//   cube.windows.message.send(v.id, 'hell', 'hello world');
//   cube.windows.message.invoke(v.id, 'hello', 'abczfs').then((v) => {
//     console.log('replay ', v);
//   });
// });
//
// cube.windows.on('moved', () => {});
//
// cube.settings.hotkeys.game.on('pressed', (v) => {
//   console.log('hotkey pressed ', v);
// });

