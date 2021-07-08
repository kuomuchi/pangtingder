require("dotenv").config()
const { query } = require("./mysql_model")

const doingUpdataClass = async (upDateArray) => {
	let sql = "UPDATE class SET class_name = ?,  department = ?, professor = ?, source = ?, remarks = ?, web_url = ?, class_content = ? WHERE number = ?"
	await query(sql, upDateArray)
}


const doingCreateClass = async (upDateArray) => {
	let sql = "INSERT INTO class (number, class_name, department, professor, source, remarks, web_url, class_content) VALUES (?)"
	await query(sql, [upDateArray])
}

const doingDeleteClass = async (classDate) => {
	let sql = "DELETE FROM class WHERE (number = ?)"
	await query(sql, classDate.number)
}


const updataUserRoot = async (root, userId) => {
	let sql = "UPDATE account SET root = ? WHERE (id = ?);"
	const package = [root, userId]
	await query(sql, package)
}



const updataUserStatus = async (status, userId) => {
	let sql = "UPDATE account SET status = ? WHERE (id = ?);"
	const package = [status, userId]
	await query(sql, package)
}

const getUserAccountData = async (userId) => {
	const getAccountMsg = await query("SELECT count(user_id) as msgTime FROM detail_msg WHERE user_id = ?", userId)
	const getAccountCollect = await query("SELECT count(user_id) as collectTime FROM collect WHERE user_id = ?", userId)
	const resend = [getAccountMsg[0], getAccountCollect[0]]
	return resend
}


const selectAccount = async (package) =>{
	const getAllAccount = await query("SELECT * FROM account WHERE user_name like ? or email like ? or id like ? LIMIT ?, 10", package)
	return getAllAccount
}

const getAutoEvent = async (package) => {
	const getAllAccount = await query("SELECT * FROM auto_work WHERE work like ? LIMIT ?, 10", package)
	return getAllAccount
}

const updataAutoEvent = async (sql, package) => {
	await query(sql, package)
}


module.exports = {
	doingUpdataClass,
	doingCreateClass,
	doingDeleteClass,
	updataUserRoot,
	updataUserStatus,
	getUserAccountData,
	selectAccount,
	getAutoEvent,
	updataAutoEvent
}