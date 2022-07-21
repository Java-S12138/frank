import { contextBridge,ipcRenderer,shell} from 'electron';
import {appConfig} from "../../utils/main/config";
import {createHttp1Request} from "league-connect";

contextBridge.exposeInMainWorld("electron", {
  send:(channel:string,args:any) => ipcRenderer.send(channel,args),
  once:(channel: string, listener:any) => ipcRenderer.once(channel,listener),
  on:(channel: string, listener:any) => ipcRenderer.on(channel,listener),
  openExternal:(url:string) => shell.openExternal(url)
});

contextBridge.exposeInMainWorld("appConfig",{
  get:(e:string) => appConfig.get(e),
  set:(key:string,value:any) => appConfig.set(key,value),
  clear:() => appConfig.clear()
})
contextBridge.exposeInMainWorld("lct",{
  createHttp1Request: async (option:any,credentials:any) => (await createHttp1Request(option,credentials)).json(),
})

