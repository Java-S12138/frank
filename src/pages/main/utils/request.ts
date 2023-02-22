import axios from "axios";

export const request = axios.create({
  timeout:9999
})

export const blacklistServe =async (config:any) => {
  const res = await cube.net.sendHttpRequest('http://43.139.80.183:8412'+config.url,
    {method:config.method,body:JSON.stringify(config?.data)}
    )
  if (res.status === 200){
    return {
      data:JSON.parse(res.data)
    }
  }else {
    return {data:{code:-1}}
  }
}
