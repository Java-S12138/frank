import {request} from "@/main/utils/request";
import {useDialog} from "naive-ui";
import {h} from "vue";

export class Notice {
  public url='https://frank-notice-1302853015.cos.ap-chongqing.myqcloud.com/notice2.json'
  public dialog = useDialog()

  public async init(){
    const timestamp = new Date().getTime()
    const res = await request.get(this.url + `?date=${timestamp}`)
    if (res.status!==200){
      return false
    }
    const notice = res.data

    const contentVNode = () => {
      const textList = notice.content.split('/n')
      return  textList.map((text:string) => {
        return  h('p',
          [text])
      })
    }

    this.dialog.success({
      title: '新的通知',
      content: contentVNode,
      showIcon:true,
      maskClosable:true,
      closable:false,
      autoFocus:false,
      style:'margin:8px;max-width:334px',
      positiveText: notice.buttonContent,
      onPositiveClick: () => {
        cube.extensions.relaunch()
      }
    })
  }
}
