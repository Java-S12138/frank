import {request} from "@/main/utils/request";
import {useDialog} from "naive-ui";
import {h} from "vue";

interface NoticeTypes {
  isShow: boolean;
  type: 'create' | 'error' | 'info' | 'success' | 'warning';
  content: string;
  isButton: boolean;
  buttonContent: string;
  url: string;
  rankVers: string;
  noticeId: string;
}


export class Notice {
  public url = 'https://frank-notice-1302853015.cos.ap-chongqing.myqcloud.com/notice2.json'
  public dialog = useDialog()
  public notice:null|NoticeTypes = null

  public async init() {
    this.checkCubeLogin()

    const timestamp = new Date().getTime()
    const res = await request.get(this.url + `?date=${timestamp}`)
    if (res.status !== 200) {
      return false
    }
    this.notice = res.data as NoticeTypes

    localStorage.setItem('rankVers', this.notice.rankVers)
    if (!this.notice.isShow) {
      return false
    } else if (localStorage.getItem('oldNoticeId') === this.notice.noticeId) {
      return true
    } else {
      localStorage.setItem('noticeId', this.notice.noticeId)
      this.showDialog()
      return true
    }
  }

  public showDialog() {
    const notice = this.notice as NoticeTypes

    const contentVNode = () => {
      const textList = notice.content.split('/n')
      return textList.map((text: string) => {
        return h('p',
          [text])
      })
    }


    this.dialog[notice.type]({
      title: '新的通知',
      content: contentVNode,
      showIcon: true,
      maskClosable: true,
      closable: false,
      autoFocus: false,
      style: 'margin:8px;max-width:334px',
      positiveText: notice.buttonContent,
      negativeText: '不再提醒',
      onPositiveClick: () => {
        cube.utils.openUrlInDefaultBrowser(notice.url)
      },
      onNegativeClick: () => {
        localStorage.setItem('oldNoticeId', notice.noticeId)
      }
    })
  }
  public checkCubeLogin(){
    cube.profile.getCurrentUser().catch(() => {
      this.dialog.error({
        title: '温馨提示',
        closable:false,
        maskClosable:false,
        content: "Cube账号未登录 ψ(._. )>> 将会导致无法正常使用部分功能。请登录Cube账号后，重启Frank。",
        positiveText: '关闭软件',
        style:'width:360px',
        onPositiveClick: () => {
          cube.extensions.terminate()
        }
      })
    })
  }
}
