require("dotenv").config()
const { query } = require("./mysql_model")

const sendMsg = async (sendData) => {
	try {
		let sql = "INSERT INTO detail_msg (`class_number`, `user_id`, `user_name`, `class_msg`) VALUES (?, ?, ?, ?)"
		await query(sql, sendData)
		return {data:"success"}

	} catch (error) {

		console.log(error)
		return {data:"false"}
	}
}

const doingDeleteMsg = async (package) => {
	try {
		let sql = "DELETE FROM detail_msg WHERE class_number = ? AND user_id = ? AND class_msg like ?"
		await query(sql, package)
		return {data:"success"}
    
	} catch (error) {

		console.log(error)
		return {data:"false"}
    
	}
}

const serviceMsgHistiry = async (package) => {
	const data =  await query("SELECT * FROM service WHERE user_id = ? OR sendTo = ?", package)
	return JSON.parse(JSON.stringify(data))
}

const adminGetUserId = async () => {
	const getUserId = await query("SELECT user_id, user_name FROM service group by user_id")
	return getUserId
}

const servicePost = async (sendDB) => {
	let sql = "INSERT INTO service (`user_name`, `user_id`, `sendTo`, `content`, `time`) VALUES (?, ?, ?, ?, ?)"
	await query(sql, sendDB)
}

module.exports = {
	sendMsg,
	doingDeleteMsg,
	serviceMsgHistiry,
	adminGetUserId,
	servicePost
  
}