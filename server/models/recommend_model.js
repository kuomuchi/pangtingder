const translate = require('translation-google')
const { query } = require('../models/mysql_model')

const { 
  getNowStatus,
  starEvent
} = require('../../util/util')



// use npm package to translate text
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

function createTextVector(text, textMap, textVector){

  for (let i = 0; i < text.length; i++) {
    for (let u = 0; u < textMap.length; u++) {

      if (text[i] === textMap[u]) {
        textVector[u]++
        break
      }
    }
  }

  return textVector
}

function getVecterResult(vecter){
  let result = vecter.map(x => Math.pow(x, 2))
  result = result.reduce((a, b) => a + b)
  return Math.pow(result, 0.5)
}



// using Law of cosines recommend
async function getRecommend (t1, t2) {

  let text1 = t1
  let text2 = t2

  // combination all text
  let alltext = text1 + ' ' + text2
  alltext = alltext.split(' ')
  text1 = text1.split(' ')
  text2 = text2.split(' ')
  const textMap = []

  let vecter1 = []
  let vecter2 = []

  // create a main text map

  for (let num = 0; num < (alltext.length); num++) {
    let inMap = 1

    for (let u = 0; u < textMap.length; u++) {
      if (textMap[u] === alltext[num]) {
        inMap = 0
      }
    }

    if (inMap) {
      vecter1.push(0) // create two empty array for text vector
      vecter2.push(0)

      textMap.push(alltext[num]) // create text map 
    }
  }


  vecter1 = await createTextVector(text1, textMap, vecter1)
  vecter2 = await createTextVector(text2,  textMap, vecter2)


  const vecter1Result = await getVecterResult(vecter1)
  const vecter2Result = await getVecterResult(vecter2)

  const sumDenominator = vecter1Result * vecter2Result

  let sumMolecular = 0

  vecter1.forEach((a, b) => {
    sumMolecular += vecter2[b] * a
  })

  let ans = sumMolecular / sumDenominator
  ans = ans.toFixed(3)
  return ans
}


async function doingRecommend (oldData, data) {
  // star to recommend
  for(let i = oldData; i<data.length; i++){

    // make sure event is runing
    if(i % 5 === 0){
      const checkPoint = await getNowStatus('recommend')
      // else stop the event
      if(!+checkPoint){
        console.log('從外部被關閉')
        return
      }
    }
    
    // tell where recommend are
    console.log('now ' + i)


    const self = data[i].content_translate
    const package = []
    const rec = []
    const sim = []

    // class content must more then 30 words
    if(self.length > 30){

      // Compare with others class content
      for(let u=0; u<data.length; u++){
        if(u !== i){
          // this is other class content
          const other = data[u].content_translate

          // this is recommend result
          const result = await getRecommend(self, other)          
          
          // save the recommend
          rec.push(data[u].number)
          sim.push(+result)
        }
      }


      // sort recommend class, limite top 10 similar class
      for(index = 0; index < 10; index++){
        let place = -1
        let max = 0;
        for(let num = 0; num < sim.length; num++){

          if(+sim[num] > max){
            max = +sim[num]
            place = num; // array index
          }
        }

        // 整理確認好看用的
        let replace = {
          number: data[i].number,
          rec: rec[place],
          sim: sim[place]
        }

        package.push([data[i].number, rec[place], sim[place]])

        // 重新整理
        rec[place] = 0
        sim[place] = 0

      }
      

      // 將推薦結果放入DB
      let sql = 'INSERT INTO recommend (number, recommend, similar) VALUES ?'
      await query(sql, [package]).catch(err => console.log(err))


      console.log('next')
        
    }else{
      console.log('skip')
    }
  }

}


const upDataRecommend = async () => {

  let getAutoStatus = await query("SELECT time, status, run FROM auto_work WHERE work = 'recommend'")
  const getRun = JSON.parse(JSON.stringify(getAutoStatus))[0].run
  const getStatus = JSON.parse(JSON.stringify(getAutoStatus))[0].status

  if(getStatus){
    if(!+getRun){

      // tell DB event ready to star
      await starEvent('recommend')

      // take all courses
      const getClass = await query('SELECT number, class_name, content_translate FROM class WHERE content_translate IS NOT NULL')
      let data = JSON.parse(JSON.stringify(getClass))


      // calculate run time
      console.log('max: ' + data.length)

      // get already finished recommend
      let oldData =  await query('SELECT id FROM recommend')
      oldData = JSON.parse(JSON.stringify(oldData))


      // if recommend is ready to full
      if(oldData.length >= data.length){

        // clear all recommend
        await query('TRUNCATE TABLE recommend')
        oldData = 0

      }else{
        // or keep doing job, with out not down yet.
        const classRecommendAmount = 10
        oldData = oldData.length / classRecommendAmount
      }

      // start doing recommend
      await doingRecommend(oldData, data)

    
      const msg = '課程更新完畢'
      await query("UPDATE auto_work SET `msg` = ?, run = 0 WHERE (`work` = 'recommend')", msg)
      console.log('end')
      return

    }else{
      console.log("事件正在執行")
      return
    }


  }else{
    console.log('translate功能 狀態為null')
    return
  }

}




module.exports = {
  getRecommend,
  translateText,
  upDataRecommend
}