const router = require('express').Router();
const {
    wrapAsync,
    userStatus
} = require('../../util/util.js')

const { 
    routeUpDataRating,
    getAccountMsg,
    getAccountStatus,
    upDateClass,
    createClass,
    deleteClass,
    banUser,
    getAccount
 } = require('../controls/rating_control')

router.route('/fixrating').get(wrapAsync(routeUpDataRating))

// 抓取特定的聊天紀錄
router.route('/admin_service').post(userStatus(), wrapAsync(getAccountMsg))
router.route('/admin_editclass').get(userStatus(), wrapAsync(getAccountStatus))
router.route('/admin_editclass').patch(userStatus(), wrapAsync(upDateClass))
router.route('/admin_editclass').post(userStatus(), wrapAsync(createClass))
router.route('/admin_editclass').delete(userStatus(), wrapAsync(deleteClass))
router.route('/admin_account').patch(userStatus(), wrapAsync(banUser))
router.route('/admin_account').post(userStatus(), wrapAsync(getAccount))

module.exports = router