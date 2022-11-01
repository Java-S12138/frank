import "../main/utils/tray.ts"

cube.extensions.on('launch-triggered', (s) => {
  cube.windows.obtainDeclaredWindow('main', { gamein: s.gamein })})


cube.games.launchers.events.on('update-info', async (classId, info) => {
    // if (info.category ==='game_flow'){
    //   if (info.value ==='ChampSelect'){
    //     // cube.windows.obtainDeclaredWindow('queryMatch')
    //   }
    // }
  // value: '{"data":{"championName":"疾风剑豪","isSkinGrantedFromB…,"uri":"/lol-champ-select/v1/skin-selector-info"}'}
  // {
  //   "category": "json_api_event",
  //   "key": "raw_data",
  //   "value": "{\"data\":777,\"eventType\":\"Create\",\"uri\":\"/lol-champ-select/v1/current-champion\"}"
  // }
  if (info.value.indexOf('lol-champ-select/v1/current-champion') !== -1){
    const assistWin = await cube.windows.getWindowByName('assist')
    cube.windows.message.send(assistWin.id,'champion',info)
  }
});

