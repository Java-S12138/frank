import "../main/utils/tray.ts"

cube.games.on('launched', (v) => {
  console.log(v);
  cube.windows.obtainDeclaredWindow('main', { gamein: true }).then((v) => {
    console.log(v);
  });
});
