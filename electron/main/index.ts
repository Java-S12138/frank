import {app, BrowserWindow} from 'electron';
import {HomeWindow} from '../windows/home';
import Store from 'electron-store';Store.initRenderer()

app.whenReady().then(() => {
  const homeWindow = new HomeWindow()


  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) new HomeWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
