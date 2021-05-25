const fetch = require('node-fetch')
const cheerio = require('cheerio')
const { query } = require('../../models/mysql_model.js')

const main = async (url) => {
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

    console.log(sortData)
    return sortData
  } catch (error) {
    setTimeout(() => {
      console.log('還敢error啊！ 給我再跑一次！')
      main(url)
    }, 500)
  }
}

const upDataContent =  async (req, res) => {
  console.log('in')
  let result = await query('SELECT number, web_url FROM pangtingder.class')
  result = await JSON.parse(JSON.stringify(result))

  console.log('進入！')

  const maxNum = result.length

  for(let i=0; i < maxNum; i++){
    console.log(i)
    console.log('\n')
    const class_text =  await main(result[i].web_url)
    // console.log(class_text)
    const post = []
    post[0] = class_text
    post[1] = i + 1
    const sql = 'UPDATE pangtingder.class SET class_content = ? WHERE id = ?'
    await query(sql, post)
  }
  res.send('finish')
  console.log('end')
  return 0
}


module.exports = {
  upDataContent
}