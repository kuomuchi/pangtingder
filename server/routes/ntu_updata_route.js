const router = require('express').Router();
const {wrapAsync} = require('../../util/util.js')

const {
    upDataContent
} = require('../crawlers/ntu_crawlers/ntu_class_content.js')

const {
    recommend,
    translte
} = require('../controls/recommend_control')


router.route('/ntu_updata').get(wrapAsync(upDataContent))
router.route('/recommend').get(wrapAsync(recommend))
router.route('/translte').get(wrapAsync(translte))

module.exports = router