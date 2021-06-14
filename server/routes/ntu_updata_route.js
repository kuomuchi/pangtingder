const router = require('express').Router();
const {wrapAsync} = require('../../util/util.js')

const {
    recommend,
    translte,
    ntu,
    coursera
} = require('../controls/recommend_control')


router.route('/recommend').get(wrapAsync(recommend))
router.route('/translte').get(wrapAsync(translte))
router.route('/ntu').get(wrapAsync(ntu))
router.route('/coursera').get(wrapAsync(coursera))


module.exports = router