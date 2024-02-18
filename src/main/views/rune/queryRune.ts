import {request} from "@/main/utils/request";
import {mapNameFromUrl} from "@/resources/champList";
import {Block, OnlineRunes} from "@/main/views/rune/runeTypes";

export class QueryRune {

  public mapId = 0

  // 获取英雄数据
  public getChampInfo = async (alias:string): Promise<OnlineRunes[]> => {
    const timestamp = new Date().getTime()
    if (this.mapId === 12) {
      return (await request({
        url: `https://frank-1304009809.cos.ap-chongqing.myqcloud.com/op.gg-aram/${alias}.json?date${timestamp}`,
        method: 'GET',
      })).data
    } else {
      return (await request({
        url: `https://frank-1304009809.cos.ap-chongqing.myqcloud.com/op.gg/${alias}.json?date${timestamp}`,
        method: 'GET',
      })).data
    }
  }
  // 获取技能数据
  public getSkillsImgUrl = (skillsImg: any, skills: any) =>  {
    return skillsImg.map((img:string, i:number) => [
      `https://game.gtimg.cn/images/lol/act/img/spell/${img}`,
      skills[i]
    ])
  }
  // 获取符文数据
  public getRunesData = async (alias:string) => {
    try {
      this.mapId = (JSON.parse(localStorage.getItem('gameInfo') as string)).mapId
      const champInfo: OnlineRunes[] = await this.getChampInfo(alias)
      // 技能
      const skillsList = this.getSkillsImgUrl(champInfo[0].skillsImg, champInfo[0].skills)
      const runeDataList = []
      const blockDataList = []

      for (const champ of champInfo) {
        // 符文
        for (const rune of champ.runes) {
          if (this.mapId === 12) {
            rune.position = 'aram'
          }
          runeDataList.push(rune)
        }
        // 出装
        const block = this.getBlocksData(JSON.parse(JSON.stringify(champ)))
        if (block !== null) {
          blockDataList.push(block)
        }
      }
      return {skillsList,runeDataList,blockDataList}

    } catch (e) {
      return null
    }
  }
  // 获取出装数据
  public getBlocksData = (champ: OnlineRunes) => {
    try {
      if (this.mapId === 12) {
        champ.position = 'aram'
      }
      const position = this.getPosition(champ.position)
      const buildItems = champ.itemBuilds[0]
      const name = mapNameFromUrl[champ.alias].label + '-' + mapNameFromUrl[champ.alias].name
      buildItems.title = name + ' 推荐出装 ' + 'lolfrank.cn'
      buildItems.blocks = this.handleBlocks(buildItems.blocks)
      return {position: position as string, buildItems: buildItems, ps: champ.position}
    } catch (e) {
      return null
    }
  }
  // 处理出装字段
  public handleBlocks = (blocks: Block[]) => {
    const blocksResult: Block[] = []
    for (const block of blocks) {
      if (block.type.indexOf('Starter') !== -1) {
        blocksResult.push(this.translateTitle(block, 'Starter Items,', '出门:'))
      } else if (block.type.indexOf('Core') !== -1) {
        blocksResult.push(this.translateTitle(block, 'Core Items,', '核心:'))
      }
    }
    return blocksResult
  }
  // 翻译中文
  public translateTitle = (block: Block, english: string, chinese: string) => {
    block.type = block.type.replace(english, chinese).replace('Pick', '选择次数').replace('Win Rate', '胜率')
    if (block.items.length > 3) {
      block.items = block.items.slice(0, 3)
    }
    return block
  }
  // 获取位置信息
  public getPosition = (pos: string) => {
    switch (pos) {
      case 'middle':
        return '中单';
      case 'top':
        return '上单';
      case 'support':
        return '辅助';
      case 'jungle':
        return '打野';
      case 'bottom':
        return '射手';
      case 'aram':
        return '极地';
      case 'mid':
        return '中单';
    }
  }
}
