const router = require('express').Router();
const {
    wrapAsync,
    userStatus
} = require('../../util/util.js')

const { 
    routeUpDataRating,
    getAccountMsg
 } = require('../controls/rating_control')

router.route('/fixrating').get(wrapAsync(routeUpDataRating))

// 抓取特定的聊天紀錄
router.route('/admin_service').post(userStatus(), wrapAsync(getAccountMsg))

module.exports = router