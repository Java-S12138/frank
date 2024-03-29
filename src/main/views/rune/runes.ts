import {applyBlockPage, applyRunePage} from "@/lcu/aboutRune";

const Precision = {
  8000: [
    8005,
    8008,
    8021,
    8010,
    9101,
    9111,
    8009,
    9104,
    9105,
    9103,
    8014,
    8017,
    8299
  ]
}

const Domination = {
  8100: [
    8112,
    8124,
    8128,
    9923,
    8126,
    8139,
    8143,
    8136,
    8120,
    8138,
    8135,
    8134,
    8105,
    8106
  ]
}

const Sorcery = {
  8200: [8214, 8229, 8230, 8224, 8226, 8275, 8210, 8234, 8233, 8237, 8232, 8236]
}

const Whimsy = {
  8300: [8351, 8360, 8369, 8306, 8304, 8313, 8321, 8316, 8345, 8347, 8410, 8352]
}

const Resolve = {
  8400: [8437, 8439, 8465, 8446, 8463, 8401, 8429, 8444, 8473, 8451, 8453, 8242]
}
const RuneMap = {
  ...Precision,
  ...Domination,
  ...Sorcery,
  ...Whimsy,
  ...Resolve
}

export const flatRunes = Object.entries(RuneMap)

export const handleRunesWrite = (runeData:any,isAutoWriteBlock:boolean,blockList:any) => {
  // 1:自动符文配置成功 2:自动符文&装备 配置成功 3:自动符文配置失败
  return applyRunePage(runeData).then(async(isApplySuccess) => {
    if (!isApplySuccess) {
      return 3
    }

    if (isAutoWriteBlock) {
      const block = blockList.find((i:any) => i.ps === runeData.position)

      if (!block) {
        return 1
      }

      const success = await applyBlockPage(block.buildItems)

      return success ? 2 : 1
    } else {
      return 1
    }
  })
}
