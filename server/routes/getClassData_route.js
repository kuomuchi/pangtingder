const router = require('express').Router();
const {
    wrapAsync,
    userStatus
} = require('../../util/util.js')

const {selectClass,
    getClassDetail,
    addCollect
} = require('../controls/getClass_control')


router.route('/learnpage/:page').post(wrapAsync(selectClass))

router.route('/detail/:number').get(userStatus(), wrapAsync(getClassDetail))

router.route('/collect').post(wrapAsync(addCollect))

module.exports = router