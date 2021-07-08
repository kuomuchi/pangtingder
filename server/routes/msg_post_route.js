const router = require("express").Router()
const {
	wrapAsync,
	userStatus
} = require("../../util/util.js")

const { 
	sendDetailMsg,
	deleteDetailMsg,
	servicePostMsg
} = require("../controls/detail_msg_control")

router.route("/classMsg").post(userStatus(), wrapAsync(sendDetailMsg))
router.route("/classMsg").delete(userStatus(), wrapAsync(deleteDetailMsg))
router.route("/service").post(userStatus(), wrapAsync(servicePostMsg))

module.exports = router