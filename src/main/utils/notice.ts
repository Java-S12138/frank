import {requestFetch} from "@/main/utils/request";
import {useDialog} from "naive-ui";
import {h} from "vue";
import {open} from "@tauri-apps/plugin-shell";
import {ConfigSettingTypes} from "@/background/types";

declare const __APP_VERSION__: string;

interface NoticeTypes {
  isShow: boolean;
  type: 'create' | 'error' | 'info' | 'success' | 'warning';
  content: string;
  isButton: boolean;
  buttonContent: string;
  url: string;
  rankVers: string;
  version: string;
  noticeId: string;
}

export class Notice {
  public url = 'https://frank-notice-1302853015.cos.ap-chongqing.myqcloud.com/frankRust.json'
  public dialog = useDialog()
  public notice:null|NoticeTypes = null

  public async init() {

    const timestamp = new Date().getTime()
    const res = await requestFetch<NoticeTypes>(this.url + `?date=${timestamp}`,'GET')

    if (res === null) {
      return false
    }
    this.notice = res as NoticeTypes

    localStorage.setItem('rankVers', this.notice.rankVers)
    if (!this.notice.isShow) {
      this.showUpdate(this.notice.version)
      return false
    } else if (localStorage.getItem('oldNoticeId') === this.notice.noticeId) {
      return true
    } else {
      localStorage.setItem('noticeId', this.notice.noticeId)
      this.showDialog(false)
      return true
    }
  }

  private showUpdate(latestVersion:string){
    if (latestVersion === __APP_VERSION__) return
      this.showDialog(true)
  }

  public showDialog(isVer:boolean) {
    const notice = this.notice as NoticeTypes
    const versionInfo = `当前版本${__APP_VERSION__}，最新版本[ ${this.notice?.version} ↑]  请立即更新，获取最佳体验！`

    const contentVNode = () => {
      const content = isVer ? versionInfo + notice.content : notice.content
      const textList = content.split('/n')
      return textList.map((text: string) => {
        return h('p',
          [text])
      })
    }



    this.dialog[notice.type]({
      title: isVer ?'版本更新':'新的通知',
      content: contentVNode,
      showIcon: true,
      maskClosable: true,
      closable: false,
      autoFocus: false,
      style: 'margin:8px;max-width:334px',
      positiveText: isVer ? '点击下载' : notice.buttonContent,
      negativeText: isVer ? '推荐更新' : '不再提醒',
      onPositiveClick:  () => {
        open(notice.url)
      },
      onNegativeClick: () => {
        localStorage.setItem('oldNoticeId', notice.noticeId)
      }
    })
  }
}


export class RuneTips{
  private dig = useDialog()

  public handleContent() {
    const text = "①：请先确保英雄联盟客户端符文页，是当前英雄的符文数据。/n " +
      "②：自动符文配置成功后，下次选择此英雄将自动完成符文配置的操作。/n" +
      "③：点击英雄头像，可查看配置的数据。"
    const textList = text.split('/n')
    return textList.map((text: string) => {
      return h('p',
        [text])
    })
  }

  public init(config:ConfigSettingTypes){
    this.dig.info({
      title: '使用提示',
      content: this.handleContent,
      showIcon: true,
      maskClosable: true,
      closable: false,
      autoFocus: false,
      style: 'margin:8px;max-width:334px',
      positiveText: '我已了解',
      negativeText: '下次不再弹出',
      onPositiveClick:  () => {
      },
      onNegativeClick: () => {
        config.warmTips.autoRune = true
        localStorage.setItem('configSetting', JSON.stringify(config))
      }
    })
  }

}