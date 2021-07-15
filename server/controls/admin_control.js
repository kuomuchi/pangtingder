const { upDataRating } = require("../models/rating_model")
const { fixWebModel } = require("../models/fixweb_model")
const { accountMsg } = require("../models/account_msg_model")
const {
	doingUpdataClass,
	doingCreateClass,
	doingDeleteClass,
	updataUserRoot,
	updataUserStatus,
	getUserAccountData,
	selectAccount,
	getAutoEvent,
	updataAutoEvent
} = require("../models/admin_model")

const routeUpDataRating = async (req, res) => {

	const userInfo = req.userData

	if(userInfo.root === "admin"){

		upDataRating(1)
		res.send({date:{msg:"success"}})
	}else{
		res.send({date:{msg:"false"}})
	}
}

const fixWeb = async (req, res) => {
    
	// fix DB class
	const userInfo = req.userData

	if(userInfo.root === "admin"){
		fixWebModel()
		res.send({date:{msg:"success"}})

	}else{
		res.send({date:{msg:"false"}})
	}
}


const getAccountMsg = async (req, res) => {
	const userInfo = req.userData
	const specify = req.body.data

	console.log(specify)

	if(userInfo.root === "admin"){
		const package = [specify, specify]
		const histiryMsg = await accountMsg(package)
		res.send(histiryMsg)
	}else{

		res.send({data:{msg:"failure"}})
	}

}


const getAccountStatus = (req, res) => {
	const userInfo = req.userDatas
	const resend = {
		data: {msg:"false"}
	}
    
	if(userInfo.root === "admin"){
		resend.data.msg = "success"
	}
	
	res.send(resend)
}


const upDateClass = async (req, res) => {
	const userInfo = req.userData
	const classDate = req.body

	const resend = {
		data: {msg:"false"}
	}
    
	if(userInfo.root === "admin"){

		let upDateArray = []
		upDateArray.push(classDate.class_name)
		upDateArray.push(classDate.department)
		upDateArray.push(classDate.professor)
		upDateArray.push(classDate.source)
		upDateArray.push(classDate.remarks)
		upDateArray.push(classDate.web_url)
		upDateArray.push(classDate.class_content)
		upDateArray.push(classDate.number)

		await doingUpdataClass(upDateArray)
		resend.data.msg = "success"
		console.log("成功更新課程")

		res.send(resend)

	}else{
		res.send(resend)
	}

    
}

const createClass = async (req, res) => {
	const userInfo = req.userData
	const classDate = req.body

	const resend = {
		data: {msg:"false"}
	}
    
	if(userInfo.root === "admin"){

		const upDateArray = []
		upDateArray.push(classDate.number)
		upDateArray.push(classDate.class_name)
		upDateArray.push(classDate.department)
		upDateArray.push(classDate.professor)
		upDateArray.push(classDate.source)
		upDateArray.push(classDate.remarks)
		upDateArray.push(classDate.web_url)
		upDateArray.push(classDate.class_content)

		await doingCreateClass(upDateArray)

		resend.data.msg = "success"
		console.log("成功創建課程")
		res.send(resend)
	}else{
		res.send(resend)
	}

}

const deleteClass = async (req, res) => {
	const userInfo = req.userData
	const classDate = req.body

	const resend = {
		data: {msg:"false"}
	}
    
	if(userInfo.root === "admin"){

		doingDeleteClass(classDate)
		console.log("刪除課程:" + classDate.number)
		resend.data.msg = "success"
		res.send(resend)
	}else{
		res.send(resend)
	}
}

const banUser = async (req, res) => {
	const {userId, status, root} = req.body

	try {

		if(root){
			updataUserRoot(root, userId)
		}
		if(status){
			updataUserStatus(status, userId)
		}

        
		res.send({data:{msg:"success"}})

	} catch (error) {
		console.log(error)
		res.send({data:{msg:"false"}})
	}
}


const getAccount = async (req, res) => {
	const userInfo = req.userData
	const {keyword, page, userId} = req.body

	if(userInfo.root === "admin"){
		if(userId){
			res.send(await getUserAccountData(userId))
		}else{

			const package = [keyword, keyword, keyword, page*10]
			res.send(await selectAccount(package))
		}
    

	}else{
		res.send({data: {msg:"false"}})
	}

}


// getAllAotoEvent
const getAuto = async (req, res) => {
	const userInfo = req.userData
	const {page, keyword} = req.body

	if(userInfo.root === "admin"){
		const package = [keyword, page*10]

		res.send(await getAutoEvent(package))

	}else{
		res.send({data: {msg:"false"}})
	}

}


const autoUpdata = async (req, res) => {
	const userInfo = req.userData
	const {status, run, event} = req.body
    
	if(userInfo.root == "admin"){
		let sql = ""

		if(run === 1){
			sql = "UPDATE auto_work SET status = ? WHERE (work = ?)"
		}else if(run ===  0){
			sql = "UPDATE auto_work SET status = ?, run = ? WHERE (work = ?);"
		}
        
		const package = [status, run, event]
		await updataAutoEvent(sql, package)
        
		res.send({data:{msg:"success"}})
	}else{
		res.send({data:{msg:"false"}})
	}
}


module.exports = {
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
	fixWeb
}