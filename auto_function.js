const cron = require('node-cron')
const { upDataRating } = require('./server/models/rating_model')
const { translteModel } = require('./server/models/translate_model')
const { getClass } = require('./server/crawlers/ntu_crawlers/ntu_class')
const { getCoursera } = require('./server/crawlers/coursera_crawlers/coursera_class')
const { upDataRecommend } = require('./server/models/recommend_model')
const { fixWebModel } = require('./server/models/fixweb_model')



// 爬取ntu 一個禮拜抓一次資料
const ntu = cron.schedule('0 5 */7 * *', () => {
  console.log('自動化開始，ntu')
  getClass()
})


// 爬取coursera 一個禮拜抓一次資料
const coursera = cron.schedule('0 7 */7 * *', () => {
  console.log('自動化開始，ntu')
  getCoursera()
})

// 整理網站課程 在抓取課程之後，整理課程
const webfix = cron.schedule('0 9 */7 * *', () => {
  console.log('自動化開始，webfix')
  fixWebModel()
})

// 翻譯 把修改過的課程拿來翻譯
const translate = cron.schedule('0 11 */7 * *', () => {
  console.log('自動化開始，translate')
  translteModel()
})

// 更新課程推薦 課程翻譯完畢後，自動翻譯課程
const recommend = cron.schedule('0 13 */7 * *', () => {
  console.log('自動化開始，recommend')
  upDataRecommend()
})


// 更新評分 每天更新評分
const rating = cron.schedule('0 0 */1 * *', () => {
  console.log('自動化開始，rating')
  upDataRating()
})











// 爬取unschool
// const { main } = require('./server/crawlers/ntu_crawlers/urschool_comment')

// main('https://urschool.org/ntu/list?page=1')


// ntu
// const { getClass } = require('./server/crawlers/ntu_crawlers/ntu_class')
// getClass()