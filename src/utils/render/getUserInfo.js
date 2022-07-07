import {request} from './request'
import cheerio from 'cheerio'
import {appConfig} from '../main/config'

let userInfo = appConfig.get('userInfo')
let name = userInfo.name;
let area = userInfo.area;

export async function init(){
  let urlRank = 'https://www.lolzhushou.com/rank_lcu.php'
  let urlCarry = 'https://www.lolzhushou.com/analyse_best_lcu.php'

  const rankList = await getRankData(urlRank);
  const carryList = await getCarryChamp(urlCarry)
  const allList = {
    'rank':rankList,'carry':carryList
  }

  return allList
}

async function getHtml(url) {
  if (url.indexOf('rank') != -1) {
    const result = await request({
      'url': url,
      method: 'GET',
      params: {gameid: name, server: area},
    });
    return result.data;
  } else {
    const result = await request({
      'url': url,
      method: 'GET',
      params: {name: name, server: area},
    });
    return result.data;
  }

}

async function getRankData(url) {
  const html = await getHtml(url)
  let rankData
  const $ = cheerio.load(html);
  if (html.indexOf('游戏ID不存在') != -1) {
    rankData = ['', '召唤师不存在']
    return rankData
  }

  let imgSrc = $('body > div.head > div.head_box > div > img').attr('src')
  if (imgSrc.length <=70){
    rankData = ['', '召唤师不存在']
    return rankData
  }
  let name = $('.head_box p:first').text()
  let area = $('.head_box p:eq(1)').text()
  let singlRank = $('.main_box > div > div:eq(0) > div.main_txt').text()
  let flexibleRank = $('.main_box > div > div:eq(1) > div.main_txt').text()
  let tacticsRank = $('.main_box > div > div:eq(2) > div.main_txt').text()
  let currentSeason = $('.main_box > div > div:eq(3) > div.main_txt').text()
  let allRank = $('.main_box > div > div:eq(4) > div.main_txt').text()

  rankData = [name, area, singlRank, flexibleRank, tacticsRank, currentSeason, allRank, imgSrc]
  return rankData

}

async function getCarryChamp(url) {
  const $ = cheerio.load(await getHtml(url));
  let fisrtChampIcon = $('body > div.benming > div > div.hero-usage > div:eq(0) > img').attr('src')
  let fisrtChampProficiency = $('body > div.benming > div > div.hero-usage > div:eq(0) > div> p:eq(0)').text()

  let secendChampIcon = $('body > div.benming > div > div.hero-usage > div:eq(1) > img').attr('src')
  let secendChampProficiency = $('body > div.benming > div > div.hero-usage > div:eq(1) > div> p:eq(0)').text()

  let thirdChampIcon = $('body > div.benming > div > div.hero-usage > div:eq(2) > img').attr('src')
  let thirdChampProficiency = $('body > div.benming > div > div.hero-usage > div:eq(2) > div> p:eq(0)').text()

  const carryData = [fisrtChampIcon, fisrtChampProficiency, secendChampIcon, secendChampProficiency, thirdChampIcon, thirdChampProficiency]
  return carryData
}

export async function getRealPower(){
  const html = await getHtml("https://www.lolzhushou.com/analyse_ability_lcu.php")
  const $ = cheerio.load(html);
  if (html.indexOf('游戏ID不存在') != -1) {
    const realPower = ["召唤师不存在 (或使用了本地获取数据)","width: 50%","逆天","width: 50%","逆天","width: 50%","异常",
      "width: 50%","逆天","width: 50%","逆天"]

    return realPower
  }
  let realPower = ["经系统分析 你的真实段位为  "+$('body > div.ability > div > div.conclusion > p:nth-child(1) > span').text()]
  const content = $('body > div.ability > div > div.each-location > div').children()
  for (const contentElement of content) {
    let tempElement = contentElement.children[3].children[1]
    let rate = (tempElement.attribs.style).split(';')[0]
    let dan = tempElement.children[1].children[1].children[0].data
    realPower.push(rate)
    realPower.push(dan)
  }
  return realPower
}
