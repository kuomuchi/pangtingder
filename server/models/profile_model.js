require("dotenv").config()
const { createHash } = require("crypto") // 引入密碼
const jwt = require("jsonwebtoken") // 製作前端加密 token
const { query } = require("../models/mysql_model")

async function addpass (password) {
	const hash = createHash("sha256") // 創建一個新的hash，使用sha256
	hash.update(password)
	return await hash.digest("hex")
}

function create_JWT_token(data){
	const token = jwt.sign(data, process.env.JWT_key, { expiresIn: "3600s" })
	return token
}


function decod_JWT(token){

	let decoded =""
	try {
		decoded = jwt.verify(token, process.env.JWT_key)
	} catch (error) {
		return
	}
  
	return decoded
}

async function selectEmail(email){
	let sql = "SELECT id, user_name, password, root, status FROM account WHERE email = ?"
	return await query(sql, email)
}

async function selectCollect(collectNumber){
	let sql = "SELECT * FROM class WHERE number in (?)"
	let userCollect = await query(sql, [collectNumber])
	return JSON.parse(JSON.stringify(userCollect))

}




module.exports = {
	addpass,
	create_JWT_token,
	decod_JWT,
	selectEmail,
	selectCollect
}