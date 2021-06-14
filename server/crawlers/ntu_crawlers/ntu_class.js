require('dotenv').config()
const fetch = require('node-fetch')
const cheerio = require('cheerio')

const { upDataContent } = require('./ntu_class_content')

const { query } = require('../../models/mysql_model.js')
const { main } = require('./ntu_class_content.js')

// axios



const getClass = async () => {

  let getAutoStatus = await query("SELECT time, status, run FROM pangtingder.auto_work WHERE work = 'ntu'")
  const getRun = JSON.parse(JSON.stringify(getAutoStatus))[0].run
  const getStatus = JSON.parse(JSON.stringify(getAutoStatus))[0].status

  // 確認事件狀態
  if(getStatus){

    // 確認課程是否執行

    if(!+getRun){

      let nowTime = new Date().toLocaleString('zh-TW');
      let setTime = "UPDATE `pangtingder`.`auto_work` SET `time` = ? WHERE (`work` = 'ntu');"
      await query(setTime, nowTime)
      

      // 判斷事件 run狀態
      async function getNowStatus(){
        let data = await query("SELECT run FROM pangtingder.auto_work WHERE work = 'ntu'")
        data = JSON.parse(JSON.stringify(data))
        return data[0].run
      }

      // 開始執行
      await query("UPDATE pangtingder.auto_work SET run = 1 WHERE (work = 'ntu')")

      // // 獲取所有課程的 number
      const getAllClass = JSON.parse(JSON.stringify(await query("SELECT number FROM pangtingder.class WHERE number like 'ntu%'")))
      
      // 抓取台大第一頁。
      const getIndex = await fetch("https://nol.ntu.edu.tw/nol/coursesearch/search_result.php", {
        "headers": {
          "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
          "accept-language": "zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7",
          "cache-control": "max-age=0",
          "content-type": "application/x-www-form-urlencoded",
          "sec-ch-ua": "\" Not;A Brand\";v=\"99\", \"Google Chrome\";v=\"91\", \"Chromium\";v=\"91\"",
          "sec-ch-ua-mobile": "?0",
          "sec-fetch-dest": "document",
          "sec-fetch-mode": "navigate",
          "sec-fetch-site": "same-origin",
          "sec-fetch-user": "?1",
          "upgrade-insecure-requests": "1"
        },
        "referrer": "https://nol.ntu.edu.tw/nol/coursesearch/search_result.php",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": "current_sem=109-2&cstype=1&csname=&alltime=yes&allproced=yes&allsel=yes&page_cnt=15&Submit22=%ACd%B8%DF",
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
      });

      // 解析第一頁的文字
      const bufferIndex = await getIndex.arrayBuffer()
      const decoderIndex = new TextDecoder('big5')
      const getIndexRes = decoderIndex.decode(bufferIndex)
      const ds = cheerio.load(getIndexRes)

      // 課程總數
      let index = 14134

      // 獲得課程總數
      ds('font b').each( (a, b) => {
        if(a === 2){
          index = +ds(b).text()
          console.log(index)
        }
      })

      // 109-2學期課程
      const res = await fetch('https://nol.ntu.edu.tw/nol/coursesearch/search_result.php', {
        headers: {
          accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
          'accept-language': 'zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7',
          'cache-control': 'max-age=0',
          'content-type': 'application/x-www-form-urlencoded',
          'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="90", "Google Chrome";v="90"',
          'sec-ch-ua-mobile': '?0',
          'sec-fetch-dest': 'document',
          'sec-fetch-mode': 'navigate',
          'sec-fetch-site': 'same-origin',
          'sec-fetch-user': '?1',
          'upgrade-insecure-requests': '1',
          cookie: '_ga=GA1.3.1554251810.1595777017; __utma=154300519.1554251810.1595777017.1609330748.1620633589.3; __utmc=154300519; __utmz=154300519.1620633589.3.2.utmcsr=google|utmccn=(organic)|utmcmd=organic|utmctr=(not%20provided); PHPSESSID=mu321kd1o13at2sb46trb4f487; NOLlang=CH; BIGipServernol_http=743874826.20480.0000; TS0117f60b=010488152263432b061ae43ce874d2e58163e1e7c9b27f8fd0da6f892dbf87b853513924cfc77c2ac1b8f9de780b2086305f62e56360250f612b27ecc67f9de73d05b9a06964b3cf55966d1fb0cf12062c9a4c3256a2e77fcec30e2b31f4c8854d00147526; TSf86f2d17027=08eee1de4aab2000ce5de079cac8fe978da35989bb7232acd17e15f7c3a66e1d41f0b9f45795790c083ac8411f11300038ed14835b832a38789e7b59695d3aad6de23ecda21b10d9f700df897c49415896bdf2ad21a3fd790d9a6544abc42c86'
        },
        referrer: 'https://nol.ntu.edu.tw/nol/coursesearch/search_result.php',
        referrerPolicy: 'strict-origin-when-cross-origin',
        body: `current_sem=109-2&cstype=1&csname=&alltime=yes&allproced=yes&allsel=yes&page_cnt=${index}&Submit22=%ACd%B8%DF`,
        method: 'POST',
        mode: 'cors'
      })

      const buffer = await res.arrayBuffer()
      const decoder = new TextDecoder('big5')
      const html = decoder.decode(buffer)

      const aws = []
      const ans = []
      const $ = cheerio.load(html)


      $('tbody tr').each(async (a, b) => {

        // 切分課程，每個a的欄位，都是一門課程。
        // b則為文字。
        if (a >= 16 && a <= 15 + index) {

          const line = $(b).html()
          const _ = cheerio.load(line)
          const array = []

          // 課程連結。
          const url = 'https://nol.ntu.edu.tw/nol/coursesearch/' + _('a').attr('href')

          // 把課程的內容放到存入 array裡面。
          _(line).each((id, data) => {
            const sortData = _(data).text()
            array.push(sortData)
          })

          // 如果教授欄位不為null
          try {
            if (array[10].trim().length) {

              // 如果課程重複。
              if (aws.length > 0 && aws[aws.length - 1].number === 'ntu' + array[2]) {

                // 如果科系重複
                if (array[1].trim().length) {
                  aws[aws.length - 1].department += (',' + array[1])
                }

              } else {
                // 這邊是收到新的課程。
                

                // 課程打包起來。
                const sendClass = {
                  number: 'ntu' + array[2],
                  className: array[4],
                  department: array[1],
                  professor: array[10],
                  source: '台大',
                  remarks: array[15],
                  web_url: url
                }

                const snedArray = []
                snedArray.push(sendClass.number)
                snedArray.push(sendClass.className)
                snedArray.push(sendClass.department)
                snedArray.push(sendClass.professor)
                snedArray.push(sendClass.source)
                snedArray.push(sendClass.remarks)
                snedArray.push(sendClass.web_url)
                
                // 獲得課程資訊

                aws.push(sendClass)
                

                // 查看哪些課程沒有重複。
                const isNotRepeat = getAllClass.findIndex((value) => value.number == sendClass.number)

                if(isNotRepeat < 0){
                  console.log('新增課程')
                  ans.push(snedArray)
                }

              }
            }

          } catch (error) {
            console.log(error)
            console.log(array[10])

          }
        }
      })

      // 將資料加入:D
      
      if(ans.length){
        console.log('存入DB')
        const sql = 'INSERT INTO class (number, class_name, department, professor, source, remarks, web_url) VALUES ?'
        await query(sql, [ans], async (err, result) => {
          if (err) throw err

          console.log(result)

          //更新課程
          console.log('end，課程更新完畢。')
          await query("UPDATE pangtingder.auto_work SET run = 0, msg = '課程更新完成' WHERE (work = 'ntu')")
          return
        })

        
      }else{

        // 更新課程
        await upDataContent()
        console.log('end，沒有課程加入Db')
        await query("UPDATE pangtingder.auto_work SET run = 0, msg = '目前是最新版的課程' WHERE (work = 'ntu')")
        return
      }



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
  getClass
}
