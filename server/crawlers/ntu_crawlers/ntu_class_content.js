const fetch = require('node-fetch')
const cheerio = require('cheerio')
const { query } = require('../../models/mysql_model.js')

const { 
  getNowStatus,
} = require('../../../util/util')

// get ntu course detail
const getTextContent = async (url) => {
  try {
    const res = await fetch(url)

    const buffer = await res.arrayBuffer()
    const decoder = new TextDecoder('big5')
    const html = decoder.decode(buffer)
    let sortData = ''
    let getClassUnit = 999
    const $ = cheerio.load(html)
    $('table tbody tr').each((ind, line) => {
      const data = $(line).text()
      if (ind !== 0) {
      // console.log(data)
      }

      if (data.trim() === '課程進度') {
        getClassUnit = ind + 1
      }
      if (ind > getClassUnit) {
        const sortUnit = data.trim().split('\n')
        // const sendUnit = sortUnit[3]
        if (sortUnit[3]) {
          sortData += sortUnit[3].trim()
        }
      }

      let dataText = ''
      switch (data.trim().substr(0, 4)) {
        case '課程概述':
        case '課程目標':
        case '課程要求':
        case '指定閱讀':
        case '參考書目':
          dataText = data.trim().substr(4).replace(/\r\n|\n/g, '').trim()
          if (dataText.trim() === '待補' || !dataText.trim()) {
          // console.log('炸！！')
          } else {
            sortData += '\n' + dataText
          }
          break
      }
    })
    return sortData

  } catch (error) {
    setTimeout(() => {
      console.log('還敢error啊！ 給我再跑一次！')
      getTextContent(url)
    }, 500)
  }
}




const judgeConetne = async(class_text, class_number, old_content) => {

  if(!old_content){
    const post = [class_text, class_number]
    const sql = 'UPDATE class SET class_content = ? WHERE number = ?'
    await query(sql, post)
    console.log('updata')

  }else if(class_text.length > old_content.length){
    const post = [class_text, class_number]
    const sql = 'UPDATE class SET class_content = ? WHERE number = ?'
    await query(sql, post)
    console.log('updata')
  }else{
    console.log('skip')
  }

}


// updata Class Content
const upDataContent =  async () => {
  
  let result = await query("SELECT number, web_url, class_content FROM class WHERE number like 'ntu%'")
  result = await JSON.parse(JSON.stringify(result))

  console.log('satr')
  const maxNum = result.length

  for(let i=0; i < maxNum; i++){
    console.log('now executed: ' + i)

    if(i % 5 === 0){
      let checkPoint = await getNowStatus('coursera')
      if(!+checkPoint){
        console.log('從外部被關閉')
        return
      }
    }

    const class_text =  await getTextContent(result[i].web_url)
    const class_number = await result[i].number
    const old_content = await result[i].class_content

    judgeConetne(class_text, class_number, old_content)

  }

  console.log('end')
  return 0
}


module.exports = {
  upDataContent
}