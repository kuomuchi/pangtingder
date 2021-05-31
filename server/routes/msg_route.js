const router = require('express').Router();
const {
    wrapAsync,
    userStatus
} = require('../../util/util.js')

const { 
    sendDetailMsg,
    serviceData,
    servicePostMsg
 } = require('../controls/detail_msg_control')

router.route('/classMsg').post(userStatus(), wrapAsync(sendDetailMsg))

router.route('/service').get(userStatus(), wrapAsync(serviceData))
router.route('/service').post(userStatus(), wrapAsync(servicePostMsg))

module.exports = router