export interface ConfigTypes {
  autoPickChampion: { championId: string; isAuto: boolean };
  autoBanChampion: { championId: string; isAuto: boolean };
  autoAccept: number;
  champRankOption: { tier: number; lane: string };
  theme: string;
}


export const config: ConfigTypes = {
  'autoPickChampion': {
    championId: "157",
    isAuto: false
  },
  'autoBanChampion': {
    championId: "101",
    isAuto: false
  },
  'autoAccept': 50,
  'champRankOption': {
    'tier': 2,
    'lane': 'mid'
  },
  'theme':'light',
}

if (localStorage.getItem('config') === null) {
  localStorage.setItem('config', JSON.stringify(config))
} else {
  const localS = JSON.parse(<string>(localStorage.getItem('config')))
  for (const configKey of Object.keys(config)) {
    if (!localS.hasOwnProperty(configKey)) {
      // @ts-ignore
      localS[configKey] = config[configKey]
      localStorage.setItem('config', JSON.stringify(localS))
    }
  }
}
