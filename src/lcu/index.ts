// cube.games.launchers.getRunningLaunchers().then((launchers) => {
//   launchers.forEach((v) => {
//     cube.games.launchers.events.getInfo(v.classId).then((info) => {
//       console.log('info ', info);
//     });
//   });
// });
// cube.games.launchers.events.on('update-info', (classId, info) => {
//   console.log('update info ', classId, info);
// });

export const invokeLcu = (method: string, uri: string, args?: any) => {
  return cube.games.launchers
    .invokeLEP(10902, 'lcuRequest', {method: method, uri: uri, args: args})
    .then((v) => {
      return v
    })
    .catch((err) => {
      return err
    })
}
