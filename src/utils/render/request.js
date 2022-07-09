
const fs = require('fs');
import axios from "axios";
import {appConfig} from "@/utils/main/config";

export const request = axios.create({
  timeout:5000,
})

// 通过url下载符文json文件到本地
export const getRuneFileByUrl = async (url) => {
  let lolClientDir = appConfig.get('gameDirectory')
  lolClientDir = lolClientDir.replace('\\Client.exe','')
  if (lolClientDir == ''){
    return 'dir-none'
  }
  // 创建保存符文页专门的文件夹
  fs.stat(`${lolClientDir}\\runes`,function(err,exists){
    if(exists){
      console.log("文件夹存在")
    }
    if(!exists){
      fs.mkdir(`${lolClientDir}\\runes`,{recursive:true},(err)=>{
        if(err){
          throw err
        }else{
          console.log('创建目录成功ok!')
        }
      });
    }
  })

  try {
    var runeJsonFile = (await request({
      url:url
    })).data
  }catch (e){
    return null
  }

  const fileName = runeJsonFile[0].alias

  const fileData = JSON.stringify(runeJsonFile)
 // 写入JSON文件到本地
  fs.writeFile(`${lolClientDir}\\runes\\${fileName}.json`, fileData, (err) => {
    if (err) {
      throw err
    }
    return fileName
  })
}






