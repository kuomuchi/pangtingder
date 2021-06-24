const router = require('express').Router();
const {
    wrapAsync,
    userStatus
} = require('../../util/util.js')

const {selectClass,
    getClassDetail,
    addCollect,
    deleteCollect,
    addRating
} = require('../controls/get_class_control')




router.route('/learnpage/:page').post(wrapAsync(selectClass))

router.route('/detail/:number').get(userStatus(), wrapAsync(getClassDetail))

router.route('/collect').post(userStatus(), wrapAsync(addCollect))

router.route('/collect').delete(userStatus(), wrapAsync(deleteCollect))

router.route('/rating').post(userStatus(), wrapAsync(addRating))

module.exports = router