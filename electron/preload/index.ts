import { contextBridge,ipcRenderer } from 'electron';
import {appConfig} from "../../utils/main/config";

contextBridge.exposeInMainWorld("electron", {
  send:(channel:string,args:any) => ipcRenderer.send(channel,args),
  once:(channel: string, listener:any) => ipcRenderer.once(channel,listener),
  on:(channel: string, listener:any) => ipcRenderer.on(channel,listener)
});

contextBridge.exposeInMainWorld("appConfig",{
  get:(e:string) => appConfig.get(e),
})