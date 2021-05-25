const fetch = require('node-fetch')
const cheerio = require('cheerio')
const { query } = require('../../models/mysql_model.js')

const dataArray = []
const sendData = []
let nowPage = 1

async function main () {
  try {
    let timeOut = 0
    setTimeout(() => {
      if (timeOut === 0) {
        console.log('TimeOut')
        return main(`https://urschool.org/ntu/list?page=${nowPage}`)
      } else if (timeOut === 2) {
        return console.log('真的結束了')
      } else {
        return ''
      }
    }, 15000)

    console.log('開始！' + '目前在:' + nowPage)
    console.log('https://urschool.org/ntu/list?page=1')

    console.log('loading')
    const res = await fetch('https://urschool.org/ntu/list?page=1')
    const html = await res.text()
    console.log('進入!')
    if (timeOut === 1) {
      console.log('stop the fetch!')
      return
    }

    console.log(typeof (html))

    const $ = cheerio.load(html)

    let allLength = 10
    let addNewData = 0

    // 張這頁的文字抓下來:D
    $('tbody.list tr').each(async (num, mark) => {
      const _ = cheerio.load($(mark).html())

      const aTeacher = []

      const teacherData = {
        source: '台大',
        professor: '',
        mark: '',
        add: 0
      }

      _($(mark).html()).each((ind, column) => {
        if (ind === 1) {
          const name = _(column).text().trim().substr(0, 3)
          teacherData.professor = name

          aTeacher.push('台大')
          aTeacher.push(name)
        }

        let fristNum = 0
        switch (ind) {
          case 7:
          case 9:
          case 11:
          case 13:
          case 15:
            fristNum = _(column).text().trim()
            fristNum = +fristNum.substr(0, 1)
            if (fristNum !== 0) {
              teacherData.add++
              teacherData.mark = +teacherData.mark + +fristNum
            }
            break
          default:
            break
        }
      })

      if (teacherData.add === 5) {
        addNewData++
        teacherData.mark = (+teacherData.mark) / (+teacherData.add)
        aTeacher.push(teacherData.mark)
        dataArray.push(teacherData)
        sendData.push(aTeacher)
      } else {
        console.log('剪一！高歌離席！')
        allLength--
      }

      console.log(addNewData + ' and ' + allLength)
      console.log(addNewData === allLength)

      if (addNewData === allLength) {
        nowPage++
        if (nowPage !== 154) {
          timeOut = 1
          main(`https://urschool.org/ntu/list?page=${nowPage}`)
        } else {
          console.log(dataArray)

          //   將資料加入
          const sql = 'INSERT INTO professor (source, professor, mark) VALUES ?'
          query(sql, [sendData], (err, result) => {
            if (err) throw err
            console.log(result)
          })
          timeOut = 2
        }
      }
    })
  } catch (error) {
    console.log(error)
  }
}

// main('')

module.exports = {
  main
}
