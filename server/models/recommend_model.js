const translate = require('translation-google')

// const text1 = "一、提供正確運動指導，做為女性健康管理的參考。二、鼓勵女生參與規律健身運動並培養運動興趣。三、提供對女性運動經驗議題之思考與研究的機會。 一、認知：1.促進學生對女性體適能相關理論之認知。                  2.強化女性運動健康知識的理解。二、技能：1.增進個人體適能促進與規律運動之實作能力。                  2.提供女性個別健身運動處方說明與規劃之基礎能力。三、情意：1.培養良好的人際互動、合作態度與正面溝通技巧。                  2.增加女性運動公益推展的社會責任知覺與參與。 體適能參與表現30％：1分鐘仰臥起坐10％、5公里慢跑10％(35/分80;30分/90;25-30/95:25以下100)，課外體適能運動紀錄10％(每週2次課外體適能促進30分鐘/次)/課外運動參與(校馬)專題研究30％：1.促進運動女力專題研究與實務報告(25%)及影像製作報導90秒到120秒                          2.女性體適能影像紀錄短評(A4:含影像及短評100字)課程參與40％：1.出席30%                          2.熱身/皮拉提斯動作正確性，分組討論參與及課外體育活動參加情形10%                            :如上課動作確認及女性體適能或相關運動參與紀錄等 運動醫學講座  賴金鑫 著美國運動醫學會（ACSM）網頁與叢書Pamela Peeke （2005）Body for life for women.Rodale Inc. U.S.A體適能相關叢書與媒體及平臺的瀏覽 美國運動醫學會（ACSM）網頁與叢書Pamela Peeke （2005）Body for life for women.Rodale Inc. U.S.A女人20.40.60健康動起來! 臺大出版中心出版。女人迷網站相關資訊Women's running magazing Web site or fb課程簡介及資料表填寫;互動與專題說明;RUN for women 活動~~戶外慢跑活動位女性運動健康擬一段宣言^^討論1:進入女性運動的里程碑/個人體適能評估討論2:皮拉提斯基礎概論與呼吸練習*骨盆時鐘的認識討論3:皮拉提斯概論:身體風箱體驗及實作(入門組合動作)討論4:女性運動阻礙探討*:皮拉提斯基礎動作/伸展運動進階實作;專題資料蒐集2補假:自主運動*運動女性影像紀錄(繳交女性運動影像攝影紀錄 )皮拉提斯組合 /肌肉適能1:室內抗重力塑身循環運動 專題3.肌肉適能2.:健身房塑身運動與健身房使用說明。**帶毛巾肌肉適能3:健身房課程—阻力塑身運動課程； **帶毛巾體適能促進與進階皮拉提斯期中評量;肌肉適能4. 彈力帶課程—阻力塑身運動課程;專題6(準備影片及書面報告說明)。進階皮拉提斯+心肺適能/塑身有氧促進運動女力專題研究與實務-影像製作分組討論(一)分組實施促進運動女力專題研究與實務報告-影像製作分組報導247室健身中心的選擇與女性運動友善環境~小組參訪分享。討論7.期末體適能再測及自我評鑑;女性運動新視野講座進階活力運動課程:全方位階梯有氧;課程建議與分享"
// const text2 = '本課程介紹楊氏太極劍，太極劍練習的基本常識，準備活動及整套太極劍套路。 1、了解太極劍簡史2、能操演太極劍套路3、培養欣賞太極劍的能力 上課出席，課後複習 歐業超、林崇彬(2001)。太極劍。台北：鴻柏。課程介紹、太極劍簡史、如何選擇一把合適的劍、圖說九構五刃劍身結構名稱、認識天盤地盤人盤。準備活動、持劍要領、攪劍、基礎八式、野馬跳澗起式至燕子抄水燕子抄水、左右攔掃至黃蜂入洞黃蜂入洞、靈貓捕鼠、鳳凰雙展翅左旋風、等魚式、撥草尋蛇至懷中抱月。講義《楊氏太極劍譜的意象思維》複習，起式至撥草尋蛇至懷中抱月第一次隨堂考野馬跳澗、翻身勒馬至挑簾式挑簾式、左右車輪劍至劍譜第二次懷中抱月第二次隨堂考青龍探爪、鳳凰雙展翅至白猿獻果白猿獻果、落花式至白虎攪尾白虎攪尾、魚躍龍門至抱劍還原測驗（一）；繳交學期書面報告測驗（二）測驗（三）'


async function translateText(text){
  try {
    trans = await translate(text, { from: 'zh-cn', to: 'en' })
    if(trans.text === undefined){
      return 0
    }else{
      return trans.text
    }
    
  } catch (error) {
    return 0
  }
  
}


async function getRecommend (t1, t2) {

  let text1 = t1
  let text2 = t2

  let alltext = text1 + ' ' + text2
  alltext = alltext.split(' ')
  text1 = text1.split(' ')
  text2 = text2.split(' ')
  const textMap = []

  const d1 = []
  const d2 = []

  for (let i = 0; i < (alltext.length); i++) { // 每一個單字
    let inMap = 1
    for (let u = 0; u < textMap.length; u++) { // 加入到文字地圖裡面
      if (textMap[u] === alltext[i]) {
        inMap = 0
      }
    }

    if (inMap) {
      d1.push(0)
      d2.push(0)
      textMap.push(alltext[i])
    }
  }

  // console.dir(textMap, { maxArrayLength: null })

  for (let i = 0; i < text1.length; i++) { // 切字tex1
    for (let u = 0; u < textMap.length; u++) {
      if (text1[i] === textMap[u]) {
        d1[u]++
        break
      }
    }
  }

  for (let i = 0; i < text2.length; i++) { // 切字tex1
    for (let u = 0; u < textMap.length; u++) {
      if (text2[i] === textMap[u]) {
        d2[u]++
        break
      }
    }
  }
  //   console.log(d2)

  let down1 = d1.map(x => Math.pow(x, 2))
  down1 = down1.reduce((a, b) => a + b)
  down1 = Math.pow(down1, 0.5)

  let down2 = d2.map(x => Math.pow(x, 2))
  down2 = down2.reduce((a, b) => a + b)
  down2 = Math.pow(down2, 0.5)

  const sum = down1 * down2
  //   console.log(sum)
  let sum2 = 0

  d1.forEach((a, b) => {
    sum2 += d2[b] * a
  })

  let ans = sum2 / sum
  ans = ans.toFixed(3)
  return ans
}

module.exports = {
  getRecommend,
  translateText
}