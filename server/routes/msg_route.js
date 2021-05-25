const router = require('express').Router();
const {
    wrapAsync,
    userStatus
} = require('../../util/util.js')

const { sendDetailMsg } = require('../controls/detail_msg_control')

router.route('/classMsg').post(userStatus(), wrapAsync(sendDetailMsg))

module.exports = router