const cron = require('node-cron')
const { upDataRating } = require('./server/models/rating_model')
const { translteModel } = require('./server/models/translate_model')
const { getClass } = require('./server/crawlers/ntu_crawlers/ntu_class')
const { getCoursera } = require('./server/crawlers/coursera_crawlers/coursera_class')

console.log('start')

// 更新評分
const rating = cron.schedule('0 0 */1 * *', () => {
  console.log('自動化開始，rating')
  upDataRating()
})


// 翻譯
const translate = cron.schedule('0 */4 * * *', () => {
  console.log('自動化開始，translate')
  translteModel()
})

// 爬取ntu
const ntu = cron.schedule('0 5 */5 * *', () => {
  console.log('自動化開始，ntu')
  getClass()
})


// 爬取coursera
const coursera = cron.schedule('0 7 */5 * *', () => {
  console.log('自動化開始，ntu')
  getCoursera()
})





// 爬取unschool
// const { main } = require('./server/crawlers/ntu_crawlers/urschool_comment')

// main('https://urschool.org/ntu/list?page=1')


// ntu
// const { getClass } = require('./server/crawlers/ntu_crawlers/ntu_class')
// getClass()