const router = require('express').Router();
const {
    wrapAsync,
    userStatus,
} = require('../../util/util.js')

const { 
    routeUpDataRating,
    getAccountMsg,
    getAccountStatus,
    upDateClass,
    createClass,
    deleteClass,
    banUser,
    getAccount,
    getAuto,
    autoUpdata,
    fixWeb,
    test
} = require('../controls/admin_control')



router.route('/fixrating').get(userStatus(), wrapAsync(routeUpDataRating))
router.route('/fixweb').get(userStatus(), wrapAsync(fixWeb))

router.route('/admin_service').post(userStatus(), wrapAsync(getAccountMsg))


router.route('/admin_editclass').get(userStatus(), wrapAsync(getAccountStatus))
router.route('/admin_editclass').patch(userStatus(), wrapAsync(upDateClass))
router.route('/admin_editclass').post(userStatus(), wrapAsync(createClass))
router.route('/admin_editclass').delete(userStatus(), wrapAsync(deleteClass))

router.route('/admin_account').patch(userStatus(), wrapAsync(banUser))
router.route('/admin_account').post(userStatus(), wrapAsync(getAccount))

router.route('/admin_auto').post(userStatus(), wrapAsync(getAuto))
router.route('/admin_auto').patch(userStatus(), wrapAsync(autoUpdata))

router.route('/test').get(wrapAsync(test))

module.exports = router