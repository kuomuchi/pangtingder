const cron = require('node-cron')
const { upDataRating } = require('./server/models/rating_model')
const { translte } = require('./server/models/translate_model')

console.log('start')

const rating = cron.schedule('0 0 */1 * *', () => {
  console.log('start recalculation')
  upDataRating()
})

const translate = cron.schedule('0 */4 * * *', () => {
  console.log('start translate')
  translte()
})

// 爬取coursera
// const { main } = require('./server/crawlers/coursera_crawlers/coursera_class')
// main()


// 爬取unschool
// const { main } = require('./server/crawlers/ntu_crawlers/urschool_comment')

// main('https://urschool.org/ntu/list?page=1')