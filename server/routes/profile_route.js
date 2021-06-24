const router = require('express').Router();
const {wrapAsync, userStatus} = require('../../util/util.js')

const {
    profile,
    getProfileData
} = require('../controls/profile_control')


router.route('/profile').post(wrapAsync(profile))

router.route('/profile').get(userStatus(), wrapAsync(getProfileData))

module.exports = router