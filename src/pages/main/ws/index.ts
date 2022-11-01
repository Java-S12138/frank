
// @ts-ignore
let clients: any = [];
// const wsServer = cube.net.createWebSocketServer({
//   cert: `-----BEGIN CERTIFICATE-----
// MIIBujCCAWACCQDjKdAMt3mZhDAKBggqhkjOPQQDAjBkMQswCQYDVQQGEwJJVDEQ
// MA4GA1UECAwHUGVydWdpYTEQMA4GA1UEBwwHRm9saWdubzETMBEGA1UECgwKd2Vi
// c29ja2V0czELMAkGA1UECwwCd3MxDzANBgNVBAMMBnNlcnZlcjAgFw0yMTA1MjYx
// OTEwMjlaGA8yMTIxMDUwMjE5MTAyOVowZDELMAkGA1UEBhMCSVQxEDAOBgNVBAgM
// B1BlcnVnaWExEDAOBgNVBAcMB0ZvbGlnbm8xEzARBgNVBAoMCndlYnNvY2tldHMx
// CzAJBgNVBAsMAndzMQ8wDQYDVQQDDAZzZXJ2ZXIwWTATBgcqhkjOPQIBBggqhkjO
// PQMBBwNCAAQKhyRhdSVOecbJU4O5XkB/iGodbnCOqmchs4TXmE3Prv5SrNDhODDv
// rOWTXwR3/HrrdNfOzPdb54amu8POwpohMAoGCCqGSM49BAMCA0gAMEUCIHMRUSPl
// 8FGkDLl8KF1A+SbT2ds3zUOLdYvj30Z2SKSVAiEA84U/R1ly9wf5Rzv93sTHI99o
// KScsr/PHN8rT2pop5pk=
// -----END CERTIFICATE-----`,
//   key: `-----BEGIN EC PRIVATE KEY-----
// MHcCAQEEIIjLz7YEWIrsGem2+YV8eJhHhetsjYIrjuqJLbdG7B3zoAoGCCqGSM49
// AwEHoUQDQgAECockYXUlTnnGyVODuV5Af4hqHW5wjqpnIbOE15hNz67+UqzQ4Tgw
// 76zlk18Ed/x663TXzsz3W+eGprvDzsKaIQ==
// -----END EC PRIVATE KEY-----`,
// });
// wsServer.on('connection', (s) => {
//   clients.push(s);
//   s.on('pong', (v) => {
//     console.log(new TextDecoder().decode(v));
//   });
//   s.on('ping', (v) => {
//     console.log(new TextDecoder().decode(v));
//   });
//   s.on('message', (v) => {
//     console.log(new TextDecoder().decode(v));
//   });
// });
// wsServer.on('close', () => {
//   console.log('server close');
// });
// wsServer.listen(undefined, () => {
//   console.log(wsServer, wsServer.address());
//   const ws = cube.net.createWebSocket(`wss://localhost:${wsServer.address()!.port}`, undefined, {
//     rejectUnauthorized: false,
//   });
//   ws.on('ping', () => {});
//   ws.on('open', () => {
//     ws.ping('abc');
//     ws.pong('abc');
//     ws.send('hello world');
//   });
//   ws.on('close', () => {
//     console.log('ws closed');
//   });
//
//   ws.connect();
// });
//
// setTimeout(() => {
//   clients.forEach((v: any) => {
//     v.close();
//   });
//   wsServer.close();
// }, 1000);
// export {};
// @ts-ignore
// @ts-ignore
