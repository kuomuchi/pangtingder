const router = require('express').Router();
const {wrapAsync} = require('../../util/util.js')

const {
    profile,
    getProData
} = require('../controls/profile_control')


router.route('/profile').post(wrapAsync(profile))

router.route('/profile').get(wrapAsync(getProData))

module.exports = router