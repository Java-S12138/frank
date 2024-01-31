import {invokeLcu} from "./index";
import {LcuRuneInfo} from "./types/runeLcuTypes";
interface T {
  alias: string;
  name: string;
  position: string;
  pickCount: number;
  winRate: string;
  primaryStyleId: number;
  subStyleId: number;
  selectedPerkIds: number[];
  score: number;
  type: string;
}

// 应用符文页面
export const applyRunePage = async (data: any) => {
  try {
    // 获取符文页信息
    const currentRuneList: Array<LcuRuneInfo> = await invokeLcu('get', '/lol-perks/v1/pages')
    const current = currentRuneList.find((i: LcuRuneInfo) => i.isDeletable && !i.isTemporary)
    if (current === undefined) {
      return false
    }
    // 删除当前符文页
    await invokeLcu('delete', `/lol-perks/v1/pages/${current.id}`)
    // 写入新的符文页
    await invokeLcu('post', '/lol-perks/v1/pages', [data])
    return true
  } catch (e) {
    return false
  }
}

export const applyBlockPage = async (buildItems:any) => {
  const blockPath = (await invokeLcu('get','/data-store/v1/install-dir')).
  replace('LeagueClient','Game')+"/Config/Global/Recommended/frank.json"

  return await cube.io
    .writeFileContents(blockPath, JSON.stringify(buildItems))
    .then((res) => true)
    .catch((err) => false)
}
