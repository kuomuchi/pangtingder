require('dotenv').config()
const fetch = require('node-fetch')
const cheerio = require('cheerio')
const { query } = require('../../models/mysql_model.js')
const { main } = require('./ntu_class_content.js')

// axios

const getClass = async () => {
  console.log('in')
  const index = 14132
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
    if (a >= 16 && a <= 15 + index) {
      const line = $(b).html()
      const _ = cheerio.load(line)
      const array = []
      const url = 'https://nol.ntu.edu.tw/nol/coursesearch/' + _('a').attr('href')
      _(line).each((id, data) => {
        const sortData = _(data).text()
        array.push(sortData)
      })

      if (array[10].trim().length) {
        if (aws.length > 0 && aws[aws.length - 1].number === 'ntu' + array[2]) {
          if (array[1].trim().length) {
            aws[aws.length - 1].department += (',' + array[1])
          }
        } else {
          const sendClass = {
            number: 'ntu' + array[2],
            className: array[4],
            department: array[1],
            professor: array[10],
            source: '台大',
            remarks: array[15],
            web_url: url
          }
          console.log(sendClass)
          console.log('\n\n\n')

          const snedArray = []
          snedArray.push(sendClass.number)
          snedArray.push(sendClass.className)
          snedArray.push(sendClass.department)
          snedArray.push(sendClass.professor)
          snedArray.push(sendClass.source)
          snedArray.push(sendClass.remarks)
          snedArray.push(sendClass.web_url)
          aws.push(sendClass)
          ans.push(snedArray)
        }
      }
    }
  })
  // console.dir(aws, { maxArrayLength: null })

  // 將資料加入:D
  // const sql = 'INSERT INTO class (number, class_name, department, professor, source, remarks, web_url) VALUES ?'
  // query(sql, [ans], (err, result) => {
  //   if (err) throw err
  //   console.log(result)
  // })
}

// getClass()

module.exports = {
  getClass
}
