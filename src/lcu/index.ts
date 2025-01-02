import {invoke} from "@tauri-apps/api/core";

export const invokeLcu = <T>(method: string, uri: string, body: string = ''): Promise<T | null> => {
  return invoke<T | null>("invoke_lcu", {method: method, uri: uri, body: body})
    .then((result) => {
      if (result === null) {
        return null
      }
      return result as T
    })
    .catch(() => {
      return null
    })
}
