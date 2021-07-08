const router = require("express").Router()
const {
	wrapAsync,
	userStatus
} = require("../../util/util.js")

const {
	recommend,
	translte,
	ntu,
	coursera
} = require("../controls/recommend_control")


router.route("/recommend").get(userStatus(), wrapAsync(recommend))
router.route("/translte").get(userStatus(), wrapAsync(translte))
router.route("/ntu").get(userStatus(), wrapAsync(ntu))
router.route("/coursera").get(userStatus(), wrapAsync(coursera))


module.exports = router